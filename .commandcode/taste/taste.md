# Taste

## Workflow
- Prefers an explicit plan → build → test workflow: asks for planning first, then building, then testing, and emphasizes "make sure there is no mistake" — i.e. thorough verification (tests/typecheck/lint run until clean) before considering work done. Confidence: 0.9

## Library / API design
- When building libraries or SDKs, prioritizes an intuitive, easy-to-use developer experience ("the library should be intuitive and easy to use") — ergonomics of the public API matter as much as correctness. Confidence: 0.8

## Environment / tooling
- Works on Windows: the shell does not expand PowerShell syntax like `$env:TEMP` and lacks Unix tools (grep, pipes with grep). Use full absolute paths with forward slashes (e.g. `C:/Users/ridho/...`) and the local grep tool instead of shell grep; use `C:/Users/ridho/AppData/Local/Temp/commandcode/` as the scratchpad for downloaded/temp files. Confidence: 0.85
