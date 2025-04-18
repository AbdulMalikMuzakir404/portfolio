import memojiAvatar1 from "@/assets/images/memoji-avatar-1.png";
import memojiAvatar2 from "@/assets/images/memoji-avatar-2.png";
import memojiAvatar3 from "@/assets/images/memoji-avatar-3.png";
import memojiAvatar4 from "@/assets/images/memoji-avatar-4.png";
import memojiAvatar5 from "@/assets/images/memoji-avatar-5.png";

import NodeJsCertificate from "@/assets/certificates/nodejs_certificate.jpg";
import CompetitionCertificate from "@/assets/certificates/competition_certificate.jpeg";
import FlutterCertificate from "@/assets/certificates/flutter_certificate.jpeg";
import PKLCertificate from "@/assets/certificates/pkl_certification.jpeg";
import UjikomCertificate from "@/assets/certificates/ujikom_certification.jpeg";

import {
  bootstrap,
  css,
  dart,
  digitalocean,
  docker,
  figma,
  firebase,
  flutter,
  git,
  html,
  javascript,
  jquery,
  laravel,
  livewire,
  mysql,
  nestjs,
  nextjs,
  nodejs,
  php,
  prisma,
  psql,
  reactjs,
  redis,
  tailwind,
  typescript,
  vue,
} from "@/assets/tech";

import {
  bootstrapskill,
  cssskill,
  dartskill,
  digitaloceanskill,
  dockerskill,
  figmaskill,
  firebaseskill,
  flutterskill,
  gitskill,
  htmlskill,
  javascriptskill,
  jqueryskill,
  laravelskill,
  mysqlskill,
  nestjsskill,
  nextjsskill,
  nodejsskill,
  phpskill,
  prismaskill,
  psqlskill,
  reactjsskill,
  redisskill,
  tailwindskill,
  typescriptskill,
  vueskill,
} from "@/assets/tech/skill";

