import Image from "next/image";
import { projects, type Project } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="work" aria-labelledby="work-title" data-swarm-scene="projects" className="relative py-24 md:py-36">
      <div className="page">
        <SectionHeading
          id="work"
          index="04"
          kicker="Selected work"
          title={<>Products I&rsquo;ve <em>worked on</em></>}
          lede="Learning platforms, data systems, CMSs and attendance apps for cooperatives, schools, finance and local government."
        />

        <div className="mt-4">
          {featured.map((p, i) => (
            <Case key={p.slug} project={p} index={i} />
          ))}
        </div>

        <h3 className="label mt-24">More projects</h3>
        <ul data-swarm-row="more" className="relative mt-6 border-t border-line">
          {rest.map((p, i) => (
            <li key={p.slug} id={`project-${p.slug}`} data-build={`more.row-${i}`} className="border-b border-line">
              <details className="group">
                <summary className="grid list-none grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-6 md:grid-cols-12">
                  <span className="font-mono text-[13px] text-muted md:col-span-2">{p.period}</span>
                  <span aria-hidden className="row-span-2 self-center font-mono text-lg text-muted transition-transform group-open:rotate-45 md:order-last md:col-span-1 md:row-span-1 md:text-right">
                    +
                  </span>
                  <span className="text-[1.375rem] tracking-tight md:col-span-4">{p.name}</span>
                  <span className="col-span-2 text-[15px] text-muted md:col-span-5">{p.summary}</span>
                </summary>
                <div className="grid gap-8 pb-12 md:grid-cols-12">
                  <div className="md:col-span-5">
                    <ProjectMeta project={p} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:col-span-7">
                    {p.images.map((img) => (
                      <Image
                        key={img.alt}
                        src={img.src}
                        alt={img.alt}
                        sizes="(min-width: 768px) 30vw, 45vw"
                        className="aspect-[16/10] w-full rounded-[5px] border border-line object-cover object-top"
                      />
                    ))}
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Case({ project: p, index }: { project: Project; index: number }) {
  return (
    <article
      id={`project-${p.slug}`}
      data-swarm-row={`case-${index}`}
      className="relative grid gap-10 border-b border-line py-16 lg:grid-cols-12 lg:gap-8 lg:py-24"
    >
      {/* Not sticky: the swarm measures this column once, so it must move with its row. */}
      <div className={`self-start lg:col-span-5 ${index % 2 ? "lg:order-last lg:col-start-8" : ""}`}>
        <p className="label">
          {String(index + 1).padStart(2, "0")} · {p.period} · {p.kind}
        </p>
        <h3 className="mt-5 w-fit font-serif text-h3" data-build={`case-${index}.title`}>
          {p.name}
        </h3>
        <ProjectMeta project={p} build={`case-${index}`} />
      </div>

      <div className={`lg:col-span-7 ${index % 2 ? "" : "lg:col-start-6"}`}>
        {p.media === "phone" ? <PhoneMedia project={p} build={`case-${index}`} /> : <DesktopMedia project={p} build={`case-${index}`} />}
      </div>
    </article>
  );
}

/** `build` prefixes the swarm hooks; the compact "More projects" rows leave it out. */
function ProjectMeta({ project: p, build }: { project: Project; build?: string }) {
  return (
    <>
      <p className="mt-5 text-[17px] leading-relaxed text-fg/85">{p.summary}</p>
      {p.contribution && (
        <p className="mt-4 text-[15px] leading-relaxed text-fg/80">
          <span className="label mr-2">My part</span>
          {p.contribution}
        </p>
      )}
      {p.tech.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies" data-build={build && `${build}.tech`}>
          {p.tech.map((t) => (
            <li key={t} className="chip font-mono text-[12px]" data-build-part={build && "item"}>
              {t}
            </li>
          ))}
        </ul>
      )}
      <details className="group/desc mt-6">
        <summary className="label inline-flex items-center gap-2 transition-colors hover:text-fg">
          Full description <span aria-hidden className="transition-transform group-open/desc:rotate-45">+</span>
        </summary>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{p.description}</p>
      </details>
      {p.links.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {p.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="link text-[15px]">
                {l.label} <span aria-hidden>↗</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function DesktopMedia({ project: p, build }: { project: Project; build: string }) {
  const [lead, ...thumbs] = p.images;
  return (
    <div className="grid gap-3">
      <div className="overflow-hidden rounded-md border border-line bg-ink-900" data-build={`${build}.media`}>
        <Image src={lead.src} alt={lead.alt} sizes="(min-width: 1024px) 680px, 100vw" className="aspect-[16/10] w-full object-cover object-top" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {thumbs.slice(0, 3).map((img, i) => (
          <div key={img.alt} className="overflow-hidden rounded-[5px] border border-line" data-build={`${build}.thumb-${i}`}>
            <Image src={img.src} alt={img.alt} sizes="(min-width: 1024px) 220px, 33vw" className="aspect-[16/10] w-full object-cover object-top" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneMedia({ project: p, build }: { project: Project; build: string }) {
  const phones = p.images.filter((img) => img.src.height > img.src.width).slice(0, 4);
  const wide = p.images.find((img) => img.src.width > img.src.height);
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* The stagger is a margin, not a transform, so measured boxes match what is drawn. */}
        {phones.map((img, i) => (
          <div key={img.alt} data-build={`${build}.phone-${i}`} className={i % 2 ? "sm:mt-10" : ""}>
            <Image
              src={img.src}
              alt={img.alt}
              sizes="(min-width: 1024px) 170px, (min-width: 640px) 22vw, 45vw"
              className="aspect-[9/20] w-full rounded-[18px] border border-white/10 object-cover object-top"
            />
          </div>
        ))}
      </div>
      {wide && (
        <div data-build={`${build}.wide`}>
          <Image
            src={wide.src}
            alt={wide.alt}
            sizes="(min-width: 1024px) 680px, 100vw"
            className="aspect-[16/10] w-full rounded-md border border-line object-cover object-top"
          />
        </div>
      )}
    </div>
  );
}
