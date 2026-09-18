# Nhật Ký Dùng Thử Sản Phẩm (User Validation Log) — CP5

> **Mục tiêu (Rubric R6 — 8 điểm):** Kiểm chứng giải pháp với 5 người dùng ngoài nhóm (trong đó có ít nhất 2 người đã khai từ CP1), ghi nhận quote nguyên văn lúc thao tác thật, phát hiện điểm nghẽn và đưa ra quyết định cải tiến sản phẩm.

---

## 1. Bảng nhật ký thử nghiệm (5 người dùng ngoài)

| STT | Người dùng thử | Vai trò / Lớp | Giao task gì | Kẹt ở đâu | Quote nguyên văn (Verbatim) | Quyết định của nhóm |
|:---:|---|---|---|---|---|---|
| **1** | **Trần Minh Đức** *(Đã khai từ CP1)* | Học viên Lớp 3A | Làm bài từ đầu: nhập bài sai (tính 1 từ = 1 token), đọc gợi ý và tự sửa bài. | Lúng túng tìm nút nộp bài sửa sau khi đọc gợi ý AI. | *"Ủa nộp bài sửa xong bấm chỗ nào để AI kiểm tra lại lần hai vậy, nhìn hai nút hơi giống nhau."* | **Sửa ngay:** Đổi màu nút CTA "Nộp bài sửa" sang màu xanh đậm nổi bật và thêm nhãn trạng thái lần thử (HAX G9). |
| **2** | **Lê Hoàng Nam** *(Đã khai từ CP1)* | Học viên Lớp 3A | Cố tình nhập câu cảm tính: *"Chắc chi phí rẻ lắm tầm 1k vnd"* để thử thách AI. | Bất ngờ vì AI từ chối giải hộ và yêu cầu cung cấp cách tính. | *"Nó bắt nhập cách tính chứ không chịu đoán hộ à, tưởng nói rẻ là nó tính ra tiền luôn chứ."* | **Giữ nguyên:** Cơ chế từ chối đoán mò HAX G10 hoạt động chính xác theo triết lý sư phạm, không giải hộ. |
| **3** | **Phạm Thu Hà** | Học viên Lớp 3B | Đọc gợi ý trích dẫn `§1.2` và tra cứu tài liệu lý thuyết. | Muốn đọc toàn văn ngữ cảnh thay vì chỉ một đoạn trích ngắn. | *"Cái đoạn trích dẫn §1.2 hơi ngắn, mình muốn bấm vào xem cả bài lý thuyết luôn được không?"* | **Sửa ngay:** Thêm khối xem tài liệu đầy đủ ngay bên cạnh màn hình làm bài để học viên tra cứu tức thì. |
| **4** | **Vũ Hoàng Linh** | Học viên Lớp 3B | Thực hiện bước 9: Giải thích nguyên nhân sai lầm ban đầu. | Trả lời cụt ngủn bị AI từ chối duyệt hoàn thành. | *"Mình gõ 'do tiếng Việt có dấu' mà nó bắt giải thích kỹ hơn về BPE, AI bắt giải thích gắt thế nhờ."* | **Sửa ngay:** Bổ sung dòng gợi ý câu hỏi dẫn dắt: *"Gợi ý: Hãy nhắc đến dấu thanh và cơ chế chia subwords"* giúp người học định hình câu trả lời. |
| **5** | **Nguyễn Việt Anh** | Học viên Lớp 3A | Thao tác giải bài và nộp bài trên màn hình laptop nhỏ / cửa sổ thu nhỏ. | Giao diện hai cột bị dồn chữ, bảng trích dẫn bị tràn lề. | *"Co nhỏ màn hình lại là cái bảng trích dẫn bị che mất chữ cuối, phải cuộn ngang hơi khó chịu."* | **Sửa ngay:** Tối ưu hóa giao diện Streamlit với `st.container` co giãn linh hoạt và responsive tốt trên mọi kích thước màn hình. |

---

## 2. Bốn dòng tổng kết cốt lõi (Bắt buộc theo Rubric R6)

1. **Chủ đề lặp nhiều nhất:** Người dùng cần chỉ dẫn trực quan hơn ở bước sửa bài lần 2 và muốn xem đầy đủ ngữ cảnh của tài liệu trích dẫn (`§1.2`) ngay tại chỗ thay vì chỉ đọc 1 câu tóm tắt.
2. **Sẽ sửa gì trước demo:** Bổ sung giao diện tra cứu trực tiếp toàn văn tài liệu `§1.1` - `§2.2`, làm nổi bật nút nộp bài sửa và hiển thị câu hỏi gợi mở ở bước Reflection.
3. **Giữ nguyên gì và vì sao:** Giữ nguyên 100% cơ chế khóa đáp án (No-spoiler) và cơ chế khắt khe ở bước Reflection (không chấp nhận câu trả lời chép vẹt) vì đây là "linh hồn" sư phạm của Track D2.
4. **Gì để dành sau:** Cơ chế visualizer tách từng subword màu sắc động theo thời gian thực và tính năng lưu lịch sử học tập cá nhân hóa đa phiên.
