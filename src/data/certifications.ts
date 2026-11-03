import CompetitionCertificate from "@/assets/certificates/competition_certificate.jpeg";
import NodeJsCertificate from "@/assets/certificates/nodejs_certificate.jpg";
import FlutterCertificate from "@/assets/certificates/flutter_certificate.jpeg";
import PKLCertificate from "@/assets/certificates/pkl_certification.jpeg";
import UjikomCertificate from "@/assets/certificates/ujikom_certification.jpeg";

export const certifications = [
  {
    issuer: "Udemy",
    date: "11 November 2024",
    title: "NodeJS: Beginner to Advanced",
    highlights: ["NodeJS", "NodeJS Basics", "NodeJS Standard Library", "NodeJS RESTful API"],
    link: "https://www.udemy.com/course/nodejs-pemula-sampai-mahir/learn/lecture/32742654#overview",
    image: NodeJsCertificate,
  },
  {
    issuer: "Udemy",
    date: "10 April 2024",
    title: "Flutter Intermediate",
    highlights: ["Scalable Architecture", "Robust State Management", "Advanced Features Integration", "Efficient Networking"],
    link: "https://www.udemy.com/course/flutterindonesiakopianan/?couponCode=ST14MT150425G1",
    image: FlutterCertificate,
  },
  {
    issuer: "Inter-School Competition",
    date: "13 April 2023",
    title: "Web Technologies",
    highlights: ["Simple Snake Game", "Create Website Using Wordpress", "Create Website Using Laravel and Vue.JS"],
    link: "https://drive.google.com/drive/folders/123QStjlkDknO4zO02G2fpNgVZ6-7FaET?usp=sharing",
    image: CompetitionCertificate,
  },
  {
    issuer: "SMKN x Inovindo",
    date: "1 April 2023",
    title: "Competency Test",
    highlights: [
      "Developed a School Tuition Payment System",
      "Implemented Online Payment Integration",
      "Presented Project to Mentors",
      "Achieved Excellent Competency Scores",
    ],
    link: "https://inovindo.co.id/",
    image: UjikomCertificate,
  },
  {
    issuer: "SINOVATIF",
    date: "8 August 2022",
    title: "PKL Certification",
    highlights: [
      "Understanding Professional Work Culture",
      "Adapting to New Technologies",
      "Web Development with Laravel Breeze",
      "Final Project: Student Attendance System",
    ],
    link: "https://www.linkedin.com/company/pt-sinergi-nusa-inovatif/?originalSubdomain=id",
    image: PKLCertificate,
  },
];

// Source: public/cv/CV2025.pdf
export const moreCertifications = [
  { title: "Flutter & Dart — The Complete Guide [2024 Edition]", issuer: "Udemy" },
  { title: "Membuat Aplikasi itu Mudah", issuer: "Flutter Indonesia, Udemy (2021)" },
  { title: "NodeJS: Pemula Sampai Mahir", issuer: "Programmer Zaman Now, Udemy" },
  {
    title: "SQL Basic, SQL Intermediate, JavaScript Basic, Python Basic, CSS Basic, Problem Solving Basic",
    issuer: "HackerRank",
  },
];

export const honors = ["3rd Place Winner in the IT Company Competition"];
