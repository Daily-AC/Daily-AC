import { writeFileSync, mkdirSync, rmSync } from 'node:fs';

const OUT = new URL('../assets/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const INK = { bg: '#0A0D12', edge: '#1C232E', amber: '#F5A63B', dim: '#58636F', text: '#E6EDF3', body: '#8B949E', topic: '#B98A44', faint: '#333D49', led: '#4CC38A' };

// Lead ship: full width, so the description gets room to actually say what it does.
const lead = {
  slug: 'omnireach', name: 'omnireach', lang: 'Python', langColor: '#3572A5', idx: '01',
  desc: [
    'Search and read the login-walled Chinese internet for AI agents — WeChat, Xiaohongshu, Douyin and Bilibili,',
    'plus Twitter, Reddit, HackerNews and RSS. An MCP server and a CLI, driven through your own logged-in browser.',
  ],
  topics: 'search · mcp · cli',
};

// The rest of mine, half width, two per row.
const cards = [
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

// Not mine. One panel, one row each — deliberately lighter than the cards above,
// because these are other people's repos and should not compete with my own work.
// Bar for the list is a MERGED pull request. An open or closed-unmerged PR does not count:
// GitHub's own "contributor" list counts those, and copying it would be a claim I can't back.
const contribs = [
  { owner: 'stablyai',         name: 'orca',                          pr: '#7223', did: 'manual network address takes any hostname + :port', stars: '55.9k' },
  { owner: 'jackwener',        name: 'OpenCLI',                       pr: '#1759', did: 'added the Douyin keyword video search command',     stars: '28.7k' },
  { owner: 'xpzouying',        name: 'xiaohongshu-mcp',               pr: '#461',  did: 'XHS_PROXY read from env, applied to the browser',   stars: '15.5k' },
  { owner: 'HUANGCHIHHUNGLeo', name: 'claude-real-video',             pr: '#25',   did: "URL runs use the source's own captions, not Whisper", stars: '2.1k' },
  // Not code. Says so, and sits last rather than first — sorting this to the top by
  // star count would misrepresent what the whole list is.
  { owner: '1c7',              name: 'chinese-independent-developer', pr: '#1062', did: 'listed omnireach in the directory — not code',      stars: '61.1k' },
];

// Live star counts, so the badges don't rot between regenerations. Falls back to the
// value above and names what failed — a stale number is fine, a silent one is not.
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
const STAR = 'M5 0 L6.176 3.382 L9.755 3.455 L6.902 5.618 L7.939 9.045 L5 7 L2.061 9.045 L3.098 5.618 L0.245 3.455 L3.824 3.382 Z';
// Star glyph sits off the badge text width (10.5px mono ~ 6.31px/char) so the gap
// stays constant whether the count reads "2.1k" or "55.9k".
const star = (x, text, y) => `<g transform="translate(${(x - text.length * 6.31 - 12.5).toFixed(1)} ${y}) scale(0.85)" fill="${INK.topic}"><path d="${STAR}"/></g>`;

const FONT = `.mono { font-family: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace; }`;

const frame = (w, h, seed) => `
  <style>
    ${FONT}
    .name { font-size: 15px; font-weight: 600; fill: ${INK.text}; }
    .desc { font-size: 12px; fill: ${INK.body}; }
    .lang { font-size: 11px; fill: ${INK.dim}; }
    .topics { font-size: 10.5px; fill: ${INK.topic}; letter-spacing: 0.3px; }
    .idx { font-size: 10.5px; fill: ${INK.faint}; }
    .led { animation: led 2.6s ease-in-out ${seed * 0.45}s infinite; }
    @keyframes led { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
    .sheen { animation: sweep 9s linear ${seed * 1.5}s infinite; }
    @keyframes sweep { 0% { transform: translateX(0); } 16% { transform: translateX(${w + 260}px); } 100% { transform: translateX(${w + 260}px); } }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } .sheen { display: none; } }
  </style>
  <defs>
    <clipPath id="c"><rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="8"/></clipPath>
    <linearGradient id="s" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${INK.text}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="${INK.text}" stop-opacity="0.05"/>
      <stop offset="1" stop-color="${INK.text}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="8" fill="${INK.bg}"/>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="8" stroke="${INK.edge}"/>
  <g clip-path="url(#c)"><rect class="sheen" x="-190" y="-20" width="70" height="${h + 40}" fill="url(#s)" /></g>
  <path d="M0.5 22 L0.5 9 Q0.5 0.5 9 0.5 L22 0.5" stroke="${INK.amber}" stroke-width="1.5" fill="none" opacity="0.9"/>`;

const shipCard = (c, w) => `<svg width="${w}" height="132" viewBox="0 0 ${w} 132" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(c.name)} — ${esc(c.desc.join(' '))}">${frame(w, 132, Number(c.idx) - 1)}
  <text class="mono name" x="22" y="36"><tspan fill="${INK.amber}">&gt;</tspan> ${esc(c.name)}</text>
  <circle cx="${w - 28}" cy="31.5" r="4" fill="${c.langColor}"/>
  <text class="mono lang" x="${w - 38}" y="36" text-anchor="end">${esc(c.lang)}</text>
  <text class="mono desc" x="22" y="66">${esc(c.desc[0])}</text>
  <text class="mono desc" x="22" y="84">${esc(c.desc[1])}</text>
  <text class="mono topics" x="22" y="112">${esc(c.topics)}</text>
  <circle class="led" cx="${w - 56}" cy="108" r="2.6" fill="${INK.led}"/>
  <text class="mono idx" x="${w - 22}" y="112" text-anchor="end">/${c.idx}</text>
</svg>
`;

const W = 880, ROW0 = 82, STEP = 32;
const H = ROW0 + STEP * (contribs.length - 1) + 30;

const panel = () => `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Merged contributions to repositories I do not own: ${esc(contribs.map((c) => `${c.owner}/${c.name} ${c.pr} ${c.did}`).join('; '))}">${frame(W, H, 2)}
  <style>
    .title { font-size: 11.5px; fill: ${INK.body}; }
    .meta { font-size: 10.5px; fill: ${INK.dim}; }
    .owner { font-size: 12px; fill: ${INK.dim}; }
    .repo { font-size: 12px; font-weight: 600; fill: ${INK.text}; }
    .pr { font-size: 11px; fill: ${INK.topic}; }
    .did { font-size: 11px; fill: ${INK.body}; }
    .stars { font-size: 10.5px; fill: ${INK.topic}; }
  </style>
  <text class="mono title" x="26" y="34"><tspan fill="${INK.amber}">$</tspan> ls ~/contributions --merged</text>
  <circle class="led" cx="${W - 96}" cy="30" r="2.6" fill="${INK.led}"/>
  <text class="mono meta" x="${W - 26}" y="34" text-anchor="end">${contribs.length} merged</text>
  <line x1="22" y1="50" x2="${W - 22}" y2="50" stroke="${INK.edge}"/>
${contribs
  .map((c, i) => {
    const y = ROW0 + i * STEP;
    return `  <text class="mono" x="26" y="${y}"><tspan class="owner">${esc(c.owner)}/</tspan><tspan class="repo">${esc(c.name)}</tspan></text>
  <text class="mono pr" x="306" y="${y}">${esc(c.pr)}</text>
  <text class="mono did" x="366" y="${y}">${esc(c.did)}</text>
  ${star(W - 26, c.stars, y - 8)}<text class="mono stars" x="${W - 26}" y="${y}" text-anchor="end">${esc(c.stars)}</text>`;
  })
  .join('\n')}
</svg>
`;

await refreshStars();
for (const f of ['card-omnireach', 'contrib-orca', 'contrib-opencli', 'contrib-xiaohongshu-mcp', 'contrib-claude-real-video', 'contrib-chinese-independent-developer'])
  rmSync(`${OUT}${f}.svg`, { force: true });
// Distinct filename, not card-*.svg: this is the 880-wide artifact, and GitHub's camo
// proxy caches by URL — reusing the old name serves the stale 432-wide file stretched to
// double size. Any future change of a card's dimensions needs a new filename too.
writeFileSync(`${OUT}lead-${lead.slug}.svg`, shipCard(lead, 880));
for (const c of cards) writeFileSync(`${OUT}card-${c.slug}.svg`, shipCard(c, 432));
writeFileSync(`${OUT}contributions.svg`, panel());
console.log(`wrote 1 lead card, ${cards.length} ship cards and a ${contribs.length}-row contributions panel to ${OUT}`);
