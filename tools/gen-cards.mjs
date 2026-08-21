import { writeFileSync, mkdirSync } from 'node:fs';

const OUT = new URL('../assets/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

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
  {
    slug: 'lingyuan', name: 'lingyuan 灵渊', lang: 'Rust', langColor: '#DEA584', idx: '06',
    desc: ['A multiplayer sandbox survival world built for', 'LLM agents to live in. Rust · PixiJS · MCP.'],
    topics: 'agents · game-world · mcp',
  },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const svg = (c) => `<svg width="432" height="132" viewBox="0 0 432 132" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(c.name)} — ${esc(c.desc.join(' '))}">
  <style>
    .mono { font-family: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace; }
    .name { font-size: 15px; font-weight: 600; fill: #E6EDF3; }
    .desc { font-size: 12px; fill: #8B949E; }
    .lang { font-size: 11px; fill: #58636F; }
    .topics { font-size: 10.5px; fill: #B98A44; letter-spacing: 0.3px; }
    .idx { font-size: 10.5px; fill: #333D49; }
  </style>
  <rect x="0.5" y="0.5" width="431" height="131" rx="8" fill="#0A0D12"/>
  <rect x="0.5" y="0.5" width="431" height="131" rx="8" stroke="#1C232E"/>
  <path d="M0.5 22 L0.5 9 Q0.5 0.5 9 0.5 L22 0.5" stroke="#F5A63B" stroke-width="1.5" fill="none" opacity="0.9"/>
  <text class="mono name" x="22" y="36"><tspan fill="#F5A63B">&gt;</tspan> ${esc(c.name)}</text>
  <circle cx="404" cy="31.5" r="4" fill="${c.langColor}"/>
  <text class="mono lang" x="394" y="36" text-anchor="end">${esc(c.lang)}</text>
  <text class="mono desc" x="22" y="66">${esc(c.desc[0])}</text>
  <text class="mono desc" x="22" y="84">${esc(c.desc[1])}</text>
  <text class="mono topics" x="22" y="112">${esc(c.topics)}</text>
  <text class="mono idx" x="410" y="112" text-anchor="end">/${c.idx}</text>
</svg>
`;

for (const c of cards) writeFileSync(`${OUT}card-${c.slug}.svg`, svg(c));
console.log('wrote', cards.length, 'cards to', OUT);
