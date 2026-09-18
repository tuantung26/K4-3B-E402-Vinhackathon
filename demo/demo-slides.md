# SLIDE PITCH CHECKPOINT 5 (CP5)
## Track D · D2: Adaptive AI Tutor — "Học từ lỗi trước"
**Đội thi: K4-3B-E402**  
**Sản phẩm:** Adaptive Socratic AI Tutor (`K4-3B-E402-Vinhackathon`)  
**Tài liệu tham chiếu:** Sổ tay học viên Mini Hackathon Lớp 3B v3 (Trang 9, 11, 15)  

---

### SLIDE 1: VẤN ĐỀ & JOBS-TO-BE-DONE (JTBD)
* **Bối cảnh đào tạo AI:** Học viên các lớp kỹ thuật nền tảng thường học vẹt công thức, gặp bài toán ước lượng thực tế (Tokenomics, VRAM, Cache) là bối rối.
* **Nỗi đau thực tế (Khảo sát 20 học viên):**
  1. **Ảo tưởng thông thuộc (Illusion of Competence):** Khi dùng ChatGPT hỏi bài, AI đưa luôn đáp án số ($0.0025, 12GB VRAM), học viên "tưởng mình đã hiểu" nhưng gặp đề mới lại sai.
  2. **Thói quen chép lời giải:** Mất hoàn toàn phản xạ tư duy phản biện (Critical Thinking) và phản xạ tra cứu tài liệu giáo trình chuẩn.
* **JTBD (Job-to-be-Done):** Khi học viên gặp bài tập tính toán khó, họ cần một gia sư AI kiên nhẫn phát hiện đúng tầng ngộ nhận, **không bao giờ làm lộ đáp án (No-spoiler)**, dẫn dắt bằng câu hỏi Socratic và bắt buộc phản tư bản chất trước khi mở khóa đáp án chuẩn (Ground Truth).

---

### SLIDE 2: GIẢI PHÁP & QUY TRÌNH "HỌC TỪ LỖI TRƯỚC"
* **Triết lý cốt lõi:** *"Làm trước – Bộc lộ lỗi sai – Nhận gợi ý Socratic – Đọc tài liệu chuẩn – Tự sửa – Phản tư bản chất (Reflection Bước 9)"*.
* **Quy trình 6 bước khép kín:**
  1. **Học viên giải bài tự do:** Nhập cách tính, suy nghĩ và giả định cá nhân (không trắc nghiệm thụ động).
  2. **AI Chẩn đoán ngộ nhận (Misconception Diagnostic):** Đối chiếu lời giải với cây 4 tầng bẫy ngộ nhận kinh điển.
  3. **Rào chắn Không lộ đáp án (No-spoiler Guardrail):** Tuyệt đối không đưa số cuối cùng hoặc công thức hoàn chỉnh; chỉ đưa 1 câu hỏi gợi mở góc nhìn.
  4. **Dẫn chứng Giáo trình (§1.1 – §2.2):** Dẫn trích đoạn tài liệu chính quy bắt buộc học viên phải đọc và liên hệ.
  5. **Tự sửa đúng (Self-correction):** Học viên tự tính lại và nộp bản sửa; hệ thống ghi nhận tiến bộ.
  6. **Phản tư Bước 9 (Reflection) & Mở khóa Ground Truth:** Học viên trả lời câu hỏi *"Vì sao lúc đầu em nhầm?"*. Khi đạt yêu cầu phản tư sâu, hệ thống mới mở khóa Lời giải mẫu & Đáp án chuẩn (Ground Truth).

---

### SLIDE 3: CƠ CHẾ AI & BẢN ĐỒ 4 TẦNG NGỘ NHẬN
* **Bản đồ 4 tầng sai lầm (Misconception Hierarchy):**
  * **Lớp 1 (Token tiếng Việt):** Ngộ nhận 1 từ = 1 token (Thực tế: BPE tokenizer tiếng Việt = 2.0 – 2.5 tokens/từ do UTF-8).
  * **Lớp 2 (Input vs Output):** Nhầm đơn giá token đầu vào ($0.5/1M) với token sinh ra ($1.5/1M).
  * **Lớp 3 (Đơn vị tính quy đổi):** Lỗi chia nhầm 1,000 thay vì 1,000,000 token.
  * **Lớp 4 (Cảm tính / Thiếu căn cứ - HAX G10):** Trả lời chung chung ("chắc rẻ lắm", "vài nghìn"), AI từ chối kết luận và yêu cầu bổ sung bước tính toán.
