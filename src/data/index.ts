export const navItems = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  // { name: "Testimonials", link: "#testimonials" },
  { name: "Contact", link: "#contact" },
];

export const gridItems = [
  {
    id: 1,
    title: "I prioritize client collaboration, fostering open communication",
    description: "",
    className:
      "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[clamp(40rem, 60vh, 70rem)]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "/b1.svg",
    spareImg: "",
  },
  {
    id: 2,
    title: "I'm very flexible with time zone communications",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My tech stack",
    description: "I constantly try to improve",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Tech enthusiast with a passion for development.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title: "Currently building a JS Animation library",
    description: "The Inside Scoop",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Would you like to see my CV?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export const projects = [
  {
    id: 1,
    title: "Big Data UMKM",
    des: "Big Data UMKM is a specialized tool designed to manage large-scale data for Micro, Small, and Medium Enterprises (MSMEs). This application simplifies MSME data management with advanced features such as real-time data analysis, interactive data visualization, and integration with various data sources. With BigDataUKM, MSMEs can make better and more informed decisions based on accurate and up-to-date data.",
    img: "project/thumbnail/bigdatauk.png",
    iconLists: [
      "project/technology/laravel.svg",
      "project/technology/vuejs.svg",
      "project/technology/tail.svg",
      "project/technology/bootstrap.svg",
      "project/technology/css.svg",
      "project/technology/postgresql.svg",
    ],
    link: "#!",
  },
  {
    id: 2,
    title: "My E-Task",
    des: "The My E Task app is a mobile-based employee attendance system that simplifies tracking check-ins and check-outs, enabling employees to log their attendance directly from their smartphones. This app features GPS-based location tracking to confirm employees' presence at designated work sites, adding accountability and enhancing remote workforce management. My E Task also allows employees to submit leave requests, which managers can review and approve instantly, streamlining the approval process. By digitizing attendance and centralizing records, My E Task improves productivity, reduces errors, and provides managers with real-time data to manage attendance and performance effectively.",
    img: "project/thumbnail/myetask.png",
    iconLists: ["project/technology/flutter.svg"],
    link: "#!",
  },
  {
    id: 3,
    title: "Neqat",
    des: "NeQat App is a digital solution designed to manage the attendance process in schools. It has two main components, a mobile application for students and a website for administrators. NeQat aims to simplify attendance management, replace manual systems, and allow students and teachers to access information and perform attendance-related actions more easily.",
    img: "project/thumbnail/neqat.png",
    iconLists: ["project/technology/flutter.svg"],
    link: "#!",
  },
  {
    id: 4,
    title: "Portal Smartcoop",
    des: "Smartcoop portal is a portal application that manages a lot of data from various applications developed by four vision media, the purpose of making this smartcoop portal application is to make it easier for users to view and manage data when large and from various applications that are managed in one application, the application developed uses the laravel base framework and vue js, the laravel used is not plain laravel but has been modified by four vision media senior developers, and vue js as a user interface.",
    img: "project/thumbnail/portalsmartcoop.png",
    iconLists: [
      "project/technology/laravel.svg",
      "project/technology/vuejs.svg",
      "project/technology/tail.svg",
      "project/technology/bootstrap.svg",
      "project/technology/css.svg",
      "project/technology/mysql.svg",
      "project/technology/redis.svg",
    ],
    link: "#!",
  },
  {
    id: 5,
    title: "Pro Bumdes",
    des: "Pro Bumdes application that aims to assist BUMDes managers in carrying out BUMDes business activities professionally through the support of a website-based application software that is equipped with accounting standard Financial Report features.",
    img: "project/thumbnail/probumdes.png",
    iconLists: [
      "project/technology/laravel.svg",
      "project/technology/bootstrap.svg",
      "project/technology/css.svg",
      "project/technology/postgresql.svg",
    ],
    link: "#!",
  },
  {
    id: 6,
    title: "Seki Halsel",
    des: "Seki Halsel application is a digital solution designed to manage personnel data and support regional education and training. This application employs a multi-tenant feature, allowing a master application, sekihalsel.4visionmedia.net, to serve as the central management hub for various subsidiary applications such as bappelitbangda.sekihalsel.4visionmedia.net and others. This approach enables each unit or agency to independently access and manage their data while remaining integrated within the same system, thereby enhancing data efficiency and consistency.",
    img: "project/thumbnail/sekihalsel.png",
    iconLists: [
      "project/technology/laravel.svg",
      "project/technology/php.svg",
      "project/technology/bootstrap.svg",
      "project/technology/tail.svg",
      "project/technology/css.svg",
      "project/technology/vuejs.svg",
      "project/technology/mysql.svg",
    ],
    link: "#!",
  },
  {
    id: 7,
    title: "Diskuk LMS",
    des: "DISKUK LMS is an online learning application that is designed to be as simple as possible without reducing performance in the application, this application has been used by several parties including employees of four vision media itself.",
    img: "project/thumbnail/diskuklms.png",
    iconLists: [
      "project/technology/laravel.svg",
      "project/technology/bootstrap.svg",
      "project/technology/tail.svg",
      "project/technology/css.svg",
      "project/technology/mysql.svg",
    ],
    link: "#!",
  },
  {
    id: 8,
    title: "Sipajonga Buton Tengah",
    des: "Sipajonga Buton Tengah is a taxation application. My responsibilities included resolving bugs and building a new feature to manage taxation data and creating a payment feature to pay taxes online on the Github workflow by Basic Teknologi's leadership.",
    img: "project/thumbnail/sipajongabutontengah.png",
    iconLists: [
      "project/technology/laravel.svg",
      "project/technology/bootstrap.svg",
      "project/technology/css.svg",
      "project/technology/jquery.svg",
      "project/technology/mysql.svg",
    ],
    link: "#!",
  },
];

export const testimonials = [
  {
    quote:
      "Collaborating with Abdul was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Abdul's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Abdul is the ideal partner.",
    name: "Michael Johnson",
    title: "Director of AlphaStream Technologies",
  },
  {
    quote:
      "Collaborating with Abdul was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Abdul's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Abdul is the ideal partner.",
    name: "Michael Johnson",
    title: "Director of AlphaStream Technologies",
  },
  {
    quote:
      "Collaborating with Abdul was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Abdul's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Abdul is the ideal partner.",
    name: "Michael Johnson",
    title: "Director of AlphaStream Technologies",
  },
  {
    quote:
      "Collaborating with Abdul was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Abdul's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Abdul is the ideal partner.",
    name: "Michael Johnson",
    title: "Director of AlphaStream Technologies",
  },
  {
    quote:
      "Collaborating with Abdul was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Abdul's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Abdul is the ideal partner.",
    name: "Michael Johnson",
    title: "Director of AlphaStream Technologies",
  },
];

export const companies = [
  {
    id: 1,
    name: "cloudinary",
    img: "/cloud.svg",
    nameImg: "/cloudName.svg",
  },
  {
    id: 2,
    name: "appwrite",
    img: "/app.svg",
    nameImg: "/appName.svg",
  },
  {
    id: 3,
    name: "HOSTINGER",
    img: "/host.svg",
    nameImg: "/hostName.svg",
  },
  {
    id: 4,
    name: "stream",
    img: "/s.svg",
    nameImg: "/streamName.svg",
  },
  {
    id: 5,
    name: "docker.",
    img: "/dock.svg",
    nameImg: "/dockerName.svg",
  },
];

export const workExperience = [
  {
    id: 1,
    title: "Frontend Engineer",
    desc: "Contributed to the development of an interactive, responsive web platform using Vue.js. Enhanced user engagement through intuitive UI elements and optimized load performance.",
    className: "md:col-span-2",
    thumbnail: "/exp1.svg",
  },
  {
    id: 2,
    title: "Mobile Application Developer",
    desc: "Designed and developed a cross-platform mobile application for iOS and Android using Flutter, focusing on seamless user experience, performance optimization, and smooth integration with backend services.",
    className: "md:col-span-2",
    thumbnail: "/exp2.svg",
  },
  {
    id: 3,
    title: "Backend Developer",
    desc: "Engineered scalable backend systems using Nest.js and Laravel, including RESTful APIs and database architectures, with a focus on security, maintainability, and efficient data handling.",
    className: "md:col-span-2",
    thumbnail: "/exp4.svg",
  },
  {
    id: 4,
    title: "Freelance Developer",
    desc: "Collaborated with clients on various freelance projects, delivering custom software solutions across web and mobile platforms, and ensuring high quality and timely delivery.",
    className: "md:col-span-2",
    thumbnail: "/exp3.svg",
  },
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
  },
  {
    id: 2,
    img: "/twit.svg",
  },
  {
    id: 3,
    img: "/link.svg",
  },
];
