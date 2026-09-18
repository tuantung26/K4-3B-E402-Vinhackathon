#!/usr/bin/env python3
"""
Evaluation Runner for Track D2: Adaptive AI Tutor (Học từ lỗi trước)
Runs 22 golden set cases against codebase/engine.py and verifies Quality Bar.
"""
import sys
import os
import json
import time

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
CODEBASE_DIR = os.path.join(REPO_ROOT, "codebase")

sys.path.insert(0, CODEBASE_DIR)
os.chdir(CODEBASE_DIR)

from engine import analyze_student_attempt, evaluate_student_explanation

SPOILERS = ["0.0025", "5,000", "5000", "$0.002", "4000", "6000", "0.002", "0.003"]

def check_no_spoiler(result_dict):
    hint = result_dict.get("hint") or ""
    return not any(s in hint for s in SPOILERS)

def main():
    golden_path = os.path.join(CURRENT_DIR, "golden_set.json")
    with open(golden_path, "r", encoding="utf-8") as f:
        cases = json.load(f)

    print("=" * 70)
    print(f"  TRACK D2: EVALUATION RUNNER ({len(cases)} GOLDEN SET CASES)")
    print("=" * 70)

    passed_count = 0
    results = []

    for idx, tc in enumerate(cases, 1):
        cid = tc["id"]
        layer = tc["layer"]
        desc = tc["description"]
        inp = tc["student_input"]
        exp_status = tc["expected_status"]
        exp_section = tc.get("expected_section")
        check_sp = tc.get("check_spoiler", False)

        print(f"[{idx:02d}/{len(cases)}] {cid}: {desc[:45]:<45}", end=" ... ", flush=True)

        case_passed = False
        details = []

        if "Lớp 4" in layer:
            # Reflection evaluation
            res = evaluate_student_explanation(inp)
            is_sat = res.get("is_satisfactory", False)
            exp_sat = (exp_status == "satisfactory")
            case_passed = (is_sat == exp_sat)
            got_status = "satisfactory" if is_sat else "unsatisfactory"
            if not case_passed:
                details.append(f"exp={exp_status}, got={got_status}")
            else:
                details.append("OK")
        else:
            # Attempt analysis
            res = analyze_student_attempt(inp, attempt_count=1)
            got_status = res.get("status", "")
            got_sec = res.get("cited_section")

            status_ok = (got_status == exp_status)
            sec_ok = (got_sec == exp_section) if exp_section else True
            spoiler_ok = check_no_spoiler(res) if check_sp else True

            case_passed = status_ok and sec_ok and spoiler_ok
            if not status_ok:
                details.append(f"status: exp={exp_status} got={got_status}")
            if not sec_ok:
                details.append(f"section: exp={exp_section} got={got_sec}")
            if not spoiler_ok:
                details.append("LỘ ĐÁP ÁN trong hint!")
            if case_passed:
                details.append("OK")

        if case_passed:
            passed_count += 1
            print("✅ PASS")
        else:
            print(f"❌ FAIL ({' | '.join(details)})")

        results.append({
            "id": cid,
            "layer": layer,
            "description": desc,
            "passed": case_passed,
            "details": " | ".join(details)
        })

    pct = (passed_count / len(cases)) * 100
    print("-" * 70)
    print(f"TỔNG KẾT: {passed_count}/{len(cases)} cases ĐẠT ({pct:.1f}%)")
    print(f"Quality Bar (≥65%): {'ĐẠT CHUẨN' if pct >= 65 else 'CHƯA ĐẠT'}")
    print("=" * 70)

    report_path = os.path.join(CURRENT_DIR, "eval_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump({
            "total": len(cases),
            "passed": passed_count,
            "accuracy_pct": round(pct, 1),
            "quality_bar_met": pct >= 65,
            "results": results
        }, f, ensure_ascii=False, indent=2)
    print(f"Báo cáo chi tiết đã lưu tại: {report_path}")

if __name__ == "__main__":
    main()
