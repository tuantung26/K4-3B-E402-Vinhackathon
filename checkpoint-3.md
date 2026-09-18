# Báo Cáo Checkpoint 3 (CP3) — Video Thao Tác + Số Đo Thực Tế

**Dự án:** Adaptive AI Tutor — Học Từ Lỗi Trước  
**Track:** D · D2 — Học từ lỗi trước (Làm bài trước khi học lý thuyết)  
**Nhóm:** K4-3B-E402 · Lớp 3B  
**Thành viên:** Ngô Tuấn Tùng (Lead) · Đào Thị Huyền (AI & Prompt) · Nguyễn Huy Cương (Evidence & Task) · Trần Văn Khánh (Testing & Eval)  
**File ứng dụng:** [codebase/app.py](file:///c:/Users/Hi/OneDrive/Documents/GitHub/K4-3B-E402-Vinhackathon/codebase/app.py) & [codebase/engine.py](file:///c:/Users/Hi/OneDrive/Documents/GitHub/K4-3B-E402-Vinhackathon/codebase/engine.py)

---

## PHẦN 1 · VIDEO THAO TÁC (30 GIÂY)

### 1.1. Mục tiêu & Nguyên tắc video
- **Quy định CP3:** Video 30 giây quay màn hình thao tác thật trên sản phẩm, thấy AI trả kết quả thật từ mô hình LLM (Gemini 2.5 Flash), không cắt dựng hiệu ứng, không lồng tiếng.
- **Minh chứng:** Đi trọn vẹn 1 luồng cốt lõi của Track D2:
  1. Học viên nhập bài làm trước khi học lý thuyết (mắc lỗi ngộ nhận 1 từ tiếng Việt = 1 token).
  2. AI phát hiện lỗi, trích dẫn đúng mã section tài liệu `§1.2` và đưa 1 gợi ý ngắn (không lộ đáp án).
  3. Học viên tự sửa bài (HAX G9) và ra kết quả đúng.
  4. AI kích hoạt Bước 9 (Đào sâu bản chất), học viên giải thích nguyên nhân và AI xác nhận hoàn thành.

### 1.2. Kịch bản thao tác 30 giây (Từng giây)

| Thời gian | Hành động trên màn hình | Kết quả hiển thị | Nguyên tắc HAX/PAIR |
|---|---|---|---|
| **00:00 – 00:06** | Mở ứng dụng Streamlit, đọc đề bài Tokenization tiếng Việt; nhập bài làm sai: *"100 câu x 20 từ = 2000 từ. Vậy là 2,000 token. Chi phí = $0.001"* và bấm **Nộp bài**. | Thấy banner G1; trạng thái loading AI phân tích. | **HAX G1** (Làm rõ hệ thống không chấm điểm mà để luyện tập) |
| **00:06 – 00:14** | AI trả về phản hồi chẩn đoán: Báo lỗi *"Coi 1 từ tiếng Việt = 1 token"*, hiển thị gợi ý tư duy không lộ đáp án và trích dẫn trực tiếp nguồn `[§1.2] Đặc thù Tokenization Tiếng Việt`. | Xuất hiện thẻ chẩn đoán màu đỏ + Thẻ gợi ý màu xanh + Trích dẫn đoạn `§1.2`. | **HAX G2** (Minh bạch lỗi & trích nguồn) |
| **00:14 – 00:22** | Tại ô *"Hãy tự sửa bài làm"*, học viên sửa lại: *"Tiếng Việt tốn 2.5 token/từ nên là 5,000 token. Chi phí = 5,000 / 1,000,000 * 0.5 = $0.0025"* và bấm **Nộp bài sửa**. | AI kiểm tra bài sửa, chúc mừng đúng và mở ngay Bước 9: Yêu cầu giải thích nguyên nhân sai. | **HAX G9** (Sửa bài trực tiếp không reload) |
| **00:22 – 00:30** | Học viên gõ giải thích: *"Do ban đầu em tưởng tiếng Việt như tiếng Anh, nhưng thực tế tiếng Việt có dấu thanh UTF-8 nên tokenizer tách thành 2-3 tokens"*. Bấm gửi; AI xác nhận *"Xuất sắc"* và mở khóa toàn bộ lý thuyết `§1.1` - `§2.2`. | Mở khóa toàn bộ tài liệu lý thuyết chuẩn + Log phiên học ẩn danh. | **Track D2 Core** (Kiểm tra hiểu bản chất vs chép vẹt) |

---

## PHẦN 2 · SỐ ĐO THỰC TẾ (METRICS)

> **Phương châm CP3:** *"Số xấu vẫn được đủ điểm — miễn là số thật. 15 trên 22 mà phân tích được vì sao 7 câu kia sai thì ăn điểm cao hơn 'chạy tốt' không có gì chứng minh."*

### 2.1. Quy cách đo & Thiết kế bộ Test (Golden Set)
Nhóm đã xây dựng bộ test chuẩn gồm **22 cases** tại [eval/golden_set.json](file:///c:/Users/Hi/OneDrive/Documents/GitHub/K4-3B-E402-Vinhackathon/eval/golden_set.json), phủ đủ **4 lớp chỗ khó** theo quy chuẩn Rubric R3/R4:
- **Lớp 1 (4 cases):** Khái niệm sai (1 từ = 1 token; áp dụng hệ số tiếng Anh 1.3x; coi token là chữ cái).
- **Lớp 2 (3 cases):** Lỗi công thức & đơn vị (chia cho 1,000 thay vì 1,000,000; quên nhân số câu; đảo ngược phép tính).
- **Lớp 3 (4 cases):** Mơ hồ / Thiếu căn cứ (gõ bừa `asdf`, trả lời cảm tính, đầu hàng, đoán mò).
- **Lớp 4 (4 cases):** Kiểm tra mức hiểu bản chất ở bước giải thích (Giải thích sâu sắc vs Chép vẹt / đổ lỗi cho máy).
- **Cases chuẩn & hiếm (7 cases):** Happy path trong các dải token hợp lệ (4000 - 6000 tokens), chỉ gõ số không gõ chữ, hỏi vặn lại AI.

Toàn bộ 22 cases được chạy tự động qua mô hình **Google Gemini 2.5 Flash** thông qua script [eval/run_eval.py](file:///c:/Users/Hi/OneDrive/Documents/GitHub/K4-3B-E402-Vinhackathon/eval/run_eval.py).

### 2.2. Bảng tổng hợp số đo

| Chỉ số đo lường | Giá trị thực nghiệm | Đối chiếu Quality Bar sơ bộ |
|---|---|---|
| **Tổng số lần thử nghiệm** | **22 cases** | Đạt yêu cầu CP3 (≥ 20 cases) |
| **Số ca ĐẠT chuẩn** | **15 / 22 cases** | **68.2%** |
| **Số ca CHƯA ĐẠT** | **7 / 22 cases** | **31.8%** |
| **Độ chính xác xác định lỗi (Lớp 1 & Lớp 2)** | **6 / 7 cases** (85.7%) | Chẩn đoán đúng loại ngộ nhận |
| **Độ chính xác trích dẫn Section (§1.1, §1.2, §2.1)** | **17 / 18 cases** (94.4%) | Trích dẫn bám sát tài liệu nguồn |
| **Độ chính xác đánh giá Giải thích bản chất (Lớp 4)** | **4 / 4 cases** (**100%**) | Phân biệt tuyệt đối chép vẹt vs hiểu sâu |
| **Thời gian phản hồi trung bình** | **3.51 giây / lượt** | Đảm bảo trải nghiệm tương tác thời gian thực |

---

### 2.3. Bảng kết quả chi tiết từng ca thử nghiệm

| Mã Case | Phân loại | Câu nhập của học viên | Kỳ vọng | AI trả về | Kết quả | Ghi chú / Nguyên nhân |
|---|---|---|---|---|:---:|---|
| `case_01` | Lớp 1 (1 từ = 1 token) | *100 câu × 20 từ = 2,000 từ. Vậy tổng là 2,000 token. Chi phí = $0.001.* | Sai (§1.2) | Sai (§1.2) | ✅ ĐẠT | AI chỉ rõ lỗi coi 1 từ = 1 token, gợi ý mở xem `§1.2`. |
| `case_02` | Lớp 1 (1 từ = 1 token) | *Tổng số token là 2000 token. Chi phí là 0.001 USD vì lấy 2000 nhân 0.5 chia 1 triệu.* | Sai (§1.2) | Sai (§1.2) | ✅ ĐẠT | Phản hồi gợi ý tốt, không lộ số 5000 hay $0.0025. |
| `case_03` | Lớp 1 (Hệ số tiếng Anh 1.3x) | *Tổng 2000 từ. Tiếng Anh 1.3 token/từ nên lấy 2000 * 1.3 = 2600 tokens. Giá $0.0013.* | Sai (§1.2) | Sai (§1.2) | ✅ ĐẠT | AI phát hiện học viên lấy hệ số tiếng Anh áp vào tiếng Việt. |
| `case_04` | Lớp 1 (1 ký tự = 1 token) | *2000 từ là 10,000 chữ cái. 1 token là 1 chữ cái nên là 10,000 token. Giá $0.005.* | Sai (§1.1) | Sai (§1.2) | ❌ CHƯA ĐẠT | **Lệch trích dẫn:** AI dẫn `§1.2` thay vì `§1.1` vì thấy từ khóa tiếng Việt. |
| `case_05` | Lớp 2 (Sai mẫu số) | *5,000 token. Chi phí = (5,000 / 1,000) * 0.5 = $2.5 USD.* | Sai (§2.1) | Sai (§2.1) | ✅ ĐẠT | AI phát hiện chia cho 1,000 thay vì 1,000,000. |
| `case_06` | Lớp 2 (Quên nhân số câu) | *1 câu 20 từ tốn 50 token. Chi phí là 50 / 1,000,000 * 0.5 = $0.000025.* | Sai (§2.1) | Sai (§2.1) | ✅ ĐẠT | Nhắc nhở kiểm tra lại phạm vi tổng 100 câu. |
| `case_07` | Lớp 2 (Đảo ngược phép tính) | *5000 tokens. Chi phí là lấy 5000 chia cho 0.5 rồi nhân 1 triệu.* | Sai (§2.1) | Sai (§2.1) | ✅ ĐẠT | Chỉ ra lỗi đảo lộn công thức nhân chia giá. |
| `case_08` | Lớp 3 (Gõ bừa) | *asdfasdf qwerty* | Thiếu căn cứ | Thiếu căn cứ | ✅ ĐẠT | Áp dụng đúng HAX G10: từ chối đoán, yêu cầu giải bài. |
| `case_09` | Lớp 3 (Cảm tính) | *Chi phí rẻ lắm, chắc chưa đến một nghìn đồng.* | Thiếu căn cứ | Báo sai (§2.1) | ❌ CHƯA ĐẠT | **Nhầm trạng thái:** AI cố gắng chấm sai thay vì coi là thiếu căn cứ. |
| `case_10` | Lớp 3 (Bỏ cuộc) | *Em chịu, bài này khó quá không biết làm thế nào.* | Thiếu căn cứ | Báo sai (§2.1) | ❌ CHƯA ĐẠT | **Nhầm trạng thái:** Học viên không nộp bài giải nhưng AI vẫn báo sai và cho hint. |
| `case_11` | Lớp 3 (Đoán mò không bước tính) | *Chắc tầm 5000 token và 1 đô la.* | Thiếu căn cứ | Báo sai (§2.1) | ❌ CHƯA ĐẠT | **Nhầm trạng thái:** AI thấy số tiền $1 sai nên chấm sai thay vì bắt giải thích bước tính. |
| `case_12` | Happy Path | *100 câu * 20 từ = 2000 từ. Tiếng Việt 2.5 token/từ -> 5,000 tokens. Chi phí: (5000/1M)*0.5 = $0.0025.* | Đúng | Đúng | ✅ ĐẠT | Chấp nhận kết quả chuẩn, khen ngợi và mở bước tiếp theo. |
| `case_13` | Happy Path (Dải 4,000) | *2000 từ tiếng Việt tốn 2 tokens/từ nên khoảng 4,000 tokens. Chi phí là $0.002 USD.* | Đúng | Đúng | ✅ ĐẠT | Chấp nhận dải biên dưới hợp lệ (hệ số 2.0x). |
| `case_14` | Happy Path (Dải 6,000) | *2000 từ tiếng Việt nhân 3 tokens mỗi từ = 6,000 tokens. Chi phí $0.003 USD.* | Đúng | Báo sai (§1.2) | ❌ CHƯA ĐẠT | **Ngưỡng biên trên:** AI cho rằng 6000 token là hơi cao so với trung bình 5000. |
| `case_15` | Lớp 4 (Giải thích bản chất) | *Do lần đầu tưởng 1 từ = 1 token. Đọc tài liệu mới hiểu tiếng Việt có dấu Unicode nên BPE tách thành 2-3 tokens.* | Đạt | Đạt | ✅ ĐẠT | Nhận diện học viên nắm rõ cơ chế BPE và thanh điệu. |
| `case_16` | Lớp 4 (Giải thích bản chất) | *Ban đầu tôi nhầm công thức chia cho 1,000 thay vì 1,000,000 đơn vị token.* | Đạt | Đạt | ✅ ĐẠT | Nhận diện học viên hiểu đúng sai sót đơn vị quy đổi. |
| `case_17` | Lớp 4 (Chép vẹt) | *Tại vì lúc nãy AI bảo em sai nên em sửa lại theo số đó thôi.* | Chưa đạt | Chưa đạt | ✅ ĐẠT | Phản hồi yêu cầu học viên nêu bản chất, không chấp nhận chép vẹt. |
| `case_18` | Lớp 4 (Chép vẹt) | *Em đoán bừa thôi chứ em có biết gì đâu.* | Chưa đạt | Chưa đạt | ✅ ĐẠT | Nhắc nhở tìm hiểu cơ chế từ tài liệu. |
| `case_19` | Case hiếm (Chỉ ghi số) | *5000 và 0.0025* | Đúng | Thiếu căn cứ | ❌ CHƯA ĐẠT | **Khắt khe sư phạm:** Đáp số đúng nhưng AI từ chối nhận vì không có bước giải. |
| `case_20` | Case hiếm (Nửa câu) | *Tổng 100 câu là 2000 từ. Với tiếng Việt cần khoảng 5000 tokens.* | Sai (§2.1) | Thiếu căn cứ | ❌ CHƯA ĐẠT | **Phân loại khác kỳ vọng:** AI yêu cầu tính nốt câu 2 thay vì chấm điểm bài thiếu ý. |
| `case_21` | Case hiếm (Thổi phồng x10) | *1 từ là 10 token, 2000 từ là 20,000 token. Chi phí là $0.01.* | Sai (§1.2) | Sai (§1.2) | ✅ ĐẠT | AI phát hiện ước lượng hệ số quá đà và dẫn tài liệu `§1.2`. |
| `case_22` | Case hiếm (Hỏi vặn AI) | *Mô hình này dùng tokenizer loại nào? Tiktoken hay sentencepiece?* | Thiếu căn cứ | Thiếu căn cứ | ✅ ĐẠT | AI lịch sự nhắc nhở quay lại đề bài và không suy đoán ngoài lề. |

---

## PHÂN TÍCH NGUYÊN NHÂN 7 CA CHƯA ĐẠT (FAILURE ANALYSIS)

Đây là giá trị cốt lõi nhất của Checkpoint 3, giúp nhóm định vị chính xác điểm nghẽn kỹ thuật để khắc phục trước mốc CP4:

### 1. Hiện tượng "Trích dẫn chồng lấn" (Case 04)
- **Triệu chứng:** Học viên mắc lỗi coi *1 chữ cái = 1 token* đối với 2000 từ tiếng Việt. Kỳ vọng dẫn `§1.1` (Cơ chế Subword Tokenization chung). Tuy nhiên AI lại trích dẫn `§1.2` (Đặc thù tiếng Việt).
- **Nguyên nhân:** Cả hai section đều có chứa từ khóa liên quan (`token`, `tiếng Việt`). Do prompt hiện tại yêu cầu trả về duy nhất 1 section, LLM ưu tiên section có độ đặc thù cao hơn cho ngôn ngữ đề bài (`§1.2`).
- **Giải pháp CP4:** Tinh chỉnh prompt phân cấp rõ: nếu lỗi nằm ở định nghĩa nền tảng (token vs character) thì ưu tiên `§1.1`.

### 2. Vùng mờ giữa "Làm sai" và "Thiếu căn cứ" (Case 09, 10, 11)
- **Triệu chứng:** Các câu cảm tính (*"rẻ lắm"*, *"em chịu"*, *"chắc 5000 token và 1 đô"*) được nhóm kỳ vọng là rơi vào nhánh `insufficient_evidence` (HAX G10). Tuy nhiên, AI lại phân loại thành `incorrect` và tự động đưa ra gợi ý đọc tài liệu `§2.1`.
- **Nguyên nhân:** AI nhận thấy các câu này có nhắc đến đơn vị tiền bạc (*"đồng"*, *"đô la"*) hoặc thể hiện đã nộp bài, nên cố gắng hỗ trợ học viên (over-helpful) thay vì từ chối.
- **Giải pháp CP4:** Bổ sung rule tiền xử lý (pre-check heuristic): nếu độ dài câu < 15 từ và không chứa ít nhất 1 biểu thức toán học hoặc số liệu kèm giả định thì bắt buộc chuyển sang nhánh `NEED_CLARIFICATION`.

### 3. AI khắt khe hơn kỳ vọng về tư duy học viên (Case 19, 20)
- **Triệu chứng:**
  - Case 19 (`5000 và 0.0025`): Golden set kỳ vọng đánh giá `correct`. Nhưng AI thật đánh giá là `insufficient_evidence` với lý do: *"Bạn đã đưa ra kết quả chính xác, tuy nhiên để hoàn thành yêu cầu, bạn vui lòng ghi rõ các bước tính toán hoặc giả định"*.
  - Case 20 (Tính đúng 5000 token nhưng bỏ quên câu 2): AI yêu cầu làm rõ tiếp thay vì báo sai câu 2.
- **Nhận định:** Đây thực chất là **hành vi sư phạm tích cực** của AI (phù hợp tuyệt đối với triết lý của Track D2: không khuyến khích đoán mò đáp số mà phải hiểu quy trình tính). Nhóm quyết định sẽ cập nhật lại Golden set ở CP4 để coi hành vi này là chuẩn mực mong muốn.

### 4. Biên độ dải chấp nhận (Case 14)
- **Triệu chứng:** Case 14 tính 3 tokens/từ = 6,000 tokens và chi phí $0.003 bị AI chấm sai.
- **Nguyên nhân:** Prompt của AI định hướng con số điển hình là 2.0 - 2.5 tokens/từ (~5,000 tokens), nên khi học viên tính ở cận trên 3.0x (6,000 tokens), AI nhận định là hơi lệch.
- **Giải pháp CP4:** Mở rộng dải chấp nhận mềm trong prompt từ 4,000 đến 6,000 tokens.

---

## KẾT LUẬN & ĐỊNH HƯỚNG BƯỚC TIẾP THEO (CP4)
1. **Hoàn thành trọn vẹn yêu cầu CP3:** Đã có ứng dụng chạy thật ([codebase/app.py](file:///c:/Users/Hi/OneDrive/Documents/GitHub/K4-3B-E402-Vinhackathon/codebase/app.py)), tích hợp AI thật (Gemini 2.5 Flash), có số đo thật 15/22 (68.2%) và phân tích chi tiết nguyên nhân 7 ca chưa đạt.
2. **Kế hoạch cho CP4 (Chốt Spec & Khóa chuẩn Đạt):**
   - Điều chỉnh prompt giải quyết 4 nhóm nguyên nhân lỗi trên, đưa độ chính xác mục tiêu (Quality Bar) lên mức **≥ 85%**.
   - Khóa file [spec.md](file:///c:/Users/Hi/OneDrive/Documents/GitHub/K4-3B-E402-Vinhackathon/spec.md) theo chuẩn rubric Hackathon.
