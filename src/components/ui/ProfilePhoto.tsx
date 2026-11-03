import Image from "next/image";
import { profile } from "@/data/profile";

/** Hero portrait. Content comes from `profile.photo`; the swarm engine only targets the `data-build` hooks. */
export function ProfilePhoto() {
  const { src, alt, focal } = profile.photo;
  return (
    <figure className="relative" data-build="hero.photo">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-line bg-ink-900">
        <div className="absolute inset-0" data-build-part="media">
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 400px, (min-width: 768px) 40vw, 90vw"
              className="object-cover"
              style={{ objectPosition: `${focal.x}% ${focal.y}%` }}
            />
          ) : (
            <PhotoPlaceholder />
          )}
        </div>
      </div>
    </figure>
  );
}

function PhotoPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Portrait placeholder — photo coming soon"
      className="absolute inset-0 bg-[linear-gradient(160deg,#1a1a1e_0%,#111113_55%,#0d0d0f_100%)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px]"
      />
      <svg aria-hidden className="absolute inset-0 h-full w-full text-white/[0.06]" preserveAspectRatio="none" viewBox="0 0 100 125">
        <path d="M0 0L100 125M100 0L0 125" stroke="currentColor" strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
      </svg>
      <span aria-hidden className="absolute inset-0 grid place-items-center font-serif text-[clamp(5rem,12vw,9rem)] italic text-white/[0.09]">
        AM
      </span>
      <span aria-hidden className="label absolute right-4 top-4">Portrait · coming soon</span>
    </div>
  );
}
