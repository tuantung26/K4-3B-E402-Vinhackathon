export const SAMPLE_DOCUMENTS = [
  {
    id: 'rag-chunking',
    title: 'Giáo trình RAG: Chiến lược Chunking & Overlap trong Hệ thống Tìm kiếm Ngữ nghĩa',
    content: `# Kiến trúc Retrieval-Augmented Generation (RAG) & Chiến lược Phân đoạn (Chunking)

## §1. Định cỡ Chunk Size và Độ trôi ngữ cảnh
Trong hệ thống RAG, văn bản dài không được đưa trực tiếp vào Vector Database mà phải được chia thành các đoạn nhỏ (chunks). Nếu chunk quá nhỏ (dưới 128 tokens), ngữ cảnh ngữ nghĩa bị xé vụn khiến mô hình Embedding không nắm bắt trọn vẹn thông điệp. Nếu chunk quá lớn (trên 1024 tokens), đoạn trích chứa quá nhiều thông tin loãng (noise), làm giảm độ chính xác khi truy xuất (Retrieval Precision) và gây lãng phí context window của LLM. Độ dài tối ưu phổ biến cho tài liệu kỹ thuật là 256 - 512 tokens.

## §2. Kỹ thuật Chunk Overlap và Chi phí Token lưu trữ
Để tránh hiện tượng câu bị ngắt đôi giữa hai chunk liền kề, các kỹ sư luôn áp dụng Chunk Overlap (thường từ 10% đến 20% kích thước chunk). Khi áp dụng overlap, tổng số tokens lưu vào cơ sở dữ liệu vector sẽ tăng lên theo tỷ lệ:
Số chunk thực tế = ceil((Tổng tokens - Chunk Size) / (Chunk Size - Overlap Size)) + 1.
Một sai lầm rất phổ biến của người mới bắt đầu là quên tính phần overlap bù trừ, dẫn đến ước tính thiếu 20-30% dung lượng vector storage và chi phí gọi Embedding API.

## §3. Trade-off giữa Top-K và Nguy cơ Ảo giác (Lost in the Middle)
Khi truy vấn, hệ thống thường lấy ra Top-K chunks có điểm tương đồng cosine cao nhất để đưa vào Prompt gửi cho LLM. Nếu K quá nhỏ (K=1, 2), hệ thống có nguy cơ bỏ sót thông tin bổ trợ. Nếu K quá lớn (K > 8), ngoài việc làm phình to chi phí Input Token, mô hình còn dễ mắc hội chứng 'Lost in the Middle' - chỉ chú ý phần đầu và cuối ngữ cảnh mà bỏ qua đoạn dữ liệu mấu chốt nằm ở giữa prompt.`
  },
  {
    id: 'transformer-attention',
    title: 'Giáo trình Deep Learning: Độ phức tạp tính toán của Self-Attention trong Transformer',
    content: `# Cơ chế Self-Attention & Chi phí Tài nguyên trong Kiến trúc Transformer

## §1. Ma trận Attention và Độ phức tạp bậc hai O(N²)
Trong cơ chế Scaled Dot-Product Attention, ma trận biểu diễn chuỗi Q (Query) và K (Key) đều có kích thước (N × d), trong đó N là độ dài chuỗi token (Sequence Length) và d là số chiều ẩn (Hidden Dimension). Phép nhân ma trận Q × K^T tạo ra ma trận Attention Scores có kích thước (N × N). Do đó, chi phí tính toán FLOPs và bộ nhớ RAM cần để lưu ma trận này tăng theo hàm bậc hai O(N²). Khi chiều dài ngữ cảnh tăng gấp đôi từ 2,000 lên 4,000 tokens, chi phí tính toán Attention không tăng gấp đôi mà tăng gấp 4 lần.

## §2. Bộ nhớ KV-Cache trong giai đoạn Suy luận (Inference Decoding)
Khi sinh văn bản tự hồi quy (Autoregressive Generation), mô hình phải tính từng token một. Để không phải tính toán lại Key và Value của các token trước đó, hệ thống lưu toàn bộ Key và Value vào bộ nhớ GPU gọi là KV-Cache. Kích thước KV-Cache tỷ lệ thuận với: 2 × (Số layer) × (Số Attention Heads) × (Hidden Dimension) × (Context Length) × (Bytes per parameter). Nhiều kỹ sư tính toán nhầm rằng chi phí bộ nhớ chỉ phụ thuộc vào số lượng tham số của mô hình (Weights), mà bỏ quên KV-Cache vốn có thể chiếm đến 60-80% VRAM GPU khi chạy đa người dùng (High Concurrency).`
  },
  {
    id: 'lru-cache',
    title: 'Hệ thống Caching: Chiến lược Loại trừ LRU và Dung lượng Bộ nhớ',
    content: `# Kiến trúc Caching & Thuật toán Least Recently Used (LRU)

## §1. Nguyên lý Hoạt động của LRU Cache
LRU (Least Recently Used) tổ chức dữ liệu theo thứ tự truy cập gần nhất, thường kết hợp Hash Map (để tìm kiếm O(1)) và Doubly Linked List (để dịch chuyển node O(1)). Khi cache đầy dung lượng (Capacity) và có một phần tử mới được ghi vào, hệ thống phải loại bỏ (evict) phần tử ít được sử dụng nhất ở đuôi danh sách.

## §2. Tính toán Tỷ lệ Trúng Cache (Cache Hit Rate) & Giảm tải Database
Giả sử hệ thống xử lý 10,000 requests/phút. Nếu Cache Hit Rate đạt 80%, chỉ có 20% requests (2,000 requests) phải đọc trực tiếp từ Database. Nhiều kỹ sư tính toán sai khi tăng dung lượng cache lên gấp đôi nhưng không phân tích phân phối truy cập (định luật Pareto 80/20), dẫn đến việc tốn chi phí RAM đắt đỏ mà Hit Rate chỉ tăng thêm 1-2%.`
  },
  {
    id: 'db-indexing',
    title: 'Cơ sở dữ liệu: So sánh B-Tree Index Scan và Full Table Scan',
    content: `# Tối ưu hóa Truy vấn Cơ sở Dữ liệu với Chỉ mục B-Tree

## §1. Cấu trúc B-Tree Index và Chi phí Tìm kiếm O(log N)
Khi tạo Index trên một cột, hệ thống xây dựng cây cân bằng B-Tree. Khi thực hiện truy vấn lọc chính xác WHERE id = 500,000 trên bảng 1 triệu dòng, B-Tree chỉ cần đọc khoảng log(N) trang đĩa (thường từ 3 đến 4 I/O operations). Ngược lại, nếu không có Index, hệ thống phải thực hiện Full Table Scan quét toàn bộ 1 triệu bản ghi từ ổ đĩa.

## §2. Điểm hòa vốn (Tipping Point) và Chi phí Ghi (Write Penalty)
Index không phải lúc nào cũng tốt: mỗi lệnh INSERT hoặc UPDATE đều phải cập nhật lại B-Tree, làm chậm thao tác ghi. Ngoài ra, nếu câu truy vấn lấy ra hơn 20-30% số dòng của bảng (Selectivity thấp), Database Optimizer sẽ quyết định bỏ qua Index và chạy Table Scan vì chi phí Random I/O của Index lúc này còn tốn kém hơn Sequential I/O.`
  }
];

