import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/ai-chat", "/ai-besedila", "/ai-dokumenti", "/ai-prevajalnik", "/ai-grafika", "/ai-inpainting", "/ai-zamenjava", "/ai-zvok", "/ai-vid", "/ai-spomin", "/ai-povzetek", "/ai-ucenje", "/pretvorniki", "/predloge", "/narocnina", "/partnerji", "/nastavitve", "/admin/"],
      },
    ],
    sitemap: "https://www.1984.si/sitemap.xml",
  };
}
