import { WobbleCard } from "@/components/ui/WobbleCard";
import Image from "next/image";
import LinearImage from "@/assets/images/linear.webp";
import { HoverEffect } from "@/components/ui/CardHoverEffect";

export const projects = [
  {
    title: "Stripe",
    description:
      "A technology company that builds economic infrastructure for the internet.",
    link: "https://stripe.com",
  },
  {
    title: "Netflix",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
    link: "https://netflix.com",
  },
  {
    title: "Google",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
    link: "https://google.com",
  },
  {
    title: "Meta",
    description:
      "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
    link: "https://meta.com",
  },
  {
    title: "Amazon",
    description:
      "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    link: "https://amazon.com",
  },
  {
    title: "Microsoft",
    description:
      "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
    link: "https://microsoft.com",
  },
];

export function Wobble() {
  return (
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
          className=""
        >
          <div className="max-w-xs">
            <h2 className="font-serif text-left text-balance text-base md:text-xl lg:text-3xl tracking-[-0.015em] text-white">
              Driven by Purpose
            </h2>
            <p className="font-sans mt-4 text-left text-base/6 text-neutral-200">
              I approach every line of code with intent—aiming to create
              experiences that are meaningful, efficient, and impactful.
            </p>
          </div>
          <Image
            src={LinearImage}
            alt="linear demo image"
            style={{ width: "500px", height: "300px" }}
            className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
          />
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 min-h-[300px]">
          <h2 className="font-serif max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl tracking-[-0.015em] text-white">
            Crafted with Precision
          </h2>
          <p className="font-sans mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            I prioritize clean code, scalability, and maintainability—ensuring
            that each solution is built on a solid foundation.
          </p>
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[300px] lg:min-h-[300px] xl:min-h-[300px]">
          <div className="max-w-sm">
            <h2 className="font-serif max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl tracking-[-0.015em] text-white">
              Always Improving
            </h2>
            <p className="font-sans mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
              Tech never stops evolving, and neither do I. I continuously
              explore new tools, frameworks, and methodologies to sharpen my
              skills.
            </p>
          </div>
          <Image
            src={LinearImage}
            style={{ width: "500px", height: "300px" }}
            alt="linear demo image"
            className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
          />
        </WobbleCard>
      </div>
    </div>
  );
}
