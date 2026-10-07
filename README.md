# rightmove-cli

Standalone CLI for scraping Rightmove search results and listing details.

Requires Node.js >= 20.

[How to install](#how-to-install) | [How to use](#how-to-use) | [How it works](#how-it-works) | [Credits](#credits) | [Legal bits](#legal-bits)

## How to install

```bash
npm install
npm run build        # compiles src/ → dist/
```

Run compiled: `node dist/cli.js …` (or `npm link` to get the `rightmove` command on PATH).
Run from source without building: `npm run dev -- …` (tsx).

## How to use

```bash
# Build a search URL (uses Rightmove's typeahead to resolve the location)
rightmove search-url "SW1A 1AA" --building-type F --sort-by newest

# Fetch listings for a postcode (the URL is built from these filters, never
# taken raw — see SSRF note below)
rightmove listings "NG1 1AA" --max-pages 2 --min-bedrooms 2
rightmove listings "NG1 1AA" --json

# Fetch one listing's full detail by numeric ID
rightmove listing 123456789
rightmove listing 123456789 --include-raw
```

## How it works

- **search-url / location**: Rightmove search needs an internal location id
  (`OUTCODE^620`). The undocumented typeahead endpoint
  (`los.rightmove.co.uk/typeahead`) resolves a postcode/outcode to one.
- **listings**: fetches the search page, reads the embedded Next.js
  `__NEXT_DATA__` JSON (`props.pageProps.searchResults`), follows pagination.
- **listing**: reads `window.__PAGE_MODEL` from the detail page. Its `data` is a
  pointer-graph (a flat node array whose values are indices into itself), which
  is dereferenced from node 0.

## Credits

- **[commander](https://www.npmjs.com/package/commander)** — argument parsing for the CLI
- **[tsx](https://www.npmjs.com/package/tsx)** / **[TypeScript](https://www.typescriptlang.org/)** — the build and dev toolchain
- Node.js's built-in [`node:test`](https://nodejs.org/api/test.html) runner — tests without a framework

## Legal bits

### Disclaimer
This is an unofficial tool, not affiliated with or endorsed by Rightmove, built
and published for educational purposes only. It must not be used in any way that
breaches [Rightmove's terms of use](https://www.rightmove.co.uk/this-site/terms-of-use.html).

The author accepts no liability for how this software is used; you are solely
responsible for your use of it.

"Rightmove" is a trademark of Rightmove Group Limited (company number 03997679).
This project is not affiliated with, endorsed by, or sponsored by Rightmove
Group Limited. All trademarks, service marks, and trade names are the property
of their respective owners, and are used here only for identification and
descriptive purposes.

### License 
Copyright 2026 Denis Zhmurenko

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
