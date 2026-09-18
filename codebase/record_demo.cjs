const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runDemoRecording() {
  console.log('🚀 Bắt đầu quá trình quay video demo thao tác chuẩn CP5...');
  
  const demoDir = path.resolve(__dirname, '../demo');
  if (!fs.existsSync(demoDir)) {
    fs.mkdirSync(demoDir, { recursive: true });
  }

  // Khởi động Chromium
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  // Cấu hình quay video chuẩn HD 1280x720
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: demoDir,
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();
  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  try {
    console.log('1. Truy cập ứng dụng tại http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await sleep(2000);

    // Kịch bản 1: Học viên làm bài lần đầu - Mắc lỗi ngộ nhận Lớp 1 (1 từ = 1 token)
    console.log('2. Nhập bài làm lần 1: Mắc lỗi ngộ nhận Lớp 1 (1 từ = 1 token)...');
    const answerInput = page.locator('#answer');
    await answerInput.scrollIntoViewIfNeeded();
    await answerInput.fill('100 câu x 20 từ = 2,000 từ = 2,000 token. Chi phí = $0.001');
    await sleep(1500);

    console.log('   Bấm Nộp bài...');
    await page.locator('button.primary').click();
    await sleep(3500);

    // Kịch bản 2: Học viên thử nhập câu mơ hồ / thiếu căn cứ
    console.log('3. Nhập bài làm lần 2: Câu trả lời cảm tính mơ hồ (Kiểm tra HAX G10)...');
    await answerInput.fill('Em chịu, chắc rẻ lắm chưa đến một nghìn đồng.');
    await sleep(1500);

    console.log('   Bấm Nộp bài sửa...');
    await page.locator('button.primary').click();
    await sleep(3500);

    // Kịch bản 3: Học viên tự sửa đúng sau khi xem gợi ý Socratic & đối chiếu lý thuyết
    console.log('4. Nhập bài làm lần 3: Tự sửa đúng sau khi đối chiếu lý thuyết §1.2...');
    await answerInput.fill('100 câu * 20 từ = 2000 từ. Tiếng Việt 2.5 token/từ -> 5,000 tokens. Chi phí: (5000/1M)*0.5 = $0.0025');
    await sleep(1500);

    console.log('   Bấm Nộp bài làm đúng...');
    await page.locator('button.primary').click();
    await sleep(3500);

    // Kịch bản 4: Bước 9 - Phản tư bản chất (Reflection Step)
    console.log('5. Thực hiện Bước 9: Phản tư bản chất nguyên nhân gốc rễ...');
    const expInput = page.locator('.reflection-box textarea');
    await expInput.scrollIntoViewIfNeeded();
    await expInput.fill('Do ban đầu em tưởng 1 từ = 1 token như tiếng Anh, nhưng thực tế tiếng Việt có dấu thanh UTF-8 nên tokenizer BPE tách thành 2-3 tokens.');
    await sleep(1500);

    console.log('   Bấm Kiểm tra giải thích (Mở khóa Ground Truth)...');
    await page.locator('.btn-reflection').click();
    await sleep(4000);

    // Kịch bản 5: Chạy bộ đo kiểm nghiệm Golden Set 22 test cases (CP4)
    console.log('6. Mở bộ đo Golden Set 22 test cases...');
    await page.locator('.btn-eval').first().click();
    await sleep(5000); // Chờ progress bar chạy từ 1 đến 22 test cases

    console.log('   Đóng modal kiểm nghiệm...');
    await page.locator('.modal-close').first().click();
    await sleep(1500);

    // Kịch bản 6: Tính năng Tải tài liệu & AI Sinh đề bài + Đáp án chuẩn
    console.log('7. Mở Modal Tải tài liệu & AI Sinh đề bài + Đáp án chuẩn...');
    await page.locator('.btn-generator').click();
    await sleep(2000);

    console.log('   Chọn tài liệu mẫu Caching LRU...');
    const presetBtn = page.locator('.preset-doc-btn').nth(2);
    if (await presetBtn.isVisible()) {
      await presetBtn.click();
      await sleep(1500);
    }

    console.log('   Bấm AI Sinh đề bài & Đáp án chuẩn ↗...');
    await page.locator('.btn-generate-main').click();
    await sleep(4500); // Chờ AI phân tích, thiết kế đề và đáp án

    console.log('   Bắt đầu luyện tập với bài tập vừa sinh...');
    const applyBtn = page.locator('.btn-apply-generated');
    if (await applyBtn.isVisible()) {
      await applyBtn.scrollIntoViewIfNeeded();
      await sleep(1500);
      await applyBtn.click();
      await sleep(3000);
    }

    console.log('✅ Hoàn thành toàn bộ kịch bản demo!');
  } catch (err) {
    console.error('❌ Lỗi trong quá trình quay demo:', err);
  } finally {
    // Lấy video path
    const video = page.video();
    await page.close();
    await context.close();
    await browser.close();

    if (video) {
      const originalPath = await video.path();
      const finalWebmPath = path.resolve(demoDir, 'demo-video.webm');
      fs.copyFileSync(originalPath, finalWebmPath);
      console.log(`🎬 Video đã được lưu thành công tại: ${finalWebmPath}`);
    }
  }
}

runDemoRecording();
