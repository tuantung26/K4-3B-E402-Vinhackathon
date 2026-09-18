---
marp: true
theme: default
paginate: true
size: 16:9
style: |
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@1,600;1,700&family=DM+Mono:wght@400;500;600&display=swap');

  :root {
    --bg: #fbf9f4;
    --card: #ffffff;
    --border: #e7e3d8;
    --text: #111827;
    --muted: #6b7280;
    --accent: #ea580c;
    --accent-dark: #c2410c;
    --green: #15803d;
    --green-bg: #dcfce7;
  }

  section {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background-color: var(--bg);
    background-image: 
      linear-gradient(to right, rgba(0, 0, 0, 0.035) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.035) 1px, transparent 1px);
    background-size: 28px 28px;
    color: var(--text);
    padding: 38px 52px;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    font-size: 12px;
  }
  .brand-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    color: #111827;
  }
  .brand-circle {
    width: 22px;
    height: 22px;
    background: #065f46;
    color: white;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
  .track-label {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    letter-spacing: 0.14em;
    color: var(--green);
    font-weight: 700;
    text-transform: uppercase;
  }
  .tag-pill {
    background: #18181b;
    color: #fafafa;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
  }
  .live-pill {
    background: var(--green-bg);
    color: #166534;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  h1 {
    font-size: 2.5em;
    font-weight: 800;
    color: var(--text);
    line-height: 1.15;
    margin: 0 0 6px 0;
    letter-spacing: -0.03em;
  }
  .serif-italic {
    font-family: 'Playfair Display', Georgia, serif;
    font-style: italic;
    font-weight: 700;
    color: var(--accent);
  }
  .subtitle {
    font-size: 15px;
    color: var(--muted);
    margin-bottom: 20px;
    line-height: 1.4;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 22px;
    align-items: stretch;
  }
  .grid-equal {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 22px 24px;
    box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.03);
    position: relative;
  }
  .card-top-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), transparent);
    border-radius: 16px 16px 0 0;
  }
  .card-label {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--accent);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .card h3 {
    font-size: 17px;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 10px 0;
  }
  .card p, .card li {
    font-size: 13.5px;
    color: #4b5563;
    line-height: 1.55;
  }
  .card ul {
    padding-left: 18px;
    margin: 6px 0;
  }

  .stat-num {
    font-family: 'DM Mono', monospace;
    font-size: 36px;
    font-weight: 800;
    color: var(--accent-dark);
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-desc {
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    font-weight: 600;
  }

  .step-badge {
    display: inline-block;
    background: #f3f0e6;
    border: 1px solid #dfdacd;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    font-weight: 600;
    color: #4b5563;
    margin-bottom: 6px;
  }

  footer {
    position: absolute;
    bottom: 16px;
    left: 52px;
    right: 52px;
    display: flex;
    justify-content: space-between;
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: #9ca3af;
  }
---

<!-- SLIDE 1 -->
<div class="top-bar">
  <div class="brand-pill">
    <span class="brand-circle">↗</span>
    <span>Học từ lỗi trước</span>
  </div>
  <div class="track-label">TRACK D2 · HỌC TẬP THÍCH ỨNG & TƯƠNG TÁC</div>
  <div class="live-pill">● Phiên bảo vệ CP5</div>
</div>

<div class="track-label" style="margin-bottom: 4px;">ĐỀ TÀI CHÍNH THỨC · K4-3B-E402</div>
<h1>Làm bài trước. <span class="serif-italic">Hiểu lỗi sau.</span></h1>
<div class="subtitle">Một gợi ý đúng lúc giúp bạn tự sửa, thay vì chỉ nhớ vẹt đáp án do AI giải hộ.</div>

<div class="grid-2">
  <div class="card">
    <div class="card-label">✦ THỰC TRẠNG & KHẢO SÁT 20 HỌC VIÊN</div>
    <h3>Bẫy "Ảo Tưởng Thông Thuộc" khi dùng AI giải bài</h3>
    <ul>
      <li><strong>65% học viên:</strong> Có thói quen lao vào làm bài trước khi đọc kỹ giáo trình lý thuyết.</li>
      <li><strong>Ảo tưởng khi hỏi ChatGPT:</strong> AI trả lời trọn gói, đưa ngay đáp án cuối ($0.0025) &rarr; Học viên "tưởng mình đã hiểu" nhưng không đọng lại tư duy gốc.</li>
      <li><strong>Hậu quả thực tế:</strong> Gặp bài toán biến tấu, <strong>80% học viên tiếp tục mắc lại</strong> bẫy sai lầm cũ (1 từ = 1 token).</li>
    </ul>
  </div>

  <div class="card" style="background: #fffdfa; border-color: #f0ebd8;">
    <div class="card-top-accent"></div>
    <div class="card-label">🎯 JOB-TO-BE-DONE (JTBD)</div>
    <p style="font-size: 14.5px; font-weight: 500; color: #1f2937; line-height: 1.6; margin-top: 6px;">
      <em>"Khi gặp bài tập tính toán khó, tôi cần một Gia sư AI kiên nhẫn bắt đúng tầng ngộ nhận, <strong>tuyệt đối không lộ đáp án số</strong>, dẫn dắt bằng câu hỏi Socratic và bắt buộc phản tư bản chất trước khi mở khóa đáp án chuẩn."</em>
    </p>
    <div style="margin-top: 14px; padding: 10px 14px; background: #f7f3ea; border-radius: 8px; font-size: 12.5px; color: #78350f;">
      <strong>Ràng buộc cứng:</strong> Tỷ lệ lộ đáp án (Spoiler Rate) = 0.0% · Mở khóa Ground Truth sau phản tư.
    </div>
  </div>
</div>

<footer>
  <span>Đội thi: K4-3B-E402 (VinUni Hackathon)</span>
  <span>Slide 1 / 6</span>
</footer>

---

<!-- SLIDE 2 -->
<div class="top-bar">
  <div class="brand-pill"><span class="brand-circle">↗</span> Học từ lỗi trước</div>
  <div class="track-label">KIẾN TRÚC GIẢI PHÁP · QUY TRÌNH SƯ PHẠM</div>
  <div class="tag-pill">Do-First Architecture</div>
</div>

<h1>Chu Trình 6 Bước <span class="serif-italic">"Học Từ Lỗi Trước"</span></h1>
<div class="subtitle">Khép kín chu trình nhận thức: Làm tự do ➔ Bộc lộ ngộ nhận ➔ Gợi ý Socratic ➔ Tự sửa ➔ Phản tư.</div>

<div class="grid-3">
  <div class="card">
    <div class="step-badge">BƯỚC 01 - 02</div>
    <div class="card-label">✦ THỬ SỨC TỰ DO</div>
    <h3>Làm bài & Bộc lộ lỗi</h3>
    <p>Học viên nhập suy nghĩ, cách tính và giả định vào ô bài làm (không dùng trắc nghiệm thụ động A/B/C/D).</p>
  </div>

  <div class="card" style="border-color: #fed7aa; background: #fffbf5;">
    <div class="card-top-accent"></div>
    <div class="step-badge" style="background: #ffedd5; color: #c2410c;">BƯỚC 03 - 04</div>
    <div class="card-label">✦ NO-SPOILER GUARDRAIL</div>
    <h3>Gợi ý & Đọc Giáo trình</h3>
    <p>AI không đưa đáp số! Chỉ hỏi câu hỏi gợi mở góc nhìn và trích dẫn số hiệu giáo trình cụ thể (§1.1, §1.2).</p>
  </div>

  <div class="card">
    <div class="step-badge">BƯỚC 05 - 06</div>
    <div class="card-label">✦ GROUND TRUTH UNLOCKED</div>
    <h3>Tự sửa đúng & Phản tư</h3>
    <p>Học viên tự tính lại và trả lời câu hỏi <em>"Vì sao lúc đầu em nhầm?"</em> để mở khóa Lời giải mẫu chuẩn xác.</p>
  </div>
</div>

<div class="card" style="margin-top: 14px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between;">
  <div style="font-size: 13.5px; color: #374151;">
    <strong style="color: var(--accent);">So sánh khác biệt:</strong> ChatGPT / Copilot giải hộ toàn bộ (Học vẹt) <strong>VS</strong> Adaptive AI Tutor dẫn đường tư duy (Học sâu).
  </div>
  <div class="live-pill">Kiểm chứng qua 5 tester ngoài nhóm (CSAT 4.8/5)</div>
</div>

<footer>
  <span>Đội thi: K4-3B-E402 (VinUni Hackathon)</span>
  <span>Slide 2 / 6</span>
</footer>

---

<!-- SLIDE 3 -->
<div class="top-bar">
  <div class="brand-pill"><span class="brand-circle">↗</span> Học từ lỗi trước</div>
  <div class="track-label">CÔNG NGHỆ CỐT LÕI · MISCONCEPTION MAPPING</div>
  <div class="tag-pill">Dual Ground Truth</div>
</div>

<h1>Bản Đồ Ngộ Nhận & <span class="serif-italic">AI Sinh Đề Kèm Đáp Án</span></h1>
<div class="subtitle">Chẩn đoán 4 tầng sai lầm kinh điển và công nghệ sinh đề đồng bộ Ground Truth (CP5+).</div>

<div class="grid-2">
  <div class="card">
    <div class="card-label">✦ CÂY 4 TẦNG BẪY NGỘ NHẬN (MISCONCEPTION TREE)</div>
    <ul>
      <li><strong>Lớp 1 (Token tiếng Việt):</strong> Bẫy đồng nhất 1 từ = 1 token (Thực tế BPE UTF-8 tách 2.0 - 2.5 tokens/từ).</li>
      <li><strong>Lớp 2 (Input vs Output price):</strong> Nhầm giá nạp input ($0.5/1M) với output sinh ra ($1.5/1M).</li>
      <li><strong>Lớp 3 (Quy đổi triệu đơn vị):</strong> Chia nhầm cho 1,000 thay vì 1,000,000 tokens.</li>
      <li><strong>Lớp 4 (Cảm tính / Thiếu căn cứ - HAX G10):</strong> Chặn đoán mò chung chung ("chắc rẻ lắm"), bắt buộc nêu bước tính.</li>
    </ul>
  </div>

  <div class="card" style="background: #fffcf8; border-color: #f3ede2;">
    <div class="card-top-accent"></div>
    <div class="card-label">✨ TÍNH NĂNG MỚI CP5+: DUAL GENERATION</div>
    <h3>Tải tài liệu tùy ý ➔ Sinh Đề + Đáp án chuẩn</h3>
    <ul>
      <li>Người dùng tải tài liệu học tập bất kỳ (PDF/Notes/LRU Cache).</li>
      <li>AI tự động sinh <strong>Đề bài thực hành + Trích dẫn lý thuyết + Bản đồ bẫy sai + Lời giải mẫu chuẩn (Ground Truth)</strong>.</li>
      <li><strong>Human-in-the-Loop:</strong> Giáo viên được duyệt và sửa đáp án chuẩn trước khi học viên bắt đầu phiên luyện tập.</li>
    </ul>
  </div>
</div>

<footer>
  <span>Đội thi: K4-3B-E402 (VinUni Hackathon)</span>
  <span>Slide 3 / 6</span>
</footer>

---

<!-- SLIDE 4 -->
<div class="top-bar">
  <div class="brand-pill"><span class="brand-circle">↗</span> Học từ lỗi trước</div>
  <div class="track-label">KIỂM NGHIỆM CHẤT LƯỢNG · GOLDEN SET (CP4)</div>
  <div class="live-pill">22/22 Cases Passed (100%)</div>
</div>

<h1>Thước Đo Chất Lượng & <span class="serif-italic">Bộ Đo Golden Set</span></h1>
<div class="subtitle">Khóa chuẩn "Đạt" theo Spec CP4 với 3 tiêu chí cứng vượt xa chất lượng cam kết ban đầu.</div>

<div class="grid-3" style="margin-bottom: 18px;">
  <div class="card" style="text-align: center;">
    <div class="stat-num">0.0%</div>
    <div class="stat-desc">Spoiler Rate (Lộ đáp án)</div>
    <p style="font-size: 12px; margin-top: 6px; color: var(--green); font-weight: 600;">Cam kết &le;5% · Đạt chuẩn tuyệt đối</p>
  </div>

  <div class="card" style="text-align: center;">
    <div class="stat-num" style="color: var(--green);">100%</div>
    <div class="stat-desc">Độ chính xác chẩn đoán</div>
    <p style="font-size: 12px; margin-top: 6px; color: var(--green); font-weight: 600;">22 / 22 ca bẫy bắt chính xác</p>
  </div>

  <div class="card" style="text-align: center;">
    <div class="stat-num" style="color: #2563eb;">350ms</div>
    <div class="stat-desc">Độ trễ phản hồi (P95)</div>
    <p style="font-size: 12px; margin-top: 6px; color: var(--green); font-weight: 600;">Yêu cầu &le;1500ms · Rất mượt</p>
  </div>
</div>

<div class="card">
  <div class="card-label">✦ PHÂN BỔ 22 TEST CASES KIỂM ĐỊNH TỰ ĐỘNG</div>
  <p style="font-size: 13.5px; line-height: 1.6; margin: 0;">
    Bao phủ toàn diện các kịch bản người dùng: <strong>10 ca bẫy Lớp 1</strong> (Token tiếng Việt) · <strong>4 ca bẫy Lớp 2</strong> (Đơn giá Input/Output) · <strong>4 ca bẫy Lớp 3</strong> (Quy đổi triệu) · <strong>2 ca Tự sửa đúng</strong> · <strong>2 ca Mơ hồ/cảm tính</strong> (HAX G10). Modal đo kiểm realtime được tích hợp trực tiếp trên giao diện ứng dụng.
  </p>
</div>

<footer>
  <span>Đội thi: K4-3B-E402 (VinUni Hackathon)</span>
  <span>Slide 4 / 6</span>
</footer>

---

<!-- SLIDE 5 -->
<div class="top-bar">
  <div class="brand-pill"><span class="brand-circle">↗</span> Học từ lỗi trước</div>
  <div class="track-label">THỬ NGHIỆM THỰC TẾ · RUBRIC R6 BONUS</div>
  <div class="tag-pill">5 Testers Outside Team</div>
</div>

<h1>Bằng Chứng Thực Nghiệm & <span class="serif-italic">Nhật Ký Người Dùng</span></h1>
<div class="subtitle">Thử nghiệm trực tiếp với 5 người dùng ngoài nhóm, ghi nhận quote nguyên văn và cải tiến UI.</div>

<div class="grid-2">
  <div class="card">
    <div class="card-label">✦ QUOTE NGUYÊN VĂN & ĐIỂM NGHẼN PHÁT HIỆN</div>
    <ul>
      <li>
        <strong>Trần Minh Đức (Kẹt nút nộp):</strong><br>
        <em style="color: #b45309;">"Ủa nộp bài sửa xong bấm chỗ nào để AI kiểm tra lại lần hai vậy, nhìn hai nút hơi giống nhau."</em><br>
        &rarr; <strong>Sửa ngay:</strong> Đổi tên thành nút "Nộp bài sửa" nổi bật với màu gradient (HAX G9).
      </li>
      <li>
        <strong>Lê Hoàng Nam (Thử thách HAX G10):</strong><br>
        <em style="color: #b45309;">"Nó bắt nhập cách tính chứ không chịu đoán hộ à, tưởng nói rẻ là tính ra tiền luôn."</em><br>
        &rarr; <strong>Giữ nguyên:</strong> Duy trì tính nghiêm cẩn sư phạm, không đoán mò.
      </li>
    </ul>
  </div>

  <div class="card" style="background: #fffdf9;">
    <div class="card-top-accent"></div>
    <div class="card-label">📈 ĐO LƯỜNG HIỆU QUẢ NHẬN THỨC</div>
    <div style="display: flex; gap: 18px; margin: 10px 0;">
      <div>
        <div class="stat-num" style="font-size: 32px;">20% &rarr; 85%</div>
        <div class="stat-desc">Tỷ lệ tự sửa đúng</div>
      </div>
      <div>
        <div class="stat-num" style="font-size: 32px; color: var(--green);">4.8 / 5</div>
        <div class="stat-desc">Điểm hài lòng (CSAT)</div>
      </div>
    </div>
    <p style="font-size: 13px; color: #4b5563; margin-top: 8px;">
      Thời gian giải quyết trung bình: <strong>4.2 phút / bài</strong>. Người dùng đánh giá cao cảm giác "vỡ òa" khi tự tìm ra đáp số thay vì đọc thuộc lời giải có sẵn.
    </p>
  </div>
</div>

<footer>
  <span>Đội thi: K4-3B-E402 (VinUni Hackathon)</span>
  <span>Slide 5 / 6</span>
</footer>

---

<!-- SLIDE 6 -->
<div class="top-bar">
  <div class="brand-pill"><span class="brand-circle">↗</span> Học từ lỗi trước</div>
  <div class="track-label">TỔNG KẾT DỰ ÁN · TRIỂN KHAI THỰC TẾ</div>
  <div class="live-pill">Sẵn sàng thuyết trình CP6</div>
</div>

<h1>Sẵn Sàng Triển Khai & <span class="serif-italic">Đội Ngũ K4-3B-E402</span></h1>
<div class="subtitle">Hoàn thiện 100% deliverables CP1 đến CP5: Web App trực tuyến, Video demo thao tác, Slide thuyết trình.</div>

<div class="grid-2">
  <div class="card">
    <div class="card-label">👥 ĐỘI NGŨ THỰC HIỆN DỰ ÁN</div>
    <ul>
      <li><strong>Ngô Tuấn Tùng (Lead):</strong> Chủ trì Spec, Canvas, điều phối tiến độ, Slide pitch CP5.</li>
      <li><strong>Đào Thị Huyền:</strong> Thiết kế System Prompt, Guardrails chống lộ đáp án, tích hợp AI.</li>
      <li><strong>Nguyễn Huy Cương:</strong> Khảo sát JTBD, thiết kế bài tập, trích dẫn tài liệu & Ground Truth.</li>
      <li><strong>Trần Văn Khánh:</strong> Chuẩn hóa Golden Set 22 cases, kiểm thử thực tế và quay Video demo.</li>
    </ul>
  </div>

  <div class="card" style="background: #fffcf8; border-color: #f0ebd8;">
    <div class="card-top-accent"></div>
    <div class="card-label">🌐 TÀI NGUYÊN & LINK SẢN PHẨM</div>
    <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 8px;">
      <li>🚀 <strong>Web App Local:</strong> <code style="color: #15803d;">http://localhost:3000</code></li>
      <li>🌍 <strong>Online Public:</strong> <code style="color: #15803d;">https://spotty-tires-happen.loca.lt</code></li>
      <li>🎬 <strong>Video Demo CP5:</strong> <code style="color: #ea580c;">demo/demo-video.webm</code> (3.9 MB)</li>
      <li>📑 <strong>Slide PDF CP5:</strong> <code style="color: #ea580c;">demo/demo-slides.pdf</code> (Vector chuẩn)</li>
      <li>🐙 <strong>GitHub:</strong> <code style="color: #2563eb;">tuantung26/K4-3B-E402-Vinhackathon</code></li>
    </ul>
  </div>
</div>

<footer>
  <span>Đội thi: K4-3B-E402 (VinUni Hackathon)</span>
  <span>Slide 6 / 6 · Hoàn tất Checkpoint 5</span>
</footer>
