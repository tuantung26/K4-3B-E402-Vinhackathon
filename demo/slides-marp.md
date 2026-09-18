---
marp: true
theme: default
paginate: true
size: 16:9
style: |
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
  section {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #090d16;
    color: #f3f4f6;
    padding: 48px 64px;
  }
  h1 {
    font-size: 2.2em;
    font-weight: 800;
    color: #ffffff;
    border-bottom: 2px solid #6366f1;
    padding-bottom: 12px;
  }
  h2 {
    font-size: 1.4em;
    color: #06b6d4;
  }
  strong { color: #a5b4fc; }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 20px;
  }
  .card {
    background: #111827;
    border: 1px solid #1f293d;
    border-radius: 12px;
    padding: 20px;
  }
  footer { color: #6b7280; font-family: 'JetBrains Mono', monospace; }
footer: 'Track D2: Adaptive AI Tutor · K4-3B-E402 · Checkpoint 5'
---

<!-- _class: lead -->
# Adaptive AI Tutor
### "Học từ lỗi trước" · Socratic Reflection Engine
**Đội thi: K4-3B-E402** · Mini Hackathon AI (VinUni)

---

# 1. Bối cảnh & Khảo sát Nỗi đau (JTBD)

<div class="grid">
<div class="card">

### 🔍 Thực trạng 20 học viên
- 65% có thói quen làm bài tập trước khi đọc lý thuyết.
- Khi dùng ChatGPT, AI đưa luôn đáp số cuối $\rightarrow$ học viên mắc bẫy **ảo tưởng thông thuộc (Illusion of Competence)**.
- Gặp bài toán biến tấu, 80% tiếp tục mắc lại các bẫy ngộ nhận cũ.

</div>
<div class="card">

### 🎯 Job-to-be-Done (JTBD)
*Khi học viên gặp bài tính toán khó, họ cần Gia sư AI phát hiện đúng tầng ngộ nhận, **không bao giờ lộ đáp án**, dẫn dắt bằng câu hỏi Socratic và bắt buộc phản tư bản chất trước khi mở khóa đáp án chuẩn (Ground Truth).*

</div>
</div>

---

# 2. Quy trình 6 bước "Học từ lỗi trước"

1. **Làm bài tự do:** Nhập cách tính và giả định vào giao diện (không trắc nghiệm thụ động).
2. **Chẩn đoán ngộ nhận:** Đối chiếu lời giải với cây 4 tầng bẫy ngộ nhận kinh điển.
3. **Rào chắn No-spoiler:** Tỷ lệ lộ đáp án = 0%. Không bao giờ đưa kết quả trước.
4. **Đối chiếu Giáo trình:** Cung cấp trích dẫn §1.1 – §2.2 để tự tra cứu lý thuyết.
5. **Tự sửa đúng:** Người học tự điều chỉnh công thức và nộp bài sửa lần 2.
6. **Bước 9 Phản tư sâu:** Giải thích nguyên nhân gốc rễ $\rightarrow$ Mở khóa Lời giải mẫu chuẩn.

---

# 3. Bản đồ Ngộ nhận & AI Dual Ground Truth

<div class="grid">
<div class="card">

### 🌲 Cây 4 tầng ngộ nhận
- **Lớp 1:** Bẫy 1 từ = 1 token (tiếng Việt UTF-8 = 2.0 - 2.5 tokens/từ).
- **Lớp 2:** Nhầm đơn giá input ($0.5/1M) với output ($1.5/1M).
- **Lớp 3:** Lỗi chia 1,000 thay vì 1,000,000 tokens.
- **Lớp 4 (HAX G10):** Chặn các câu trả lời cảm tính, mơ hồ.

</div>
<div class="card">

### ✨ AI Dual Ground Truth (CP5+)
- Tải lên tài liệu tùy ý (PDF/Text/Notes).
- AI đồng thời trích xuất trọng tâm, sinh **Đề bài + Bản đồ ngộ nhận + Lời giải mẫu + Dải dung sai số**.
- Đáp án chuẩn được khóa an toàn, chỉ mở sau Bước 9.

</div>
</div>

---

# 4. Thước đo Chất lượng & Golden Set (CP4)

<div class="grid">
<div class="card">

### 📊 Kết quả kiểm định 22 Test Cases
- **10/10** ca bẫy Token tiếng Việt (Lớp 1) — 100%
- **4/4** ca bẫy Đơn giá Input/Output (Lớp 2) — 100%
- **4/4** ca bẫy Quy đổi Triệu (Lớp 3) — 100%
- **2/2** ca Tự sửa đúng — 100%
- **2/2** ca Cảm tính HAX G10 — 100%

</div>
<div class="card">

### 🎯 3 Tiêu chuẩn cứng (Quality Bar)
- **Tỷ lệ lộ đáp án (Spoiler Rate): 0.0%** (Chuẩn ≤5%)
- **Độ chính xác chẩn đoán: 100%** (Chuẩn ≥75%)
- **Độ trễ phản hồi (P95 Latency): 350ms** (Chuẩn ≤1500ms)

</div>
</div>

---

# 5. Thử nghiệm Người dùng Thực tế (Rubric R6)

<div class="grid">
<div class="card">

### 📈 Số liệu thực nghiệm (5 testers)
- Tỷ lệ tự sửa đúng tăng từ **20%** lên **85%** sau gợi ý.
- Thời gian trung bình: **4.2 phút** / bài tập.
- Điểm hài lòng (CSAT): **4.8 / 5.0**.
- 2 testers khai báo từ CP1: Trần Minh Đức & Lê Hoàng Nam.

</div>
<div class="card">

### 🔄 Cải tiến theo phản hồi người dùng
- **Trần Minh Đức:** Nổi bật nút CTA *"Nộp bài sửa"* (HAX G9).
- **Phạm Thu Hà:** Thêm nút tra cứu toàn văn giáo trình ngay tại chỗ.
- **Vũ Hoàng Linh:** Bổ sung gợi ý dẫn dắt định hình phản tư sâu.

</div>
</div>

---

<!-- _class: lead -->
# Tổng kết & Sản phẩm Triển khai

- **Online Demo:** `https://spotty-tires-happen.loca.lt` (Localhost: 3000)
- **Video Demo CP5:** `demo/demo-video.webm`
- **GitHub:** `tuantung26/K4-3B-E402-Vinhackathon`
- **Đội thi K4-3B-E402:** Ngô Tuấn Tùng · Nguyễn Thị Huyền · Đào Mạnh Cương · Trần Văn Khánh
