import { SectionHeader } from "@/components/SectionHeader";
import { SparklesCore } from "@/components/ui/Sparkles";
import { Timeline } from "@/components/ui/Timeline";
import Image from "next/image";

import {
  SmartcoopAcademyIndex,
  SmartcoopAcademyQuiz,
  SmartcoopAcademyRegister,
  SmartcoopAcademyTrainingModule,
  BprChristaJayaDashboard,
  BprChristaJayaIndex,
  BprChristaJayaInformation,
  BprChristaJayaLogin,
  DiabseninAnnouncement,
  DiabseninAnnouncementDetail,
  DiabseninLogin,
  DiabseninMaps,
  DiabseninNotification,
  DiabseninSignin,
  BigDataUMKMCatalog,
  BigDataUMKMIndex,
  BigDataUMKMDashboard,
  BigDataUMKMLogin,
  PortalSmartcoopCoperationData,
  PortalSmartcoopDashboardStatistik,
  PortalSmartcoopLogin,
  PortalSmartcoopStatistik,
  SekiHalselDashboard,
  SekiHalselLogin,
  SilatoKopiSahaDashboard,
  SilatoKopiSahaIndex,
  SilatoKopiSahaLogin,
  SilatoKopiSahaTraining,
  NeqatAnnouncement,
  NeqatCheckin,
  NeqatConfig,
  NeqatMaps,
  SipajongaPayment,
  SipajongaStatistik,
  PmsDetailTask,
  PmsTask,
} from "@/assets/experiences/index";
import {
  bprChristaJayaIcons,
  smartcoopAcademyIcons,
  diabseninIcons,
  bigdataumkmIcons,
  portalSmartcoopIcons,
  sekiHalselIcons,
  silatoKopiSahaIcons,
  neqatIcons,
  sipajongaIcons,
  pmsIcons
} from "@/utils/const";

export const Experience = () => {
  return (
    <section id="experience" className="relative py-16 lg:py-24">
      <div id="experience-anchor" className="absolute -top-32 h-px w-full" />
      <div className="container">
        <div className="w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
          <SectionHeader
            eyebrow="Work Experience"
            title="Projects I&#39;ve Worked On"
            description="These are some of the projects I&#39;ve completed and ones currently in progress — showcasing my experience and ongoing work."
          />
          <div className="w-[40rem] h-40 mt-5 relative">
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />

            <div className="absolute inset-0 w-full h-full bg-slate-950 [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
          </div>
        </div>
      </div>
      <Timeline data={workexperiences} />
    </section>
  );
};