* **Tính năng mới (CP5+): Dual Ground Truth Generation:**
  * Người dùng tải lên tài liệu tùy ý (PDF/Text/Notes).
  * AI đồng thời trích xuất trọng tâm, sinh đề bài luyện tập, bẫy ngộ nhận dự kiến, dải dung sai và **Cặp Đáp án chuẩn (Ground Truth)** được mã hóa an toàn.

---

### SLIDE 4: THƯỚC ĐO CHẤT LƯỢNG & BỘ ĐO GOLDEN SET (CP4)
* **Bộ đo kiểm nghiệm tự động Golden Set (22 Cases):**
  * 10 cases Bẫy Lớp 1 (Token tiếng Việt): Phát hiện chính xác 10/10 (100%).
  * 4 cases Bẫy Lớp 2 (Input/Output price): Phát hiện chính xác 4/4 (100%).
  * 4 cases Bẫy Lớp 3 (Quy đổi triệu token): Phát hiện chính xác 4/4 (100%).
  * 2 cases Tự sửa đúng: Công nhận chính xác 2/2 (100%).
  * 2 cases Mơ hồ / Cảm tính (HAX G10): Chặn đúng 2/2 (100%).
* **3 Tiêu chuẩn cứng (Quality Bar):**
  1. **Tỷ lệ lộ đáp án (Spoiler Rate): 0.0%** (Vượt xa ngưỡng cho phép ≤5%).
  2. **Độ chính xác chẩn đoán ngộ nhận: 100.0%** (Vượt ngưỡng cam kết ≥75%).
  3. **Độ trễ phản hồi (P95 Latency): 350ms** (Vượt ngưỡng yêu cầu ≤1500ms).

---

### SLIDE 5: BẰNG CHỨNG THỬ NGHIỆM NGƯỜI DÙNG (RUBRIC R6)
* **Quy mô thử nghiệm:** 5 người dùng độc lập ngoài nhóm dự thi (Học viên AI, Lập trình viên, Sinh viên kỹ thuật).
* **Kết quả đo lường thực nghiệm:**
  * **Tỷ lệ tự sửa đúng:** Tăng từ **20%** (làm tự do) lên **85%** sau khi nhận gợi ý Socratic và đọc trích dẫn tài liệu.
  * **Thời gian trung bình hoàn thành bài:** 4.2 phút / bài tập tính toán định lượng.
  * **Điểm hài lòng (CSAT): 4.8 / 5.0**.
* **Đóng góp cải tiến từ phản hồi người dùng:**
  1. Tích hợp nút *"Đọc toàn văn giáo trình ↗"* mở modal tra cứu ngay trong ngữ cảnh.
  2. Bổ sung nút bấm nộp rõ ràng, trạng thái màu sắc trực quan (Đã hiểu / Gợi ý 1/2 / Chưa đủ căn cứ).
  3. Thêm tính năng mở khóa Lời giải mẫu chuẩn (Ground Truth) sau khi phản tư thành công.

---

### SLIDE 6: TỔNG KẾT, DEMO & ĐỘI NGŨ THỰC HIỆN
* **Trạng thái triển khai thực tế:**
  * **Web Application:** React + Vite SPA, CSS hiện đại, responsive, không phụ thuộc backend nặng.
  * **Online Demo:** `https://spotty-tires-happen.loca.lt` (Localhost `http://localhost:3000`).
  * **Video Demo CP5:** `demo/demo-video.webm` (Thời lượng ~45s, ghi lại trọn vẹn quy trình 6 bước).
  * **GitHub Repository:** `tuantung26/K4-3B-E402-Vinhackathon` (Clean git history, đầy đủ spec, eval, validation, demo).
* **Phân công đội thi (K4-3B-E402):**
  * **Ngô Tuấn Tùng (Lead):** Kiến trúc hệ thống, Spec, Prompt Engineering, Slide pitch CP5.
  * **Nguyễn Thị Huyền:** Thiết kế UX/UI, kiểm thử chất lượng và Golden Set 22 test cases.
  * **Đào Mạnh Cương:** Xây dựng logic chẩn đoán ngộ nhận, Socratic hints, Dual Ground Truth.
  * **Trần Văn Khánh:** Thu thập dữ liệu người dùng thực tế (`validation/`), tài liệu hóa và quay video demo CP5.