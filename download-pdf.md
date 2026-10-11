---
description: How readers download this whitepaper as PDF from GitBook
---

# Download PDF

{% hint style="success" %}
**Live site:** [https://livestockmon.gitbook.io/smart-livestock-asset-stack/](https://livestockmon.gitbook.io/smart-livestock-asset-stack/)
{% endhint %}

{% hint style="info" %}
PDF export is enabled on this site’s page Actions (look for **Export as PDF** near the page title).
{% endhint %}

## For readers (on the published site)

On the live GitBook site:

1. Open any page of the whitepaper on the live GitBook site.
2. Use the page **Actions** control (near the page title).
3. Choose **Export as PDF** → **All pages** (full whitepaper) or **Current page**.
4. When the export view loads, use **Print or save as PDF**.

If you do not see Export as PDF, the site owner has not enabled it yet — ask them, or use the owner steps below.

## For the author (enable PDF download on GitBook)

GitBook’s reader-facing PDF export is available on **Premium / Ultimate** published sites ([GitBook PDF export docs](https://gitbook.com/docs/publish/pdf-export)).

1. Create a free GitBook account at [gitbook.com](https://www.gitbook.com).
2. **Import this repository** (Git Sync) or paste the Markdown into a new space.
3. Publish the space as a docs site.
4. Open **Customize** → **Tools** → **Configure** → **Page actions**.
5. Toggle **Export as PDF** **on**.
6. Share the public site URL — readers can then download the PDF from any page.

### Optional: API temporary PDF URL

Organization members with API access can request a short-lived PDF URL:

```http
GET https://api.gitbook.com/v1/spaces/{spaceId}/pdf
Authorization: Bearer <GITBOOK_TOKEN>
```

See [Get a temporary URL to download a space as PDF](https://gitbook.com/docs/developers/gitbook-api/api-reference/spaces/space-content/get-a-temporary-url-to-download-a-space-or-page-as-pdf).

### Fallback (any plan)

If your GitBook plan does not include visitor PDF export:

1. Open the space while logged in.
2. Page Actions → **Export to PDF** → All pages.
3. Save via the browser print dialog.
4. Host the resulting PDF next to this repo (e.g. `releases/smart-livestock-asset-stack-v1.pdf`) and link it here.

## Suggested public filename

`Smart-Livestock-Asset-Stack-Pakistan-Ammar-Jamshed-v1.pdf`
