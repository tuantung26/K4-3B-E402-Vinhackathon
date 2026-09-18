"""
Test runner cho AI Tutor Engine - Hoc tu loi truoc (Track D2)
10 test cases phu 4 lop loi + Happy path
"""
import sys, os, json, time

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
os.chdir(os.path.join(os.path.dirname(__file__), '..'))

from engine import analyze_student_attempt, evaluate_student_explanation

TEST_CASES = [
    # Lop 1 - Khai niem sai
    {
        "id": "TC-01", "layer": "Lop 1 - Khai niem",
        "desc": "Coi 1 tu tieng Viet = 1 token",
        "type": "analyze",
        "input": "100 cau x 20 tu = 2000 tu = 2000 tokens. Chi phi = 2000/1000000 * 0.5 = $0.001",
        "expected_status": "incorrect", "expected_section": "§1.2", "check_spoiler": True,
    },
    {
        "id": "TC-02", "layer": "Lop 1 - Khai niem",
        "desc": "Ap dung he so tieng Anh 1.3 cho tieng Viet",
        "type": "analyze",
        "input": "Tong tu = 100 x 20 = 2000 tu. Nhan 1.3 (he so tieng Anh) = 2600 tokens. Chi phi = 2600/1000000 * 0.5 = $0.0013",
        "expected_status": "incorrect", "expected_section": "§1.2", "check_spoiler": True,
    },
    # Lop 2 - Loi cong thuc
    {
        "id": "TC-03", "layer": "Lop 2 - Cong thuc",
        "desc": "Chia cho 1000 thay vi 1,000,000 (sai mau so)",
        "type": "analyze",
        "input": "Tong token = 5000. Chi phi = 5000 / 1000 * 0.5 = $2.5",
        "expected_status": "incorrect", "expected_section": "§2.1", "check_spoiler": True,
    },
    {
        "id": "TC-04", "layer": "Lop 2 - Cong thuc",
        "desc": "Quen nhan 100 cau (chi tinh 1 cau)",
        "type": "analyze",
        "input": "1 cau x 20 tu x 2.5 = 50 tokens. Chi phi = 50/1000000 * 0.5 = $0.000025",
        "expected_status": "incorrect", "expected_section": "§2.1", "check_spoiler": True,
    },
    # Lop 3 - Thieu can cu
    {
        "id": "TC-05", "layer": "Lop 3 - Thieu can cu",
        "desc": "Nhap ky tu rac (bo cuoc)",
        "type": "analyze",
        "input": "asdfghjkl",
        "expected_status": "insufficient_evidence", "expected_section": None, "check_spoiler": False,
    },
    {
        "id": "TC-06", "layer": "Lop 3 - Thieu can cu",
        "desc": "Doan so khong co buoc tinh",
        "type": "analyze",
        "input": "Em chiu, chac chi phi khoang $1 thoi.",
        "expected_status": "insufficient_evidence", "expected_section": None, "check_spoiler": False,
    },
    # Happy Path
    {
        "id": "TC-07", "layer": "Happy Path",
        "desc": "Bai lam dung - he so 2.5 token/tu",
        "type": "analyze",
        "input": "100 cau x 20 tu = 2000 tu. Tieng Viet co dau nen 2.5 tokens/tu = 5000 tokens. Chi phi = 5000/1000000 * 0.5 = $0.0025",
        "expected_status": "correct", "expected_section": None, "check_spoiler": False,
    },
    {
        "id": "TC-08", "layer": "Happy Path",
        "desc": "Bai lam dung - he so 2.0 token/tu",
        "type": "analyze",
        "input": "Tong tu = 100 x 20 = 2000 tu. Tieng Viet ton khoang 2 tokens/tu = 4000 tokens. Chi phi = 4000/1000000 * 0.5 = $0.002",
        "expected_status": "correct", "expected_section": None, "check_spoiler": False,
    },
    # Lop 4 - Reflection
    {
        "id": "TC-09", "layer": "Lop 4 - Reflection",
        "desc": "Giai thich thau dao ve BPE va dau thanh",
        "type": "explain",
        "input": "Luc dau em tuong 1 tu tieng Viet = 1 token nhu tieng Anh. Nhung thuc ra tieng Viet co dau thanh, tokenizer dung BPE nen tach nhieu subword hon, thuong 2-3 tokens/tu. Em da tinh thieu 2-3 lan do khong biet dac thu nay.",
        "expected_satisfactory": True,
    },
    {
        "id": "TC-10", "layer": "Lop 4 - Reflection",
        "desc": "Giai thich chep vet, khong neu ban chat",
        "type": "explain",
        "input": "Vi luc nay em tinh sai, AI bao sai thi em sua lai theo goi y roi ra dung.",
        "expected_satisfactory": False,
    },
]

