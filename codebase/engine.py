import os
import json
import time
import re
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

# Exercise & Document Data (Fixtures)
EXERCISE_DATA = {
    "id": "ex_tokenization_vn_01",
    "title": "Ước tính Tokenization Tiếng Việt và Chi phí API LLM",
    "concept": "Subword Tokenization & API Cost Estimation",
    "prompt": """**Đề bài thực hành (Làm trước khi xem lý thuyết):**
Một ứng dụng AI cần dịch **100 câu tiếng Việt** sang tiếng Anh, mỗi câu dài trung bình **20 từ tiếng Việt**.
Giả sử bạn gọi mô hình qua API với mức giá là **$0.5 cho 1 triệu (1,000,000) input tokens**.

👉 **Yêu cầu:**
1. Ước tính tổng số **tokens đầu vào** mà bạn sẽ gửi lên API là bao nhiêu?
2. Chi phí ước tính cho toàn bộ 100 câu này là bao nhiêu **USD**?
*(Ghi rõ các bước tính toán hoặc giả định của bạn)*""",
    "standard_answer_range": {
        "min_tokens": 4000,
        "max_tokens": 6000,
        "typical_tokens": 5000,
        "min_cost": 0.002,
        "max_cost": 0.003,
        "typical_cost": 0.0025
    },
    "documents": {
        "§1.1": {
            "title": "Cơ chế Subword Tokenization trong LLM",
            "content": "Mô hình ngôn ngữ lớn (LLM) không nhận trực tiếp từng từ (word) mà phân tách văn bản thành các 'token' qua thuật toán Subword (như Byte-Pair Encoding - BPE). Với tiếng Anh đơn âm thông thường, trung bình 1 từ tiếng Anh tương đương 1 đến 1.3 tokens."
        },
        "§1.2": {
            "title": "Đặc thù Tokenization Tiếng Việt",
            "content": "Tiếng Việt là ngôn ngữ đơn lập, có dấu thanh điệu và sử dụng hệ ký tự Latinh mở rộng (Unicode UTF-8). Các tokenizer tiêu chuẩn của LLM quốc tế thường tách mỗi từ tiếng Việt có dấu thành nhiều byte/subwords. Do đó, trung bình 1 từ tiếng Việt tương đương từ 2.0 đến 3.0 tokens (hệ số giãn nở gấp 2 - 2.5 lần tiếng Anh)."
        },
        "§2.1": {
            "title": "Công thức tính chi phí gọi LLM API",
            "content": "Chi phí gọi API được tính theo công thức: Chi phí ($) = (Tổng số tokens / 1,000,000) × Đơn giá trên 1M token. Khi tính toán, cần chú ý mẫu số quy đổi là một triệu (1,000,000) tokens."
        },
        "§2.2": {
            "title": "Chi phí tiềm ẩn & Hệ số dự phòng",
            "content": "Trong thực tế, ngoài input prompt từ người dùng, ứng dụng còn gửi kèm System Prompt, định dạng đối thoại, và nhận về output tokens. Vì vậy, các kỹ sư AI thường cộng thêm 20-30% dự phòng chi phí vận hành."
        }
    }
}

def get_gemini_api_key(custom_key: Optional[str] = None) -> Optional[str]:
    if custom_key and custom_key.strip():
        return custom_key.strip()
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        load_dotenv()
        key = os.environ.get("GEMINI_API_KEY")
    return key

def call_gemini(system_prompt: str, user_prompt: str, custom_key: Optional[str] = None) -> Optional[str]:
    api_key = get_gemini_api_key(custom_key)
    if not api_key:
        return None
        
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        prompt = f"{system_prompt}\n\nUser Input:\n{user_prompt}"
        response = model.generate_content(
            prompt,
            generation_config={"temperature": 0.2, "response_mime_type": "application/json"}
        )
        return response.text
    except Exception as e:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=f"{system_prompt}\n\nUser Input:\n{user_prompt}",
                config={"temperature": 0.2, "response_mime_type": "application/json"}
            )
            return response.text
        except Exception:
            return None