export async function generateExerciseFromText(rawText, customApiKey = null) {
  const text = rawText.trim();
  if (text.length < 10) {
    throw new Error('Nội dung quá ngắn. Vui lòng cung cấp ít nhất 10 ký tự chủ đề hoặc tài liệu.');
  }

  // 1. Nếu có API key, gọi Gemini 2.5 Flash
  const apiKey = customApiKey || localStorage.getItem('gemini_api_key') || '';
  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Bạn là Chuyên gia Thiết kế Sư phạm AI theo phương pháp "Học từ lỗi trước" (Track D2 - Learning from Mistakes).
Nhiệm vụ: Phân tích tài liệu học tập sau đây và tự động thiết kế 1 bài tập thực hành nhỏ để học viên LÀM THỬ TRƯỚC KHI ĐỌC LÝ THUYẾT.

Tài liệu đầu vào:
"""
${text.slice(0, 4000)}
"""

YÊU CẦU ĐẦU RA (Trả về định dạng JSON DUY NHẤT):
{
  "title": "Tên bài tập ngắn gọn, thực chiến",
  "prompt": "Đề bài bài tập cụ thể có số liệu/dữ kiện để học viên tính toán hoặc tự làm trước khi xem lý thuyết. Nêu rõ câu hỏi 1, câu hỏi 2 và yêu cầu ghi rõ bước giải.",
  "documents": {
    "§1.1": { "title": "Tiêu đề section trích dẫn 1", "content": "Nội dung tóm tắt khoảng 2-3 câu từ tài liệu" },
    "§1.2": { "title": "Tiêu đề section trích dẫn 2", "content": "Nội dung tóm tắt khoảng 2-3 câu từ tài liệu" },
    "§2.1": { "title": "Tiêu đề section trích dẫn 3", "content": "Nội dung tóm tắt khoảng 2-3 câu từ tài liệu" }
  },
  "misconceptions": [
    {
      "keyword": "từ khóa hoặc số nhận diện lỗi 1",
      "error_type": "Tên ngộ nhận thường gặp",
      "hint": "Gợi ý Socratic ngắn giúp học viên tự nhận ra vấn đề (TUYỆT ĐỐI KHÔNG LỘ CON SỐ ĐÁP ÁN CUỐI)",
      "cited_section": "§1.1"
    },
    {
      "keyword": "từ khóa hoặc số nhận diện lỗi 2",
      "error_type": "Tên sai sót công thức hoặc tham số",
      "hint": "Gợi ý Socratic ngắn hướng tư duy (TUYỆT ĐỐI KHÔNG LỘ ĐÁP ÁN)",
      "cited_section": "§1.2"
    }
  ],
  "standard_answer": "Lời giải mẫu chi tiết từng bước và kết quả chuẩn xác",
  "standard_keywords": ["từ khóa hoặc dải số 1", "từ khóa 2", "đáp án đúng"],
  "reflection_prompt": "Câu hỏi đào sâu bản chất ở Bước 9",
  "reflection_keywords": ["từ khóa bản chất 1", "từ khóa bản chất 2"]
}`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const json = await response.json();
        const contentStr = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (contentStr) {
          const parsed = JSON.parse(contentStr);
          return formatGeneratedExercise(parsed, text);
        }
      }
    } catch (err) {
      console.warn('Lỗi gọi Gemini API khi sinh đề, chuyển sang Smart Heuristic:', err);
    }
  }

  // 2. Chế độ Smart Heuristic (Không cần API key)
  return generateOfflineExercise(text);
}

function formatGeneratedExercise(aiResult, originalDoc) {
  const exId = 'ex_generated_' + Date.now();
  return {
    id: exId,
    track: 'TRACK D2 · SINH TỰ ĐỘNG TỪ TÀI LIỆU CỦA BẠN',
    title: aiResult.title || 'Bài tập thực hành tự động',
    prompt: aiResult.prompt,
    documents: aiResult.documents || {
      '§1.1': { title: 'Tổng quan khái niệm', content: originalDoc.slice(0, 300) }
    },
    misconceptions: aiResult.misconceptions || [],
    standard_answer: aiResult.standard_answer || '1. Tính toán theo công thức giáo trình.\n2. Nêu rõ giả định và đơn vị quy đổi.',
    standard_keywords: aiResult.standard_keywords || [],
    reflectionPrompt: aiResult.reflection_prompt || 'Hãy giải thích ngắn: Vì sao lúc đầu bạn lại mắc phải sai lầm đó?',
    reflection_keywords: aiResult.reflection_keywords || [],
    samples: [
      { label: 'Ví dụ làm thử 1', text: 'Nhập giả định hoặc phép tính ban đầu của bạn...' },
      { label: 'Ví dụ làm thử 2', text: 'Tôi nghĩ kết quả là...' }
    ],
    reflectionSample: {
      deep: 'Tôi đã hiểu được bản chất vấn đề sau khi đối chiếu tài liệu trích dẫn.',
      superficial: 'Tôi làm đúng vì máy bảo sửa lại thế.'
    }
  };
}

function generateOfflineExercise(text) {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  let title = lines[0].replace(/^#+\s*/, '').slice(0, 60);
  if (!title || title.length < 5) title = 'Thực hành tối ưu hóa kiến trúc hệ thống AI';

  // Trích xuất các đoạn văn làm section
  const sections = {};
  let secIdx = 1;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 40);

  paragraphs.slice(0, 3).forEach((p, idx) => {
    const secKey = `§1.${idx + 1}`;
    const firstLine = p.trim().split('\n')[0].replace(/^#+\s*/, '').slice(0, 50);
    sections[secKey] = {
      title: firstLine || `Khái niệm then chốt phần ${idx + 1}`,
      content: p.slice(0, 260) + '...'
    };
  });

  if (Object.keys(sections).length === 0) {
    sections['§1.1'] = { title: 'Tài liệu kiến thức cốt lõi', content: text.slice(0, 300) };
  }

  // Phát hiện chủ đề từ khóa
  const isRAG = text.toLowerCase().includes('rag') || text.toLowerCase().includes('chunk');
  const isAttention = text.toLowerCase().includes('attention') || text.toLowerCase().includes('transformer');
  const isCache = text.toLowerCase().includes('cache') || text.toLowerCase().includes('lru');
  const isDatabase = text.toLowerCase().includes('index') || text.toLowerCase().includes('b-tree') || text.toLowerCase().includes('database') || text.toLowerCase().includes('sql');

  let prompt = '';
  let misconceptions = [];
  let standardKeywords = [];
  let reflectionKeywords = [];

  if (isRAG) {
    prompt = `**Đề bài thực hành RAG Chunking (Làm trước khi xem lý thuyết):**
Một hệ thống hỏi đáp RAG cần nạp một cuốn cẩm nang kỹ thuật gồm **5,000 tokens**.
Kỹ sư cấu hình kích thước phân đoạn: **Chunk Size = 500 tokens**, **Chunk Overlap = 100 tokens (20%)**.

👉 **Yêu cầu:**
1. Hãy ước tính tổng số chunks thực tế sẽ được tạo ra và lưu vào Vector Database?
2. Chi phí lưu trữ vector sẽ tăng bao nhiêu % so với trường hợp không có overlap?
*(Ghi rõ công thức hoặc cách nhẩm của bạn trước khi nộp)*`;

    misconceptions = [
      {
        keyword: '10',
        error_type: 'Quên tính bù trừ Chunk Overlap (lấy 5000 / 500 = 10 chunks)',
        hint: 'Gợi ý: Hãy chú ý rằng mỗi chunk liền kề gối lên nhau 100 tokens. Mỗi bước trượt (stride) thực tế chỉ dịch đi bao nhiêu tokens?',
        cited_section: '§1.2'
      },
      {
        keyword: '50',
        error_type: 'Nhầm lẫn kích thước phân đoạn',
        hint: 'Gợi ý: Xem lại định nghĩa Chunk Size và tỷ lệ Overlap trong tài liệu §1.1.',
        cited_section: '§1.1'
      }
    ];
    standardKeywords = ['12', '13', '12 chunk', '13 chunk', '20%', '25%'];
    reflectionKeywords = ['stride', 'gối đầu', 'overlap', 'bước trượt', 'tránh đứt'];
  } else if (isAttention) {
    prompt = `**Đề bài thực hành Transformer Attention (Làm trước khi xem lý thuyết):**
Một mô hình ngôn ngữ đang xử lý đoạn văn đầu vào có độ dài **N = 2,000 tokens**.
Nếu bạn tăng độ dài văn bản đầu vào lên gấp 3 lần thành **N = 6,000 tokens**:

👉 **Yêu cầu:**
1. Khối lượng tính toán (FLOPs) của ma trận Self-Attention Q × K^T sẽ tăng lên bao nhiêu lần?
2. Dung lượng bộ nhớ RAM/VRAM để lưu ma trận điểm Attention này sẽ thay đổi như thế nào?
*(Ghi rõ các bước lập luận hoặc công thức bạn đã dùng)*`;

    misconceptions = [
      {
        keyword: '3 lần',
        error_type: 'Ngộ nhận độ phức tạp tuyến tính O(N)',
        hint: 'Gợi ý: Ma trận Attention Scores được tạo ra từ phép nhân Q (N × d) và K^T (d × N). Kích thước ma trận kết quả là bao nhiêu?',
        cited_section: '§1.1'
      },
      {
        keyword: '6 lần',
        error_type: 'Nhầm lẫn công thức nhân đôi',
        hint: 'Gợi ý: Hãy nhớ lại độ phức tạp của Self-Attention là bậc hai O(N^2). Khi N tăng gấp 3 thì N^2 tăng bao nhiêu lần?',
        cited_section: '§1.1'
      }
    ];
    standardKeywords = ['9 lần', '9x', 'bậc hai', 'o(n^2)', 'n^2'];
    reflectionKeywords = ['bậc hai', 'n²', 'n^2', 'q x k', 'ma trận n x n', 'quadratic'];
  } else if (isCache) {
    prompt = `**Đề bài thực hành LRU Caching & Capacity (Làm trước khi xem lý thuyết):**
Một API xử lý **10,000 requests/phút**. Ban đầu không có Cache, toàn bộ 10,000 requests đều đập vào Database.
Kỹ sư triển khai LRU Cache và đo được **Cache Hit Rate đạt 80%**.

👉 **Yêu cầu:**
1. Số lượng requests phải đọc trực tiếp từ Database mỗi phút giảm xuống còn bao nhiêu?
2. Nếu tăng gấp đôi dung lượng Cache (RAM) thì tỷ lệ Hit Rate có chắc chắn tăng gấp đôi lên 160% không? Vì sao?
*(Ghi rõ các bước tính toán và nhận định của bạn)*`;

    misconceptions = [
      {
        keyword: '8000',
        error_type: 'Nhầm lẫn giữa số request trúng cache và số request chạm database',
        hint: 'Gợi ý: Hit Rate 80% nghĩa là 80% đã được phục vụ từ cache. Vậy số còn lại phải vào database là (100% - 80%)?',
        cited_section: '§1.2'
      },
      {
        keyword: '160%',
        error_type: 'Ngộ nhận Hit Rate tỷ lệ thuận tuyến tính vô hạn',
        hint: 'Gợi ý: Tỷ lệ phần trăm hit rate không thể vượt quá 100%, và theo quy luật Pareto chỉ một phần nhỏ dữ liệu được truy cập thường xuyên.',
        cited_section: '§1.2'
      }
    ];
    standardKeywords = ['2,000', '2000', '20%', 'không', 'pareto'];
    reflectionKeywords = ['hit rate', 'miss rate', 'pareto', 'bão hòa', 'dung lượng'];
  } else if (isDatabase) {
    prompt = `**Đề bài thực hành Tối ưu Truy vấn SQL & B-Tree Index (Làm trước khi xem lý thuyết):**
Bảng \`users\` có **1,000,000 dòng**. Ta cần chạy truy vấn:
\`SELECT * FROM users WHERE status = 'active';\`
Biết rằng 90% số dòng trong bảng đều có \`status = 'active'\`. Cột \`status\` đã được tạo B-Tree Index.

👉 **Yêu cầu:**
1. Database Query Optimizer sẽ chọn dùng B-Tree Index Scan hay Full Table Scan?
2. Hãy giải thích ngắn lý do về mặt chi phí I/O (Random I/O vs Sequential I/O).
*(Ghi rõ lập luận của bạn trước khi đối chiếu)*`;

    misconceptions = [
      {
        keyword: 'index scan',
        error_type: 'Ngộ nhận có Index thì luôn luôn được dùng',
        hint: 'Gợi ý: Hãy chú ý rằng 90% bảng đều thỏa mãn điều kiện. Nếu dùng Index, ta phải nhảy con trỏ ngẫu nhiên (Random I/O) bao nhiêu lần so với đọc tuần tự một mạch (Sequential I/O)?',
        cited_section: '§1.2'
      }
    ];
    standardKeywords = ['table scan', 'full table scan', 'quét toàn bộ', 'sequential', 'tuần tự', 'random i/o'];
    reflectionKeywords = ['selectivity', 'tipping point', 'sequential', 'random i/o', 'ngẫu nhiên'];
  } else {
    prompt = `**Đề bài áp dụng thực hành (Làm trước khi xem lý thuyết):**
Dựa trên tài liệu bạn vừa cung cấp về "${title}":

👉 **Yêu cầu:**
1. Hãy trình bày giải pháp hoặc ước tính thông số cốt lõi cho một tình huống thực tế áp dụng kiến thức trên.
2. Nêu rõ các bước suy luận, công thức hoặc giả định của bạn trước khi đối chiếu với giáo trình chuẩn.`;

    misconceptions = [
      {
        keyword: 'không biết',
        error_type: 'Chưa đủ căn cứ bài làm',
        hint: 'Gợi ý: Hãy thử đưa ra một giả định ban đầu và nhẩm thử một bước tính cơ bản.',
        cited_section: '§1.1'
      }
    ];
    standardKeywords = ['tối ưu', 'tham số', 'công thức', 'phân tích'];
    reflectionKeywords = ['hiểu bản chất', 'đối chiếu', 'tài liệu'];
  }

  const standardAnswer = isRAG 
    ? '1. Bước trượt stride = 500 - 100 = 400 tokens.\nSố chunk thực tế = ceil((5000 - 500) / 400) + 1 = 12 hoặc 13 chunks (tùy xử lý biên).\n2. Tổng số tokens embedding lưu trữ tăng thêm 20-25% do 100 tokens gối đầu ở mỗi phân đoạn.'
    : isAttention
    ? '1. Chi phí FLOPs tăng theo hàm bậc hai O(N^2). Khi N tăng gấp 3 lần thì ma trận Attention Q x K^T tăng 3^2 = 9 lần.\n2. Bộ nhớ VRAM lưu trữ ma trận điểm N x N cũng tăng gấp 9 lần.'
    : isCache
    ? '1. Số request phải đọc từ Database = 10,000 × (100% - 80%) = 2,000 requests/phút (giảm 80%).\n2. Không thể tăng lên 160% vì Hit rate tối đa là 100%, và theo quy luật Pareto (80/20), việc tăng RAM thêm sẽ chạm ngưỡng bão hòa tăng ích giảm dần.'
    : isDatabase
    ? '1. Database Optimizer sẽ chọn Full Table Scan thay vì dùng Index.\n2. Vì Selectivity quá thấp (90% dữ liệu thỏa mãn), việc tra qua B-Tree Index rồi đọc ngẫu nhiên (Random I/O) từng block dữ liệu tốn kém hơn nhiều so với việc đọc tuần tự liên tục (Sequential I/O) toàn bộ bảng.'
    : '1. Dựa trên các nguyên tắc nêu trong tài liệu trích dẫn.\n2. Phân tích rõ các giả định và thông số kỹ thuật then chốt.';

  return {
    id: 'ex_auto_' + Date.now(),
    track: 'TRACK D2 · SINH ĐỀ TỰ ĐỘNG TỪ TÀI LIỆU',
    title: `Thực hành: ${title}`,
    prompt,
    documents: sections,
    misconceptions,
    standard_answer: standardAnswer,
    standard_keywords: standardKeywords,
    reflectionPrompt: 'Hãy giải thích ngắn: Vì sao lúc đầu bạn lại nhầm lẫn hoặc tính toán chưa đúng?',
    reflection_keywords: reflectionKeywords,
    samples: [
      { label: 'Thử phán đoán ban đầu', text: 'Theo tôi thì kết quả sẽ tăng khoảng 3 lần vì độ dài tăng 3 lần.' },
      { label: 'Thử bài làm hoàn chỉnh', text: 'Do độ phức tạp là O(N^2), khi N tăng gấp 3 thì khối lượng tính toán sẽ tăng 3^2 = 9 lần.' }
    ],
    reflectionSample: {
      deep: 'Lúc đầu tôi ngộ nhận độ phức tạp là tuyến tính O(N), nhưng ma trận Q x K^T có kích thước N x N nên tăng theo bậc hai N^2.',
      superficial: 'Tôi sửa lại số 9 vì lúc nãy AI nhắc là bậc hai.'
    }
  };
}
