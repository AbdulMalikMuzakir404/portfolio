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
  title: "Abdul Malik Muzakir | Software Engineer Portfolio",
  description:
    "Abdul Malik Muzakir is a software engineer specializing in backend (NestJS, Laravel), frontend (Vue.js, Next.js), and mobile development (Flutter). Explore his projects, skills, and experience in building high-performance web and mobile applications.",
  keywords: [
    // Nama personal
    "Abdul",
    "Abdul Malik",
    "Abdul Malik Muzakir",
    "Abdul Portfolio",

    // Role/profesi umum
    "Software Engineer",
    "Full Stack Developer",
    "Backend Developer",
    "Frontend Developer",
    "Mobile App Developer",
    "Web Developer",
    "App Developer",

    // Role + Indonesia
    "Software Engineer Indonesia",
    "Full Stack Developer Indonesia",
    "Backend Developer Indonesia",
    "Frontend Developer Indonesia",
    "Mobile App Developer Indonesia",
    "Web Developer Indonesia",

    // Stack/teknologi
    "NestJS Developer",
    "Laravel Developer",
    "Vue.js Developer",
    "Next.js Developer",
    "Flutter Developer",
    "JavaScript Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "API Developer",

    // Freelance market
    "Freelance Software Engineer",
    "Freelance Full Stack Developer",
    "Freelance Backend Developer",
    "Freelance Frontend Developer",
    "Freelance Mobile App Developer",
    "Freelance Web Developer",

    // Freelance + Lokal
    "Freelance Software Engineer Indonesia",
    "Freelance Full Stack Developer Indonesia",
    "Freelance Backend Developer Indonesia",
    "Freelance Frontend Developer Indonesia",
    "Freelance Mobile App Developer Indonesia",
    "Freelance Web Developer Indonesia",

    // Layanan & project
    "Jasa Pembuatan Aplikasi",
    "Jasa Pembuatan Website",
    "Jasa Pembuatan Aplikasi Mobile",
    "Jasa Web Developer",
    "Open Hiring Developer",
    "Sewa Developer Freelance",
    "Hire Software Engineer Indonesia",
    "Hire Full Stack Developer",

    // Portfolio & brand building
    "Portfolio Software Engineer",
    "Portfolio Developer Indonesia",
    "Developer Indonesia Portfolio",
    "Developer Profesional Indonesia",

    // Lokasi (Local SEO)
    "Software Engineer Bandung",
    "Full Stack Developer Bandung",
    "Backend Developer Bandung",
    "Frontend Developer Bandung",
    "Mobile App Developer Bandung",
    "Web Developer Bandung",

    "Freelance Developer Bandung",
    "Freelance Software Engineer Bandung",
    "Freelance Full Stack Developer Bandung",
    "Freelance Backend Developer Bandung",
    "Freelance Frontend Developer Bandung",
    "Freelance Mobile App Developer Bandung",
    "Freelance Web Developer Bandung",

    "Jasa Pembuatan Website Bandung",
    "Jasa Pembuatan Aplikasi Bandung",
    "Hire Developer Bandung",
    "Sewa Programmer Bandung",
    "Developer Profesional Bandung",
    "Developer Terbaik Bandung",

    "Jasa IT Bandung",
    "Programmer Bandung",
    "Developer Bandung",
    "Bandung Full Stack Developer Portfolio",
  ],
  icons: "/favicon.ico",
  authors: [{ name: "Abdul Malik Muzakir" }],
  metadataBase: new URL("https://www.abdulmalikmuzakir.my.id"),
  openGraph: {
    title: "Abdul Malik Muzakir | Software Engineer Portfolio",
    description:
      "Explore Abdul's portfolio - full stack developer with expertise in NestJS, Laravel, Vue.js, Next.js, and Flutter.",
    url: "https://www.abdulmalikmuzakir.my.id",
    siteName: "Abdul Malik Muzakir Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Abdul Malik Muzakir - Software Engineer Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdul Malik Muzakir | Software Engineer Portfolio",
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
