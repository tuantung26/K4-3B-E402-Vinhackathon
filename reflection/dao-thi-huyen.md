# Bài Thu Hoạch Cá Nhân (Reflection) — Đào Thị Huyền

- **Họ và tên:** Đào Thị Huyền
- **Mã học viên:** 2A202602670
- **Vai trò:** AI Engineer & Prompting
- **Nhóm:** K4-3B-E402 · Track D2 (Học từ lỗi trước)

---

### 1. Đóng góp cụ thể trong dự án
- Thiết kế System Prompt và định dạng JSON đầu ra nghiêm ngặt cho mô hình Gemini 2.5 Flash trong `engine.py`.
- Xây dựng lớp rào chắn chống lộ đáp án (No-spoiler Guardrail): ngăn LLM đưa ra các con số kết quả như `$0.0025` hay `5000 tokens` trong phần gợi ý.
- Thiết kế bộ tiêu chí chấm điểm phản tư (Reflection rubric) ở Bước 9 để phân biệt rạch ròi giữa học viên hiểu sâu bản chất với học viên chép vẹt hoặc đối phó.

### 2. Bài học rút ra lớn nhất
- **Kiểm soát tính "quá nhiệt tình" (over-helpful) của LLM:** Mô hình lớn thường có xu hướng giải thích cặn kẽ và giải hộ người dùng. Để phục vụ mục đích sư phạm Socratic, prompt phải đặt ra các ràng buộc phủ định rất mạnh (negative constraints) để AI chỉ đưa ra gợi ý manh mối và buộc người học tự tính toán.
- **Xử lý vùng mờ dữ liệu:** Các câu trả lời cảm tính như *"chắc rẻ lắm"* nếu không có bộ lọc heuristic tiền xử lý thì LLM rất dễ đoán bừa loại lỗi. Cơ chế HAX G10 giúp hệ thống biết dừng lại và yêu cầu làm rõ khi thiếu căn cứ.

### 3. Điều muốn cải tiến nếu có thêm thời gian
- Tinh chỉnh prompt động (few-shot prompting) thích ứng theo từng phong cách diễn đạt của từng học viên.
- Thử nghiệm kỹ thuật Structured Outputs của API để đảm bảo 100% không bao giờ gặp lỗi parse JSON.
