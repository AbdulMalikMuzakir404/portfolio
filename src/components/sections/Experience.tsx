import { roles } from "@/data/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-24 md:py-36">
      <div className="page">
        <SectionHeading
          id="experience"
          index="03"
          kicker="Experience"
          title={<>Where I&rsquo;ve <em>built</em></>}
          lede="Back-end systems, product platforms and mobile apps, from internship to full-time engineering."
        />

        <ol className="relative mt-4">
          {roles.map((r, i) => (
            <li key={r.company + r.period} data-swarm-row={`experience-${i}`} className="relative grid gap-4 border-b border-line py-10 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-3">
                <p className="w-fit font-mono text-[13px] text-fg/90" data-build={`experience.period-${i}`}>
                  {r.period}
                </p>
                <p className="label mt-2 w-fit" data-build={`experience.type-${i}`}>
                  {r.type}
                </p>
              </div>
              <div className="md:col-span-9">
                <h3 data-build={`experience.role-${i}`} className="w-fit text-[clamp(1.375rem,1.2rem+0.6vw,1.75rem)] font-medium tracking-tight">
                  {r.role} <span className="font-serif font-normal italic text-muted">at</span> {r.company}
                </h3>
                <p className="mt-1 w-fit text-[14px] text-muted" data-build={`experience.loc-${i}`}>
                  {r.location}
                </p>
                <ul data-build={`experience.points-${i}`} className="mt-6 max-w-3xl space-y-3 text-[15px] leading-relaxed text-fg/80">
                  {r.points.map((p) => (
                    <li key={p} data-build-part="label" className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-white/30">
                      {p}
                    </li>
                  ))}
                </ul>
                {r.stack.length > 0 && (
                  <ul data-build={`experience.stack-${i}`} className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                    {r.stack.map((s) => (
                      <li key={s} className="chip font-mono text-[12px]" data-build-part="item">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
