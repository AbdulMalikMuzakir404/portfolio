import Image from "next/image";
import { certifications, honors, moreCertifications } from "@/data/certifications";
import { education } from "@/data/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Credentials() {
  return (
    <section id="credentials" aria-labelledby="credentials-title" className="relative py-24 md:py-36">
      {/* Old links pointed at #certificates. */}
      <span id="certificates" className="absolute -top-16" aria-hidden />
      <div className="page">
        <SectionHeading
          id="credentials"
          index="05"
          kicker="Credentials"
          title={<>Education &amp; <em>certifications</em></>}
          lede="The credentials I’ve earned on my journey of continuous learning."
        />

        <h3 className="label mt-14">Education</h3>
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {education.map((e) => (
            <li key={e.school} className="rounded-md border border-line bg-ink-900 p-6 md:p-7">
              <p className="font-mono text-[13px] text-muted">
                {e.period} · {e.location}
              </p>
              <p className="mt-6 font-serif text-[1.75rem] leading-tight">{e.school}</p>
              <p className="mt-1 text-[15px] text-fg/85">{e.degree}</p>
              {e.note && <p className="mt-4 text-[14px] leading-relaxed text-muted">{e.note}</p>}
            </li>
          ))}
        </ul>

        <h3 className="label mt-20">Certifications</h3>
        <ul className="mt-5 border-t border-line">
          {certifications.map((c) => (
            <li key={c.title} className="grid gap-6 border-b border-line py-8 md:grid-cols-12 md:gap-8">
              <p className="font-mono text-[13px] text-muted md:col-span-2">{c.date}</p>
              <div className="md:col-span-6">
                <p className="text-[1.375rem] tracking-tight">{c.title}</p>
                <p className="text-[15px] text-muted">{c.issuer}</p>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[14px] text-fg/75">
                  {c.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2">
                      <span aria-hidden className="size-1 rounded-full bg-accent" />
                      {h}
                    </li>
                  ))}
                </ul>
                <a href={c.link} target="_blank" rel="noopener noreferrer" className="link mt-5 inline-block text-[15px]">
                  View certification <span aria-hidden>↗</span>
                  <span className="sr-only"> for {c.title}</span>
                </a>
              </div>
              <div className="md:col-span-4">
                <Image
                  src={c.image}
                  alt={`${c.title} certificate`}
                  sizes="(min-width: 768px) 360px, 100vw"
                  className="aspect-[4/3] w-full rounded-md border border-line bg-ink-900 object-contain p-2"
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <h3 className="label">Also on my CV</h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              {moreCertifications.map((c) => (
                <li key={c.title}>
                  {c.title} <span className="text-muted">— {c.issuer}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <h3 className="label">Honors</h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              {honors.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
