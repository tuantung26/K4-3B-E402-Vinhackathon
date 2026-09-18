const http = require('http');
const fs = require('fs');
const path = require('path');
const goldenSet = JSON.parse(fs.readFileSync(path.join(__dirname, 'eval', 'golden-set.json'), 'utf8'));

loadEnv(path.join(__dirname, '..', '.env'));

const port = Number(process.env.PORT || 4173);
const publicDir = __dirname;

const exercise = {
  id: 'linear-equation-01',
  title: 'Phuong trinh bac nhat mot an',
  prompt: 'Giai phuong trinh 3x + 5 = 20 va trinh bay cac buoc bien doi.',
  answer: 'x = 5',
  rubric: ['Chuyen 5 sang ve phai thanh 15', 'Chia hai ve cho 3', 'Ket luan x = 5']
};

const documents = [
  {
    id: 'SEC-01',
    title: 'Quy tac bien doi phuong trinh',
    content: 'Khi chuyen mot hang tu ve nay sang ve kia, ta doi dau hang do. Sau do co the chia ca hai ve cho cung mot so khac 0.'
  },
  {
    id: 'SEC-02',
    title: 'Cac buoc giai phuong trinh bac nhat',
    content: 'Voi ax + b = c va a khac 0, ta chuyen b sang ve phai de duoc ax = c - b, roi chia hai ve cho a de tim x.'
  }
];
const sessions = [];

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 100000) req.destroy(); });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch (error) { reject(error); }
    });
    req.on('error', reject);
  });
}

function localAnalysis(answer, hintCount) {
  const normalized = answer.toLowerCase().replace(/\s/g, '');
  const isCorrect = (normalized.includes('x=5') || normalized.includes('x=+5')) && !normalized.includes('x=5/3');
  if (isCorrect) {
    return {
      status: 'correct',
      errorType: null,
      confidence: 0.99,
      feedback: 'Bai sua dung. Hay noi lai vi sao can chuyen 5 sang ve phai va chia cho 3.',
      hint: null,
      source: null,
      explanationPrompt: true,
      provider: 'fixture'
    };
  }
  let errorType = 'Chua du can cu';
  let feedback = 'Mình chưa đủ căn cứ để xác định chính xác lỗi ở đâu. Hãy viết thêm các bước biến đổi.';
  let source = documents[0];
  if (normalized.includes('20+5') || normalized.includes('25/3')) {
    errorType = 'Sai dau khi chuyen hang';
    feedback = 'Bạn đã đổi dấu của hằng số chưa đúng khi chuyển 5 sang vế phải.';
    source = documents[0];
  } else if (normalized.includes('3x=15') && !normalized.includes('/3') && !normalized.includes('x=5')) {
    errorType = 'Chua chia cho he so cua x';
    feedback = 'Bạn đã đưa phương trình về 3x = 15 nhưng chưa chia hai vế cho 3.';
    source = documents[1];
  } else if (normalized.includes('20-5/3') || normalized.includes('20-5')) {
    errorType = 'Sai thu tu bien doi';
    feedback = 'Bạn cần thực hiện phép trừ trước rồi mới chia cho hệ số của x.';
    source = documents[1];
  } else if (normalized.includes('5=20-3x') || normalized.includes('3x+5')) {
    errorType = 'Bien doi chua hoan tat';
    feedback = 'Bạn mới viết lại một phần phương trình, chưa cô lập được x.';
    source = documents[1];
  }
  const hint = hintCount > 0
    ? errorType === 'Sai dau khi chuyen hang' ? 'Hãy kiểm tra dấu của 5 khi chuyển sang vế phải: vế phải cần là 20 trừ 5.'
      : errorType === 'Chua chia cho he so cua x' ? 'Khi còn 3x = 15, phép toán ngược của nhân 3 là gì? Hãy làm trên cả hai vế.'
      : 'Hãy viết lại từng phép biến đổi trên một dòng và kiểm tra phép toán đó trên cả hai vế.'
    : 'Hãy tìm bước đầu tiên để đưa hằng số 5 ra khỏi vế chứa x. Nhớ quy tắc đổi dấu khi chuyển vế.';
  return {
    status: 'incorrect',
    errorType,
    confidence: 0.91,
    feedback,
    hint,
    source,
    explanationPrompt: false,
    provider: 'fixture'
  };
}

