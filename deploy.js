import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log("🚀 Building Eleventy site...");
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (e) {
  console.error("❌ Build failed");
  process.exit(1);
}

const siteDir = path.resolve('_site');

console.log("📝 Generating .gitignore to exclude massive files from deployment...");
// We exclude .mp4 to prevent GitHub's 100MB file limit from blocking the push
fs.writeFileSync(path.join(siteDir, '.gitignore'), '*.mp4\n');

console.log("📦 Preparing local git repository for deployment...");
// Wipe previous .git directory to ensure no large files are kept in history
try {
  fs.rmSync(path.join(siteDir, '.git'), { recursive: true, force: true });
} catch (e) {}

try {
  execSync('git init', { cwd: siteDir, stdio: 'inherit' });
  execSync('git add .', { cwd: siteDir, stdio: 'inherit' });
  execSync('git commit -m "Deploy to GitHub Pages"', { cwd: siteDir, stdio: 'inherit' });
} catch (e) {
  console.log("⚠️ No changes to commit or git error. Proceeding...");
}

console.log("🔄 Pushing _site to local gh-pages branch...");
try {
  execSync('git push -f ../.git HEAD:refs/heads/gh-pages', { cwd: siteDir, stdio: 'inherit' });
} catch (e) {
  console.error("❌ Failed to push to local gh-pages branch");
  process.exit(1);
}

console.log("☁️ Publishing to origin gh-pages...");
try {
  execSync('git push -f origin gh-pages:gh-pages', { stdio: 'inherit' });
  console.log("✅ Deployed successfully!");
} catch (e) {
  console.error("❌ Failed to publish to GitHub");
  process.exit(1);
}
