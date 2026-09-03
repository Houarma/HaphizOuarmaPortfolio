import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { about, identity, research, site, systems } from "@/content/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  alternates: { canonical: "/" },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "profile",
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: site.name,
    locale: "en_US",
    firstName: "Haphiz",
    lastName: "Ouarma",
    username: "haphizouarma",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Paste the token from Search Console here once the property is verified.
  // verification: { google: "..." },
};

export const viewport = {
  themeColor: "#f1f1f1",
  colorScheme: "light",
};

const PERSON = `${site.url}/#person`;
const WEBSITE = `${site.url}/#website`;
const HORIZONS = `${site.url}/#horizons`;

/**
 * One connected graph rather than a pile of separate blocks: the page is about
 * a Person, that Person founded an Organization and wrote an Article, and the
 * site belongs to them. Search engines and answer engines both walk these
 * edges, which is what makes an entity legible rather than a keyword soup.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON,
      name: site.name,
      alternateName: ["Ouarma Haphiz", "Haphiz OUARMA", "HAPHIZ OUARMA"],
      givenName: "Haphiz",
      familyName: "Ouarma",
      url: site.url,
      image: `${site.url}${identity.avatar}`,
      email: `mailto:${site.links.email}`,
      jobTitle: "AI & Data Engineer",
      description: site.description,
      knowsAbout: site.keywords,
      knowsLanguage: ["fr", "en"],
      nationality: { "@type": "Country", name: "Burkina Faso" },
      alumniOf: about.education.map((e) => ({
        "@type": "CollegeOrUniversity",
        name: "National School of Applied Sciences of Oujda (ENSA Oujda)",
        description: `${e.detail}, ${e.period}`,
      })),
      hasCredential: about.certifications.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: c.name,
        credentialCategory: "certificate",
        recognizedBy: { "@type": "Organization", name: c.issuer },
      })),
      founder: { "@id": HORIZONS },
      worksFor: { "@id": HORIZONS },
      sameAs: [site.links.github, site.links.linkedin, site.links.medium].filter(
        Boolean,
      ),
    },
    {
      "@type": "Organization",
      "@id": HORIZONS,
      name: "Horizon's",
      description:
        "Research, entrepreneurship and education for the African technology ecosystem. Horizon's Academy trains engineers in data science and artificial intelligence.",
      founder: { "@id": PERSON },
      url: site.url,
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": PERSON },
    },
    {
      "@type": "ProfilePage",
      "@id": `${site.url}/#webpage`,
      url: site.url,
      name: site.title,
      description: site.description,
      isPartOf: { "@id": WEBSITE },
      about: { "@id": PERSON },
      mainEntity: { "@id": PERSON },
      inLanguage: "en",
    },
    ...research
      .filter((piece) => piece.href)
      .map((piece) => ({
        "@type": "ScholarlyArticle",
        headline: piece.title,
        abstract: piece.blurb,
        url: piece.href,
        author: { "@id": PERSON },
        publisher: { "@id": PERSON },
        inLanguage: "en",
        keywords: piece.tags.join(", "),
        image: `${site.url}${piece.cover}`,
      })),
    ...systems.map((s) => ({
      "@type": "SoftwareApplication",
      name: s.name,
      description: s.body,
      applicationCategory: "MobileApplication",
      author: { "@id": PERSON },
      operatingSystem: "Android, iOS, Web",
    })),
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('anim')}catch(e){}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