function explanationCheck(explanation) {
  const text = String(explanation || '').toLowerCase();
  const hasCause = /(dau|chuyen|hang|chia|he so|bien doi|thu tu)/.test(text);
  const hasReason = /(vi|boi|nen|sai|nham|quy tac)/.test(text);
  return { accepted: hasCause && hasReason, feedback: hasCause && hasReason ? 'Giải thích đã nêu được nguyên nhân gốc.' : 'Hãy nêu rõ bạn đã nhầm ở bước nào và vì sao quy tắc đó cần được áp dụng.' };
}

async function aiAnalysis(answer, hintCount) {
  const prompt = `Ban la tro giang toan. Phan tich bai lam theo quy tac: goi y truoc, khong tiet lo dap an neu chua het 2 luot; chi dung thong tin trong bai va tai lieu. Tra ve JSON voi cac truong status (correct|incorrect|uncertain), errorType, confidence, feedback, hint, sourceId, explanationPrompt.\nDe bai: ${exercise.prompt}\nDap an: ${exercise.answer}\nBai lam: ${answer}\nLuot goi y: ${hintCount}\nTai lieu: ${JSON.stringify(documents)}`;
  if (process.env.GEMINI_API_KEY) {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${prompt}\nChi tra ve JSON hop le, khong markdown.` }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
      })
    });
    if (!response.ok) throw new Error(`Gemini returned ${response.status}`);
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned no content');
    const result = JSON.parse(text);
    return { ...result, source: documents.find(doc => doc.id === result.sourceId) || null, provider: 'gemini' };
  }
  if (!process.env.OPENAI_API_KEY) return localAnalysis(answer, hintCount);
  const response = await fetch(process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: 'Chi tra ve JSON hop le, khong markdown.' }, { role: 'user', content: prompt }]
    })
  });
  if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content);
  return { ...result, source: documents.find(doc => doc.id === result.sourceId) || null, provider: 'openai' };
}

async function handleApi(req, res, url) {
  if (url.pathname === '/api/exercise' && req.method === 'GET') return send(res, 200, { exercise, documents });
  if (url.pathname === '/api/eval' && req.method === 'GET') {
    const results = goldenSet.map(test => ({ id: test.id, expected: test.expected, actual: localAnalysis(test.answer, 0).errorType, status: localAnalysis(test.answer, 0).status }));
    const incorrect = results.filter(result => result.status === 'incorrect');
    return send(res, 200, { total: results.length, incorrect: incorrect.length, results });
  }
  if (url.pathname === '/api/explain' && req.method === 'POST') {
    const body = await readBody(req);
    return send(res, 200, explanationCheck(body.explanation));
  }
  if (url.pathname === '/api/session-log' && req.method === 'POST') {
    const body = await readBody(req);
    sessions.push({ timestamp: new Date().toISOString(), status: body.status, hintCount: Number(body.hintCount || 0), explanationAccepted: Boolean(body.explanationAccepted) });
    return send(res, 201, { saved: true });
  }
  if (url.pathname === '/api/analyze' && req.method === 'POST') {
    let body = {};
    try {
      body = await readBody(req);
      const result = await aiAnalysis(String(body.answer || ''), Number(body.hintCount || 0));
      return send(res, 200, result);
    } catch (error) {
      return send(res, 200, { ...localAnalysis(String(body?.answer || ''), Number(body?.hintCount || 0)), warning: `AI provider unavailable: ${error.message}` });
    }
  }
  return send(res, 404, { error: 'Not found' });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith('/api/')) return handleApi(req, res, url);
  const requested = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const file = path.resolve(publicDir, requested);
  if (!file.startsWith(path.resolve(publicDir)) || !fs.existsSync(file)) return send(res, 404, 'Not found', 'text/plain');
  const ext = path.extname(file);
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
  send(res, 200, fs.readFileSync(file), types[ext] || 'application/octet-stream');
});

server.listen(port, () => console.log(`Prototype running at http://localhost:${port}`));