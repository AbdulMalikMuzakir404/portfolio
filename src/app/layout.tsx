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
  title: "Abdul - Portfolio",
  description:
    "I am a software engineer with almost two years of experience, specializing in back-end and mobile development using technologies such as NestJS and Laravel. I am also skilled in front-end development with frameworks like Vue.js and Next.js,and I have experience building mobile applications using Flutter Programming is not just a profession for me—it’s a passion. I am a quick learner who adheres to best practices, consistently delivering high-quality solutions efficiently and on time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