export const workexperiences = [
  {
    title: "2025 - Present",
    content: (
      <>
        <div>
          <p className="text-9xl font-bold font-sans text-neutral-800 md:text-lg dark:text-neutral-200">
            Smartcoop Academy
          </p>
          <p className="mb-4 text-xs font-normal font-sans text-neutral-800 md:text-sm dark:text-neutral-200">
            SmartCoop Academy is a comprehensive digital learning platform
            developed to support continuous education and skill development for
            cooperative members, staff, and stakeholders. It offers a wide range
            of interactive and engaging learning methods, including video
            tutorials, quizzes, webinars via Zoom, and other multimedia-based
            training modules. The platform is designed to be user-friendly and
            accessible anytime, anywhere, making it easier for users to learn at
            their own pace. SmartCoop Academy covers various topics relevant to
            cooperative development, business management, financial literacy,
            entrepreneurship, and more. Participants who successfully complete
            courses or training programs are awarded digital certificates as
            formal recognition of their achievements. These certificates can
            serve as valuable credentials for personal growth and professional
            development. Whether you&#39;re a beginner looking to understand the
            basics or a professional seeking advanced insights, SmartCoop
            Academy is your trusted partner in lifelong learning.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={SmartcoopAcademyIndex.src}
              alt="Smartcoop Academy Index"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={SmartcoopAcademyQuiz.src}
              alt="Smartcoop Academy Quiz"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={SmartcoopAcademyRegister.src}
              alt="Smartcoop Academy Register"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={SmartcoopAcademyTrainingModule.src}
              alt="Smartcoop Academy Training Module"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
          </div>
          <div className="flex items-center mt-4">
            {smartcoopAcademyIcons.map((icon, index) => (
              <div
                key={index}
                className="border border-black/[.2] rounded-full bg-gradient-to-r from-emerald-200 to-sky-300 lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                style={{
                  transform: `translateX(-${5 * index + 2}px)`,
                }}
              >
                <icon.icon className="w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-9xl pt-10 font-bold font-sans text-neutral-800 md:text-lg dark:text-neutral-200">
            BPR Christa Jaya
          </p>
          <p className="mb-4 text-xs font-normal font-sans text-neutral-800 md:text-sm dark:text-neutral-200">
            BPR Crista Jaya is a content management system (CMS) application
            developed to manage the digital presence of the institution
            efficiently. It allows administrators to customize and control key
            website components such as the logo, SEO settings, navigation bar,
            and other interface elements. While tailored for the specific needs
            of BPR Crista Jaya, the platform functions much like a
            general-purpose CMS, offering familiar tools for managing content
            and site structure. This enables the organization to maintain a
            professional and up-to-date website without requiring advanced
            technical expertise, supporting both branding and communication
            needs in a modern and accessible way.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={BprChristaJayaDashboard.src}
              alt="Smartcoop Academy Index"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={BprChristaJayaIndex.src}
              alt="Smartcoop Academy Quiz"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={BprChristaJayaInformation.src}
              alt="Smartcoop Academy Register"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={BprChristaJayaLogin.src}
              alt="Smartcoop Academy Training Module"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
          </div>
          <div className="flex items-center mt-4">
            {bprChristaJayaIcons.map((icon, index) => (
              <div
                key={index}
                className="border border-black/[.2] rounded-full bg-gradient-to-r from-emerald-200 to-sky-300 lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                style={{
                  transform: `translateX(-${5 * index + 2}px)`,
                }}
              >
                <icon.icon className="w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-9xl pt-10 font-bold font-sans text-neutral-800 md:text-lg dark:text-neutral-200">
            Diabsenin
          </p>
          <p className="mb-4 text-xs font-normal font-sans text-neutral-800 md:text-sm dark:text-neutral-200">
            Diabsenin is a modern attendance application designed for students,
            available on both mobile and web platforms. The mobile app is
            specifically developed for students to easily submit their daily
            attendance, making the process more efficient and accessible. In
            addition to attendance as its core feature, the application includes
            several supporting functions such as an announcement section, where
            students can receive real-time updates and important school
            information. It also features an integrated map to help
            students—especially new ones—navigate to their school location,
            making it particularly useful for those unfamiliar with the area.
            Another notable feature is the student ranking system, which serves
            as a form of recognition for students who consistently maintain good
            attendance. On the other hand, the web-based version is designed for
            school administrators and staff, allowing them to manage student
            data effectively. This includes the ability to register students,
            import and export data in bulk, publish announcements, and generate
            attendance reports in PDF format. The platform provides a
            centralized and organized system for handling administrative tasks
            related to student presence and school communication. In the future,
            Diabsenin is planned to be integrated with IoT technology to enable
            automated attendance tracking through smart devices, further
            streamlining the process and enhancing accuracy. As an all-in-one
            solution, Diabsenin not only improves attendance management but also
            strengthens the connection between students and school
            administration through real-time information sharing and digital
            convenience.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={DiabseninAnnouncement.src}
              alt="Diabsenin Announcement"
              width={600}
              height={1200}
              className="w-full rounded-lg object-scale-down shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={DiabseninAnnouncementDetail.src}
              alt="Diabsenin Announcement Detail"
              width={600}
              height={1200}
              className="w-full rounded-lg object-scale-down shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={DiabseninLogin.src}
              alt="Diabsenin Login"
              width={600}
              height={1200}
              className="w-full rounded-lg object-scale-down shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={DiabseninMaps.src}
              alt="Diabsenin Maps"
              width={600}
              height={1200}
              className="w-full rounded-lg object-scale-down shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={DiabseninNotification.src}
              alt="Diabsenin Notification"
              width={600}
              height={1200}
              className="w-full rounded-lg object-scale-down shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={DiabseninSignin.src}
              alt="Diabsenin Signin"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
          </div>
          <div className="flex items-center mt-4">
            {diabseninIcons.map((icon, index) => (
              <div
                key={index}
                className="border border-black/[.2] rounded-full bg-gradient-to-r from-emerald-200 to-sky-300 lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                style={{
                  transform: `translateX(-${5 * index + 2}px)`,
                }}
              >
                <icon.icon className="w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
      </>
    ),
  },
  {
    title: "2024 - 2025",
    content: (
      <>
        <div>
          <p className="text-9xl font-bold font-sans text-neutral-800 md:text-lg dark:text-neutral-200">
            Big Data UMKM
          </p>
          <p className="mb-4 text-xs font-normal font-sans text-neutral-800 md:text-sm dark:text-neutral-200">
            BigDataUMKM is a data management platform designed to centralize and
            streamline information related to Micro, Small, and Medium
            Enterprises (MSMEs) registered across Indonesia. Built to handle
            large-scale data efficiently, the platform provides powerful
            features such as bulk data import and export, making it easy for
            institutions and stakeholders to manage and analyze MSME data at
            scale. Through BigDataUMKM, registered MSMEs can receive targeted
            mentoring and support to help them grow and sustain their
            businesses. Additionally, the platform allows MSMEs to showcase and
            share their products directly, providing visibility and potential
            market opportunities within the ecosystem. BigDataUMKM not only
            simplifies data administration but also empowers MSMEs with tools
            and insights that enhance their digital presence, operational
            capacity, and access to development resources. It serves as a vital
            bridge between MSMEs, government programs, mentors, and potential
            buyers. Whether for data analysis, business development, or
            collaboration, BigDataUMKM is a reliable solution that supports the
            growth of Indonesia&#39;s MSME sector.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={BigDataUMKMCatalog.src}
              alt="BIG DATA UMKM Catalog"
              width={1200}
              height={600}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={BigDataUMKMIndex.src}
              alt="BIG DATA UMKM Index"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={BigDataUMKMDashboard.src}
              alt="BIG DATA UMKM Dashboard"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={BigDataUMKMLogin.src}
              alt="BIG DATA UMKM Login"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
          </div>
          <div className="flex items-center mt-4">
            {bigdataumkmIcons.map((icon, index) => (
              <div
                key={index}
                className="border border-black/[.2] rounded-full bg-gradient-to-r from-emerald-200 to-sky-300 lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                style={{
                  transform: `translateX(-${5 * index + 2}px)`,
                }}
              >
                <icon.icon className="w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-9xl pt-10 font-bold font-sans text-neutral-800 md:text-lg dark:text-neutral-200">
            Portal Smartcoop
          </p>
          <p className="mb-4 text-xs font-normal font-sans text-neutral-800 md:text-sm dark:text-neutral-200">
            Portal SmartCoop is an integrated management application designed to
            facilitate the administration of cooperative data, including
            transactions such as purchases, rentals, membership records, and
            more. The platform offers a wide range of features to simplify data
            processing and decision-making for cooperatives. Key functionalities
            include automated calculations of total billing costs, member
            statistics, cooperative statuses (active/inactive), and other
            essential indicators. The platform also provides intuitive data
            visualization through dynamic charts and graphs, allowing users to
            monitor key metrics more effectively. To further enhance
            productivity, Portal SmartCoop supports bulk data import and export,
            PDF conversion for report sharing, and seamless integration with
            external systems such as the Inventory Management System (IMS) and
            Diskuk (local cooperative and SME development platforms). Whether
            for operational tracking, performance evaluation, or regulatory
            reporting, Portal SmartCoop delivers a powerful and user-friendly
            environment to manage cooperatives with ease and accuracy.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={PortalSmartcoopCoperationData.src}
              alt="Portal Smartcoop Coperation Data"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={PortalSmartcoopDashboardStatistik.src}
              alt="Portal Smartcoop Dashboard Statistik"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={PortalSmartcoopLogin.src}
              alt="Portal Smartcoop Login"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={PortalSmartcoopStatistik.src}
              alt="Portal Smartcoop Statistik"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
          </div>
          <div className="flex items-center mt-4">
            {portalSmartcoopIcons.map((icon, index) => (
              <div
                key={index}
                className="border border-black/[.2] rounded-full bg-gradient-to-r from-emerald-200 to-sky-300 lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                style={{
                  transform: `translateX(-${5 * index + 2}px)`,
                }}
              >
                <icon.icon className="w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-9xl pt-10 font-bold font-sans text-neutral-800 md:text-lg dark:text-neutral-200">
            Seki Halsel
          </p>
          <p className="mb-4 text-xs font-normal font-sans text-neutral-800 md:text-sm dark:text-neutral-200">
            SEKI Halsel is an Electronic Personnel Management System (SEKI)
            developed for the Regional Personnel, Education, and Training Agency
            (BKPPD) of South Halmahera Regency. The application is designed to
            streamline and simplify the management of personnel data within the
            local government environment. SEKI Halsel adopts a multi-tenant
            architecture similar to a Software as a Service (SaaS) model, where
            a single application can support multiple organizational units or
            departments as independent tenants. This structure allows for
            centralized management while maintaining data separation and
            autonomy for each unit. The platform enhances efficiency in handling
            various administrative processes related to staffing, making it
            easier for the government to manage personnel records, training, and
            development programs in a digital, organized, and scalable way.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={SekiHalselDashboard.src}
              alt="Seki Halsel Dashboard"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={SekiHalselLogin.src}
              alt="Seki Halsel Login"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
          </div>
          <div className="flex items-center mt-4">
            {sekiHalselIcons.map((icon, index) => (
              <div
                key={index}
                className="border border-black/[.2] rounded-full bg-gradient-to-r from-emerald-200 to-sky-300 lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                style={{
                  transform: `translateX(-${5 * index + 2}px)`,
                }}
              >
                <icon.icon className="w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-9xl pt-10 font-bold font-sans text-neutral-800 md:text-lg dark:text-neutral-200">
            Silato Kopi Saha LMS
          </p>
          <p className="mb-4 text-xs font-normal font-sans text-neutral-800 md:text-sm dark:text-neutral-200">
            Silato Kopi Saha is a Learning Management System (LMS) designed
            specifically for training cooperative employees who are registered
            members of the SmartCoop organization. This application serves as an
            educational platform to help members better understand and utilize
            the features of the SmartCoop system. By providing structured
            training courses, Silato Kopi Saha ensures that members can
            independently learn how to navigate and make the most of the
            platform&#39;s functionalities. This not only empowers users to become
            more proficient but also significantly reduces the need for repeated
            explanations from the SmartCoop team—training can be delivered once
            and accessed by all members at any time, improving efficiency and
            scalability in cooperative education and onboarding.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={SilatoKopiSahaDashboard.src}
              alt="Silato Kopi Saha Dashboard"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={SilatoKopiSahaIndex.src}
              alt="Silato Kopi Saha Index"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={SilatoKopiSahaLogin.src}
              alt="Silato Kopi Saha Index"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={SilatoKopiSahaTraining.src}
              alt="Silato Kopi Saha Training"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
          </div>
          <div className="flex items-center mt-4">
            {silatoKopiSahaIcons.map((icon, index) => (
              <div
                key={index}
                className="border border-black/[.2] rounded-full bg-gradient-to-r from-emerald-200 to-sky-300 lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                style={{
                  transform: `translateX(-${5 * index + 2}px)`,
                }}
              >
                <icon.icon className="w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
      </>
    ),
  },
  {
    title: "2023 - 2024",
    content: (
      <>
        <div>
          <p className="text-9xl pt-10 font-bold font-sans text-neutral-800 md:text-lg dark:text-neutral-200">
            NeQat
          </p>
          <p className="mb-4 text-xs font-normal font-sans text-neutral-800 md:text-sm dark:text-neutral-200">
            Neqat is a student attendance application available on both mobile
            and web platforms. The mobile application is specifically designed
            for students to easily record their attendance, serving as the core
            feature of the system. In addition to attendance tracking, the app
            offers several supporting features such as announcements, which keep
            students informed with the latest school updates. It also includes a
            built-in map feature to help guide students to their school
            location—particularly useful for new students who may be unfamiliar
            with the area, as the map is centered on each respective school&#39;s
            location. On the administrative side, the web application enables
            school staff and administrators to efficiently manage student data.
            This includes functionalities such as student registration, data
            import and export, announcement creation, and more. Neqat provides a
            practical and centralized solution for schools to streamline
            attendance tracking and internal communication in a modern,
            accessible way.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={NeqatAnnouncement.src}
              alt="NeQat Announcement"
              width={600}
              height={1200}
              className="w-full rounded-lg object-scale-down shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={NeqatCheckin.src}
              alt="NeQat Checkin"
              width={600}
              height={1200}
              className="w-full rounded-lg object-scale-down shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={NeqatMaps.src}
              alt="NeQat Maps"
              width={600}
              height={1200}
              className="w-full rounded-lg object-scale-down shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={NeqatConfig.src}
              alt="NeQat Config"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
          </div>
          <div className="flex items-center mt-4">
            {neqatIcons.map((icon, index) => (
              <div
                key={index}
                className="border border-black/[.2] rounded-full bg-gradient-to-r from-emerald-200 to-sky-300 lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                style={{
                  transform: `translateX(-${5 * index + 2}px)`,
                }}
              >
                <icon.icon className="w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-9xl pt-10 font-bold font-sans text-neutral-800 md:text-lg dark:text-neutral-200">
            Sipajonga Button Tengah
          </p>
          <p className="mb-4 text-xs font-normal font-sans text-neutral-800 md:text-sm dark:text-neutral-200">
            Sipajonga Buton Tengah is a taxation management application
            developed for the Buton Tengah region. My responsibilities on this
            project included resolving application bugs and developing new
            features to support effective tax data management. One of the key
            contributions was building a payment feature that enables users to
            pay their taxes online, providing a smoother and more efficient
            experience for taxpayers. All development and collaboration tasks
            were carried out within a GitHub-based workflow, ensuring a
            structured, trackable, and team-oriented development process.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={SipajongaPayment.src}
              alt="Sipajongan Payment"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={SipajongaStatistik.src}
              alt="Sipajongan Statistik"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
          </div>
          <div className="flex items-center mt-4">
            {sipajongaIcons.map((icon, index) => (
              <div
                key={index}
                className="border border-black/[.2] rounded-full bg-gradient-to-r from-emerald-200 to-sky-300 lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                style={{
                  transform: `translateX(-${5 * index + 2}px)`,
                }}
              >
                <icon.icon className="w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-9xl pt-10 font-bold font-sans text-neutral-800 md:text-lg dark:text-neutral-200">
            PMS (Project Manajemen Sistem)
          </p>
          <p className="mb-4 text-xs font-normal font-sans text-neutral-800 md:text-sm dark:text-neutral-200">
            PMS (Project Management System) is an internal application designed
            to help manage office projects efficiently. It provides features
            such as task timelines, assignment tracking, team collaboration, and
            visual task monitoring through an intuitive drag-and-drop interface.
            Tasks can be grouped and organized based on categories or
            priorities, making it easier for employees to manage their workload
            and stay on top of project progress. Overall, the application aims
            to streamline task management and improve productivity across teams
            by providing a centralized and user-friendly platform for organizing
            daily work activities.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={PmsDetailTask.src}
              alt="PMS Detail Task"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
            <Image
              src={PmsTask.src}
              alt="PMS Task"
              width={500}
              height={500}
              className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] h-20 md:h-44 lg:h-60"
            />
          </div>
          <div className="flex items-center mt-4">
            {pmsIcons.map((icon, index) => (
              <div
                key={index}
                className="border border-black/[.2] rounded-full bg-gradient-to-r from-emerald-200 to-sky-300 lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                style={{
                  transform: `translateX(-${5 * index + 2}px)`,
                }}
              >
                <icon.icon className="w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
      </>
    ),
  },
];
