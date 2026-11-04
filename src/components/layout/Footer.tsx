import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div data-swarm-row="footer" className="page relative flex flex-col gap-4 py-8 text-[13px] text-muted md:flex-row md:items-center md:justify-between">
        <p className="w-fit" data-build="footer.copy">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <a href="#home" className="link w-fit" data-build="footer.top">
          Back to top <span aria-hidden>↑</span>
        </a>
      </div>
    </footer>
  );
}
