import Image from "next/image";
import { practices, skillGroups } from "@/data/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-24 md:py-36">
      <div className="page">
        <SectionHeading
          id="skills"
          index="02"
          kicker="Skills"
          title={<>A stack organized like a <em>design system</em></>}
          lede="Each set below is a group of tools I reach for, from interface to infrastructure."
        />

        <div className="mt-14 grid gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g) => (
            <article key={g.id} data-build={`skills.group-${g.id}`} className="relative rounded-md border border-dashed border-[#A78BFA]/35 p-5 pt-7">
              <h3 className="absolute -top-2.5 left-4 bg-ink-950 px-1.5 font-mono text-[12px] text-[#C4B5FD]">
                <span aria-hidden>◇ </span>
                {g.title}
              </h3>
              <p className="label">
                {g.caption} · {g.items.length} items
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li key={s.name} className="chip" data-build-part="item">
                    {s.icon ? (
                      <Image src={s.icon} alt="" width={16} height={16} className="size-4" />
                    ) : (
                      <span aria-hidden className="grid size-4 place-items-center rounded-[3px] bg-white/10 font-mono text-[9px]">
                        {s.name[0]}
                      </span>
                    )}
                    {s.name}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-baseline md:gap-10">
          <h3 className="label shrink-0">Practice</h3>
          <p className="text-[15px] text-fg/80">{practices.join(" · ")}</p>
        </div>
      </div>
    </section>
  );
}
