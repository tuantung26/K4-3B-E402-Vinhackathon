export const GOLDEN_SET_22 = [
  {
    id: "case_01",
    layer: "Lớp 1 - Khái niệm sai lệch",
    description: "Coi 1 từ tiếng Việt = 1 token",
    student_input: "100 câu × 20 từ = 2,000 từ. Vậy tổng là 2,000 token. Chi phí = $0.001.",
    expected_status: "incorrect",
    expected_section: "§1.2",
    check_spoiler: true
  },
  {
    id: "case_02",
    layer: "Lớp 1 - Khái niệm sai lệch",
    description: "Coi 1 từ = 1 token, nhân 0.5 chia 1M",
    student_input: "Tổng số token là 2000 token. Chi phí là 0.001 USD vì lấy 2000 nhân 0.5 chia 1 triệu.",
    expected_status: "incorrect",
    expected_section: "§1.2",
    check_spoiler: true
  },
  {
    id: "case_03",
    layer: "Lớp 1 - Khái niệm sai lệch",
    description: "Áp dụng hệ số tiếng Anh 1.3x cho tiếng Việt",
    student_input: "Tổng 2000 từ. Tiếng Anh 1.3 token/từ nên lấy 2000 * 1.3 = 2600 tokens. Giá $0.0013.",
    expected_status: "incorrect",
    expected_section: "§1.2",
    check_spoiler: true
  },
  {
    id: "case_04",
    layer: "Lớp 1 - Khái niệm sai lệch",
    description: "Coi 1 ký tự/chữ cái = 1 token",
    student_input: "2000 từ là 10,000 chữ cái. 1 token là 1 chữ cái nên là 10,000 token. Giá $0.005.",
    expected_status: "incorrect",
    expected_section: "§1.1",
    check_spoiler: true
  },
  {
    id: "case_05",
    layer: "Lớp 2 - Lỗi công thức & đơn vị",
    description: "Sai mẫu số quy đổi (chia 1,000 thay vì 1,000,000)",
    student_input: "5,000 token. Chi phí = (5,000 / 1,000) * 0.5 = $2.5 USD.",
    expected_status: "incorrect",
    expected_section: "§2.1",
    check_spoiler: true
  },
  {
    id: "case_06",
    layer: "Lớp 2 - Lỗi công thức & đơn vị",
    description: "Quên nhân số lượng 100 câu (chỉ tính 1 câu)",
    student_input: "1 câu 20 từ tốn 50 token. Chi phí là 50 / 1,000,000 * 0.5 = $0.000025.",
    expected_status: "incorrect",
    expected_section: "§2.1",
    check_spoiler: true
  },
  {
    id: "case_07",
    layer: "Lớp 2 - Lỗi công thức & đơn vị",
    description: "Đảo ngược phép tính chi phí (chia đơn giá nhân 1 triệu)",
    student_input: "5000 tokens. Chi phí là lấy 5000 chia cho 0.5 rồi nhân 1 triệu.",
    expected_status: "incorrect",
    expected_section: "§2.1",
    check_spoiler: true
  },
  {
    id: "case_08",
    layer: "Lớp 3 - Mơ hồ / Thiếu căn cứ",
    description: "Gõ ký tự ngẫu nhiên rác",
    student_input: "asdfasdf qwerty",
    expected_status: "insufficient_evidence",
    expected_section: null,
    check_spoiler: false
  },
  {
    id: "case_09",
    layer: "Lớp 3 - Mơ hồ / Thiếu căn cứ",
    description: "Đoán cảm tính không có số liệu",
    student_input: "Chi phí rẻ lắm, chắc chưa đến một nghìn đồng.",
    expected_status: "insufficient_evidence",
    expected_section: null,
    check_spoiler: false
  },
  {
    id: "case_10",
    layer: "Lớp 3 - Mơ hồ / Thiếu căn cứ",
    description: "Học viên bỏ cuộc, không trình bày bài làm",
    student_input: "Em chịu, bài này khó quá không biết làm thế nào.",
    expected_status: "insufficient_evidence",
    expected_section: null,
    check_spoiler: false
  },
  {
    id: "case_11",
    layer: "Lớp 3 - Mơ hồ / Thiếu căn cứ",
    description: "Đoán mò không đưa ra bước tính trung gian",
    student_input: "Chắc tầm 5000 token và 1 đô la.",
    expected_status: "insufficient_evidence",
    expected_section: null,
    check_spoiler: false
  },
  {
    id: "case_12",
    layer: "Happy Path",
    description: "Bài làm hoàn chỉnh chuẩn xác (hệ số 2.5x)",
    student_input: "100 câu * 20 từ = 2000 từ. Tiếng Việt 2.5 token/từ -> 5,000 tokens. Chi phí: (5000/1M)*0.5 = $0.0025.",
    expected_status: "correct",
    expected_section: null,
    check_spoiler: false
  },
  {
    id: "case_13",
    layer: "Happy Path",
    description: "Bài làm đúng ở dải biên dưới (hệ số 2.0x)",
    student_input: "2000 từ tiếng Việt tốn 2 tokens/từ nên khoảng 4,000 tokens. Chi phí là $0.002 USD.",
    expected_status: "correct",
    expected_section: null,
    check_spoiler: false
  },
  {
    id: "case_14",
    layer: "Happy Path",
    description: "Bài làm đúng ở dải biên trên (hệ số 3.0x)",
    student_input: "2000 từ tiếng Việt nhân 3 tokens mỗi từ = 6,000 tokens. Chi phí $0.003 USD.",
    expected_status: "correct",
    expected_section: null,
    check_spoiler: false
  },
  {
    id: "case_15",
    layer: "Lớp 4 - Reflection (Giải thích bản chất)",
    description: "Giải thích sâu sắc về cơ chế BPE và thanh điệu Unicode",
    student_input: "Do lần đầu tưởng 1 từ = 1 token. Đọc tài liệu mới hiểu tiếng Việt có dấu Unicode nên BPE tách thành 2-3 tokens.",
    expected_status: "satisfactory",
    expected_section: null,
    check_spoiler: false
  },
  {
    id: "case_16",
    layer: "Lớp 4 - Reflection (Giải thích bản chất)",
    description: "Giải thích đúng sai sót đơn vị quy đổi 1M tokens",
    student_input: "Ban đầu tôi nhầm công thức chia cho 1,000 thay vì 1,000,000 đơn vị token.",
    expected_status: "satisfactory",
    expected_section: null,
    check_spoiler: false
  },
  {
    id: "case_17",
    layer: "Lớp 4 - Reflection (Giải thích bản chất)",
    description: "Giải thích chép vẹt, đối phó theo AI",
    student_input: "Tại vì lúc nãy AI bảo em sai nên em sửa lại theo số đó thôi.",
    expected_status: "unsatisfactory",
    expected_section: null,
    check_spoiler: false
  },
  {
    id: "case_18",
    layer: "Lớp 4 - Reflection (Giải thích bản chất)",
    description: "Giải thích đối phó, đoán bừa",
    student_input: "Em đoán bừa thôi chứ em có biết gì đâu.",
    expected_status: "unsatisfactory",
    expected_section: null,
    check_spoiler: false
  },
  {
    id: "case_19",
    layer: "Cases biên & hiếm",
    description: "Chỉ đưa số kết quả không có bước giải (yêu cầu sư phạm giải thích)",
    student_input: "5000 và 0.0025",
    expected_status: "insufficient_evidence",
    expected_section: null,
    check_spoiler: false
  },
  {
    id: "case_20",
    layer: "Cases biên & hiếm",
    description: "Chỉ trả lời nửa câu (thiếu phần tính chi phí)",
    student_input: "Tổng 100 câu là 2000 từ. Với tiếng Việt cần khoảng 5000 tokens.",
    expected_status: "insufficient_evidence",
    expected_section: null,
    check_spoiler: false
  },
  {
    id: "case_21",
    layer: "Cases biên & hiếm",
    description: "Ước lượng thổi phồng quá mức (1 từ = 10 tokens)",
    student_input: "1 từ là 10 token, 2000 từ là 20,000 token. Chi phí là $0.01.",
    expected_status: "incorrect",
    expected_section: "§1.2",
    check_spoiler: true
  },
  {
    id: "case_22",
    layer: "Cases biên & hiếm",
    description: "Học viên hỏi lạc đề / vặn lại mô hình tokenizer",
    student_input: "Mô hình này dùng tokenizer loại nào? Tiktoken hay sentencepiece?",
    expected_status: "insufficient_evidence",
    expected_section: null,
    check_spoiler: false
  }
];
