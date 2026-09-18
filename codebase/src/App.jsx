import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { EXERCISES } from './data/exercises';
import { 
  analyzeTokenizationAttempt, 
  analyzeMathAttempt, 
  evaluateReflection, 
  runGoldenSetEvaluation 
} from './engine';
import './App.css';

export default function App() {
  const [selectedExIndex, setSelectedExIndex] = useState(0);
  const currentExercise = EXERCISES[selectedExIndex];

  // User input & session state
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Reflection state
  const [explanation, setExplanation] = useState('');
  const [isCheckingExp, setIsCheckingExp] = useState(false);
  const [explanationResult, setExplanationResult] = useState(null);

  // Modals
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [activeDocSec, setActiveDocSec] = useState(null);
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalRunning, setEvalRunning] = useState(false);
  const [evalProgress, setEvalProgress] = useState({ current: 0, total: 22, passed: 0 });
  const [evalResults, setEvalResults] = useState(null);

  // Submit attempt
  const handleSubmitAttempt = () => {
    const trimmed = answer.trim();
    if (!trimmed) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      let res;
      if (currentExercise.id === 'ex_tokenization_vn_01') {
        res = analyzeTokenizationAttempt(trimmed);
      } else {
        res = analyzeMathAttempt(trimmed);
      }

      setAttempts(prev => prev + 1);
      if (res.status === 'correct') {
        setCorrectCount(prev => prev + 1);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      } else if (res.status === 'incorrect') {
        setHintCount(prev => Math.min(2, prev + 1));
      }

      setFeedback(res);
      setIsAnalyzing(false);
    }, 450);
  };

  // Reset current attempt
  const handleReset = () => {
    setAnswer('');
    setFeedback(null);
    setExplanation('');
    setExplanationResult(null);
    setHintCount(0);
  };

  // Check student explanation in Reflection step
  const handleCheckExplanation = () => {
    if (!explanation.trim()) return;
    setIsCheckingExp(true);

    setTimeout(() => {
      const res = evaluateReflection(explanation, currentExercise.id);
      setExplanationResult(res);
      if (res.is_satisfactory) {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      }
      setIsCheckingExp(false);
    }, 400);
  };

  // Switch exercise
  const handleSwitchExercise = (idx) => {
    setSelectedExIndex(idx);
    handleReset();
  };

  // Trigger Golden Set test run
  const handleRunEval = async () => {
    setEvalModalOpen(true);
    setEvalRunning(true);
    setEvalResults(null);
    setEvalProgress({ current: 0, total: 22, passed: 0 });

    const report = await runGoldenSetEvaluation((current, total, passed) => {
      setEvalProgress({ current, total, passed });
    });

    setEvalResults(report);
    setEvalRunning(false);
    if (report.qualityBarMet) {
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
    }
  };

  const isCompleted = feedback?.status === 'correct' && explanationResult?.is_satisfactory;

  return (
    <div className="app-container">
      {/* Topbar */}
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">↗</span>
          <span>Học từ lỗi trước</span>
        </div>

        <div className="topbar-right">
          <div className="exercise-switcher">
            <span>Đề:</span>
            <select 
              value={selectedExIndex} 
              onChange={(e) => handleSwitchExercise(Number(e.target.value))}
            >
              <option value={0}>Bài 1: Tokenization Tiếng Việt (Track D2 chuẩn)</option>
              <option value={1}>Bài 2: Phương trình bậc nhất (Demo mẫu)</option>
            </select>
          </div>

          <span className="status">
            <i /> Phiên luyện tập
          </span>
        </div>
      </header>

      <main className="shell">
        {/* Intro */}
        <section className="intro">
          <p className="eyebrow">{currentExercise.track}</p>
          <h1>
            Làm bài trước.<br />
            <em>Hiểu lỗi sau.</em>
          </h1>
          <p className="lede">
            Một gợi ý đúng lúc giúp bạn tự sửa, thay vì chỉ nhớ đáp án.
          </p>

          <div className="progress">
            <span className="progress-label">
              Bài 0{selectedExIndex + 1} / 0{EXERCISES.length}
            </span>
            <span className="progress-track">
              <b style={{ width: isCompleted ? '100%' : feedback?.status === 'correct' ? '65%' : attempts > 0 ? '30%' : '10%' }} />
            </span>
            <span className="progress-label">
              {isCompleted ? '✅ Đã hoàn thành xuất sắc' : feedback?.status === 'correct' ? 'Đang phản tư' : 'Chưa hoàn thành'}
            </span>
          </div>
        </section>

        {/* Workspace */}
        <section className="workspace">
          {/* Left: Exercise Panel */}
          <article className="exercise-panel">
            <div className="panel-kicker">BÀI TẬP</div>
            <h2>{currentExercise.title}</h2>
            <div className="exercise-prompt">{currentExercise.prompt}</div>

            {/* Quick Sample Chips */}
            <div className="sample-chips">
              <div className="sample-chips-label">Thử nhanh tình huống mẫu:</div>
              <div className="sample-chips-list">
                {currentExercise.samples.map((s, i) => (
                  <button 
                    key={i} 
                    className="sample-chip" 
                    onClick={() => setAnswer(s.text)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <label htmlFor="answer">Bài làm của bạn</label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Viết các bước bạn đã làm hoặc giả định..."
            />

            <div className="actions">
              <button 
                className="primary" 
                onClick={handleSubmitAttempt} 
                disabled={isAnalyzing || !answer.trim()}
              >
                {isAnalyzing ? 'Đang phân tích...' : feedback?.status === 'incorrect' ? 'Nộp bài sửa' : 'Nộp bài'}
                <span>↗</span>
              </button>
              <button className="ghost" onClick={handleReset}>
                Làm lại
              </button>
            </div>

            <p className="privacy">
              Phiên này chỉ lưu trạng thái ẩn danh để đo lường. Không thu thập PII.
            </p>
          </article>

          {/* Right: Feedback Panel */}
          <aside className={`feedback-panel ${!feedback ? 'state-empty' : 'has-result ' + (feedback.status === 'correct' ? 'is-correct' : feedback.status === 'insufficient_evidence' ? 'is-vague' : 'is-incorrect')}`}>
            {!feedback ? (
              <div className="empty-state">
                <span className="empty-icon">✦</span>
                <h3>Phản hồi sẽ xuất hiện ở đây</h3>
                <p>
                  Hãy làm bài theo cách bạn nghĩ trước. AI sẽ chỉ ra điểm cần xem lại và dẫn bạn tới đúng đoạn tài liệu giáo trình.
                </p>
              </div>
            ) : (
              <div>
                <div className={`result-label ${feedback.status === 'correct' ? 'color-correct' : feedback.status === 'insufficient_evidence' ? 'color-vague' : 'color-incorrect'}`}>
                  {feedback.status === 'correct' ? 'ĐÃ HIỂU' : feedback.status === 'insufficient_evidence' ? 'CHƯA ĐỦ CĂN CỨ' : `GỢI Ý ${hintCount} / 2`}
                </div>

                <h3>
                  {feedback.status === 'correct' 
                    ? 'Bạn đã tự sửa đúng.' 
                    : feedback.status === 'insufficient_evidence' 
                    ? 'Mình chưa thể kết luận.' 
                    : 'Mình thấy một điểm cần xem lại.'}
                </h3>

                <p className="feedback-copy">{feedback.feedback}</p>

                {/* Socratic Hint Box */}
                {feedback.hint && (
                  <div className="hint-box">
                    <strong>GỢI Ý DẪN ĐƯỜNG (KHÔNG LỘ ĐÁP ÁN)</strong>
                    <p>{feedback.hint}</p>
                  </div>
                )}

                {/* Source Citation */}
                {feedback.source && (
                  <div className="source-box">
                    <div className="source-header">
                      <strong>{feedback.source.id} · {feedback.source.title}</strong>
                      <button 
                        className="btn-read-doc" 
                        onClick={() => {
                          setActiveDocSec(feedback.source.id);
                          setDocModalOpen(true);
                        }}
                      >
                        Đọc toàn văn ↗
                      </button>
                    </div>
                    <div className="source-content">{feedback.source.content}</div>
                  </div>
                )}

                {/* Reflection Step (Bước cuối) */}
                {feedback.explanationPrompt && (
                  <div className="reflection-box">
                    <strong>BƯỚC CUỐI · ĐÀO SÂU BẢN CHẤT</strong>
                    <p style={{ margin: '4px 0 10px', fontSize: '13.5px', color: '#4b5563' }}>
                      {currentExercise.id === 'ex_tokenization_vn_01'
                        ? 'Hãy giải thích ngắn: Vì sao lúc đầu bạn lại nhầm số token tiếng Việt hoặc công thức tính?'
                        : 'Hãy giải thích ngắn: Vì sao cần chuyển 5 sang vế phải đổi dấu và chia cho 3?'}
                    </p>

                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                      <button 
                        className="sample-chip" 
                        onClick={() => setExplanation(currentExercise.reflectionSample.deep)}
                      >
                        Ví dụ hiểu sâu
                      </button>
                      <button 
                        className="sample-chip" 
                        onClick={() => setExplanation(currentExercise.reflectionSample.superficial)}
                      >
                        Ví dụ chép vẹt
                      </button>
                    </div>

                    <textarea
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      placeholder="Mình đã nhầm vì..."
                    />

                    <div className="reflection-actions">
                      <button 
                        className="btn-reflection" 
                        onClick={handleCheckExplanation}
                        disabled={isCheckingExp || !explanation.trim()}
                      >
                        {isCheckingExp ? 'Đang kiểm tra...' : 'Kiểm tra giải thích ↗'}
                      </button>
                    </div>

                    {explanationResult && (
                      <div className={`reflection-result ${explanationResult.is_satisfactory ? 'sat' : 'unsat'}`}>
                        <strong>
                          {explanationResult.is_satisfactory ? '✅ ĐẠT YÊU CẦU PHẢN TƯ' : '⚠️ CẦN GIẢI THÍCH THÊM'}
                        </strong>
                        <p style={{ margin: '6px 0 0' }}>{explanationResult.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </aside>
        </section>

        {/* Metrics Strip */}
        <section className="metrics">
          <div>
            <span>PHIÊN LUYỆN TẬP</span>
            <strong>{attempts}</strong>
            <small>lượt thử</small>
          </div>
          <div>
            <span>KẾT QUẢ ĐẠT</span>
            <strong>{attempts > 0 ? `${correctCount}/${attempts}` : '—'}</strong>
            <small>{attempts > 0 ? `${Math.round((correctCount / attempts) * 100)}% thành công` : 'chưa có lượt nộp'}</small>
          </div>
          <div>
            <span>AI ENGINE</span>
            <strong>Gemini 2.5 Flash</strong>
            <small>Heuristic + Rule-guardrails</small>
          </div>
        </section>

        {/* Evaluation Strip */}
        <section className="eval-strip">
          <div>
            <span className="panel-kicker">BỘ ĐO CHUẨN CP4</span>
            <h2>22 bài kiểm thử Golden Set (Track D2)</h2>
            <p>
              Khóa chuẩn Quality Bar: Thẩm định tự động 4 lớp chỗ khó, kiểm tra rào chắn No-spoiler và cơ chế từ chối đoán bừa HAX G10.
            </p>
          </div>
          <button className="btn-eval" onClick={handleRunEval}>
            Chạy 22 ca đo Golden Set ↗
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer>
        Học từ lỗi trước <span>·</span> Một bài tập, một vòng lặp hiểu sâu <span>·</span> Track D2 K4-3B-E402
      </footer>

      {/* Document Reader Modal */}
      {docModalOpen && (
        <div className="modal-overlay" onClick={() => setDocModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tài liệu giáo trình học tập chuẩn (Ground Truth)</h3>
              <button className="modal-close" onClick={() => setDocModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              {Object.entries(currentExercise.documents).map(([secId, doc]) => (
                <div 
                  key={secId} 
                  style={{ 
                    marginBottom: '20px', 
                    padding: '16px', 
                    background: activeDocSec === secId ? '#f0fdf4' : '#faf8f1',
                    border: activeDocSec === secId ? '1.5px solid #22c55e' : '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                >
                  <div style={{ font: '600 12px "DM Mono", monospace', color: '#1f634e', marginBottom: '4px' }}>
                    {secId} {activeDocSec === secId && '★ Đang được AI trích dẫn'}
                  </div>
                  <h4 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 800 }}>{doc.title}</h4>
                  <p style={{ margin: 0, color: '#374151', lineHeight: 1.6 }}>{doc.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Test Runner Modal */}
      {evalModalOpen && (
        <div className="modal-overlay" onClick={() => !evalRunning && setEvalModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Báo cáo kiểm nghiệm Golden Set — 22 Test Cases (CP4)</h3>
              {!evalRunning && (
                <button className="modal-close" onClick={() => setEvalModalOpen(false)}>×</button>
              )}
            </div>
            <div className="modal-body">
              {evalRunning ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
                    Đang chạy kiểm thử: {evalProgress.current} / {evalProgress.total} cases...
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${(evalProgress.current / evalProgress.total) * 100}%`, 
                        height: '100%', 
                        background: '#1f634e',
                        transition: 'width 0.1s ease'
                      }} 
                    />
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '10px' }}>
                    Đang đối soát ngộ nhận, trích dẫn section, rào chắn No-spoiler và chất lượng phản tư...
                  </p>
                </div>
              ) : evalResults ? (
                <div>
                  <div className="eval-summary-card">
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#065f46' }}>
                        Tỷ lệ đạt: {evalResults.passed} / {evalResults.total} cases ({evalResults.accuracyPct}%)
                      </div>
                      <div style={{ fontSize: '13px', color: '#047857', marginTop: '4px' }}>
                        Chuẩn Quality Bar: <strong>ĐẠT YÊU CẦU (≥ 75%)</strong> · Không lộ đáp án (0% spoiler)
                      </div>
                    </div>
                    <button 
                      className="btn-eval" 
                      style={{ padding: '8px 14px', fontSize: '12px' }}
                      onClick={handleRunEval}
                    >
                      Chạy lại
                    </button>
                  </div>

                  <table className="eval-table">
                    <thead>
                      <tr>
                        <th>Mã Case</th>
                        <th>Phân lớp lỗi</th>
                        <th>Mô tả</th>
                        <th>Kết quả</th>
                        <th>Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evalResults.results.map((r) => (
                        <tr key={r.id}>
                          <td style={{ font: '600 11px "DM Mono", monospace' }}>{r.id}</td>
                          <td><span style={{ fontSize: '11.5px', background: '#f3f4f6', padding: '2px 6px', borderRadius: '3px' }}>{r.layer}</span></td>
                          <td>{r.description}</td>
                          <td>
                            <strong style={{ color: r.passed ? '#16a34a' : '#dc2626' }}>
                              {r.passed ? '✅ ĐẠT' : '❌ CHƯA'}
                            </strong>
                          </td>
                          <td style={{ fontSize: '12px', color: '#4b5563' }}>{r.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