export const navItems = [
  { id: "home", label: "Home" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export const certificates = [
  {
    company: "Inter-School Competition",
    year: "13 April 2023",
    title: "Web Technologies",
    results: [
      { title: "Simple Snake Game" },
      { title: "Create Website Using Wordpress" },
      { title: "Create Website Using Laravel and Vue.JS" },
    ],
    link: "https://drive.google.com/drive/folders/123QStjlkDknO4zO02G2fpNgVZ6-7FaET?usp=sharing",
    image: CompetitionCertificate,
  },
  {
    company: "Udemy",
    year: "11 November 2024",
    title: "NodeJS: Beginner to Advanced",
    results: [
      { title: "NodeJS" },
      { title: "NodeJS Basics" },
      { title: "NodeJS Standard Library" },
      { title: "NodeJS RESTful API" },
    ],
    link: "https://www.udemy.com/course/nodejs-pemula-sampai-mahir/learn/lecture/32742654#overview",
    image: NodeJsCertificate,
  },
  {
    company: "Udemy",
    year: "10 April 2024",
    title: "Flutter Intermediate",
    results: [
      { title: "Scalable Architecture" },
      { title: "Robust State Management" },
      { title: "Advanced Features Integration" },
      { title: "Efficient Networking" },
    ],
    link: "https://www.udemy.com/course/flutterindonesiakopianan/?couponCode=ST14MT150425G1",
    image: FlutterCertificate,
  },
  {
    company: "SINOVATIF",
    year: "8 August 2022",
    title: "PKL Certification",
    results: [
      { title: "Understanding Professional Work Culture" },
      { title: "Adapting to New Technologies" },
      { title: "Web Development with Laravel Breeze" },
      { title: "Final Project: Student Attendance System" },
    ],
    link: "https://www.linkedin.com/company/pt-sinergi-nusa-inovatif/?originalSubdomain=id",
    image: PKLCertificate,
  },
  {
    company: "SMKN x Inovindo",
    year: "1 April 2023",
    title: "Competency Test",
    results: [
      { title: "Developed a School Tuition Payment System" },
      { title: "Implemented Online Payment Integration" },
      { title: "Presented Project to Mentors" },
      { title: "Achieved Excellent Competency Scores" },
    ],
    link: "https://inovindo.co.id/",
    image: UjikomCertificate,
  },
];

export const skills = [
  { title: "Bootstrap", iconType: bootstrapskill },
  { title: "CSS", iconType: cssskill },
  { title: "Dart", iconType: dartskill },
  { title: "DigitalOcean", iconType: digitaloceanskill },
  { title: "Docker", iconType: dockerskill },
  { title: "Figma", iconType: figmaskill },
  { title: "Firebase", iconType: firebaseskill },
  { title: "Flutter", iconType: flutterskill },
  { title: "Git", iconType: gitskill },
  { title: "HTML", iconType: htmlskill },
  { title: "JavaScript", iconType: javascriptskill },
  { title: "jQuery", iconType: jqueryskill },
  { title: "Laravel", iconType: laravelskill },
  { title: "MySQL", iconType: mysqlskill },
  { title: "NestJS", iconType: nestjsskill },
  { title: "Next.js", iconType: nextjsskill },
  { title: "Node.js", iconType: nodejsskill },
  { title: "PHP", iconType: phpskill },
  { title: "Prisma", iconType: prismaskill },
  { title: "PostgreSQL", iconType: psqlskill },
  { title: "React.js", iconType: reactjsskill },
  { title: "Redis", iconType: redisskill },
  { title: "Tailwind CSS", iconType: tailwindskill },
  { title: "TypeScript", iconType: typescriptskill },
  { title: "Vue.js", iconType: vueskill },
];

export const hobbies = [
  {
    title: "Movie",
    emoji: "🎬",
    left: "5%",
    top: "5%",
  },
  {
    title: "Photography",
    emoji: "📷",
    left: "35%",
    top: "5%",
  },
  {
    title: "Swimming",
    emoji: "🏊‍♂️",
    left: "70%",
    top: "0%",
  },
  {
    title: "Hiking",
    emoji: "🥾",
    left: "35%",
    top: "40%",
  },
  {
    title: "Gaming",
    emoji: "🎮",
    left: "10%",
    top: "35%",
  },
  {
    title: "Music",
    emoji: "🎵",
    left: "70%",
    top: "45%",
  },
  {
    title: "Fitness",
    emoji: "🏋️‍♀️",
    left: "5%",
    top: "65%",
  },
  {
    title: "Reading",
    emoji: "📚",
    left: "45%",
    top: "70%",
  },
];

export const technologies = [
  {
    name: "Nest JS",
    icon: nestjs,
  },
  {
    name: "Next Js",
    icon: nextjs,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Vue JS",
    icon: vue,
  },
  {
    name: "Laravel",
    icon: laravel,
  },
  {
    name: "Flutter",
    icon: flutter,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "PHP",
    icon: php,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "Digital Ocean",
    icon: digitalocean,
  },
  {
    name: "docker",
    icon: docker,
  },
];

export const testimonials = [
  {
    name: "Alex Turner",
    position: "Marketing Manager @ TechStartups",
    text: "Alex was instrumental in transforming our website into a powerful marketing tool. His attention to detail and ability to understand our brand is exceptional. We're thrilled with the results!",
    avatar: memojiAvatar1,
  },
  {
    name: "Olivia Green",
    position: "Head of Design @ GreenLeaf",
    text: "Working with Alex was a pleasure. His expertise in frontend development brought our designs to life in a way we never imagined. The website has exceeded our expectations.",
    avatar: memojiAvatar2,
  },
  {
    name: "Daniel White",
    position: "CEO @ InnovateCo",
    text: "Alex's ability to create seamless user experiences is unmatched. Our website has seen a significant increase in conversions since launching the new design. We couldn't be happier.",
    avatar: memojiAvatar3,
  },
  {
    name: "Emily Carter",
    position: "Product Manager @ GlobalTech",
    text: "Alex is a true frontend wizard. He took our complex product and transformed it into an intuitive and engaging user interface. We're already seeing positive feedback from our customers.",
    avatar: memojiAvatar4,
  },
  {
    name: "Michael Brown",
    position: "Director of IT @ MegaCorp",
    text: "Alex's work on our website has been nothing short of exceptional. He's a talented developer who is also a great communicator. We highly recommend him.",
    avatar: memojiAvatar5,
  },
];
