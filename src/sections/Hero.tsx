import { HeroOrbit } from "@/components/HeroOrbit";
import GrainImage from "@/assets/images/grain.jpg";
import StarIcon from "@/assets/icons/star.svg";
import SparkleIcom from "@/assets/icons/sparkle.svg";
import { Cover } from "@/components/ui/Cover";
import { ExploreMyWorkButton } from "@/components/ExploreMyWorkButton";
import { CVButton } from "@/components/CVButton";
import { Border } from "@/components/ui/MovingBorder";

export const HeroSection = () => {
  const openMyCV = () => {
    const pdfUrl = "cv/CV2025.pdf";
    window.open(pdfUrl, "_blank");
  };

  return (
    <section
      id="home"
      className="relative py-32 md:py-50 lg:py-60 z-0 overflow-x-clip"
    >
      <div id="home-anchor" className="absolute" />
      <div
        className="absolute inset-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 70%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 70%, transparent)",
        }}
      >
        <div
          className="absolute inset-0 -z-30 opacity-5"
          style={{
            backgroundImage: `url(${GrainImage.src})`,
          }}
        />
        <div className="size-[620px] hero-ring" />
        <div className="size-[820px] hero-ring" />
        <div className="size-[1020px] hero-ring" />
        <div className="size-[1220px] hero-ring" />
        <HeroOrbit
          size={430}
          rotation={-14}
          shouldOrbit
          orbitDuration="30s"
          shouldSpin
          spinDuration="3s"
        >
          <SparkleIcom className="size-8 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit
          size={440}
          rotation={79}
          shouldOrbit
          orbitDuration="33s"
          shouldSpin
          spinDuration="3s"
        >
          <SparkleIcom className="size-5 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit
          size={460}
          rotation={-14}
          shouldOrbit
          orbitDuration="20s"
          shouldSpin
          spinDuration="2s"
        >
          <SparkleIcom className="size-8 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={520} rotation={-41} shouldOrbit orbitDuration="34s">
          <div className="size-2 rounded-full bg-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit
          size={530}
          rotation={178}
          shouldOrbit
          orbitDuration="36s"
          shouldSpin
          spinDuration="3s"
        >
          <SparkleIcom className="size-10 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit
          size={550}
          rotation={20}
          shouldOrbit
          orbitDuration="38s"
          shouldSpin
          spinDuration="6s"
        >
          <StarIcon className="size-12 text-emerald-300" />
        </HeroOrbit>
        <HeroOrbit
          size={590}
          rotation={98}
          shouldOrbit
          orbitDuration="40s"
          shouldSpin
          spinDuration="6s"
        >
          <StarIcon className="size-8 text-emerald-300" />
        </HeroOrbit>
        <HeroOrbit size={650} rotation={-5} shouldOrbit orbitDuration="42s">
          <div className="size-2 rounded-full bg-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit
          size={710}
          rotation={144}
          shouldOrbit
          orbitDuration="44s"
          shouldSpin
          spinDuration="3s"
        >
          <SparkleIcom className="size-14 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={720} rotation={85} shouldOrbit orbitDuration="46s">
          <div className="size-3 rounded-full bg-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit
          size={800}
          rotation={0}
          shouldOrbit
          orbitDuration="48s"
          shouldSpin
          spinDuration="6s"
        >
          <StarIcon className="size-28 text-emerald-300" />
        </HeroOrbit>
        <HeroOrbit
          size={980}
          rotation={-100}
          shouldOrbit
          orbitDuration="48s"
          shouldSpin
          spinDuration="6s"
        >
          <StarIcon className="size-28 text-emerald-300" />
        </HeroOrbit>
        <HeroOrbit
          size={850}
          rotation={-50}
          shouldOrbit
          orbitDuration="40s"
          shouldSpin
          spinDuration="6s"
        >
          <StarIcon className="size-20 text-emerald-300" />
        </HeroOrbit>
        <HeroOrbit
          size={700}
          rotation={130}
          shouldOrbit
          orbitDuration="40s"
          shouldSpin
          spinDuration="6s"
        >
          <StarIcon className="size-20 text-emerald-300" />
        </HeroOrbit>
      </div>
      <div className="container relative z-[10]">
        <div className="flex flex-col items-center md:pb-20 lg:pb-30">
          <Border>
            <div className="bg-gray-950 px-4 py-1.5 inline-flex items-center gap-4 rounded-full">
              <div className="bg-green-500 size-2.5 rounded-full relative">
                <div className="bg-green-500 absolute inset-0 rounded-full animate-ping-large"></div>
              </div>
              <div className="text-sm font-medium">
                Available for new projects
              </div>
            </div>
          </Border>
        </div>
        <div className="mx-auto">
          <h1 className="font-serif text-3xl md:text-5xl text-center mt-8 tracking-wide">
            Bringing your dreams to life with cutting-edge{" "}
            <Cover>software solutions</Cover>
          </h1>
          <p className="mt-4 text-center text-white/60 md:text-lg">
            I am a software engineer with almost two years of experience,
            specializing in back-end and mobile development using technologies
            such as NestJS and Laravel. I am also skilled in front-end
            development with frameworks like Vue.js and Next.js,and I have
            experience building mobile applications using Flutter.
          </p>
          <p className="mt-4 text-center text-white/60 md:text-lg">
            Programming is not just a profession for me—it&#39;s a passion. I am a
            quick learner who adheres to best practices, consistently delivering
            high-quality solutions efficiently and on time.
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center mt-8 gap-4">
          <ExploreMyWorkButton />
          <CVButton />
        </div>
      </div>
    </section>
  );
};
