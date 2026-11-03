import type { StaticImageData } from "next/image";
import {
  BigDataUMKMCatalog,
  BigDataUMKMDashboard,
  BigDataUMKMIndex,
  BigDataUMKMLogin,
  BprChristaJayaAboutUs,
  BprChristaJayaFinancialReport,
  BprChristaJayaHome,
  BprChristaJayaNews,
  DiabseninAnnouncement,
  DiabseninAnnouncementDetail,
  DiabseninLogin,
  DiabseninMaps,
  DiabseninNotification,
  DiabseninSignin,
  MiuraHome1,
  MiuraHome2,
  MiuraHome3,
  MiuraNews,
  NeqatAnnouncement,
  NeqatCheckin,
  NeqatConfig,
  NeqatMaps,
  PmsDetailTask,
  PmsTask,
  PortalSmartcoopCooperationData,
  PortalSmartcoopDashboardStatistik,
  PortalSmartcoopLogin,
  PortalSmartcoopStatistik,
  SekiHalselDashboard,
  SekiHalselLogin,
  SilatoKopiSahaDashboard,
  SilatoKopiSahaIndex,
  SilatoKopiSahaLogin,
  SilatoKopiSahaTraining,
  SipajongaPayment,
  SipajongaStatistik,
  SmartcoopAcademyIndex,
  SmartcoopAcademyQuiz,
  SmartcoopAcademyRegister,
  SmartcoopAcademyTrainingModule,
} from "@/assets/experiences";

export type Project = {
  slug: string;
  name: string;
  period: string;
  kind: string;
  featured: boolean;
  /** "phone" renders tall mobile screenshots side by side; "desktop" renders a 16:10 lead shot. */
  media: "desktop" | "phone";
  summary: string;
  /** Full original description from the previous site. */
  description: string;
  tech: string[];
  contribution?: string;
  links: { label: string; href: string }[];
  images: { src: StaticImageData; alt: string }[];
};

