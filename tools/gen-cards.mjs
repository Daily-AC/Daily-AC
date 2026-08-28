import { writeFileSync, mkdirSync } from 'node:fs';

const OUT = new URL('../assets/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

// Mine.
const cards = [
  {
    slug: 'omnireach', name: 'omnireach', lang: 'Python', langColor: '#3572A5', idx: '01',
    desc: ['Search and read the login-walled Chinese internet', 'for AI agents. WeChat · XHS · Douyin · Bilibili.'],
    topics: 'search · mcp · cli',
  },
  {
    slug: 'wanctl', name: 'wanctl', lang: 'Go', langColor: '#00ADD8', idx: '02',
    desc: ['Cross-WAN remote device control for humans and', 'AI agents. E2E-encrypted exec · files · logs.'],
    topics: 'remote-control · e2ee · relay',
  },
  {
    slug: 'cfx', name: 'cfx', lang: 'Go', langColor: '#00ADD8', idx: '03',
    desc: ['Codeforces training CLI for humans and coding', 'agents — pull, test and submit from the terminal.'],
    topics: 'competitive-programming · cli',
  },
  {
    slug: 'fuxi', name: 'fuxi 伏羲', lang: 'Rust', langColor: '#DEA584', idx: '04',
    desc: ['Orchestration platform for a personal legion of', 'AI agents, with A2A messaging. Written in Rust.'],
    topics: 'agents · orchestration · a2a',
  },
  {
    slug: 'webai-cli', name: 'webai-cli', lang: 'JavaScript', langColor: '#F1E05A', idx: '05',
    desc: ['Reverse-engineered CLI for Grok · ChatGPT · Claude', 'Gemini · DeepSeek web APIs. Chat, image, video.'],
    topics: 'llm · cli · reverse-engineering',
  },
];

// Not mine. Kept in a separate list on purpose: the ships above are things I built,
// these are other people's projects where a patch of mine got merged. The card says whose.
// Bar for this list is a MERGED pull request — an opened or closed-unmerged PR does not count.
const contribs = [
  {
    slug: 'orca', owner: 'stablyai', name: 'orca', lang: 'TypeScript', langColor: '#3178C6', stars: '55.9k',
    desc: ['Merged #7223 — manual network address entry now', 'accepts any hostname, with an optional :port.'],
    topics: 'agent-ade · networking',
  },
  {
    slug: 'opencli', owner: 'jackwener', name: 'OpenCLI', lang: 'JavaScript', langColor: '#F1E05A', stars: '28.7k',
    desc: ['Merged #1759 — added the Douyin search command', 'for keyword video lookup.'],
    topics: 'browser-cli · douyin · search',
  },
  {
    slug: 'xiaohongshu-mcp', owner: 'xpzouying', name: 'xiaohongshu-mcp', lang: 'Go', langColor: '#00ADD8', stars: '15.5k',
    desc: ['Merged #461 — XHS_PROXY is now read from the', 'environment and applied to the browser.'],
    topics: 'mcp · proxy · browser',
  },
  {
    slug: 'claude-real-video', owner: 'HUANGCHIHHUNGLeo', name: 'claude-real-video', lang: 'Python', langColor: '#3572A5', stars: '2.1k',
    desc: ["Merged #25 — URL runs pull the source's own", 'captions instead of re-transcribing with Whisper.'],
    topics: 'video · captions · yt-dlp',
  },
  {
    // Not a code contribution and the card says so. Last in the list on purpose:
    // leading with the biggest star count would misrepresent what this one is.
    slug: 'chinese-independent-developer', owner: '1c7', name: 'chinese-independent-developer', stars: '61.1k',
    desc: ['Listed, not coded — #1062 added omnireach to this', 'directory of Chinese independent developer projects.'],
    topics: 'directory · listed · omnireach',
  },
];

// Live star counts, so the badges don't rot between regenerations. Falls back to the
// value above and says which one failed — a stale number is fine, a silent one is not.
async function refreshStars() {
  for (const c of contribs) {
    try {
      const r = await fetch(`https://api.github.com/repos/${c.owner}/${c.name}`, {
        headers: { accept: 'application/vnd.github+json', 'user-agent': 'daily-ac-profile-cards' },
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const n = (await r.json()).stargazers_count;
      c.stars = n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
    } catch (e) {
      console.warn(`! ${c.owner}/${c.name}: star count not refreshed (${e.message}) — keeping ${c.stars}`);
    }
  }
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const chrome = (seed) => `
  <style>
    .mono { font-family: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace; }
    .name { font-size: 15px; font-weight: 600; fill: #E6EDF3; }
    .path { font-size: 13.5px; font-weight: 600; fill: #E6EDF3; }
    .owner { font-size: 13.5px; font-weight: 600; fill: #58636F; }
    .desc { font-size: 12px; fill: #8B949E; }
    .lang { font-size: 11px; fill: #58636F; }
    .topics { font-size: 10.5px; fill: #B98A44; letter-spacing: 0.3px; }
    .stars { font-size: 10.5px; fill: #B98A44; }
    .idx { font-size: 10.5px; fill: #333D49; }
    .led { animation: led 2.6s ease-in-out ${seed * 0.45}s infinite; }
    @keyframes led { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
    .sheen { animation: sweep 9s linear ${seed * 1.5}s infinite; }
    @keyframes sweep { 0% { transform: translateX(0); } 16% { transform: translateX(690px); } 100% { transform: translateX(690px); } }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } .sheen { display: none; } }
  </style>
  <defs>
    <clipPath id="card"><rect x="0.5" y="0.5" width="431" height="131" rx="8"/></clipPath>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#E6EDF3" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#E6EDF3" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#E6EDF3" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0.5" y="0.5" width="431" height="131" rx="8" fill="#0A0D12"/>
  <rect x="0.5" y="0.5" width="431" height="131" rx="8" stroke="#1C232E"/>
  <g clip-path="url(#card)"><rect class="sheen" x="-190" y="-20" width="70" height="172" fill="url(#shine)" /></g>
  <path d="M0.5 22 L0.5 9 Q0.5 0.5 9 0.5 L22 0.5" stroke="#F5A63B" stroke-width="1.5" fill="none" opacity="0.9"/>`;

const body = (c) => `${c.lang ? `
  <circle cx="404" cy="31.5" r="4" fill="${c.langColor}"/>
  <text class="mono lang" x="394" y="36" text-anchor="end">${esc(c.lang)}</text>` : ''}
  <text class="mono desc" x="22" y="66">${esc(c.desc[0])}</text>
  <text class="mono desc" x="22" y="84">${esc(c.desc[1])}</text>
  <text class="mono topics" x="22" y="112">${esc(c.topics)}</text>`;

const open = (label) =>
  `<svg width="432" height="132" viewBox="0 0 432 132" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}">`;

const svg = (c) => `${open(`${c.name} — ${c.desc.join(' ')}`)}${chrome(Number(c.idx) - 1)}
  <text class="mono name" x="22" y="36"><tspan fill="#F5A63B">&gt;</tspan> ${esc(c.name)}</text>${body(c)}
  <circle class="led" cx="376" cy="108" r="2.6" fill="#4CC38A"/>
  <text class="mono idx" x="410" y="112" text-anchor="end">/${c.idx}</text>
</svg>
`;

// Star glyph is placed from the badge text width (10.5px mono ~ 6.31px/char) so the
// gap stays constant whether the count is "2.1k" or "55.9k".
// Same frame, but the owner is spelled out in a dimmer weight and the index is
// replaced by the upstream star count — this repo is somebody else's.
const svgContrib = (c, i) => `${open(`${c.owner}/${c.name} — ${c.desc.join(' ')}`)}${chrome(i)}
  <text class="mono" x="22" y="36"><tspan class="name" fill="#F5A63B">&gt;</tspan> <tspan class="owner">${esc(c.owner)}/</tspan><tspan class="path">${esc(c.name)}</tspan></text>${body(c)}
  <g transform="translate(${(410 - c.stars.length * 6.31 - 12.5).toFixed(1)} 104) scale(0.85)" fill="#B98A44"><path d="M5 0 L6.176 3.382 L9.755 3.455 L6.902 5.618 L7.939 9.045 L5 7 L2.061 9.045 L3.098 5.618 L0.245 3.455 L3.824 3.382 Z"/></g>
  <text class="mono stars" x="410" y="112" text-anchor="end">${esc(c.stars)}</text>
</svg>
`;

await refreshStars();
for (const c of cards) writeFileSync(`${OUT}card-${c.slug}.svg`, svg(c));
contribs.forEach((c, i) => writeFileSync(`${OUT}contrib-${c.slug}.svg`, svgContrib(c, i)));
console.log(`wrote ${cards.length} ship cards and ${contribs.length} contribution cards to ${OUT}`);
