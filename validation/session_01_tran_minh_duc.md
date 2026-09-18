# Nhật Ký Phiên Dùng Thử 01 — Trần Minh Đức (CP1 Willing User)

- **Người dùng thử:** Trần Minh Đức (Học viên Lớp 3A — Đã khai báo từ CP1 trong bảng Willing Users).
- **Thời gian thực hiện:** 18/9/2026 · 14:15 – 14:35 (20 phút).
- **Hình thức:** Trực tiếp 1-1 tại phòng Lab E402.
- **Thiết bị:** Laptop ThinkPad T14, trình duyệt Chrome 128, màn hình 14 inch Full HD.
- **Người quan sát / Ghi chép:** Trần Văn Khánh (QA & Evidence Lead, K4-3B-E402).
- **Phương pháp quan sát (Mom Test):** Giao nhiệm vụ cụ thể rồi giữ im lặng quan sát thao tác tự nhiên, chỉ can thiệp khi người dùng dừng thao tác hoàn toàn.

---

## 1. Nhiệm vụ giao (Task Briefing)
> *"Bạn hãy truy cập vào ứng dụng Adaptive AI Tutor, làm bài tập ước lượng chi phí Tokenomics trên màn hình theo cách nghĩ và hiểu biết hiện tại của bạn, không tra cứu ngoài hay dùng ChatGPT."*

---

## 2. Nhật ký diễn biến & Trích dẫn nguyên văn (Verbatim Quotes)

### [14:16] Giai đoạn 1: Tiếp cận bài toán & Làm bài lần đầu
- Đức đọc lướt đề bài: Đề bài yêu cầu ước tính chi phí dịch thuật 100 câu tiếng Việt (mỗi câu 20 từ) với mô hình gpt-4o-mini (Input $0.50/1M tokens).
- Thao tác: Nhập nhanh vào khung văn bản: `100 câu x 20 từ = 2,000 từ = 2,000 token. Chi phí = (2000 / 1,000,000) * 0.5 = $0.001`.
- Bấm nút **Nộp bài ↗**.
- **Quote nguyên văn lúc làm bài:**
  > *"Đề này tính nhẩm phát là ra, 100 câu nhân 20 từ là 2,000 từ, thì bằng 2,000 tokens chứ mấy."*

### [14:18] Giai đoạn 2: Nhận phản hồi Socratic & Đối chiếu giáo trình
- Hệ thống trả về trạng thái **GỢI Ý 1 / 2 (MÀU ĐỎ/CAM)**:
  - *Chẩn đoán:* Bắt đúng bẫy ngộ nhận Lớp 1 (Đồng nhất 1 từ = 1 token).
  - *Socratic Hint:* Tuyệt đối không đưa số đúng, chỉ hỏi: *"Bạn đã tính đúng số từ, nhưng với tiếng Việt có dấu thanh UTF-8, một từ thường tương đương bao nhiêu token? Hãy đối chiếu trích dẫn §1.2 bên dưới."*
  - *Trích dẫn:* Hiển thị trích đoạn §1.2 Tokenizer BPE tiếng Việt (1 từ ≈ 2.0 – 2.5 tokens).
- Đức ngạc nhiên, đọc kỹ lại trích đoạn §1.2:
- **Quote nguyên văn:**
  > *"Ơ sao lại sai nhỉ? 2,000 từ chả là 2,000 token à? ... À hóa ra tiếng Việt có dấu thanh nên BPE nó chém thành 2-3 mẩu token lận! Thế phải là 5,000 tokens mới đúng."*

### [14:22] Giai đoạn 3: Tự sửa đúng & Điểm nghẽn giao diện (Pain Point)
- Đức sửa lại nội dung trong ô bài làm: `100 câu * 20 từ = 2000 từ. Tiếng Việt 2.5 token/từ -> 5,000 tokens. Chi phí: (5000/1M)*0.5 = $0.0025`.
- Đức nhìn xuống khu vực nút bấm, phân vân giữa 2 nút "Nộp bài" và "Làm lại":
- **Quote nguyên văn (Điểm nghẽn then chốt):**
  > *"Ủa nộp bài sửa xong bấm chỗ nào để AI kiểm tra lại lần hai vậy, nhìn hai nút hơi giống nhau."*
- Đức bấm nút **Nộp bài sửa**.
- Hệ thống đổi sang nhãn **ĐÃ HIỂU (MÀU XANH LÁ)**: *"Bạn đã tự sửa đúng. Chi phí chính xác là $0.0025 dựa trên 5,000 tokens."*

### [14:26] Giai đoạn 4: Bước 9 Phản tư (Reflection) & Mở khóa Ground Truth
- Khối **Bước 9 · Đào sâu bản chất** xuất hiện, yêu cầu giải thích: *"Vì sao lúc đầu bạn lại nhầm lẫn?"*
- Đức bấm thử chip mẫu "Ví dụ hiểu sâu", sau đó tự gõ: `Do thói quen nghĩ tiếng Việt giống tiếng Anh 1 từ = 1 token, nhưng UTF-8 tiếng Việt bị tokenizer BPE tách thành nhiều subwords`.
- Bấm **Kiểm tra giải thích ↗**.
- AI chấm: **ĐẠT YÊU CẦU PHẢN TƯ**.
- Thẻ **🎓 MỞ KHÓA LỜI GIẢI MẪU & ĐÁP ÁN CHUẨN (Ground Truth)** bung ra với đầy đủ các bước giải chi tiết và dải từ khóa chấp nhận.
- **Quote nguyên văn kết thúc phiên:**
  > *"Hay đấy! Khóa đáp án chuẩn lại bắt mình tự đào sâu thế này nhớ dai hơn hẳn việc vừa vào đã phơi luôn đáp số như ChatGPT."*

---

## 3. Quyết định cải tiến của nhóm sau phiên thử nghiệm
1. **Sửa UI ngay lập tức:** Đổi tên nút thành **"Nộp bài sửa"**, áp dụng gradient màu xanh tím nổi bật và hiệu ứng pulse nhẹ khi có bài sửa (khắc phục điểm Đức bị lúng túng).
2. **Cập nhật Spec:** Ghi nhận vào §9 Changelog (Mốc CP5) — tham chiếu trực tiếp đến trường hợp của Trần Minh Đức.
