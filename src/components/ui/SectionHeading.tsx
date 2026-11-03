import type { ReactNode } from "react";

type Props = {
  /** Section id; also prefixes the `data-build` hooks used by the swarm scenes. */
  id: string;
  index: string;
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
};

export function SectionHeading({ id, index, kicker, title, lede }: Props) {
  return (
    <header>
      <div className="grid items-end gap-6 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="label" data-build={`${id}.kicker`}>
            {index} — {kicker}
          </p>
          <h2 id={`${id}-title`} className="mt-5 font-serif text-h2" data-build={`${id}.title`}>
            {title}
          </h2>
        </div>
        {lede && <p className="text-lede text-muted md:col-span-5 md:pb-2">{lede}</p>}
      </div>
      <div className="mt-10 h-px origin-left bg-white/10" data-build={`${id}.rule`} />
    </header>
  );
}
