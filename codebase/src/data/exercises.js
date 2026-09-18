export const EXERCISES = [
  {
    id: 'ex_tokenization_vn_01',
    track: 'TRACK D2 · HỌC TỪ LỖI TRƯỚC (CHÍNH THỨC)',
    title: 'Ước tính Tokenization Tiếng Việt và Chi phí API LLM',
    prompt: 'Một ứng dụng AI cần dịch 100 câu tiếng Việt sang tiếng Anh, mỗi câu dài trung bình 20 từ tiếng Việt. Giả sử bạn gọi mô hình qua API với mức giá là $0.5 cho 1 triệu (1,000,000) input tokens.\n\n👉 Yêu cầu:\n1. Ước tính tổng số tokens đầu vào mà bạn sẽ gửi lên API là bao nhiêu?\n2. Chi phí ước tính cho toàn bộ 100 câu này là bao nhiêu USD?\n*(Ghi rõ các bước tính toán hoặc giả định của bạn)*',
    samples: [
      { label: 'Ngộ nhận 1 từ = 1 token', text: '100 câu x 20 từ = 2,000 từ = 2,000 token. Chi phí = $0.001' },
      { label: 'Sai mẫu số 1 triệu', text: '5,000 token. Chi phí = (5,000 / 1,000) * 0.5 = $2.5 USD.' },
      { label: 'Cảm tính thiếu căn cứ', text: 'Chi phí rẻ lắm, chắc chưa đến một nghìn đồng.' },
      { label: 'Bài làm đúng chuẩn', text: '100 câu * 20 từ = 2000 từ. Tiếng Việt 2.5 token/từ -> 5,000 tokens. Chi phí: (5000/1M)*0.5 = $0.0025' }
    ],
    reflectionSample: {
      deep: 'Do ban đầu em tưởng 1 từ = 1 token như tiếng Anh, nhưng thực tế tiếng Việt có dấu thanh UTF-8 nên tokenizer BPE tách thành 2-3 tokens.',
      superficial: 'Tại vì lúc nãy AI bảo em sai nên em sửa lại theo số đó thôi.'
    },
    documents: {
      '§1.1': {
        title: 'Cơ chế Subword Tokenization trong LLM',
        content: 'Mô hình ngôn ngữ lớn (LLM) không nhận trực tiếp từng từ (word) mà phân tách văn bản thành các "token" qua thuật toán Subword (như Byte-Pair Encoding - BPE). Với tiếng Anh đơn âm thông thường, trung bình 1 từ tiếng Anh tương đương 1 đến 1.3 tokens.'
      },
      '§1.2': {
        title: 'Đặc thù Tokenization Tiếng Việt',
        content: 'Tiếng Việt là ngôn ngữ đơn lập, có dấu thanh điệu và sử dụng hệ ký tự Latinh mở rộng (Unicode UTF-8). Các tokenizer tiêu chuẩn của LLM quốc tế thường tách mỗi từ tiếng Việt có dấu thành nhiều byte/subwords. Do đó, trung bình 1 từ tiếng Việt tương đương từ 2.0 đến 3.0 tokens (hệ số giãn nở gấp 2 - 2.5 lần tiếng Anh).'
      },
      '§2.1': {
        title: 'Công thức tính chi phí gọi LLM API',
        content: 'Chi phí gọi API được tính theo công thức: Chi phí ($) = (Tổng số tokens / 1,000,000) × Đơn giá trên 1M token. Khi tính toán, cần chú ý mẫu số quy đổi là một triệu (1,000,000) tokens.'
      },
      '§2.2': {
        title: 'Chi phí tiềm ẩn & Hệ số dự phòng',
        content: 'Trong thực tế, ngoài input prompt từ người dùng, ứng dụng còn gửi kèm System Prompt, định dạng đối thoại, và nhận về output tokens. Vì vậy, các kỹ sư AI thường cộng thêm 20-30% dự phòng chi phí vận hành.'
      }
    },
    standard_answer: `Bước 1: Tính tổng số từ tiếng Việt:
100 câu × 20 từ = 2,000 từ tiếng Việt.

Bước 2: Ước tính hệ số tokenization tiếng Việt (§1.2):
Do tiếng Việt là ngôn ngữ có dấu thanh Unicode UTF-8, thuật toán Byte-Pair Encoding (BPE) tách mỗi từ có dấu thành 2.0 - 3.0 tokens (chọn trung bình 2.5 tokens/từ).
Tổng số tokens = 2,000 từ × 2.5 = 5,000 tokens (chấp nhận dải 4,000 - 6,000 tokens).

Bước 3: Tính chi phí gọi API theo công thức chuẩn (§2.1):
Mức giá niêm yết: $0.5 cho 1,000,000 (1 triệu) input tokens.
Chi phí = (5,000 tokens / 1,000,000) × $0.5 = 0.005 × $0.5 = $0.0025 USD (hoặc khoảng $0.002 - $0.003 USD tùy hệ số).`,
    standard_keywords: ['5000', '5,000', '4000', '6000', '0.0025', '$0.0025', '0.002', '0.003']
  },
  {
    id: 'linear-equation-01',
    track: 'TRACK D2 · TOÁN HỌC CĂN BẢN (DEMO MẪU)',
    title: 'Phương trình bậc nhất một ẩn',
    prompt: 'Giải phương trình 3x + 5 = 20 và trình bày các bước biến đổi.',
    samples: [
      { label: 'Sai dấu chuyển vế', text: '3x = 20 + 5 = 25; x = 25/3' },
      { label: 'Chưa chia hệ số', text: '3x = 15; x = 15' },
      { label: 'Đoán mò không bước giải', text: 'Em không biết, x chắc là 25' },
      { label: 'Bài giải đúng', text: '3x = 20 - 5 = 15 => x = 15 / 3 = 5' }
    ],
    reflectionSample: {
      deep: 'Lúc đầu em quên quy tắc chuyển vế đổi dấu: chuyển +5 sang vế phải phải thành -5 chứ không giữ nguyên dấu cộng.',
      superficial: 'Do máy tính nó bảo em sai thì em đổi lại thôi.'
    },
    documents: {
      'SEC-01': {
        title: 'Quy tắc chuyển vế đổi dấu',
        content: 'Khi chuyển một hạng tử từ vế này sang vế kia của một phương trình, ta phải đổi dấu hạng tử đó: dấu "+" đổi thành dấu "-", dấu "-" đổi thành dấu "+".'
      },
      'SEC-02': {
        title: 'Quy tắc nhân hoặc chia với một số',
        content: 'Trong một phương trình, ta có thể nhân hoặc chia cả hai vế với cùng một số khác 0 để tìm nghiệm x: nếu ax = b (a ≠ 0) thì x = b / a.'
      }
    },
    standard_answer: `Bước 1: Chuyển hạng tử tự do (+5) từ vế trái sang vế phải và đổi dấu thành (-5) theo SEC-01:
3x = 20 - 5
3x = 15

Bước 2: Chia cả hai vế của phương trình cho hệ số 3 để cô lập x theo SEC-02:
x = 15 / 3
x = 5.

Kết luận: Nghiệm của phương trình là x = 5.`,
    standard_keywords: ['x=5', 'x = 5']
  }
];
