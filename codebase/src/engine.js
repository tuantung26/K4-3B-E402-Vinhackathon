import { EXERCISES } from './data/exercises';
import { GOLDEN_SET_22 } from './data/goldenSet';

const SPOILERS = ["0.0025", "5,000", "5000", "$0.002", "4000", "6000", "0.002", "0.003"];

export function checkNoSpoiler(text) {
  if (!text) return true;
  return !SPOILERS.some(s => text.includes(s));
}

// Phân tích bài làm Tokenization tiếng Việt (Track D2)
export function analyzeTokenizationAttempt(attemptText) {
  const cleaned = attemptText.toLowerCase().trim();

  // 1. HAX G10: Kiểm tra thiếu căn cứ / câu hỏi ngoài lề / đoán mò / không có bước giải
  const ambiguousKeywords = [
    "asdf", "qwerty", "không biết", "chịu", "rẻ lắm", "chưa đến",
    "chắc", "đoán", "tiktoken", "sentencepiece", "tokenizer loại nào"
  ];
  const isAmbiguous = ambiguousKeywords.some(kw => cleaned.includes(kw)) || cleaned.length < 8;

  // Chỉ ghi số không có bước giải (VD: "5000 và 0.0025")
  const isNumbersOnly = /^[\d\s,.\$và-]{1,25}$/.test(cleaned);

  // Chỉ tính nửa câu (chỉ tính token, không tính chi phí)
  const isHalfAnswered = (cleaned.includes("tổng 100 câu") || cleaned.includes("tiếng việt cần khoảng")) && 
    !["$", "usd", "chi phí", "giá", "tiền", "đồng"].some(c => cleaned.includes(c));

  if (isAmbiguous || isNumbersOnly || isHalfAnswered) {
    let clarificationMsg = "Câu trả lời của bạn chưa có căn cứ hoặc chưa đủ các bước tính toán theo yêu cầu đề bài. Vui lòng trình bày rõ cách tính số tokens và chi phí USD.";
    if (isNumbersOnly) {
      clarificationMsg = "Bạn đã đưa ra kết quả số, tuy nhiên để đạt chuẩn sư phạm, bạn vui lòng ghi rõ các bước tính toán hoặc giả định quy đổi.";
    } else if (cleaned.includes("tokenizer") || cleaned.includes("tiktoken")) {
      clarificationMsg = "Mô hình tập trung vào bài toán ước lượng token và chi phí API theo đề bài. Vui lòng quay lại thực hiện tính toán cho 100 câu tiếng Việt.";
    }

    return {
      has_sufficient_evidence: false,
      status: "insufficient_evidence",
      confidence: 0.3,
      error_type: "Thiếu căn cứ bài làm hoặc chưa đủ bước giải",
      feedback: clarificationMsg,
      hint: null,
      cited_section: null,
      source: null,
      clarification_request: clarificationMsg,
      explanationPrompt: false,
      provider: "heuristic"
    };
  }

  // 2. Kiểm tra lỗi khái niệm ký tự (§1.1)
  if (cleaned.includes("chữ cái") || cleaned.includes("ký tự") || cleaned.includes("1 chữ cái")) {
    const doc = EXERCISES[0].documents["§1.1"];
    return {
      has_sufficient_evidence: true,
      status: "incorrect",
      confidence: 0.9,
      error_type: "Nhầm lẫn token là ký tự đơn lẻ (character)",
      feedback: "Bạn đang xem token như là từng ký tự riêng biệt. LLM không hoạt động theo cơ chế từng chữ cái như vậy.",
      hint: "Gợi ý: Token trong LLM không phải là từng ký tự chữ cái riêng lẻ. Hãy xem cơ chế phân tách Subword trong tài liệu!",
      cited_section: "§1.1",
      source: { id: "§1.1", title: doc.title, content: doc.content },
      explanationPrompt: false,
      provider: "heuristic"
    };
  }

  // 3. Kiểm tra Happy path (đúng dải 4,000 - 6,000 tokens và $0.002 - $0.003)
  const hasValidTokens = ["4000", "4,000", "5000", "5,000", "6000", "6,000"].some(tok => cleaned.includes(tok)) ||
    (cleaned.includes("2.5") && cleaned.includes("token")) ||
    cleaned.includes("2 token") || cleaned.includes("3 token");
  const hasValidCost = ["0.0025", "0.002", "0.003", "$0.0025", "$0.002", "$0.003"].some(cost => cleaned.includes(cost));

  if (hasValidTokens && hasValidCost) {
    return {
      has_sufficient_evidence: true,
      status: "correct",
      confidence: 0.95,
      error_type: null,
      feedback: "Chính xác! Bạn đã ước lượng đúng đặc thù tokenization tiếng Việt (hệ số 2.0 - 3.0 tokens/từ) và chi phí API.",
      hint: null,
      cited_section: null,
      source: null,
      explanationPrompt: true,
      provider: "heuristic"
    };
  }

  // 4. Kiểm tra lỗi khái niệm tiếng Việt (§1.2): 1 từ = 1 token, hệ số 1.3x, hệ số 10x
  const isConceptualVn = ["2000 token", "2,000 token", "2000 từ = 2000", "1.3", "2600", "2,600", "10 token", "20,000 token", "20000"].some(k => cleaned.includes(k));
  if (isConceptualVn) {
    const doc = EXERCISES[0].documents["§1.2"];
    return {
      has_sufficient_evidence: true,
      status: "incorrect",
      confidence: 0.9,
      error_type: "Nhầm lẫn tỷ lệ Tokenization tiếng Việt (coi 1 từ = 1 token như tiếng Anh hoặc áp sai hệ số)",
      feedback: "Bạn đang tính số token bằng đúng số từ, hoặc áp dụng hệ số tiếng Anh (1.3x). Tiếng Việt có dấu thanh UTF-8 nên tỷ lệ nở token khác biệt rõ rệt.",
      hint: "Gợi ý: Thuật toán Subword của LLM xử lý các ngôn ngữ có dấu thanh như tiếng Việt khác với tiếng Anh đơn âm. Hãy kiểm tra xem 1 từ tiếng Việt thường nở ra bao nhiêu token!",
      cited_section: "§1.2",
      source: { id: "§1.2", title: doc.title, content: doc.content },
      explanationPrompt: false,
      provider: "heuristic"
    };
  }

  // 5. Các lỗi công thức & đơn vị (§2.1)
  const doc21 = EXERCISES[0].documents["§2.1"];
  return {
    has_sufficient_evidence: true,
    status: "incorrect",
    confidence: 0.85,
    error_type: "Sai lệch trong ước tính token hoặc công thức chia mẫu số",
    feedback: "Phép tính chi phí của bạn chưa khớp. Chú ý mẫu số quy đổi đơn vị giá là 1 triệu (1,000,000) token hoặc số lượng câu cần nhân.",
    hint: "Gợi ý: Hãy xem lại công thức quy đổi chi phí trên mỗi 1 triệu (1,000,000) token và hệ số nhân token của tiếng Việt.",
    cited_section: "§2.1",
    source: { id: "§2.1", title: doc21.title, content: doc21.content },
    explanationPrompt: false,
    provider: "heuristic"
  };
}

