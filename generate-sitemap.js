import fs from "fs/promises";
import path from "path";
import { SitemapStream, streamToPromise } from "sitemap";

// Define your site's base URL
const baseUrl = "https://convertio2-0-dztg.vercel.app";

// Define your routes
const routes = ["/", "/image-converter"];

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: baseUrl });

  routes.forEach((route) => {
    sitemap.write({ url: route, changefreq: "daily", priority: 0.7 });
  });

  sitemap.end();

  try {
    const data = await streamToPromise(sitemap);
    await fs.writeFile(path.resolve("public", "sitemap.xml"), data);
    console.log("Sitemap generated successfully!");
  } catch (err) {
    console.error("Error generating sitemap:", err);
  }
}

generateSitemap();
