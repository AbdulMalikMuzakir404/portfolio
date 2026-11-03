import Image from "next/image";
import { profile } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import MapImage from "@/assets/images/map.png";
import Memoji from "@/assets/images/memoji-smile.png";

export function About() {
  const facts = [
    { k: "Based in", v: profile.location },
    { k: "Currently", v: `${profile.current.role}, ${profile.current.company}` },
    { k: "Studying", v: "B.Sc. Computer Science, Cakrawala University" },
    { k: "Languages", v: profile.languages.map((l) => `${l.name} (${l.level.toLowerCase()})`).join(", ") },
  ];
  const read = profile.reads[0];

  return (
    <section id="about" aria-labelledby="about-title" data-swarm-scene="about" className="relative py-24 md:py-36">
      <div className="page">
        <SectionHeading id="about" index="01" kicker="About" title={<>A glimpse into my <em>world</em></>} />

        <div className="mt-14 grid gap-12 md:grid-cols-12">
          <p data-build="about.summary" className="text-[clamp(1.25rem,1.05rem+0.7vw,1.75rem)] leading-[1.45] text-fg/90 md:col-span-7">
            {profile.summary}
          </p>
          <dl data-build="about.facts" className="grid content-start gap-6 md:col-span-4 md:col-start-9">
            {facts.map((f) => (
              <div key={f.k} className="border-t border-line pt-4" data-build-part="item">
                <dt className="label">{f.k}</dt>
                <dd className="mt-1.5 text-[15px] text-fg/90">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ol data-swarm-row="about-cards" className="relative mt-20 grid gap-4 md:grid-cols-3">
          {profile.principles.map((p, i) => (
            <li key={p.title} data-build={`about.card-${i}`} className="rounded-md border border-line bg-ink-900 p-6 md:p-7">
              <p className="font-mono text-[12px] text-muted" data-build-part="label">
                0{i + 1}
              </p>
              <h3 className="mt-10 font-serif text-[1.75rem] leading-tight" data-build-part="label">
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted" data-build-part="label">
                {p.body}
              </p>
            </li>
          ))}
        </ol>

        <div data-swarm-row="about-more" className="relative mt-4 grid gap-4 md:grid-cols-12">
          <div className="rounded-md border border-line bg-ink-900 p-6 md:col-span-5 md:p-7">
            <h3 className="label">Beyond the code</h3>
            <ul data-build="about.hobbies" className="mt-6 flex flex-wrap gap-2">
              {profile.hobbies.map((h) => (
                <li key={h.title} className="chip" data-build-part="item">
                  <span aria-hidden>{h.emoji}</span>
                  {h.title}
                </li>
              ))}
            </ul>
            <h3 className="label mt-10">What I aim for</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-fg/80">{profile.qualities.join(" · ")}</p>
          </div>

          <div className="flex gap-6 rounded-md border border-line bg-ink-900 p-6 md:col-span-3 md:flex-col md:p-7">
            <div data-build="about.book" className="shrink-0">
              <Image src={read.cover} alt={`${read.title} by ${read.author} — book cover`} className="h-auto w-24 md:w-28" sizes="112px" />
            </div>
            <div>
              <h3 className="label">My reads</h3>
              <p className="mt-3 font-serif text-2xl leading-tight">{read.title}</p>
              <p className="text-[14px] text-muted">{read.author}</p>
            </div>
          </div>

          <div className="relative min-h-64 overflow-hidden rounded-md border border-line md:col-span-4">
            <Image
              src={MapImage}
              alt="Map of Bandung and surrounding area"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover opacity-60 grayscale-[40%]"
            />
            {/* Centering transform lives on the wrapper so the swarm can move the pin itself. */}
            <div className="absolute left-[38%] top-[40%] -translate-x-1/2 -translate-y-1/2">
              <div data-build="about.pin" className="size-16 rounded-full border-2 border-ink-950/40 bg-accent">
                <Image src={Memoji} alt="" className="size-full rounded-full object-cover" sizes="64px" />
              </div>
            </div>
            <p className="label absolute bottom-4 left-4 rounded bg-ink-950/80 px-2 py-1 text-fg/90">Bandung, Indonesia</p>
          </div>
        </div>
      </div>
    </section>
  );
}
