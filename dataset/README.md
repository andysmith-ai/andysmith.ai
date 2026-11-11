---
license: cc-by-4.0
language:
  - en
pretty_name: Andy Smith — Posts
configs:
  - config_name: default
    data_files:
      - split: train
        path: data/*.jsonl
---

# Andy Smith — Posts

Every public post by [Andy Smith](https://andysmith.ai), collected in one open
dataset. Why: <https://andysmith.ai/2026/Nov/11/post-dataset/>

The dataset is rebuilt from source on every change; each version is a commit
in this repository.

## Sources

| Platform | File | Status |
| --- | --- | --- |
| [andysmith.ai](https://andysmith.ai) | `data/site.jsonl` | complete, updated on every publish |

Social platforms will be added later.

## Fields

One row is one publication on one platform.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Stable ID prefixed with the platform, e.g. `site:2026/Nov/11/post-dataset` |
| `platform` | string | `site` |
| `url` | string | Public URL of the publication |
| `published_at` | string | Publication time, ISO 8601 UTC |
| `title` | string, nullable | Title, where the platform has one |
| `text` | string | Body as Markdown; links and images use absolute URLs |
| `link` | string, nullable | External URL a link post comments on |
| `media` | list of `{type, url, text}` | Attached media; `text` is its text form (alt text, transcript), nullable |
| `tags` | list of string | Author-assigned topics |

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Attribute to Andy
Smith with a link to <https://andysmith.ai>.
