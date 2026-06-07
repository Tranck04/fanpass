import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", ".output", "public");
const ASSETS_DIR = join(PUBLIC_DIR, "assets");

if (!existsSync(ASSETS_DIR)) {
  console.error("❌ .output/public/assets not found. Run build first.");
  process.exit(1);
}

const files = readdirSync(ASSETS_DIR);

const jsFile = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
const cssFiles = files.filter((f) => f.endsWith(".css"));

if (!jsFile) {
  console.error("❌ No index-*.js bundle found in assets.");
  process.exit(1);
}

const cssLinks = cssFiles
  .map((f) => `    <link rel="stylesheet" href="/assets/${f}" />`)
  .join("\n");

const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FanPass — Votre match commence avant le stade</title>
    <meta name="description" content="FanPass : l'expérience fan intelligente pour les stades. Billet digital, itinéraire temps réel, gate navigator, fan zones et plus." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" />
${cssLinks}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${jsFile}"></script>
  </body>
</html>`;

writeFileSync(join(PUBLIC_DIR, "index.html"), html);
console.log(`✅ Generated index.html → /assets/${jsFile}`);
console.log(`   CSS: ${cssFiles.map((f) => `/assets/${f}`).join(", ")}`);
