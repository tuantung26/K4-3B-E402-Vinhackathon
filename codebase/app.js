const state = { attempts: 0, correct: 0, hintCount: 0 };
const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);

function updateAnswerCount() {
  $('#answer-count').textContent = `${$('#answer').value.length} / 2000`;
}

async function init() {
  try {
    const [exerciseResponse, evalResponse] = await Promise.all([
      fetch('/api/exercise'),
      fetch('/api/eval')
    ]);
    if (!exerciseResponse.ok || !evalResponse.ok) throw new Error('Không tải được dữ liệu app');
    const [data, evaluation] = await Promise.all([exerciseResponse.json(), evalResponse.json()]);
    $('#exercise-title').textContent = data.exercise.title;
    $('#exercise-prompt').textContent = data.exercise.prompt;
    $('#eval-total-label').textContent = `${evaluation.total} bài làm trong golden set`;
    $('#run-eval').textContent = `Chạy ${evaluation.total} ca đo ↗`;
    updateAnswerCount();
  } catch (error) {
    $('#exercise-title').textContent = 'Không tải được bài tập';
    $('#exercise-prompt').textContent = 'Hãy kiểm tra server rồi tải lại trang.';
    $('#eval-result').textContent = 'Chưa kết nối được bộ đo';
  }
}

function render(result) {
  const panel = $('#feedback');
  panel.className = 'feedback-panel has-result';
  const isCorrect = result.status === 'correct';
  if (isCorrect) state.correct += 1;
  $('#accuracy').textContent = `${state.correct}/${state.attempts}`;
  $('#engine').textContent = ['openai', 'gemini'].includes(result.provider) ? 'AI thật' : 'Fixture';
  panel.innerHTML = `<div class="result-label">${isCorrect ? 'ĐÃ HIỂU' : result.status === 'uncertain' ? 'CHƯA ĐỦ CĂN CỨ' : `GỢI Ý ${state.hintCount + 1} / 2`}</div>
    <h3>${isCorrect ? 'Bạn đã tự sửa đúng.' : result.status === 'uncertain' ? 'Mình chưa thể kết luận.' : 'Mình thấy một điểm cần xem lại.'}</h3>
    <p class="feedback-copy">${escapeHtml(result.feedback || 'Hãy bổ sung thêm một bước để mình có đủ căn cứ phân tích.')}</p>
    ${result.hint ? `<div class="feedback-box"><strong>GỢI Ý DẪN ĐƯỜNG</strong><p>${escapeHtml(result.hint)}</p></div>` : ''}
    ${result.source ? `<div class="source"><strong>${escapeHtml(result.source.id)} · ${escapeHtml(result.source.title)}</strong><br>${escapeHtml(result.source.content)}</div>` : ''}
    ${result.explanationPrompt ? '<div class="feedback-box explanation"><strong>BƯỚC CUỐI</strong><p>Hãy giải thích ngắn: lúc đầu bạn đã nhầm ở bước nào?</p><textarea id="explanation" placeholder="Mình đã nhầm vì..."></textarea><button class="continue" id="check-explanation">Kiểm tra giải thích</button><p id="explanation-result"></p></div>' : ''}`;
  if (result.explanationPrompt) {
    $('#check-explanation').addEventListener('click', async () => {
      const response = await fetch('/api/explain', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ explanation: $('#explanation').value }) });
      const explanation = await response.json();
      $('#explanation-result').textContent = explanation.feedback;
      await logSession(result.status, state.hintCount, explanation.accepted);
    });
  } else {
    logSession(result.status, state.hintCount, false);
  }
}

async function logSession(status, hintCount, explanationAccepted) {
  await fetch('/api/session-log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, hintCount, explanationAccepted }) });
}

$('#answer').addEventListener('input', updateAnswerCount);

$('#submit').addEventListener('click', async () => {
  const answer = $('#answer').value.trim();
  if (!answer) { $('#answer').focus(); return; }
  $('#submit').disabled = true;
  $('#submit').textContent = 'Đang phân tích...';
  try {
    state.attempts += 1;
    const response = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answer, hintCount: state.hintCount }) });
    const result = await response.json();
    if (result.status === 'incorrect') state.hintCount = Math.min(2, state.hintCount + 1);
    render(result);
    $('#attempt-count').textContent = state.attempts;
  } catch (error) {
    $('#feedback').innerHTML = '<div class="empty-state"><h3>Kết nối AI chưa sẵn sàng</h3><p>Hãy kiểm tra server và cấu hình API trong file .env.</p></div>';
  } finally {
    $('#submit').disabled = false;
    $('#submit').innerHTML = 'Nộp bài <span>↗</span>';
  }
});

$('#reset').addEventListener('click', () => { $('#answer').value = ''; state.hintCount = 0; updateAnswerCount(); $('#feedback').className = 'feedback-panel'; $('#feedback').innerHTML = '<div class="empty-state"><span class="empty-icon">✦</span><h3>Phản hồi sẽ xuất hiện ở đây</h3><p>Hãy làm bài theo cách bạn nghĩ trước.</p></div>'; });
$('#run-eval').addEventListener('click', async () => {
  $('#run-eval').disabled = true;
  $('#eval-result').textContent = 'Đang chạy...';
  const response = await fetch('/api/eval');
  const result = await response.json();
  $('#eval-result').textContent = `${result.incorrect}/${result.total} ca sai được nhận diện`;
  $('#run-eval').disabled = false;
});
init();