import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="page flex flex-col gap-4 py-8 text-[13px] text-muted md:flex-row md:items-center md:justify-between">
        <p className="ftr-type w-fit">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <a href="#home" className="ftr-in link w-fit">
          Back to top <span aria-hidden>↑</span>
        </a>
      </div>
    </footer>
  );
}
