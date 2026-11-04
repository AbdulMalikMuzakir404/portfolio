import { profile } from "@/data/profile";
import { ProfilePhoto } from "@/components/ui/ProfilePhoto";

export function Hero() {
  const { headline } = profile;
  return (
    <section id="home" aria-labelledby="hero-name" data-swarm-scene="hero" className="dot-grid relative overflow-hidden">
      <div className="page relative flex min-h-[100svh] flex-col justify-center pb-16 pt-28 md:pb-20">
        <div data-swarm-frame className="grid items-center gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <p
              data-build="hero.status"
              className="rise inline-flex items-center gap-2 rounded-full border border-line bg-ink-900 px-3 py-1.5 font-mono text-[12px] text-fg/85"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              {profile.status}
            </p>

            <h1
              id="hero-name"
              data-build="hero.name"
              aria-label={profile.name}
              className="rise mt-8 w-fit text-[clamp(1.375rem,1.1rem+0.9vw,1.875rem)] font-medium tracking-tight [--d:60ms]"
            >
              <span aria-hidden>
                {[...profile.name].map((c, i) => (
                  <span key={i} data-ch>
                    {c}
                  </span>
                ))}
              </span>
            </h1>
            <p data-build="hero.title" className="rise mt-1.5 w-fit font-mono text-[13px] text-muted [--d:120ms]">
              {profile.title} · Bandung, Indonesia
            </p>

            <p data-build="hero.headline" className="rise mt-7 max-w-[13ch] origin-top-left font-serif text-display [--d:180ms]">
              {headline.before} <em className="text-accent/95" data-build="hero.emphasis">{headline.emphasis}</em> {headline.after}
            </p>

            <div className="rise mt-10 flex flex-wrap gap-3 [--d:260ms]">
              <a data-build="hero.cta1" href="#work" className="btn-primary">
                <span data-build-part="label">Explore my work</span>
                <span aria-hidden data-build-part="label">↓</span>
              </a>
              <a data-build="hero.cta2" href={profile.cv} target="_blank" rel="noopener" className="btn-ghost">
                <span data-build-part="label">Curriculum Vitae</span>
                <span aria-hidden data-build-part="label" className="font-mono text-[11px] text-muted">
                  PDF ↗
                </span>
              </a>
            </div>
          </div>

          <div className="rise relative mx-auto w-full max-w-[22rem] [--d:200ms] md:col-span-5 md:max-w-none lg:col-span-4 lg:col-start-9">
            <ProfilePhoto />
            <div
              data-build="hero.now"
              className="relative mt-4 w-fit rounded-md border border-line bg-ink-900 px-4 py-3 md:absolute md:-left-10 md:bottom-10 md:mt-0 md:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]"
            >
              <p className="label" data-build-part="label">
                Now
              </p>
              <p className="mt-1 text-[14px]" data-build-part="label">
                {profile.current.role} at <span className="font-medium">{profile.current.company}</span>
              </p>
              <p className="font-mono text-[12px] text-muted" data-build-part="label">
                since {profile.current.since}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
