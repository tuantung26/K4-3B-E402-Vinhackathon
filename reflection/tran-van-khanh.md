# Bài Thu Hoạch Cá Nhân (Reflection) — Trần Văn Khánh

- **Họ và tên:** Trần Văn Khánh
- **Mã học viên:** 2A202602413
- **Vai trò:** QA & Evaluation Engineer
- **Nhóm:** K4-3B-E402 · Track D2 (Học từ lỗi trước)

---

### 1. Đóng góp cụ thể trong dự án
- Xây dựng và chuẩn hóa bộ dữ liệu kiểm thử Golden Set gồm 22 cases tại `eval/golden_set.json`, bao phủ toàn diện 4 lớp chỗ khó theo yêu cầu Rubric R3/R4.
- Viết test runner tự động `eval/run_eval.py` để đánh giá độ chính xác chẩn đoán, trích dẫn tài liệu, rào chắn No-spoiler và chất lượng phản tư.
- Phân tích chi tiết nguyên nhân 7 ca chưa đạt ở mốc CP3, từ đó phối hợp cùng đội ngũ cải tiến hệ thống đạt tỷ lệ vượt qua bài test 100% trên bộ 22 cases.

### 2. Bài học rút ra lớn nhất
- **"Số xấu vẫn được đủ điểm — miễn là số thật":** Triết lý này của Hackathon đã giúp em tự tin đối diện với kết quả ban đầu (68.2% ở CP3). Việc phân tích rạch ròi vì sao 7 ca kia thất bại (hiện tượng chồng lấn trích dẫn, vùng mờ mơ hồ) có giá trị kỹ thuật cao hơn nhiều so với việc chỉ tuyên bố sản phẩm "chạy tốt".
- **Kiểm thử tự động là kim chỉ nam cho việc tối ưu AI:** Có bộ Golden Set 22 cases độc lập giúp nhóm kiểm soát được hiện tượng hồi quy (regression) mỗi khi thay đổi prompt hoặc bổ sung heuristic rules.

### 3. Điều muốn cải tiến nếu có thêm thời gian
- Xây dựng hệ thống tự động sinh test cases giáp hạt (edge-case generation) bằng LLM để nâng bộ test lên 50-100 cases.
- Đo lường độ trễ (latency) và chi phí token chi tiết cho từng ca kiểm thử.
