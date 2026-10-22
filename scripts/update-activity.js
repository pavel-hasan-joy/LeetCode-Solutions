const fs = require('fs');
const path = require('path');

const USERNAME = 'pavel-hasan-joy';
const THEME = 'tokyonight';
const OUTPUT_PATH = path.join(__dirname, '..', 'assets', 'submission-activity.svg');

async function fetchWithRetry(url, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GitHubActions/1.0',
          'Cache-Control': 'no-cache'
        }
      });
      if (res.ok) {
        return await res.text();
      }
      console.warn(`Attempt ${i + 1} failed with status: ${res.status}`);
    } catch (err) {
      console.warn(`Attempt ${i + 1} error: ${err.message}`);
    }
    if (i < retries - 1) {
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts.`);
}

async function updateActivity() {
  console.log(`Fetching latest activity graph for ${USERNAME}...`);
  const cardUrl = `https://github-readme-leetcode-card.romitsagu.com/${USERNAME}?theme=${THEME}&show=graph`;
  
  const fullSvg = await fetchWithRetry(cardUrl);

  const styleMatch = fullSvg.match(/<style>([\s\S]*?)<\/style>/);
  const defsMatch = fullSvg.match(/<defs>([\s\S]*?)<\/defs>/);
  const activityMatch = fullSvg.match(/<g transform="translate\(30, 215\)">([\s\S]*?)<\/g>\s*<\/svg>/);

  if (!activityMatch) {
    throw new Error('Could not locate Submission Activity section in fetched SVG.');
  }

  const croppedSvg = `<svg width="500" height="175" viewBox="0 0 500 175" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Submission Activity">
  <title>${USERNAME}'s LeetCode Submission Activity</title>
  <style>
${styleMatch ? styleMatch[1].trim() : ''}
  </style>
  <defs>
${defsMatch ? defsMatch[1].trim() : ''}
  </defs>
  <rect data-testid="card-bg" x="0.5" y="0.5" rx="4.5" 
        height="174" width="499" 
        fill="url(#cardGradient)" 
        stroke="#1a1b27" 
        stroke-width="1" 
        stroke-opacity="1" 
        filter="url(#dropShadow)"/>
  <g transform="translate(30, 32)">
    ${activityMatch[1].trim()}
  </g>
</svg>
`;

  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, croppedSvg, 'utf8');
  console.log(`Successfully generated and saved ${OUTPUT_PATH} (${croppedSvg.length} bytes)`);
}

updateActivity().catch(err => {
  console.error('Update failed:', err);
  process.exit(1);
});