def analyze_student_attempt(attempt_text: str, attempt_count: int = 1, custom_key: Optional[str] = None) -> Dict[str, Any]:
    """Phân tích bài làm của học viên theo nguyên tắc HAX/PAIR và Track D2"""
    doc_context = "\n".join([f"[{sec_id}] {doc['title']}: {doc['content']}" for sec_id, doc in EXERCISE_DATA["documents"].items()])
    
    system_prompt = f"""Bạn là AI Tutor sư phạm chuyên môn cao, thực hiện luồng 'Học từ lỗi trước' (Track D2) cho học viên AI.
Đề bài:
{EXERCISE_DATA["prompt"]}

Chuẩn đáp án:
- Tổng từ: 100 câu × 20 từ = 2,000 từ.
- Tiếng Việt tốn 2 - 3 tokens/từ do mã UTF-8 và dấu thanh.
- Tổng tokens đầu vào: dải 4,000 - 6,000 tokens (trung bình 5,000 tokens).
- Chi phí: (Số tokens / 1,000,000) * 0.5 -> $0.0020 đến $0.0030 USD (trung bình $0.0025 USD).

Tài liệu tham khảo:
{doc_context}

Lần thử thứ: {attempt_count} / tối đa 2 lần gợi ý.

QUY TẮC SƯ PHẠM BẮT BUỘC:
1. KIỂM TRA CĂN CỨ (HAX G10 - Thu hẹp phạm vi khi nghi ngờ):
   - Nếu câu trả lời vô nghĩa, gõ bừa ("asdf", "không biết", "rất rẻ", "khoảng vài xu", hỏi ngoài lề không làm bài) HOẶC câu trả lời chỉ là phỏng đoán không có bất kỳ bước tính nào -> has_sufficient_evidence = false, status = "insufficient_evidence".
   - Không được tự suy đoán khi học viên không đưa ra căn cứ! Yêu cầu học viên cung cấp bước tính hoặc số liệu.
2. NẾU ĐÚNG:
   - Học viên ra được số token trong dải 4000-6000 (hoặc xấp xỉ) và chi phí trong dải $0.002 - $0.003 -> status = "correct".
3. NẾU SAI & ĐỦ CĂN CỨ:
   - status = "incorrect".
   - Phân tích rõ loại lỗi (error_type), ví dụ: 'Coi 1 từ tiếng Việt = 1 token (tính ra 2,000 token)' hoặc 'Sai mẫu số quy đổi 1 triệu tokens'.
   - Đưa 1 GỢI Ý NGẮN (hint): Tuyệt đối KHÔNG ĐƯỢC LỘ ĐÁP ÁN con số! Chỉ gợi ý hướng suy nghĩ.
   - BẮT BUỘC TRÍCH DẪN ĐÚNG MÃ SECTION trong tài liệu (cited_section: '§1.1' hoặc '§1.2' hoặc '§2.1' hoặc '§2.2').
     * Nếu lỗi về tỷ lệ token của tiếng Việt / 1 từ = 1 token -> cited_section = '§1.2'.
     * Nếu lỗi về công thức chi phí, chia cho 1000 thay vì 1M, quên nhân số câu -> cited_section = '§2.1'.
     * Nếu hiểu nhầm token là ký tự đơn lẻ -> cited_section = '§1.1'.

Định dạng JSON bắt buộc:
{{
  "has_sufficient_evidence": true/false,
  "status": "correct" | "incorrect" | "insufficient_evidence",
  "confidence": 0.0 đến 1.0,
  "error_type": "Tên lỗi cụ thể nếu sai hoặc null nếu đúng",
  "hint": "Gợi ý ngắn không lộ đáp án",
  "cited_section": "§1.2" hoặc section phù hợp, hoặc null nếu đúng/thiếu căn cứ,
  "clarification_request": "Câu hỏi yêu cầu làm rõ nếu thiếu căn cứ"
}}"""

    raw_json = call_gemini(system_prompt, attempt_text, custom_key)
    if raw_json:
        try:
            clean = re.sub(r"^```json\s*", "", raw_json.strip())
            clean = re.sub(r"\s*```$", "", clean)
            parsed = json.loads(clean)
            if "status" in parsed:
                return parsed
        except Exception:
            pass
            
    # Fallback heuristic
    cleaned = attempt_text.lower().strip()
    
    # 1. HAX G10: Kiểm tra thiếu căn cứ / câu hỏi ngoài lề / đoán mò / không có bước giải
    ambiguous_keywords = [
        "asdf", "qwerty", "không biết", "chịu", "rẻ lắm", "chưa đến",
        "chắc", "đoán", "tiktoken", "sentencepiece", "tokenizer loại nào"
    ]
    is_ambiguous = any(kw in cleaned for kw in ambiguous_keywords) or len(cleaned) < 8
    
    # Chỉ ghi số không có bước giải (VD: "5000 và 0.0025")
    is_numbers_only = bool(re.match(r"^[\d\s,.\$và-]{1,25}$", cleaned))
    
    # Chỉ tính nửa câu (chỉ tính token, không tính chi phí)
    is_half_answered = ("tổng 100 câu" in cleaned or "tiếng việt cần khoảng" in cleaned) and not any(c in cleaned for c in ["$", "usd", "chi phí", "giá", "tiền", "đồng"])
    
    if is_ambiguous or is_numbers_only or is_half_answered:
        clarification_msg = "Câu trả lời của bạn chưa có căn cứ hoặc chưa đủ các bước tính toán theo yêu cầu đề bài. Vui lòng trình bày rõ cách tính số tokens và chi phí USD."
        if is_numbers_only:
            clarification_msg = "Bạn đã đưa ra kết quả số, tuy nhiên để đạt chuẩn sư phạm, bạn vui lòng ghi rõ các bước tính toán hoặc giả định quy đổi."
        elif "tokenizer" in cleaned or "tiktoken" in cleaned:
            clarification_msg = "Mô hình tập trung vào bài toán ước lượng token và chi phí API theo đề bài. Vui lòng quay lại thực hiện tính toán cho 100 câu tiếng Việt."
            
        return {
            "has_sufficient_evidence": False,
            "status": "insufficient_evidence",
            "confidence": 0.3,
            "error_type": "Thiếu căn cứ bài làm hoặc chưa đủ bước giải",
            "hint": "",
            "cited_section": None,
            "clarification_request": clarification_msg
        }
        
    # 2. Kiểm tra lỗi khái niệm ký tự (§1.1)
    if "chữ cái" in cleaned or "ký tự" in cleaned or "1 chữ cái" in cleaned:
        return {
            "has_sufficient_evidence": True,
            "status": "incorrect",
            "confidence": 0.9,
            "error_type": "Nhầm lẫn token là ký tự đơn lẻ (character)",
            "hint": "Gợi ý: Token trong LLM không phải là từng ký tự chữ cái riêng lẻ. Hãy xem cơ chế phân tách Subword trong tài liệu!",
            "cited_section": "§1.1",
            "clarification_request": ""
        }
        
    # 3. Kiểm tra Happy path (đúng dải 4,000 - 6,000 tokens và $0.002 - $0.003)
    has_valid_tokens = any(tok in cleaned for tok in ["4000", "4,000", "5000", "5,000", "6000", "6,000"]) or ("2.5" in cleaned and "token" in cleaned) or ("2 token" in cleaned) or ("3 token" in cleaned)
    has_valid_cost = any(cost in cleaned for cost in ["0.0025", "0.002", "0.003", "$0.0025", "$0.002", "$0.003"])
    
    if has_valid_tokens and has_valid_cost:
        return {
            "has_sufficient_evidence": True,
            "status": "correct",
            "confidence": 0.95,
            "error_type": None,
            "hint": "Chính xác! Bạn đã ước lượng đúng đặc thù tokenization tiếng Việt và chi phí.",
            "cited_section": None,
            "clarification_request": ""
        }
        
    # 4. Kiểm tra lỗi khái niệm tiếng Việt (§1.2): 1 từ = 1 token, hệ số 1.3x, hệ số 10x
    is_conceptual_vn = any(k in cleaned for k in ["2000 token", "2,000 token", "2000 từ = 2000", "1.3", "2600", "2,600", "10 token", "20,000 token", "20000"])
    if is_conceptual_vn:
        return {
            "has_sufficient_evidence": True,
            "status": "incorrect",
            "confidence": 0.9,
            "error_type": "Nhầm lẫn tỷ lệ Tokenization tiếng Việt (coi 1 từ = 1 token như tiếng Anh hoặc áp sai hệ số)",
            "hint": "Gợi ý: Thuật toán Subword của LLM xử lý các ngôn ngữ có dấu thanh như tiếng Việt khác với tiếng Anh đơn âm. Hãy kiểm tra xem 1 từ tiếng Việt thường nở ra bao nhiêu token!",
            "cited_section": "§1.2",
            "clarification_request": ""
        }
        
    # 5. Các lỗi công thức & đơn vị (§2.1)
    return {
        "has_sufficient_evidence": True,
        "status": "incorrect",
        "confidence": 0.85,
        "error_type": "Sai lệch trong ước tính token hoặc công thức chia mẫu số",
        "hint": "Gợi ý: Hãy xem lại công thức quy đổi chi phí trên mỗi 1 triệu (1,000,000) token và hệ số nhân token của tiếng Việt.",
        "cited_section": "§2.1",
        "clarification_request": ""
    }

