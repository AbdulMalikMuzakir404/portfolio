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

        <div data-swarm-row="edu" className="relative mt-14">
          <h3 className="label w-fit" data-build="edu.label">
            Education
          </h3>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {education.map((e, i) => (
              <li key={e.school} data-build={`edu.${i}`} className="rounded-md border border-line bg-ink-900 p-6 md:p-7">
                <p className="font-mono text-[13px] text-muted" data-build-part="label">
                  {e.period} · {e.location}
                </p>
                <p className="mt-6 font-serif text-[1.75rem] leading-tight" data-build-part="label">
                  {e.school}
                </p>
                <p className="mt-1 text-[15px] text-fg/85" data-build-part="label">
                  {e.degree}
                </p>
                {e.note && (
                  <p className="mt-4 text-[14px] leading-relaxed text-muted" data-build-part="label">
                    {e.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <h3 data-swarm-row="cert-label" className="label relative mt-20 w-fit">
          <span data-build="cert.label">Certifications</span>
        </h3>
        <ul className="mt-5 border-t border-line">
          {certifications.map((c, i) => (
            <li key={c.title} data-swarm-row={`cert-${i}`} className="relative grid gap-6 border-b border-line py-8 md:grid-cols-12 md:gap-8">
              <p className="font-mono text-[13px] text-muted md:col-span-2">
                <span className="inline-block" data-build={`cert.date-${i}`}>{c.date}</span>
              </p>
              <div className="md:col-span-6">
                <p className="w-fit text-[1.375rem] tracking-tight" data-build={`cert.title-${i}`}>
                  {c.title}
                </p>
                <p className="w-fit text-[15px] text-muted" data-build={`cert.issuer-${i}`}>
                  {c.issuer}
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[14px] text-fg/75" data-build={`cert.highlights-${i}`}>
                  {c.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2" data-build-part="item">
                      <span aria-hidden className="size-1 rounded-full bg-accent" />
                      {h}
                    </li>
                  ))}
                </ul>
                <a href={c.link} target="_blank" rel="noopener noreferrer" className="link mt-5 inline-block text-[15px]" data-build={`cert.link-${i}`}>
                  View certification <span aria-hidden>↗</span>
                  <span className="sr-only"> for {c.title}</span>
                </a>
              </div>
              <div className="md:col-span-4" data-build={`cert.image-${i}`}>
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

        <div data-swarm-row="cv-more" className="relative mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <h3 className="label w-fit" data-build="cv.label-0">
              Also on my CV
            </h3>
            <ul className="mt-4 space-y-3 text-[15px]" data-build="cv.more">
              {moreCertifications.map((c) => (
                <li key={c.title} data-build-part="item" className="w-fit">
                  {c.title} <span className="text-muted">— {c.issuer}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <h3 className="label w-fit" data-build="cv.label-1">
              Honors
            </h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              {honors.map((h, i) => (
                <li key={h} data-build={`cv.honor-${i}`} className="w-fit">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
