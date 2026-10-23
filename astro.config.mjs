// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [mdx(), sitemap()],
	// Astro 6+ adapter: keep build-time image handling (no Cloudflare Images binding)
	// and no sessions KV, so the upgrade provisions no new Cloudflare resources.
	session: false,
	adapter: cloudflare({
		imageService: "compile",
	}),
});
