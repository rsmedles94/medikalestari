import { notFound } from "next/navigation";

const locales = ["id", "en"];

export async function getMessages(locale: string) {
  try {
    return (await import(`../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }
}

export function isValidLocale(locale: string): locale is (typeof locales)[number] {
  return locales.includes(locale);
}

export { locales };