def evaluate_student_explanation(explanation_text: str, custom_key: Optional[str] = None) -> Dict[str, Any]:
    """Đánh giá lời giải thích nguyên nhân sai của học viên sau khi sửa đúng (Bước 9)"""
    system_prompt = f"""Bạn là AI Tutor đánh giá năng lực hiểu bản chất của học viên (Deep Reflection - Track D2).
Ngữ cảnh: Học viên ban đầu đã tính sai bài toán Tokenization tiếng Việt (thường do coi 1 từ = 1 token hoặc nhầm đơn vị tính). Sau khi được AI gợi ý đọc tài liệu, học viên đã sửa đúng.
Bây giờ học viên giải thích NGUYÊN NHÂN VÌ SAO LÚC ĐẦU MÌNH SAI.

TIÊU CHÍ ĐÁNH GIÁ (Rubric):
1. ĐẠT (is_satisfactory: true):
   - Học viên nêu rõ được bản chất: Tiếng Việt có dấu thanh UTF-8 nên tokenizer tách thành nhiều subwords/tokens (2-3 tokens/từ); HOẶC nhận ra mình nhầm đơn vị chia 1 triệu tokens.
2. CHƯA ĐẠT (is_satisfactory: false):
   - Giải thích hời hợt, chép vẹt: 'Do lúc nãy bấm máy tính nhầm', 'Do AI bảo sửa thì sửa', 'Đoán bừa', hoặc không liên quan đến bản chất kiến thức.

Trả về duy nhất định dạng JSON:
{{
  "is_satisfactory": true/false,
  "feedback": "Nhận xét chi tiết khuyến khích và giải thích thêm nếu cần",
  "concept_grasped": "Tóm tắt bản chất học viên đã hiểu"
}}"""

    raw_json = call_gemini(system_prompt, explanation_text, custom_key)
    if raw_json:
        try:
            clean = re.sub(r"^```json\s*", "", raw_json.strip())
            clean = re.sub(r"\s*```$", "", clean)
            parsed = json.loads(clean)
            if "is_satisfactory" in parsed:
                return parsed
        except Exception:
            pass
            
    # Fallback
    exp_lower = explanation_text.lower()
    if any(k in exp_lower for k in ["dấu", "utf-8", "subword", "tiếng việt", "nhiều token", "1 triệu", "đơn vị", "2-3"]):
        return {
            "is_satisfactory": True,
            "feedback": "Tuyệt vời! Bạn đã nắm rất vững bản chất vì sao tiếng Việt tốn nhiều token hơn và cách tính chi phí chuẩn xác.",
            "concept_grasped": "Hiểu cơ chế Subword Tokenization đối với tiếng Việt có dấu thanh."
        }
    else:
        return {
            "is_satisfactory": False,
            "feedback": "Lời giải thích của bạn còn hơi khái quát hoặc mang tính suy đoán. Bạn hãy thử làm rõ: Vì sao tiếng Việt lại không tương đương 1 từ = 1 token như tiếng Anh?",
            "concept_grasped": "Chưa làm rõ được cơ chế ngôn ngữ đơn lập có dấu."
        }
