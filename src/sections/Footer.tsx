import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";

const footerLinks = [
  {
    title: "Youtube",
    href: "",
  },
  {
    title: "Twitter",
    href: "",
  },
  {
    title: "Instagram",
    href: "",
  },
  {
    title: "LinkedIn",
    href: "",
  },
];

export const Footer = () => {
  return (
    <footer className="relative -z-10 overflow-x-clip">
      <div
        className="absolute bottom-0 left-1/2 h-[280px] w-[1600px] -translate-x-1/2 bg-emerald-300/30 -z-10"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse at bottom center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 40%, transparent 80%)",
          maskImage:
            "radial-gradient(ellipse at bottom center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 40%, transparent 80%)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      />
      <div className="container">
        <div className="border-t border-white/15 py-6 text-sm flex flex-col md:flex-row md:justify-between items-center gap-8">
          <div className="text-white/40">&copy; 2025 Abdul Malik Muzakir. All rights reserved.</div>
          <nav className="flex flex-col md:flex-row items-center gap-8">
            {footerLinks.map((link) => (
              <a
                href=""
                key={link.title}
                className="inline-flex items-center gap-1.5"
              >
                <span className="font-semibold">{link.title}</span>
                <ArrowUpRightIcon className="size-4" />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
