---
description: Author checklist to publish on GitBook with PDF download
---

# Publish on GitBook (author checklist)

## 1. Push this repo

```bash
cd D:\livestock-smart-asset-stack-whitepaper
git add .
git commit -m "docs: Smart Livestock Asset Stack whitepaper v1.0"
# create a GitHub/GitLab repo, then:
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

## 2. Create the GitBook space

1. Go to [gitbook.com](https://www.gitbook.com) and sign in.
2. **New space** → import via **Git Sync** pointing at this repository.
3. Confirm `.gitbook.yaml` picks up `README.md` + `SUMMARY.md`.
4. Check that Mermaid diagrams render on:
   - Executive summary
   - Architecture & flows
   - Roadmap

## 3. Turn on PDF download for readers

1. Publish the space as a docs site.
2. **Customize** → **Tools** → **Configure** → **Page actions**.
3. Enable **Export as PDF** ([docs](https://gitbook.com/docs/publish/pdf-export)).
4. Open the live site and verify [Download PDF](download-pdf.md) instructions match what readers see.

> Note: visitor PDF export requires a GitBook plan that includes the feature (Premium/Ultimate for published sites per GitBook’s docs). On lower plans, export from the logged-in space and host a static PDF in GitHub Releases, then link it from `download-pdf.md`.

## 4. Brand the cover

In GitBook space settings:

- Title: **The Smart Livestock Asset Stack**
- Subtitle: **From Biometric Passport to Exchange Rails in Pakistan**
- Author: **Ammar Jamshed (Independent)**
- Add a short description that includes: *independent whitepaper — no institutional affiliation*

## 5. Independence check before going public

- [ ] No logo of employer / university on the cover
- [ ] About the author uses “independent” language
- [ ] Disclaimer page linked from README
- [ ] No sentence claims MoUs that do not exist
- [ ] Contact method filled in on About page
