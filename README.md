# og · OGxLuxuries' Claude plugins

One marketplace for my Claude Code / Claude desktop plugins.

```bash
claude plugin marketplace add OGxLuxuries/claude-plugins
claude plugin install codex-subagent@og
claude plugin install zen-garden@og
```

(or in Claude: `/plugin marketplace add OGxLuxuries/claude-plugins`, then `/plugin install <name>@og`)

| Plugin | What it does | Source |
| --- | --- | --- |
| `codex-subagent` | Claude delegates bounded subtasks to OpenAI Codex (`codex exec`), shown live in a Terminal tab, then verifies the result. | [OGxLuxuries/codex-run](https://github.com/OGxLuxuries/codex-run) |
| `zen-garden` | A calm Japanese-garden look for the Claude desktop app: shoji paper, moss green, bamboo in the wind, a koi pond. | [`plugins/zen-garden`](plugins/zen-garden) |

Third-party marketplaces have auto-update off by default: run `claude`, open `/plugin` → Marketplaces → `og`, and enable it.

## Adding a plugin

- Plugin kept in this repo: put it under `plugins/<name>/` (with `.claude-plugin/plugin.json`) and add `{ "name": "<name>", "source": "./plugins/<name>" }` to `.claude-plugin/marketplace.json`.
- Plugin with its own repo: add `{ "name": "<name>", "source": { "source": "github", "repo": "OGxLuxuries/<repo>" } }`.

Bump the plugin's `version` in its `plugin.json` to ship an update.
