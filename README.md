# HEDiGEAR Influencer Selection Microsite Template

[![Node 18+](https://img.shields.io/badge/node-18%2B-brightgreen)](https://nodejs.org/)  <!-- optional CI badge goes here -->

Launch brand‑specific product‑selection sites for influencer / athlete campaigns in minutes. Swap **one** inventory file and **one** config file, then deploy to Vercel.

---

## 🚀 Quick Start (local dev)

```bash
# Prereqs – Node 18+ and Git
git clone https://github.com/<your‑org>/<this‑template>.git
cd <project>
npm install
npm run dev    # http://localhost:3000
```

> **Never commit `.env.local`.**  Keep Notion credentials local or add them only on Vercel.

---

## 🛠 Create a New School / Campaign Site

|  Step                      |  Action                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
|  1. **Use this template**  |  Click **Use this template** → new repo (e.g. `hedigear‑fsu‑selection-site`) then clone.                                |
|  2. **Swap inventory**     |  Replace `public/data/inventory.json` with the new campaign’s product list (same schema).                               |
|  3. **Update branding**    |  Edit `campaign.config.js` → set `schoolName`, `campaignName`, `primaryColor`, `secondaryColor`, `logoUrl`, `iconUrl`.  |
|  4. **Prepare Notion**     |  Create a fresh DB, copy the column layout, create an integration → grab **API Key** & **Database ID**.                 |
|  5. **Add .env.local**     |  \`\`\`env                                                                                                              |
| NOTION\_API\_KEY=xxx       |                                                                                                                         |
| NOTION\_DATABASE\_ID=yyy   |                                                                                                                         |

```` |
| 6. **Deploy on Vercel** | Push → Vercel → New Project → add the two env vars → **Deploy**. |

You now have a live selection site for the new campaign 🎉

---
### 🖌️ Branding & Config
`campaign.config.js`
```js
export const CAMPAIGN_CONFIG = {
  schoolName: "University of Florida",
  campaignName: '"Pack Your Story" Inventory Selection',
  primaryColor: "#FA4616",   // UF orange
  secondaryColor: "#0021A5", // UF blue
  logoUrl: "/brand/UF-gator-head-logo.png",
  iconUrl: "/brand/uf-favicon.svg",
};
````

#### Global CSS variables

`pages/_app.js`

```js
import '../styles/globals.css';
import { CAMPAIGN_CONFIG } from '../campaign.config';
export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --primary: ${CAMPAIGN_CONFIG.primaryColor};
          --secondary: ${CAMPAIGN_CONFIG.secondaryColor};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
```

Example usage in CSS (`styles/globals.css`):

```css
body { color: var(--primary); }
.btn-primary { background: var(--primary); }
.btn-secondary { background: var(--secondary); }
```

---

### 📋 Inventory Schema

```jsonc
[
  {
    "selectionOption": "Included",   // Included | Pick 1 | Pick 3 | Pick 2
    "productName": "Gator Head Patch",
    "productType": "Patch",
    "category": "UF Logo",
    "url": "https://example.com/product/123",
    "imageUrl": "https://example.com/img/123.jpg"
  }
]
```

---

### 🔒 Validation & CI (optional)

* `npm run validate` – AJV script checks `inventory.json` before deploy.
* GitHub Actions workflow runs `npm ci`, `npm run validate`, and `npm run build` on every PR.

---

### 🛡️ Extras (optional)

* **Anti‑spam** – hidden honeypot field in the form. 
* **Custom 404** – `pages/404.js` using `CAMPAIGN_CONFIG.logoUrl`.
* **Rate‑limiting** – throttle `/api/submit` or queue writes for large campaigns.

---

### 🔗 Useful Commands

```bash
npm run dev       # local dev server
npm run validate  # schema‑check inventory.json
npm run build     # production build locally
npm start         # run built app locally
```

> Ten‑minute turnaround: swap `inventory.json`, update `campaign.config.js`, set env vars, **Deploy** 🚀
