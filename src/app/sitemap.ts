import type { MetadataRoute } from "next";
import { getPublishedLessons } from "@/lib/repo/content";
import { SITE_URL } from "@/lib/url";

/** หน้าบทเรียนคือช่องทางที่คนค้นเจอเว็บนี้จาก Google จึงต้องอยู่ใน sitemap ทุกหน้า */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/courses", "/playground", "/about", "/privacy"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const lessonPages = getPublishedLessons().map((lesson) => ({
    url: `${SITE_URL}/lesson/${lesson.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...lessonPages];
}
