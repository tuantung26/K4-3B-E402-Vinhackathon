# CP3 - Học từ lỗi trước

## Đã chuẩn bị

- Prototype chạy tại `http://localhost:4173`.
- Một bài tập và hai đoạn tài liệu có mã nguồn `SEC-01`, `SEC-02`.
- Luồng làm bài → phân tích lỗi → gợi ý → sửa bài → giải thích.
- Endpoint AI thật qua OpenAI-compatible API khi có `OPENAI_API_KEY`.
- Fixture dự phòng để kiểm tra giao diện khi chưa có API key.
- Golden set **20 bài làm sai** tại `eval/golden-set.json`, chia thành các nhóm: sai dấu khi chuyển vế, chưa chia hệ số, sai thứ tự phép tính, biến đổi chưa hoàn tất, sai phép toán ngược và thiếu căn cứ.
- Nút **Chạy 20 ca đo** ngay trên giao diện.
- Chấm phần giải thích nguyên nhân sai và ghi log phiên ẩn danh.

## Chạy demo

```powershell
cd codebase
node server.js
```

Mở `http://localhost:4173`, nhập thử bài sai trước:

```text
3x + 5 = 20, x = 25/3
```

Sau đó sửa thành:

```text
3x = 15, x = 5
```

## Bật AI thật với Gemini

Sau khi thu hồi khóa bị lộ, tạo khóa mới ở Google AI Studio rồi tự điền vào `.env` ở thư mục dự án. Không gửi khóa qua chat và không đưa khóa vào GitHub:

```text
GEMINI_API_KEY=your-new-key-here
GEMINI_MODEL=gemini-2.5-flash
```

Khởi động lại server sau khi thay đổi `.env`. Trên giao diện, chỉ số `AI ENGINE` phải chuyển từ `Fixture` sang `AI thật`.

## Nội dung quay video 30 giây

1. Mở bài tập và nhập bài làm sai.
2. Bấm `Nộp bài`, giữ cảnh AI chỉ ra lỗi và dẫn `SEC-01`.
3. Sửa bài, nộp lại và để màn hình hiện kết quả đúng.
4. Nếu có thời gian, kéo xuống để quay số đo phiên.

## Số đo CP3 đề xuất

Chạy 20 ca trong `eval/golden-set.json`. Kết quả kiểm thử hiện tại của prototype local: **20/20 ca được nhận diện là bài làm sai**. Khi nộp, có thể ghi:

> Thử 20 bài làm sai, hệ thống nhận diện đúng trạng thái sai ở 20/20 ca (100%). Các lỗi được phân nhóm theo sai dấu, thiếu bước chia hệ số, sai thứ tự phép tính, biến đổi chưa hoàn tất, sai phép toán ngược và thiếu căn cứ.

Đây là số đo của bộ fixture/golden set; nếu nhóm muốn tuyên bố độ chính xác loại lỗi, cần đối chiếu thủ công nhãn `errorType` của từng ca.