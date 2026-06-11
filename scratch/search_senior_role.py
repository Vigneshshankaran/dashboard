import json

log_path = r"C:\Users\vigne\.gemini\antigravity\brain\7d98ddb3-4831-4d1a-b2a1-84af799f7b1a\.system_generated\logs\transcript.jsonl"

print("Searching for SENIOR role JSON payloads...")
with open(log_path, 'r', encoding='utf-8') as infile:
    for line in infile:
        try:
            data = json.loads(line)
            content = data.get("content", "")
            if '"role":"SENIOR"' in content or '"role": "SENIOR"' in content:
                print(f"=== Match Step {data.get('step_index')} ===")
                # find indices of role:SENIOR
                idx = content.find("role")
                start = max(0, idx - 500)
                end = min(len(content), idx + 1500)
                print(content[start:end])
                print("-" * 50)
        except Exception:
            pass
