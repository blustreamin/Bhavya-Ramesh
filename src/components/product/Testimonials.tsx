import Image from "next/image";

const REVIEWS = [
  {
    name: "Ujwal Chopra",
    title: "CEO",
    company: "TheWebagency",
    avatar: "/figma/67c28554bb035bb434d67d022a26e5401d67f847.png",
    quote: "Genuinely my favourite purchase this year. The craft is unreal and it turns heads every single time.",
  },
  {
    name: "Madhuri Iyer",
    title: "Manager",
    company: "TheWekrtech",
    avatar: "/figma/9b227545e2a9637a4f88dad021a60a3613e290f8.png",
    quote: "Feels heirloom-worthy. Beautifully made, ships fast, and looks even better in person.",
  },
  {
    name: "Somya Yadav",
    title: "Developer",
    company: "I2c Company",
    avatar: "/figma/3a16c9835bee6dfe6169e1bb8ec0509a3fc6b6ee.png",
    quote: "Bold, sculptural and unlike anything else. I get compliments every time I wear it out.",
  },
  {
    name: "Mehak Arora",
    title: "Accountant",
    company: "TheConsturction",
    avatar: "/figma/d4affb9ba67d82589175eba4ecee2ecbe554baa3.png",
    quote: "Obsessed. The finish is flawless and it pairs with absolutely everything in my wardrobe.",
  },
];

function Stars() {
  return (
    <div className="flex justify-center gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 text-[#e8b44a]" fill="currentColor" aria-hidden>
          <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.98 6.1 20.67l1.13-6.57L2.45 9.44l6.6-.96z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="px-5 py-16 sm:px-12">
      <div className="mx-auto max-w-[1360px]">
        <h2 className="text-[15px] uppercase tracking-[0.2em] text-white/90">What People Say</h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="overflow-hidden rounded-2xl bg-[#161616] shadow-lg">
              {/* White header — avatar + name + role */}
              <div className="flex items-center gap-3.5 bg-[#f3f1ec] p-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-200">
                  <Image src={r.avatar} alt={r.name} fill sizes="56px" className="object-cover object-[center_22%]" />
                </div>
                <figcaption className="min-w-0">
                  <p className="truncate text-[16px] font-bold text-[#1a1a1a]">{r.name}</p>
                  <p className="text-[13px] leading-tight text-neutral-500">{r.title}</p>
                  <p className="text-[13px] leading-tight text-neutral-500">{r.company}</p>
                </figcaption>
              </div>

              {/* Dark body — stars + quote */}
              <div className="px-5 py-6 text-center">
                <Stars />
                <blockquote className="mt-4 text-[13px] leading-relaxed text-white/75">{r.quote}</blockquote>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
