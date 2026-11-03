import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" data-swarm-scene="contact" className="dot-grid relative py-28 md:py-40">
      <div className="page">
        <p className="label" data-build="contact.kicker">
          06 — Contact
        </p>
        <h2 id="contact-title" data-build="contact.title" className="mt-6 max-w-[17ch] font-serif text-[clamp(3rem,1.8rem+5.4vw,7.5rem)] leading-[0.95] tracking-[-0.02em]">
          Let&rsquo;s create something <em className="text-accent/95">amazing</em> together
        </h2>
        <p className="mt-8 max-w-xl text-lede text-muted">
          Ready to bring your next project to life? Let&rsquo;s connect and discuss how I can help you achieve your goals.
        </p>

        <ul className="mt-12 flex w-fit flex-wrap gap-3" data-build="contact.actions">
          <li>
            <a href={`mailto:${profile.email}`} className="btn-primary">
              {profile.email}
            </a>
          </li>
          <li>
            <a href={profile.phone.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              WhatsApp <span aria-hidden>↗</span>
            </a>
          </li>
          <li>
            <a href={`tel:${profile.phone.tel}`} className="btn-ghost">
              <span className="sr-only">Call </span>
              {profile.phone.display}
            </a>
          </li>
          <li>
            <a href={profile.cv} target="_blank" rel="noopener" className="btn-ghost">
              Curriculum Vitae <span className="font-mono text-[11px] text-muted">PDF</span>
            </a>
          </li>
        </ul>

        <ul className="mt-20 grid grid-cols-2 border-t border-line sm:grid-cols-3 lg:grid-cols-5">
          {socials.map((s) => (
            <li key={s.label} className="border-b border-line lg:border-b-0">
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-1 py-6 pr-4">
                <span className="flex items-center gap-2 text-[17px]">
                  {s.label}
                  <span aria-hidden className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    ↗
                  </span>
                </span>
                <span className="truncate font-mono text-[12px] text-muted">{s.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