SPOILERS = ["0.0025", "5,000", "5000", "$0.002", "4000", "6000", "0.002", "0.003"]

def no_spoiler(r):
    hint = r.get("hint") or ""
    return not any(p in hint for p in SPOILERS)

results = []
print("=" * 65)
print("  AI TUTOR ENGINE — TEST RUNNER (10 cases)")
print("=" * 65)
print()

for i, tc in enumerate(TEST_CASES, 1):
    print(f"[{i:02d}/10] {tc['id']} — {tc['desc'][:50]}", end=" ... ", flush=True)
    row = {"id": tc["id"], "layer": tc["layer"], "desc": tc["desc"],
           "passed": False, "details": ""}
    try:
        if tc["type"] == "analyze":
            r = analyze_student_attempt(tc["input"], 1)
            got_status = r.get("status", "")
            got_section = r.get("cited_section")
            s_ok = got_status == tc["expected_status"]
            sec_ok = (got_section == tc["expected_section"]) if tc["expected_section"] else True
            ns_ok = no_spoiler(r) if tc["check_spoiler"] else True
            row["passed"] = s_ok and sec_ok and ns_ok
            issues = []
            if not s_ok: issues.append(f"status exp={tc['expected_status']} got={got_status}")
            if not sec_ok: issues.append(f"section exp={tc['expected_section']} got={got_section}")
            if not ns_ok: issues.append("LOD DAP AN trong hint!")
            row["details"] = " | ".join(issues) or "OK - tat ca khop"
            row["got_status"] = got_status
            row["got_section"] = got_section
            row["hint_preview"] = (r.get("hint") or "")[:70]
        else:
            r = evaluate_student_explanation(tc["input"])
            got_sat = r.get("is_satisfactory")
            row["passed"] = (got_sat == tc["expected_satisfactory"])
            row["details"] = "OK - danh gia phan tu dung" if row["passed"] else f"sat exp={tc['expected_satisfactory']} got={got_sat}"
            row["is_satisfactory"] = got_sat
            row["feedback"] = (r.get("feedback") or "")[:70]
    except Exception as e:
        row["details"] = f"ERROR: {e}"
    results.append(row)
    print("PASS" if row["passed"] else "FAIL")
    if not row["passed"]:
        print(f"        -> {row['details']}")
    time.sleep(1.2)

passed = sum(1 for r in results if r["passed"])
total = len(results)
pct = passed / total * 100

print()
print("=" * 65)
print(f"  KET QUA CUOI: {passed}/{total} cases dat ({pct:.1f}%)")
print("=" * 65)
print()
print(f"{'ID':<8} {'Layer':<25} {'KQ':<6} Ghi chu")
print("-" * 65)
for r in results:
    icon = "PASS" if r["passed"] else "FAIL"
    print(f"{r['id']:<8} {r['layer']:<25} {icon:<6} {r['details'][:35]}")
print()

report = {
    "summary": {"passed": passed, "total": total, "pct": round(pct, 1),
                "quality_bar_65": pct >= 65},
    "results": results
}
report_path = os.path.join(os.path.dirname(__file__), "test_report.json")
with open(report_path, "w", encoding="utf-8") as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

verdict = "VUOT Quality Bar (>=65%) — Dat tieu chuan!" if pct >= 65 else "CHUA dat Quality Bar (65%) — Can tinh chinh."
print(f"  => {verdict}")
print(f"  => Bao cao: eval/test_report.json")
