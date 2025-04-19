import { Inter, Calistoga } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { twMerge } from "tailwind-merge";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Abdul | Software Engineer Portfolio",
  description:
    "Abdul is a software engineer specializing in backend (NestJS, Laravel), frontend (Vue.js, Next.js), and mobile development (Flutter). Explore his projects, skills, and experience in building high-performance web and mobile applications.",
  keywords: [
    "Abdul",
    "Abdul Malik",
    "Abdul Malik Muzakir",
    "Abdul Portfolio",
    "Software Engineer",
    "Full Stack Developer",
    "NestJS Developer",
    "Laravel Developer",
    "Vue.js Developer",
    "Next.js Developer",
    "Flutter Developer",
    "Portfolio Developer",
    "Backend Engineer",
    "Frontend Developer",
    "Mobile App Developer",
  ],
  icons: "/favicon/favicon.ico",
  authors: [{ name: "Abdul Malik Muzakir" }],
  metadataBase: new URL("https://www.abdulmalikmuzakir.my.id"),
  openGraph: {
    title: "Abdul | Software Engineer Portfolio",
    description:
      "Explore Abdul's portfolio - full stack developer with expertise in NestJS, Laravel, Vue.js, Next.js, and Flutter.",
    url: "https://www.abdulmalikmuzakir.my.id",
    siteName: "Abdul Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Abdul - Software Engineer Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdul | Software Engineer Portfolio",
    description:
      "Explore Abdul's portfolio - full stack developer with expertise in NestJS, Laravel, Vue.js, Next.js, and Flutter.",
    images: ["/og-image.png"],
    creator: "@MalikAbdul64787",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  themeColor: "#0f172a",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abdul Malik Muzakir",
  url: "https://www.abdulmalikmuzakir.my.id",
  sameAs: [
    "https://github.com/AbdulMalikMuzakir404",
    "https://www.linkedin.com/in/abdul-malik-muzakir-aba30a343",
    "https://www.instagram.com/abdul.malik.muzakir",
    "https://id.quora.com/profile/Abdul-Malik-Muzakir",
    "https://discord.com/users/1072893949288644732",
  ],
  jobTitle: "Software Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Freelance / Open Source / Personal Projects / Internships / Part Time Jobs / Full Time Jobs / Projects",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          id="structured-data-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={twMerge(
          inter.variable,
          calistoga.variable,
          "bg-slate-950 text-white antialiased font-sans"
        )}
      >
        {children}
      </body>
    </html>
  );
}