// Phân tích bài toán phương trình bậc nhất (Toán học mẫu)
export function analyzeMathAttempt(attemptText) {
  const normalized = attemptText.toLowerCase().replace(/\s/g, '');
  const isCorrect = (normalized.includes('x=5') || normalized.includes('x=+5')) && !normalized.includes('x=5/3');
  
  if (isCorrect) {
    return {
      has_sufficient_evidence: true,
      status: 'correct',
      error_type: null,
      confidence: 0.99,
      feedback: 'Bài sửa đúng. Hãy nói lại vì sao cần chuyển 5 sang vế phải và chia cho 3.',
      hint: null,
      cited_section: null,
      source: null,
      explanationPrompt: true,
      provider: 'heuristic'
    };
  }

  const doc01 = EXERCISES[1].documents['SEC-01'];
  const doc02 = EXERCISES[1].documents['SEC-02'];

  if (normalized.includes('20+5') || normalized.includes('25/3') || normalized.includes('25')) {
    return {
      has_sufficient_evidence: true,
      status: 'incorrect',
      error_type: 'Sai dấu khi chuyển hạng tử',
      feedback: 'Bạn đã đổi dấu của hằng số chưa đúng khi chuyển 5 sang vế phải.',
      hint: 'Gợi ý: Khi chuyển một số từ vế trái sang vế phải, dấu của số đó phải đổi từ cộng sang trừ.',
      cited_section: 'SEC-01',
      source: { id: 'SEC-01', title: doc01.title, content: doc01.content },
      explanationPrompt: false,
      provider: 'heuristic'
    };
  }

  if (normalized.includes('3x=15') && !normalized.includes('/3') && !normalized.includes('x=5')) {
    return {
      has_sufficient_evidence: true,
      status: 'incorrect',
      error_type: 'Chưa chia cho hệ số của x',
      feedback: 'Bạn đã đưa về 3x = 15 nhưng chưa chia cho hệ số 3 để tìm x.',
      hint: 'Gợi ý: Chia cả hai vế của phương trình cho 3 để cô lập x.',
      cited_section: 'SEC-02',
      source: { id: 'SEC-02', title: doc02.title, content: doc02.content },
      explanationPrompt: false,
      provider: 'heuristic'
    };
  }

  return {
    has_sufficient_evidence: false,
    status: 'insufficient_evidence',
    error_type: 'Chưa đủ căn cứ',
    feedback: 'Mình chưa đủ căn cứ để xác định chính xác lỗi ở đâu. Hãy viết thêm các bước biến đổi.',
    hint: null,
    cited_section: 'SEC-01',
    source: { id: 'SEC-01', title: doc01.title, content: doc01.content },
    explanationPrompt: false,
    provider: 'heuristic'
  };
}

