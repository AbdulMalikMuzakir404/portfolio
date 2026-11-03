# Abdul Malik Muzakir — Portfolio

Next.js 16 · React 19 · Tailwind CSS 3 · GSAP (ScrollTrigger, MotionPath)

```bash
bun install
bun dev            # http://localhost:3000
bun run build      # production build + sitemap
bun run lint && bun run typecheck
```

- Content lives in `src/data/*` (profile, experience, projects, skills, certifications, socials).
- Sections are server components in `src/components/sections/*`.
- The scroll-built "swarm" animation is documented in [docs/ANIMATION.md](docs/ANIMATION.md).
- To add your portrait, set `profile.photo.src` in `src/data/profile.ts`.
