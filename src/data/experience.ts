// Source: public/cv/CV2025.pdf (stack chips use only what each role's CV text names)
export const roles = [
  {
    period: "Jul 2025 — Present",
    role: "Full Stack Engineer",
    company: "MrScraper",
    type: "Full time",
    location: "Los Angeles, California, United States",
    points: [
      "Building a centralized platform for monitoring large-scale data scraping, focusing on high request throughput and horizontal scaling.",
      "Implemented Kafka with multi-partition support to enable a Change Data Capture (CDC) workflow for efficient load distribution and high-volume data processing, while optimizing database pooling to ensure system stability under heavy traffic.",
      "The platform is built using a monorepo architecture with Next.js for the frontend and NestJS for the backend.",
      "Frontend contributions include developing a dynamic, responsive, and reusable UI component system with a minimal-code approach, and enforcing code quality standards using ESLint, Husky, and Conventional Commit.",
    ],
    stack: ["Next.js", "NestJS", "Kafka", "Change Data Capture", "Database pooling", "Horizontal scaling", "Monorepo", "ESLint", "Husky", "Conventional Commits"],
  },
  {
    period: "Jun 2023 — Jun 2025",
    role: "Back-end Developer",
    company: "Four Vision Media",
    type: "Contract",
    location: "Bandung, West Java, Indonesia",
    points: [
      "Responsible for designing and developing scalable backend systems using NestJS and Laravel, supporting high-traffic applications for various clients.",
      "Worked closely with cross-functional teams, including front-end developers using Vue.js and Next.js, to ensure seamless API integration and efficient data flow.",
      "Implemented secure authentication mechanisms using JWT and OAuth, optimized database performance in PostgreSQL and MySQL, and conducted regular code reviews and unit testing.",
    ],
    stack: ["NestJS", "Laravel", "PostgreSQL", "MySQL", "JWT", "OAuth", "REST API integration", "Code review", "Unit testing"],
  },
  {
    period: "Jul 2023 — Sep 2023",
    role: "Back-end Developer",
    company: "PT. Basic Technology",
    type: "Freelance",
    location: "Bandung, West Java, Indonesia",
    points: [
      "Led a small team to develop a comprehensive tax payment application.",
      "Gathered business requirements, created system architecture and database design blueprints, and oversaw the integration of the Midtrans payment gateway.",
      "Involved in hands-on coding, implementing key features, and performing pre-project research.",
    ],
    stack: ["Midtrans", "Team leadership", "System architecture", "Database design", "Requirements gathering"],
  },
  {
    period: "Apr 2022 — Jun 2022",
    role: "Back-end Developer",
    company: "PT. SINOVATIF",
    type: "Internship",
    location: "Bandung, West Java, Indonesia",
    points: [
      "Contributed to the full development and continuous enhancement of an employee attendance management system, working across all stages of the software development lifecycle.",
      "Gathered and analyzed requirements, planned system architecture, implemented new features based on real user feedback, conducted thorough testing, and managed deployment and ongoing maintenance.",
      "Focused on improving system performance, increasing data accuracy, and ensuring long-term reliability and scalability of the platform.",
    ],
    // Laravel / Laravel Breeze: from the SINOVATIF PKL certificate (src/data/certifications.ts).
    stack: ["Laravel", "Laravel Breeze", "Requirements analysis", "Testing", "Deployment"],
  },
];

export const education = [
  {
    period: "2025 — 2027",
    school: "Cakrawala University",
    degree: "Bachelor Degree of Computer Science",
    location: "South Jakarta, Indonesia",
    note: "",
  },
  {
    period: "2020 — 2023",
    school: "SMK Negeri 1 Katapang",
    degree: "High School Diploma, Computer Software Engineering",
    location: "Bandung, Indonesia",
    note: "Fundamentals of software development, algorithms, and data structures, with hands-on web, desktop, and mobile application development, plus exposure to IoT and robotics using Arduino.",
  },
];
