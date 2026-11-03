import type { StaticImageData } from "next/image";
import BookCover from "@/assets/images/book-cover.png";

export type Photo = {
  /** Import your photo (e.g. `import me from "@/assets/images/me.jpg"`) and set it here. `null` shows the placeholder. */
  src: StaticImageData | null;
  alt: string;
  /** Focal point in percent; drives `object-position` so cropping keeps your face in frame. */
  focal: { x: number; y: number };
};

export const profile = {
  name: "Abdul Malik Muzakir",
  title: "Software Engineer",
  location: "Bandung, West Java, Indonesia",
  status: "Available for new projects",
  headline: {
    before: "Bringing your dreams to life with",
    emphasis: "cutting-edge",
    after: "software solutions",
  },
  summary:
    "Software Engineer with nearly 3 years of experience specializing in back-end and mobile development. Proficient in NestJS, Ruby on Rails, Flutter, Vue.js, and Next.js. Skilled in designing scalable APIs, managing robust databases, and implementing secure authentication and authorization systems. Experienced in working with cross-functional teams, delivering high-quality, production-ready solutions, and optimizing system performance. Adaptable, fast-learning, and committed to clean code, maintainability, and industry best practices.",
  current: { role: "Full Stack Engineer", company: "MrScraper", since: "July 2025" },
  email: "abdulmalikmuzakir55@gmail.com",
  phone: { display: "+62 857 2348 6958", tel: "+6285723486958", whatsapp: "https://wa.me/6285723486958" },
  cv: "/cv/CV2025.pdf",
  photo: {
    src: null,
    alt: "Portrait of Abdul Malik Muzakir",
    focal: { x: 50, y: 35 },
  } satisfies Photo as Photo,
  languages: [
    { name: "Indonesian", level: "Native" },
    { name: "Sundanese", level: "Native" },
    { name: "English", level: "Limited working proficiency" },
  ],
  principles: [
    {
      title: "Driven by Purpose",
      body: "I approach every line of code with intent—aiming to create experiences that are meaningful, efficient, and impactful.",
    },
    {
      title: "Crafted with Precision",
      body: "I prioritize clean code, scalability, and maintainability—ensuring that each solution is built on a solid foundation.",
    },
    {
      title: "Always Improving",
      body: "Tech never stops evolving, and neither do I. I continuously explore new tools, frameworks, and methodologies to sharpen my skills.",
    },
  ],
  qualities: [
    "Performant", "Accessible", "Secure", "Interactive", "Scalable", "User Friendly",
    "Responsive", "Maintainable", "Search Optimized", "Usable", "Reliable",
  ],
  hobbies: [
    { title: "Movie", emoji: "🎬" },
    { title: "Photography", emoji: "📷" },
    { title: "Swimming", emoji: "🏊‍♂️" },
    { title: "Hiking", emoji: "🥾" },
    { title: "Gaming", emoji: "🎮" },
    { title: "Music", emoji: "🎵" },
    { title: "Fitness", emoji: "🏋️‍♀️" },
    { title: "Reading", emoji: "📚" },
  ],
  reads: [{ title: "Atomic Habits", author: "James Clear", cover: BookCover }],
};
