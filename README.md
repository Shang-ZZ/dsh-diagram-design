# dsh-diagram-design

Diagram Design tools and gallery for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): export HTML diagrams to SVG/PNG, import from draw.io / Mermaid / Excalidraw, validate output, and browse a gallery of 45 diagram types.

## What it does

A DeepSeek Harness bundle with four agent tools and a web gallery panel:

| Tool | What it does |
|---|---|
| `diagram_export` | Export a diagram-design HTML file to a standalone SVG and/or PNG. |
| `diagram_extract` | Parse a draw.io / Mermaid / Excalidraw file into a normalized digest for redrawing. |
| `diagram_self_check` | Validate a generated diagram HTML file (accessible-SVG, single-file safety, viewBox). |
| `diagram_doctor` | Diagnose the environment: bundled scripts, python3, Playwright availability. |

The gallery panel (sidebar "Diagram Gallery") lists the 45 diagram types with
live example previews.

## Install

```bash
dsh plugin add github:Shang-ZZ/dsh-diagram-design
```

PNG export is the only feature that needs an extra dependency, installed once
on demand (never automatically):

```bash
pip install playwright && playwright install chromium
```

## Attribution

The bundled Python scripts and example diagrams come from
[`cathrynlavery/diagram-design`](https://github.com/cathrynlavery/diagram-design)
(MIT, Copyright (c) 2025 Cathryn Lavery). See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## License

[MIT](LICENSE)
