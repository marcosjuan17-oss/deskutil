# Deskutil

Small, focused browser utilities at `deskutil.com`. Built with Astro and TypeScript; tool input stays in the browser.

## Local development

Requires Node.js 22.12 or newer and pnpm. From the project root:

```sh
pnpm install
pnpm dev
```

Create a production build with `pnpm build`; static output is written to `dist/`.

## Deploy to Cloudflare Pages

1. In Cloudflare, open **Workers & Pages**, create a Pages application, and connect `marcosjuan17-oss/deskutil` on GitHub.
2. Select the Astro preset. Set the build command to `pnpm build` and output directory to `dist`.
3. Deploy the `main` branch.
4. Open **Custom domains**, choose **Set up a custom domain**, and enter `deskutil.com`.
5. Since the domain already uses Cloudflare DNS, accept the suggested record. Add `www.deskutil.com` separately only if wanted, then redirect it to the apex domain.

## Add a tool

1. Copy `src/pages/developer/json-formatter/` to `src/pages/{category}/{new-slug}/`; update the page, metadata, canonical URL, FAQ, and structured data.
2. Add its name, slug, category, description, and path to `src/data/tools.ts`.

The registry automatically exposes live tools on the homepage, relevant hub, and sitemap. Link only to pages that exist. Preserve the JSON Formatter’s accessibility, privacy, metadata, FAQ, and structured-data conventions.

