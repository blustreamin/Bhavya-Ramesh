import Image from "next/image";
import Link from "next/link";

const LOOKS = [
  { image: "/figma/9b227545e2a9637a4f88dad021a60a3613e290f8.png", name: "Aanya S", quote: "The first thing I reach for before stepping out." },
  { image: "/figma/3a16c9835bee6dfe6169e1bb8ec0509a3fc6b6ee.png", name: "Ritvik Kumar", quote: "Wore it once and every outfit started making sense." },
  { image: "/figma/d4affb9ba67d82589175eba4ecee2ecbe554baa3.png", name: "Meher Dhall", quote: "Rooted but unexpected — it still feels like home." },
  { image: "/figma/67c28554bb035bb434d67d022a26e5401d67f847.png", name: "Ishaan R", quote: "People keep asking where it's from." },
];

export function SeeItInAction() {
  return (
    <section className="px-5 py-16 sm:px-12">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] uppercase tracking-[0.2em] text-white/90">See It In Action</h2>
          <Link href="/#as-worn" className="text-sm tracking-wide text-white/80 underline-offset-4 transition-colors hover:text-brand hover:underline">
            View More
          </Link>
        </div>

        <div className="no-scrollbar mt-8 flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
          {LOOKS.map((look) => (
            <article key={look.name} className="group relative aspect-[291/380] w-[70%] shrink-0 overflow-hidden rounded-lg sm:w-auto">
              <Image src={look.image} alt={look.name} fill sizes="(min-width:1024px) 320px, 70vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.85) 100%)" }} />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-sans text-[17px] font-bold text-brand">{look.name}</h3>
                <p className="mt-1 text-[11px] leading-snug text-white/85">{look.quote}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