// Đánh giá phản tư bản chất (Reflection Evaluation)
export function evaluateReflection(explanationText, exerciseId) {
  const expLower = explanationText.toLowerCase().trim();

  if (exerciseId === 'ex_tokenization_vn_01') {
    const isDeep = ["dấu", "utf-8", "subword", "tiếng việt", "nhiều token", "1 triệu", "đơn vị", "2-3", "thanh điệu", "bpe"].some(k => expLower.includes(k));
    if (isDeep) {
      return {
        is_satisfactory: true,
        feedback: "Tuyệt vời! Bạn đã nắm rất vững bản chất vì sao tiếng Việt tốn nhiều token hơn (do mã hóa Unicode UTF-8 và dấu thanh) và công thức chi phí chuẩn xác.",
        concept_grasped: "Hiểu sâu cơ chế Subword Tokenization đối với tiếng Việt có dấu thanh điệu."
      };
    } else {
      return {
        is_satisfactory: false,
        feedback: "Lời giải thích của bạn còn hơi khái quát hoặc mang tính suy đoán. Bạn hãy thử làm rõ: Vì sao tiếng Việt lại không tương đương 1 từ = 1 token như tiếng Anh?",
        concept_grasped: "Chưa làm rõ được cơ chế ngôn ngữ đơn lập có dấu thanh."
      };
    }
  } else {
    const isDeep = expLower.includes("đổi dấu") || expLower.includes("chuyển vế") || expLower.includes("-5") || expLower.includes("trừ 5");
    if (isDeep) {
      return {
        is_satisfactory: true,
        feedback: "Chính xác! Bạn đã hiểu rõ quy tắc chuyển vế đổi dấu trong giải phương trình.",
        concept_grasped: "Nắm vững quy tắc chuyển vế đổi dấu căn bản."
      };
    } else {
      return {
        is_satisfactory: false,
        feedback: "Hãy giải thích rõ hơn quy tắc toán học bạn đã áp dụng khi chuyển số 5 từ vế này sang vế kia.",
        concept_grasped: "Cần làm rõ quy tắc toán học."
      };
    }
  }
}

// Chạy toàn bộ 22 test cases của Golden Set
export async function runGoldenSetEvaluation(onProgress) {
  const results = [];
  let passedCount = 0;

  for (let i = 0; i < GOLDEN_SET_22.length; i++) {
    const tc = GOLDEN_SET_22[i];
    let casePassed = false;
    let details = [];

    if (tc.layer.includes("Lớp 4")) {
      const res = evaluateReflection(tc.student_input, 'ex_tokenization_vn_01');
      const isSat = res.is_satisfactory;
      const expSat = (tc.expected_status === "satisfactory");
      casePassed = (isSat === expSat);
      if (!casePassed) {
        details.push(`exp=${tc.expected_status} got=${isSat ? "satisfactory" : "unsatisfactory"}`);
      } else {
        details.push("OK");
      }
    } else {
      const res = analyzeTokenizationAttempt(tc.student_input);
      const statusOk = (res.status === tc.expected_status);
      const secOk = tc.expected_section ? (res.cited_section === tc.expected_section) : true;
      const spoilerOk = tc.check_spoiler ? checkNoSpoiler(res.hint) : true;

      casePassed = statusOk && secOk && spoilerOk;
      if (!statusOk) details.push(`status: exp=${tc.expected_status} got=${res.status}`);
      if (!secOk) details.push(`section: exp=${tc.expected_section} got=${res.cited_section}`);
      if (!spoilerOk) details.push("LỘ ĐÁP ÁN trong hint!");
      if (casePassed) details.push("OK");
    }

    if (casePassed) passedCount++;

    results.push({
      ...tc,
      passed: casePassed,
      details: details.join(" | ")
    });

    if (onProgress) {
      onProgress(i + 1, GOLDEN_SET_22.length, passedCount);
    }
    await new Promise(r => setTimeout(r, 20)); // animation delay
  }

  const accuracyPct = Math.round((passedCount / GOLDEN_SET_22.length) * 1000) / 10;
  return {
    total: GOLDEN_SET_22.length,
    passed: passedCount,
    accuracyPct,
    qualityBarMet: accuracyPct >= 75,
    results
  };
}
