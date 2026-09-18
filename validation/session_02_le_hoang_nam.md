# Nhật Ký Phiên Dùng Thử 02 — Lê Hoàng Nam (CP1 Willing User)

- **Người dùng thử:** Lê Hoàng Nam (Học viên Lớp 3A — Đã khai báo từ CP1 trong bảng Willing Users).
- **Thời gian thực hiện:** 18/9/2026 · 14:45 – 15:05 (20 phút).
- **Hình thức:** Trực tiếp 1-1 tại phòng Lab E402.
- **Thiết bị:** Laptop Dell XPS 13, trình duyệt Chrome 128.
- **Người quan sát / Ghi chép:** Trần Văn Khánh (QA & Evidence Lead, K4-3B-E402).
- **Phương pháp quan sát (Mom Test):** Giao nhiệm vụ, để người dùng tự do tương tác, kiểm tra hành vi biên (edge cases).

---

## 1. Nhiệm vụ giao (Task Briefing)
> *"Bạn hãy làm bài toán ước lượng chi phí gọi API trên màn hình. Bạn có thể nhập bất cứ cách trả lời nào mà bạn nghĩ trong đầu."*

---

## 2. Nhật ký diễn biến & Trích dẫn nguyên văn (Verbatim Quotes)

### [14:46] Giai đoạn 1: Thử thách AI bằng câu trả lời cảm tính
- Nam đọc đề bài xong không tính nháp mà muốn thử xem AI xử lý thế nào nếu người học lười tính toán.
- Thao tác: Gõ vào ô nhập bài: `Em chịu, chắc chi phí rẻ lắm tầm 1k vnd thôi.`
- Bấm nút **Nộp bài ↗**.
- **Quote nguyên văn lúc nộp bài:**
  > *"Để gõ bừa xem AI nó có đoán hộ số tiền rồi tự sửa cho mình không, như ChatGPT là nó giải luôn đấy."*

### [14:48] Giai đoạn 2: Kích hoạt rào chắn HAX G10 (Từ chối đoán mò khi thiếu căn cứ)
- Hệ thống không chấp nhận đáp án, hiển thị nhãn màu xám cảnh báo: **CHƯA ĐỦ CĂN CỨ (INSUFFICIENT EVIDENCE)**:
  - *Thông báo:* \"Mình chưa thể kết luận. Câu trả lời của bạn mang tính ước đoán cảm tính và chưa cung cấp các bước tính toán (số từ, số token hoặc công thức quy đổi).\"
  - *Socratic Guidance:* Yêu cầu người học nêu rõ: 1) 100 câu x 20 từ = bao nhiêu từ? 2) Quy đổi sang bao nhiêu tokens theo §1.2?
- Nam bất ngờ vì AI không tự điền kết quả hộ:
- **Quote nguyên văn (Điểm kiểm chứng HAX G10 thành công):**
  > *"Nó bắt nhập cách tính chứ không chịu đoán hộ à, tưởng nói rẻ là nó tính ra tiền luôn chứ."*

### [14:52] Giai đoạn 3: Tính toán nghiêm túc theo hướng dẫn Socratic
- Nam lấy điện thoại tính nhẩm: 100 * 20 = 2,000 từ. Tra cứu trích dẫn §1.2 thấy hệ số tiếng Việt 2.5 tokens/từ -> 5,000 tokens.
- Nhập bài sửa: `100 * 20 = 2000 từ. Tiếng Việt 2.5 token/từ -> 5,000 token. Đơn giá $0.5/1M -> Chi phí: (5000/1000000)*0.5 = $0.0025`.
- Bấm nút **Nộp bài sửa ↗**.
- Hệ thống trả về nhãn xanh **ĐÃ HIỂU**: Công nhận bài làm chính xác ngay ở lần thử thứ 2.
- **Quote nguyên văn:**
  > *"À đấy, bắt buộc phải viết từng bước ra thì mới chịu duyệt. Nhưng thế này chuẩn hơn, không thể lươn lẹo học vẹt được."*

### [14:56] Giai đoạn 4: Phản tư Bước 9
- Nam giải thích: `Lúc đầu đoán mò vì nghĩ tiền API OpenAI tính bằng cent nên rất nhỏ, không để ý đến lượng token thực tế`.
- AI duyệt phản tư đạt chuẩn và hiển thị thẻ Mở khóa Lời giải mẫu (Ground Truth).

---

## 3. Quyết định cải tiến của nhóm sau phiên thử nghiệm
1. **Giữ nguyên 100% cơ chế HAX G10 (Không đoán mò / Không làm hộ):**
   - Phiên thử nghiệm của Lê Hoàng Nam chứng minh rào chắn HAX G10 hoạt động cực kỳ hiệu quả, ngăn chặn hoàn toàn việc học viên "dụ" AI giải hộ bằng các câu nói chung chung vô thưởng vô phạt.
2. **Cập nhật Spec:** Ghi nhận vào §9 Changelog (Mốc CP5) và Canvas sản phẩm.