export const projects: Project[] = [
  {
    slug: "smartcoop-academy",
    name: "Smartcoop Academy",
    period: "2025 — Present",
    kind: "Learning platform",
    featured: true,
    media: "desktop",
    summary: "A digital learning platform for cooperative members, staff, and stakeholders — video tutorials, quizzes, Zoom webinars, and digital certificates on completion.",
    description:
      "SmartCoop Academy is a comprehensive digital learning platform developed to support continuous education and skill development for cooperative members, staff, and stakeholders. It offers a wide range of interactive and engaging learning methods, including video tutorials, quizzes, webinars via Zoom, and other multimedia-based training modules. The platform is designed to be user-friendly and accessible anytime, anywhere, making it easier for users to learn at their own pace. SmartCoop Academy covers various topics relevant to cooperative development, business management, financial literacy, entrepreneurship, and more. Participants who successfully complete courses or training programs are awarded digital certificates as formal recognition of their achievements. These certificates can serve as valuable credentials for personal growth and professional development. Whether you're a beginner looking to understand the basics or a professional seeking advanced insights, SmartCoop Academy is your trusted partner in lifelong learning.",
    tech: [],
    links: [],
    images: [
      { src: SmartcoopAcademyIndex, alt: "Smartcoop Academy \u2014 Landing page" },
      { src: SmartcoopAcademyTrainingModule, alt: "Smartcoop Academy \u2014 Training modules" },
      { src: SmartcoopAcademyQuiz, alt: "Smartcoop Academy \u2014 Quiz" },
      { src: SmartcoopAcademyRegister, alt: "Smartcoop Academy \u2014 Registration" },
    ],
  },
  {
    slug: "diabsenin",
    name: "Diabsenin",
    period: "2025 — Present",
    kind: "Mobile + Web",
    featured: true,
    media: "phone",
    summary: "A student attendance app on mobile and web — daily check-ins, real-time announcements, an integrated school map, and attendance rankings, plus an admin web app for bulk data and PDF reports.",
    description:
      "Diabsenin is a modern attendance application designed for students, available on both mobile and web platforms. The mobile app is specifically developed for students to easily submit their daily attendance, making the process more efficient and accessible. In addition to attendance as its core feature, the application includes several supporting functions such as an announcement section, where students can receive real-time updates and important school information. It also features an integrated map to help students—especially new ones—navigate to their school location, making it particularly useful for those unfamiliar with the area. Another notable feature is the student ranking system, which serves as a form of recognition for students who consistently maintain good attendance. On the other hand, the web-based version is designed for school administrators and staff, allowing them to manage student data effectively. This includes the ability to register students, import and export data in bulk, publish announcements, and generate attendance reports in PDF format. The platform provides a centralized and organized system for handling administrative tasks related to student presence and school communication. In the future, Diabsenin is planned to be integrated with IoT technology to enable automated attendance tracking through smart devices, further streamlining the process and enhancing accuracy. As an all-in-one solution, Diabsenin not only improves attendance management but also strengthens the connection between students and school administration through real-time information sharing and digital convenience.",
    tech: ["Flutter", "Firebase"],
    links: [],
    images: [
      { src: DiabseninLogin, alt: "Diabsenin \u2014 Mobile login" },
      { src: DiabseninAnnouncement, alt: "Diabsenin \u2014 Announcements" },
      { src: DiabseninMaps, alt: "Diabsenin \u2014 School map" },
      { src: DiabseninNotification, alt: "Diabsenin \u2014 Notifications" },
      { src: DiabseninAnnouncementDetail, alt: "Diabsenin \u2014 Announcement detail" },
      { src: DiabseninSignin, alt: "Diabsenin \u2014 Admin web sign-in" },
    ],
  },
  {
    slug: "big-data-umkm",
    name: "Big Data UMKM",
    period: "2024 — 2025",
    kind: "Data platform",
    featured: true,
    media: "desktop",
    summary: "A platform that centralizes data on Indonesian MSMEs at scale — bulk import and export, targeted mentoring, and a product showcase for registered businesses.",
    description:
      "BigDataUMKM is a data management platform designed to centralize and streamline information related to Micro, Small, and Medium Enterprises (MSMEs) registered across Indonesia. Built to handle large-scale data efficiently, the platform provides powerful features such as bulk data import and export, making it easy for institutions and stakeholders to manage and analyze MSME data at scale. Through BigDataUMKM, registered MSMEs can receive targeted mentoring and support to help them grow and sustain their businesses. Additionally, the platform allows MSMEs to showcase and share their products directly, providing visibility and potential market opportunities within the ecosystem. BigDataUMKM not only simplifies data administration but also empowers MSMEs with tools and insights that enhance their digital presence, operational capacity, and access to development resources. It serves as a vital bridge between MSMEs, government programs, mentors, and potential buyers. Whether for data analysis, business development, or collaboration, BigDataUMKM is a reliable solution that supports the growth of Indonesia's MSME sector.",
    tech: ["Laravel", "Vue.js", "Tailwind CSS", "Bootstrap", "PostgreSQL"],
    links: [],
    images: [
      { src: BigDataUMKMCatalog, alt: "Big Data UMKM \u2014 Product catalog" },
      { src: BigDataUMKMDashboard, alt: "Big Data UMKM \u2014 Dashboard" },
      { src: BigDataUMKMIndex, alt: "Big Data UMKM \u2014 Landing page" },
      { src: BigDataUMKMLogin, alt: "Big Data UMKM \u2014 Login" },
    ],
  },
  {
    slug: "portal-smartcoop",
    name: "Portal Smartcoop",
    period: "2024 — 2025",
    kind: "Management system",
    featured: true,
    media: "desktop",
    summary: "An integrated cooperative-management app — transactions, memberships, automated billing, statistics dashboards, PDF reports, and integrations with IMS and Diskuk.",
    description:
      "Portal SmartCoop is an integrated management application designed to facilitate the administration of cooperative data, including transactions such as purchases, rentals, membership records, and more. The platform offers a wide range of features to simplify data processing and decision-making for cooperatives. Key functionalities include automated calculations of total billing costs, member statistics, cooperative statuses (active/inactive), and other essential indicators. The platform also provides intuitive data visualization through dynamic charts and graphs, allowing users to monitor key metrics more effectively. To further enhance productivity, Portal SmartCoop supports bulk data import and export, PDF conversion for report sharing, and seamless integration with external systems such as the Inventory Management System (IMS) and Diskuk (local cooperative and SME development platforms). Whether for operational tracking, performance evaluation, or regulatory reporting, Portal SmartCoop delivers a powerful and user-friendly environment to manage cooperatives with ease and accuracy.",
    tech: ["Laravel", "Vue.js", "Tailwind CSS", "Bootstrap", "MySQL", "Redis"],
    links: [],
    images: [
      { src: PortalSmartcoopDashboardStatistik, alt: "Portal Smartcoop \u2014 Statistics dashboard" },
      { src: PortalSmartcoopStatistik, alt: "Portal Smartcoop \u2014 Statistics" },
      { src: PortalSmartcoopCooperationData, alt: "Portal Smartcoop \u2014 Cooperative data" },
      { src: PortalSmartcoopLogin, alt: "Portal Smartcoop \u2014 Login" },
    ],
  },
  {
    slug: "neqat",
    name: "NeQat",
    period: "2023 — 2024",
    kind: "Mobile + Web",
    featured: true,
    media: "phone",
    summary: "A student attendance app on mobile and web — attendance tracking, announcements, and a school-centered map, with a web console for school administrators.",
    description:
      "Neqat is a student attendance application available on both mobile and web platforms. The mobile application is specifically designed for students to easily record their attendance, serving as the core feature of the system. In addition to attendance tracking, the app offers several supporting features such as announcements, which keep students informed with the latest school updates. It also includes a built-in map feature to help guide students to their school location—particularly useful for new students who may be unfamiliar with the area, as the map is centered on each respective school's location. On the administrative side, the web application enables school staff and administrators to efficiently manage student data. This includes functionalities such as student registration, data import and export, announcement creation, and more. Neqat provides a practical and centralized solution for schools to streamline attendance tracking and internal communication in a modern, accessible way.",
    tech: ["Flutter"],
    links: [{ label: "Mobile repository", href: "https://github.com/AbdulMalikMuzakir404/neqat-mobile" }, { label: "Web repository", href: "https://github.com/AbdulMalikMuzakir404/neqat-web" }],
    images: [
      { src: NeqatCheckin, alt: "NeQat \u2014 Check-in" },
      { src: NeqatAnnouncement, alt: "NeQat \u2014 Announcements" },
      { src: NeqatMaps, alt: "NeQat \u2014 School map" },
      { src: NeqatConfig, alt: "NeQat \u2014 Admin configuration" },
    ],
  },
  {
    slug: "bpr-christa-jaya",
    name: "BPR Christa Jaya",
    period: "2025 — Present",
    kind: "CMS",
    featured: false,
    media: "desktop",
    summary: "A CMS for managing the institution's website — logo, SEO settings, navigation, and other interface elements, without advanced technical expertise.",
    description:
      "BPR Crista Jaya is a content management system (CMS) application developed to manage the digital presence of the institution efficiently. It allows administrators to customize and control key website components such as the logo, SEO settings, navigation bar, and other interface elements. While tailored for the specific needs of BPR Crista Jaya, the platform functions much like a general-purpose CMS, offering familiar tools for managing content and site structure. This enables the organization to maintain a professional and up-to-date website without requiring advanced technical expertise, supporting both branding and communication needs in a modern and accessible way.",
    tech: [],
    links: [],
    images: [
      { src: BprChristaJayaHome, alt: "BPR Christa Jaya \u2014 Home page" },
      { src: BprChristaJayaAboutUs, alt: "BPR Christa Jaya \u2014 About us" },
      { src: BprChristaJayaFinancialReport, alt: "BPR Christa Jaya \u2014 Financial reports" },
      { src: BprChristaJayaNews, alt: "BPR Christa Jaya \u2014 News" },
    ],
  },
  {
    slug: "miura",
    name: "Miura",
    period: "2025 — Present",
    kind: "CMS",
    featured: false,
    media: "desktop",
    summary: "A CMS that lets administrators control the logo, SEO settings, navigation, and site content of Miura's website.",
    description:
      "Miura is a content management system (CMS) application developed to manage the digital presence of the institution efficiently. It allows administrators to customize and control key website components such as the logo, SEO settings, navigation bar, and other interface elements. While tailored for the specific needs of Miura, the platform functions much like a general-purpose CMS, offering familiar tools for managing content and site structure. This enables the organization to maintain a professional and up-to-date website without requiring advanced technical expertise, supporting both branding and communication needs in a modern and accessible way.",
    tech: [],
    links: [],
    images: [
      { src: MiuraHome1, alt: "Miura \u2014 Home page" },
      { src: MiuraHome2, alt: "Miura \u2014 Home page, section 2" },
      { src: MiuraHome3, alt: "Miura \u2014 Home page, section 3" },
      { src: MiuraNews, alt: "Miura \u2014 News" },
    ],
  },
  {
    slug: "seki-halsel",
    name: "Seki Halsel",
    period: "2024 — 2025",
    kind: "Government SaaS",
    featured: false,
    media: "desktop",
    summary: "An electronic personnel management system for the BKPPD of South Halmahera Regency, built on a multi-tenant, SaaS-style architecture.",
    description:
      "SEKI Halsel is an Electronic Personnel Management System (SEKI) developed for the Regional Personnel, Education, and Training Agency (BKPPD) of South Halmahera Regency. The application is designed to streamline and simplify the management of personnel data within the local government environment. SEKI Halsel adopts a multi-tenant architecture similar to a Software as a Service (SaaS) model, where a single application can support multiple organizational units or departments as independent tenants. This structure allows for centralized management while maintaining data separation and autonomy for each unit. The platform enhances efficiency in handling various administrative processes related to staffing, making it easier for the government to manage personnel records, training, and development programs in a digital, organized, and scalable way.",
    tech: ["Laravel", "PHP", "Vue.js", "Tailwind CSS", "Bootstrap", "MySQL"],
    links: [],
    images: [
      { src: SekiHalselDashboard, alt: "Seki Halsel \u2014 Dashboard" },
      { src: SekiHalselLogin, alt: "Seki Halsel \u2014 Login" },
    ],
  },
  {
    slug: "silato-kopi-saha",
    name: "Silato Kopi Saha LMS",
    period: "2024 — 2025",
    kind: "LMS",
    featured: false,
    media: "desktop",
    summary: "An LMS that trains SmartCoop cooperative employees to use the SmartCoop system on their own, through structured courses.",
    description:
      "Silato Kopi Saha is a Learning Management System (LMS) designed specifically for training cooperative employees who are registered members of the SmartCoop organization. This application serves as an educational platform to help members better understand and utilize the features of the SmartCoop system. By providing structured training courses, Silato Kopi Saha ensures that members can independently learn how to navigate and make the most of the platform's functionalities. This not only empowers users to become more proficient but also significantly reduces the need for repeated explanations from the SmartCoop team—training can be delivered once and accessed by all members at any time, improving efficiency and scalability in cooperative education and onboarding.",
    tech: [],
    links: [],
    images: [
      { src: SilatoKopiSahaIndex, alt: "Silato Kopi Saha LMS \u2014 Landing page" },
      { src: SilatoKopiSahaDashboard, alt: "Silato Kopi Saha LMS \u2014 Dashboard" },
      { src: SilatoKopiSahaTraining, alt: "Silato Kopi Saha LMS \u2014 Training" },
      { src: SilatoKopiSahaLogin, alt: "Silato Kopi Saha LMS \u2014 Login" },
    ],
  },
  {
    slug: "sipajonga",
    name: "Sipajonga Buton Tengah",
    period: "2023 — 2024",
    kind: "Tax management",
    featured: false,
    media: "desktop",
    summary: "A taxation management application for the Buton Tengah region.",
    description:
      "Sipajonga Buton Tengah is a taxation management application developed for the Buton Tengah region. My responsibilities on this project included resolving application bugs and developing new features to support effective tax data management. One of the key contributions was building a payment feature that enables users to pay their taxes online, providing a smoother and more efficient experience for taxpayers. All development and collaboration tasks were carried out within a GitHub-based workflow, ensuring a structured, trackable, and team-oriented development process.",
    tech: [],
    contribution: "Resolved application bugs and developed new features — including an online tax payment feature — within a GitHub-based workflow.",
    links: [],
    images: [
      { src: SipajongaPayment, alt: "Sipajonga Buton Tengah \u2014 Online payment" },
      { src: SipajongaStatistik, alt: "Sipajonga Buton Tengah \u2014 Statistics" },
    ],
  },
  {
    slug: "pms",
    name: "PMS — Project Management System",
    period: "2023 — 2024",
    kind: "Internal tool",
    featured: false,
    media: "desktop",
    summary: "An internal project management tool — task timelines, assignment tracking, team collaboration, and drag-and-drop task boards.",
    description:
      "PMS (Project Management System) is an internal application designed to help manage office projects efficiently. It provides features such as task timelines, assignment tracking, team collaboration, and visual task monitoring through an intuitive drag-and-drop interface. Tasks can be grouped and organized based on categories or priorities, making it easier for employees to manage their workload and stay on top of project progress. Overall, the application aims to streamline task management and improve productivity across teams by providing a centralized and user-friendly platform for organizing daily work activities.",
    tech: [],
    links: [],
    images: [
      { src: PmsTask, alt: "PMS \u2014 Project Management System \u2014 Task board" },
      { src: PmsDetailTask, alt: "PMS \u2014 Project Management System \u2014 Task detail" },
    ],
  },
];
