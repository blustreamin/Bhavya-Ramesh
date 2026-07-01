import Image from "next/image";
import { StarRating } from "../ui/StarRating";

const REVIEWS = [
  {
    name: "Ujwal Chopra",
    role: "Founder, The Wild Agency",
    avatar: "/figma/67c28554bb035bb434d67d022a26e5401d67f847.png",
    quote: "Genuinely my favourite purchase this year. The craft is unreal and it turns heads every single time.",
  },
  {
    name: "Madhuri Iyer",
    role: "Creative Director",
    avatar: "/figma/9b227545e2a9637a4f88dad021a60a3613e290f8.png",
    quote: "Feels heirloom-worthy. Beautifully made, ships fast, and looks even better in person.",
  },
  {
    name: "Somya Yadav",
    role: "Stylist",
    avatar: "/figma/3a16c9835bee6dfe6169e1bb8ec0509a3fc6b6ee.png",
    quote: "Bold, sculptural and unlike anything else. I get compliments every time I wear it out.",
  },
  {
    name: "Mehak Arora",
    role: "Content Creator",
    avatar: "/figma/d4affb9ba67d82589175eba4ecee2ecbe554baa3.png",
    quote: "Obsessed. The finish is flawless and it pairs with absolutely everything in my wardrobe.",
  },
];

export function Testimonials() {
  return (
    <section className="px-5 py-16 sm:px-12">
      <div className="mx-auto max-w-[1360px]">
        <h2 className="text-[15px] uppercase tracking-[0.2em] text-white/90">What People Say</h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15">
                  <Image src={r.avatar} alt={r.name} fill sizes="48px" className="object-cover object-[center_22%] grayscale-[0.15]" />
                </div>
                <figcaption>
                  <p className="text-[14px] font-semibold text-white">{r.name}</p>
                  <p className="text-[12px] text-white/50">{r.role}</p>
                </figcaption>
              </div>
              <div className="mt-4">
                <StarRating value={5} />
              </div>
              <blockquote className="mt-3 text-[13px] leading-relaxed text-white/75">“{r.quote}”</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
