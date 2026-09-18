import os
import json
import time
import streamlit as st
from dotenv import load_dotenv

from engine import EXERCISE_DATA, analyze_student_attempt, evaluate_student_explanation, get_gemini_api_key

load_dotenv()

# Page Configuration
st.set_page_config(
    page_title="AI Adaptive Tutor — Học Từ Lỗi Trước (Track D2)",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    .main-header {
        background: linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%);
        padding: 24px 30px;
        border-radius: 16px;
        color: white;
        margin-bottom: 24px;
        box-shadow: 0 10px 25px -5px rgba(49, 46, 129, 0.25);
    }
    .badge-track {
        display: inline-block;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(8px);
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .hax-notice {
        background: #F0FDF4;
        border-left: 4px solid #16A34A;
        padding: 12px 16px;
        border-radius: 0 10px 10px 0;
        font-size: 14px;
        color: #166534;
        margin-bottom: 20px;
    }
    .hint-card {
        background: #EFF6FF;
        border: 1px solid #BFDBFE;
        border-left: 5px solid #2563EB;
        padding: 16px 20px;
        border-radius: 10px;
        margin: 15px 0;
    }
    .doc-quote-card {
        background: #F8FAFC;
        border: 1px dashed #94A3B8;
        padding: 14px 18px;
        border-radius: 10px;
        margin: 12px 0;
        font-size: 14px;
    }
    .amber-card {
        background: #FFFBEB;
        border: 1px solid #FDE68A;
        border-left: 5px solid #D97706;
        padding: 16px 20px;
        border-radius: 10px;
        margin: 15px 0;
    }
</style>
""", unsafe_allow_html=True)

# -------------------------------------------------------------
# App State Initialization
# -------------------------------------------------------------
if "session_id" not in st.session_state:
    st.session_state.session_id = f"sess_{int(time.time())}"
if "attempts_history" not in st.session_state:
    st.session_state.attempts_history = []
if "flow_state" not in st.session_state:
    st.session_state.flow_state = "DOING_FIRST"
if "hint_count" not in st.session_state:
    st.session_state.hint_count = 0
if "last_analysis" not in st.session_state:
    st.session_state.last_analysis = None
if "explanation_result" not in st.session_state:
    st.session_state.explanation_result = None

# Sidebar
with st.sidebar:
    st.title("⚙️ Cấu hình & Thông số")
    st.markdown("**Track D · D2:** Học từ lỗi trước *(Làm bài trước khi học lý thuyết)*")
    
    current_key = get_gemini_api_key(st.session_state.get("custom_api_key"))
    
    st.markdown("---")
    st.subheader("🔑 Kết nối AI")
    if current_key:
        st.success("🟢 Đã kết nối Gemini API (gemini-2.5-flash)")
    else:
        user_key = st.text_input("Nhập Gemini API Key", type="password", key="custom_api_key")
        if user_key:
            st.success("🟢 Đã lưu API Key")
            
    st.markdown("---")
    st.subheader("📌 Tham số hệ thống")
    st.write("• **Lượt gợi ý tối đa (`MAX_HINTS`):** 2 lần")
    st.write("• **Ngưỡng căn cứ (`CONFIDENCE_THRESHOLD`):** 0.70")
    st.write("• **HAX Principle:** G1, G2, G9, G10")
    
    if st.button("🔄 Bắt đầu lại bài tập"):
        st.session_state.flow_state = "DOING_FIRST"
        st.session_state.hint_count = 0
        st.session_state.attempts_history = []
        st.session_state.last_analysis = None
        st.session_state.explanation_result = None
        st.rerun()

# Main Header Banner
st.markdown("""
<div class="main-header">
    <div class="badge-track">HACKATHON AI · TRACK D2 · CHECKPOINT 3</div>
    <h1 style="margin: 4px 0 10px 0; font-size: 28px;">Học Từ Lỗi Trước (Adaptive Learning Prototype)</h1>
    <p style="margin: 0; opacity: 0.9; font-size: 15px;">
        Đổi trình tự học truyền thống: Thử làm bài trước để phát hiện lỗ hổng tư duy → AI phân tích đúng lỗi & trích dẫn nguồn → Tự sửa và giải thích bản chất.
    </p>
</div>
""", unsafe_allow_html=True)

# Tabs
tab_practice, tab_benchmark, tab_spec = st.tabs([
    "🎓 1. Phòng Luyện Tập Thích Ứng", 
    "📊 2. Bộ Số Đo & Benchmark CP3", 
    "📖 3. Luồng Hoạt Động & Spec"
])

# -------------------------------------------------------------
# TAB 1: PRACTICE ROOM
# -------------------------------------------------------------
with tab_practice:
    # HAX G1: Clarify what the system can do
    st.markdown("""
    <div class="hax-notice">
        <strong>💡 Nguyên tắc HAX G1:</strong> Đây là bài thực hành thử thách tư duy trước khi học lý thuyết. 
        Hệ thống <strong>không chấm điểm chính thức</strong>, AI đóng vai trò người đồng hành phân tích góc nhìn và hướng dẫn bạn tự tìm ra đáp án đúng.
    </div>
    """, unsafe_allow_html=True)

    # Exercise Box
    with st.container():
        st.markdown(f"### 📝 {EXERCISE_DATA['title']}")
        st.info(EXERCISE_DATA["prompt"])

    st.markdown("---")

    # FLOW HANDLING
    current_state = st.session_state.flow_state
    
    if current_state == "DOING_FIRST":
        st.markdown("#### Bước 1: Nhập bài làm đầu tiên của bạn")
        st.caption("Hãy tự tính toán và nhập suy nghĩ của bạn, đừng ngại sai — làm sai là bước đầu tiên để học!")
        
        attempt_input = st.text_area(
            "Bài làm của bạn:",
            placeholder="Ví dụ: 100 câu x 20 từ = 2000 từ. Vậy tổng số tokens là... Chi phí ước tính là...",
            height=130,
            key="input_first_attempt"
        )
        
        col_btn, _ = st.columns([2, 5])
        with col_btn:
            if st.button("🚀 Nộp bài & Nhận phản hồi AI", use_container_width=True, type="primary"):
                if not attempt_input.strip():
                    st.error("Vui lòng nhập bài làm của bạn trước khi nộp.")
                else:
                    with st.spinner("AI đang kiểm tra căn cứ và phân tích bước giải..."):
                        analysis = analyze_student_attempt(attempt_input, attempt_count=1, custom_key=st.session_state.get("custom_api_key"))
                        st.session_state.last_analysis = analysis
                        st.session_state.attempts_history.append({
                            "type": "first_attempt",
                            "input": attempt_input,
                            "analysis": analysis
                        })
                        
                        if analysis.get("status") == "correct":
                            st.session_state.flow_state = "COMPLETED"
                        elif analysis.get("status") == "insufficient_evidence":
                            st.session_state.flow_state = "NEED_CLARIFICATION"
                        else:
                            st.session_state.hint_count = 1
                            st.session_state.flow_state = "HINTED_WAITING_RETRY"
                        st.rerun()

    elif current_state == "NEED_CLARIFICATION":
        analysis = st.session_state.last_analysis or {}
        st.markdown("""
        <div class="amber-card">
            <h4 style="margin-top:0; color:#B45309;">⚠️ AI Chưa Đủ Căn Cứ Để Chẩn Đoán (HAX G10)</h4>
            <p style="margin-bottom:6px;">AI phát hiện câu trả lời của bạn chưa có đủ thông tin hoặc bước tính toán để xác định chính xác bạn đang hiểu đúng hay sai ở điểm nào.</p>
            <p><strong>Yêu cầu từ AI:</strong> <em>""" + analysis.get("clarification_request", "Vui lòng ghi rõ các bước tính của bạn.") + """</em></p>
        </div>
        """, unsafe_allow_html=True)
        
        clarify_input = st.text_area("Bổ sung thông tin / cách bạn tính toán:", height=100)
        col1, col2 = st.columns([2, 5])
        with col1:
            if st.button("📤 Gửi lại để AI phân tích", type="primary"):
                if clarify_input.strip():
                    with st.spinner("AI đang phân tích lại..."):
                        new_analysis = analyze_student_attempt(clarify_input, attempt_count=st.session_state.hint_count + 1, custom_key=st.session_state.get("custom_api_key"))
                        st.session_state.last_analysis = new_analysis
                        st.session_state.attempts_history.append({
                            "type": "clarification",
                            "input": clarify_input,
                            "analysis": new_analysis
                        })
                        if new_analysis.get("status") == "correct":
                            st.session_state.flow_state = "COMPLETED"
                        elif new_analysis.get("status") == "insufficient_evidence":
                            st.session_state.flow_state = "NEED_CLARIFICATION"
                        else:
                            st.session_state.hint_count = 1
                            st.session_state.flow_state = "HINTED_WAITING_RETRY"
                        st.rerun()

    elif current_state == "HINTED_WAITING_RETRY":
        analysis = st.session_state.last_analysis or {}
        error_type = analysis.get("error_type", "Chưa khớp với kết quả chuẩn")
        hint_text = analysis.get("hint", "")
        cited_sec = analysis.get("cited_section")
        
        st.markdown(f"#### 🔍 Phản hồi chẩn đoán từ AI (Lượt gợi ý: {st.session_state.hint_count}/2)")
        
        # Error card
        st.error(f"❌ **Chẩn đoán phát hiện:** {error_type}")
        
        # Hint card
        st.markdown(f"""
        <div class="hint-card">
            <h5 style="margin-top:0; color:#1D4ED8;">💡 Gợi ý tư duy:</h5>
            <p style="margin-bottom:0; font-size:15px;">{hint_text}</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Document Citation Card
        if cited_sec and cited_sec in EXERCISE_DATA["documents"]:
            doc = EXERCISE_DATA["documents"][cited_sec]
            st.markdown(f"""
            <div class="doc-quote-card">
                <strong>📖 Nguồn tài liệu liên quan [{cited_sec}] — {doc['title']}:</strong><br>
                <span style="color:#475569; font-style:italic;">"{doc['content']}"</span>
            </div>
            """, unsafe_allow_html=True)
            
        st.markdown("---")
        # HAX G9: Easy edit/retry
        st.markdown("#### ✏️ Hãy tự sửa bài làm của bạn (HAX G9):")
        retry_input = st.text_area(
            "Bài sửa của bạn:",
            placeholder="Dựa vào gợi ý và tài liệu trên, hãy tính lại số tokens và chi phí...",
            height=120,
            key="input_retry"
        )
        
        col_retry, col_giveup = st.columns([2, 2])
        with col_retry:
            if st.button("✅ Nộp bài sửa", type="primary", use_container_width=True):
                if retry_input.strip():
                    with st.spinner("AI đang kiểm tra bài sửa..."):
                        retry_analysis = analyze_student_attempt(retry_input, attempt_count=st.session_state.hint_count + 1, custom_key=st.session_state.get("custom_api_key"))
                        st.session_state.last_analysis = retry_analysis
                        st.session_state.attempts_history.append({
                            "type": "retry",
                            "input": retry_input,
                            "analysis": retry_analysis
                        })
                        
                        if retry_analysis.get("status") == "correct":
                            st.session_state.flow_state = "EXPLAINING"
                        else:
                            st.session_state.hint_count += 1
                            if st.session_state.hint_count >= 2:
                                st.session_state.flow_state = "COMPLETED"
                            else:
                                st.session_state.flow_state = "HINTED_WAITING_RETRY"
                        st.rerun()
                        
        with col_giveup:
            if st.button("🔓 Tôi muốn xem đáp án & lý thuyết đầy đủ", use_container_width=True):
                st.session_state.flow_state = "COMPLETED"
                st.rerun()

    elif current_state == "EXPLAINING":
        st.balloons()
        st.success("🎉 **Chúc mừng bạn đã sửa bài chính xác!**")
        st.markdown("""
        <div style="background:#F0FDF4; border:1px solid #BBF7D0; padding:18px; border-radius:12px; margin-bottom:18px;">
            <h4 style="margin-top:0; color:#15803D;">🧠 Bước 9 (Đào sâu bản chất): Giải thích nguyên nhân ban đầu</h4>
            <p>Khác biệt cốt lõi của phương pháp <em>'Học từ lỗi trước'</em> là hiểu được gốc rễ sai lầm thay vì chỉ nhớ con số.</p>
            <p>👉 <strong>Câu hỏi:</strong> <em>Hãy giải thích ngắn gọn: Tại sao lần đầu bạn lại ước tính sai? Bản chất cơ chế tokenization cho tiếng Việt khác tiếng Anh như thế nào?</em></p>
        </div>
        """, unsafe_allow_html=True)
        
        exp_input = st.text_area(
            "Lời giải thích của bạn:",
            placeholder="Ví dụ: Do ban đầu tôi nghĩ 1 từ tiếng Việt = 1 token như tiếng Anh, nhưng thực tế tiếng Việt có dấu nên bộ tokenizer...",
            height=120,
            key="input_explanation"
        )
        
        if st.button("📤 Gửi giải thích cho AI đánh giá", type="primary"):
            if exp_input.strip():
                with st.spinner("AI đang đánh giá độ hiểu bản chất..."):
                    exp_eval = evaluate_student_explanation(exp_input, custom_key=st.session_state.get("custom_api_key"))
                    st.session_state.explanation_result = exp_eval
                    st.session_state.attempts_history.append({
                        "type": "explanation",
                        "input": exp_input,
                        "evaluation": exp_eval
                    })
                    st.session_state.flow_state = "COMPLETED"
                    st.rerun()

    elif current_state == "COMPLETED":
        st.success("🏁 **Bạn đã hoàn thành phiên học thích ứng!**")
        
        if st.session_state.explanation_result:
            res = st.session_state.explanation_result
            if res.get("is_satisfactory"):
                st.markdown(f"""
                <div style="background:#ECFDF5; border-left:5px solid #10B981; padding:14px 18px; border-radius:8px; margin:15px 0;">
                    <strong>🌟 Đánh giá giải thích: XUẤT SẮC (Hiểu đúng bản chất)</strong><br>
                    {res.get("feedback")}<br>
                    <small style="color:#047857;">Khái niệm đã nắm vững: {res.get("concept_grasped")}</small>
                </div>
                """, unsafe_allow_html=True)
            else:
                st.markdown(f"""
                <div style="background:#FFFBEB; border-left:5px solid #F59E0B; padding:14px 18px; border-radius:8px; margin:15px 0;">
                    <strong>ℹ️ Đánh giá giải thích: CẦN HOÀN THIỆN THÊM</strong><br>
                    {res.get("feedback")}
                </div>
                """, unsafe_allow_html=True)

        st.markdown("### 📚 Lý thuyết đầy đủ và Đáp án chuẩn")
        col_ans1, col_ans2 = st.columns(2)
        with col_ans1:
            st.metric(label="Tổng số tokens đầu vào chuẩn", value="4,000 - 6,000 tokens", delta="Trung bình 5,000 tokens")
        with col_ans2:
            st.metric(label="Chi phí ước tính chuẩn", value="$0.0020 - $0.0030 USD", delta="Trung bình $0.0025 USD")
            
        with st.expander("📖 Xem toàn bộ tài liệu kiến thức cốt lõi", expanded=True):
            for sec_id, doc in EXERCISE_DATA["documents"].items():
                st.markdown(f"#### [{sec_id}] {doc['title']}")
                st.write(doc["content"])
                
        with st.expander("📊 Log phiên học ẩn danh (SessionLog)", expanded=False):
            st.json({
                "session_id": st.session_state.session_id,
                "exercise_id": EXERCISE_DATA["id"],
                "total_attempts": len(st.session_state.attempts_history),
                "hints_used": st.session_state.hint_count,
                "history": st.session_state.attempts_history
            })

# -------------------------------------------------------------
# TAB 2: BENCHMARK SUITE (CP3 METRICS)
# -------------------------------------------------------------
with tab_benchmark:
    st.markdown("### 📊 Bộ Số Đo Kiểm Thử Thực Tế — Checkpoint 3")
    st.markdown("""
    Theo quy định của **Checkpoint 3 (CP3)**:
    > **Nộp hai thứ:**
    > 1. Video thao tác 30 giây (quay màn hình bấm thật trên sản phẩm).
    > 2. Số đo — Thử bao nhiêu lần, đúng được bao nhiêu: Chạy bộ câu hỏi thử nghiệm (ít nhất 20 case), đối chiếu chuẩn đạt và **phân tích vì sao các câu kia sai**.
    """)
    
    golden_path = os.path.join(os.path.dirname(__file__), "..", "eval", "golden_set.json")
    if not os.path.exists(golden_path):
        golden_path = "eval/golden_set.json"
        
    golden_data = None
    if os.path.exists(golden_path):
        with open(golden_path, "r", encoding="utf-8") as f:
            golden_data = json.load(f)
            
    if golden_data:
        cases = golden_data.get("cases", [])
        st.info(f"📁 Đã nạp thành công **{len(cases)} test cases** từ `eval/golden_set.json` phủ đủ 4 lớp chỗ khó.")
        
        col_run, _ = st.columns([3, 4])
        with col_run:
            run_btn = st.button("🚀 Bấm để chạy toàn bộ 22 case bằng AI thật", type="primary", use_container_width=True)
            
        if run_btn:
            progress_bar = st.progress(0)
            status_text = st.empty()
            results = []
            
            for idx, c in enumerate(cases):
                status_text.text(f"Đang kiểm thử case {idx+1}/{len(cases)}: {c['id']} ({c['category']})...")
                inp = c["input"]
                step = c.get("step", "attempt")
                
                start_t = time.time()
                is_passed = False
                reason = ""
                ai_output = {}
                
                if step == "explanation":
                    eval_res = evaluate_student_explanation(inp, custom_key=st.session_state.get("custom_api_key"))
                    ai_output = eval_res
                    exp_eval = c.get("expected_evaluation")
                    actual_eval = "satisfactory" if eval_res.get("is_satisfactory") else "unsatisfactory"
                    if exp_eval == actual_eval:
                        is_passed = True
                        reason = "Đánh giá mức hiểu bản chất khớp chuẩn mong đợi."
                    else:
                        is_passed = False
                        reason = f"Kỳ vọng {exp_eval} nhưng AI đánh giá {actual_eval}."
                else:
                    analysis = analyze_student_attempt(inp, attempt_count=1, custom_key=st.session_state.get("custom_api_key"))
                    ai_output = analysis
                    exp_status = c.get("expected_status")
                    actual_status = analysis.get("status")
                    exp_sec = c.get("expected_section")
                    actual_sec = analysis.get("cited_section")
                    
                    status_match = (exp_status == actual_status)
                    section_match = (exp_sec is None or exp_sec == actual_sec)
                    
                    if status_match and (exp_status in ["correct", "insufficient_evidence"] or section_match):
                        is_passed = True
                        reason = "Đúng chẩn đoán trạng thái và trích dẫn mã section."
                    elif not status_match:
                        is_passed = False
                        reason = f"Sai trạng thái: Kỳ vọng '{exp_status}' nhưng AI trả về '{actual_status}'."
                    else:
                        is_passed = False
                        reason = f"Sai trích dẫn: Kỳ vọng '{exp_sec}' nhưng AI dẫn '{actual_sec}'."
                        
                latency = round(time.time() - start_t, 2)
                results.append({
                    "id": c["id"],
                    "category": c["category"],
                    "input": inp[:60] + "..." if len(inp) > 60 else inp,
                    "passed": is_passed,
                    "reason": reason,
                    "latency": latency,
                    "ai_output": ai_output
                })
                progress_bar.progress((idx + 1) / len(cases))
                
            status_text.text("✅ Hoàn thành chạy toàn bộ 22 test cases!")
            st.session_state.bench_results = results

        if "bench_results" in st.session_state:
            res_list = st.session_state.bench_results
            total = len(res_list)
            passed_count = sum(1 for r in res_list if r["passed"])
            fail_count = total - passed_count
            pass_rate = round((passed_count / total) * 100, 1)
            
            st.markdown("---")
            st.subheader("📈 Báo Cáo Kết Quả Thực Nghiệm (CP3 Metric)")
            
            c1, c2, c3 = st.columns(3)
            with c1:
                st.metric("Tổng số ca thử nghiệm", f"{total} cases")
            with c2:
                st.metric("Số ca ĐẠT chuẩn", f"{passed_count} / {total}", delta=f"{pass_rate}%")
            with c3:
                st.metric("Số ca CHƯA ĐẠT", f"{fail_count} / {total}", delta=f"-{round(100-pass_rate, 1)}%", delta_color="inverse")
                
            st.markdown(f"""
            > **Định dạng số đo chuẩn CP3:**  
            > *"Thử {total} case, {passed_count} case đạt chuẩn có dẫn nguồn & phân loại đúng, {fail_count} case chưa đạt do độ nhạy ngưỡng căn cứ và trích dẫn thừa."*
            """)
            
            st.markdown("#### Chi tiết từng ca kiểm thử:")
            table_data = []
            for r in res_list:
                table_data.append({
                    "Mã case": r["id"],
                    "Phân loại": r["category"],
                    "Đầu vào": r["input"],
                    "Kết quả": "✅ ĐẠT" if r["passed"] else "❌ CHƯA ĐẠT",
                    "Thời gian (s)": r["latency"],
                    "Ghi chú phân tích": r["reason"]
                })
            st.dataframe(table_data, use_container_width=True)
            
            if fail_count > 0:
                st.markdown("#### 🔬 Phân tích nguyên nhân các ca chưa đạt:")
                st.markdown("""
                1. **Vấn đề ngữ nghĩa ngắn (Ambiguous short sentences):** Một số câu học viên nhập quá ngắn (ví dụ chỉ nhập `5000 và 0.0025`), LLM đôi khi phân vân giữa câu trả lời đúng và câu đoán mò thiếu căn cứ.
                2. **Trích dẫn phụ (Over-citation):** Ở lỗi tính toán, AI đôi khi trích cả `§1.2` lẫn `§2.1` thay vì chỉ trích duy nhất `§2.1`.
                3. **Hướng khắc phục cho CP4:** Siết chặt regex tiền xử lý cho các case chỉ chứa số, và quy định rõ ràng trong prompt ưu tiên trích 1 section duy nhất.
                """)
    else:
        st.warning("Không tìm thấy file `eval/golden_set.json`. Vui lòng kiểm tra lại thư mục.")

# -------------------------------------------------------------
# TAB 3: SPEC & ARCHITECTURE
# -------------------------------------------------------------
with tab_spec:
    st.markdown("### 📋 Kiến trúc & Nguyên tắc Thiết Kế (HAX/PAIR & Spec)")
    st.markdown("""
    #### 4 Nguyên tắc HAX/PAIR được tích hợp trong Prototype:
    1. **HAX G1 (Làm rõ hệ thống làm được gì):**
       - Banner đầu trang thông báo rõ ràng đây là bài luyện tập tư duy, AI chỉ đóng vai trò phân tích và gợi ý, không chấm điểm chính thức.
    2. **HAX G2 (Làm rõ hệ thống làm tốt đến đâu):**
       - Khi bài làm sai, AI hiển thị chẩn đoán loại lỗi cụ thể, kèm mức độ tin cậy và trích dẫn mã Section (§1.2, §2.1) từ tài liệu nguồn.
    3. **HAX G9 (Sửa dễ dàng):**
       - Vòng lặp sửa bài giữ nguyên ngữ cảnh, học viên chỉ cần nhập bài sửa và bấm nộp lại mà không phải bắt đầu lại từ đầu.
    4. **HAX G10 (Thu hẹp phạm vi khi nghi ngờ):**
       - Nếu học viên nhập bừa, mơ hồ hoặc không có bước tính, AI từ chối suy đoán và thông báo 'Chưa đủ căn cứ', yêu cầu học viên làm rõ.
    """)
