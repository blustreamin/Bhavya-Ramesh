import Link from "next/link";
import { Newsletter } from "./Newsletter";
import { PhoneIcon, MailIcon } from "./ui/Icons";

const SERVICES = [
  { label: "Jewellery", href: "#jewellery" },
  { label: "The Archive", href: "#archive" },
  { label: "Client Diaries", href: "#client-diaries" },
  { label: "Style Guide", href: "#style-guide" },
  { label: "Our Crafts", href: "#crafts" },
  { label: "Blogs", href: "#blogs" },
];

const SOCIALS = [
  { label: "Instagram", href: "#", src: "/figma/4166322238aa08633ecc7c87c960bf0c31b7ec39.png" },
  { label: "Facebook", href: "#", src: "/figma/bdfeb232fb1e9e29b84c31e0775847b81562184d.png" },
  { label: "YouTube", href: "#", src: "/figma/ff4a49a47250c804f2340585ffca5ac1ab3eced9.png" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black px-5 pt-20 pb-[5vw] sm:px-8">
      {/* Maroon glow rising on the left, behind the SHINE ON wordmark. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-2/3 w-2/3"
        style={{
          background:
            "radial-gradient(60% 70% at 25% 70%, rgba(120,20,55,0.4) 0%, rgba(5,5,5,0) 70%)",
        }}
      />

      {/* Oversized "SHINE ON" wordmark behind the content, one line, with an
          animated shine wave (the text itself always stays visible). */}
      <span
        aria-hidden
        className="shine-on pointer-events-none absolute inset-x-0 bottom-[-1.2vw] z-0 select-none whitespace-nowrap text-center font-serif font-semibold leading-none text-[20vw]"
      >
        SHINE ON
      </span>

      {/* Footer content (on top) */}
      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
        {/* Newsletter */}
        <Newsletter />

        {/* Services */}
        <nav aria-label="Services">
          <h3 className="text-lg text-brand">Services</h3>
          <ul className="mt-6 space-y-4 text-sm text-white/85">
            {SERVICES.map((s) => (
              <li key={s.label}>
                <Link
                  href={s.href}
                  className="transition-colors hover:text-brand"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Get in Touch */}
        <div>
          <h3 className="text-lg text-brand">Get in Touch</h3>
          <address className="mt-6 text-sm not-italic leading-relaxed text-white/85">
            Shop No. 3, 43, Forbes St, behind Rhythm House, Kala Ghoda, Fort,
            Mumbai, Maharashtra 400001
          </address>

          <div className="mt-6 space-y-3">
            <a
              href="tel:+918302074284"
              className="inline-flex items-center gap-2.5 rounded border border-white/20 px-3.5 py-2.5 text-sm text-white/90 transition-colors hover:border-brand"
            >
              <PhoneIcon className="h-4 w-4" />
              +91 8302074284
            </a>
            <br />
            <a
              href="mailto:info@bhavyaramesh.com"
              className="inline-flex items-center gap-2.5 rounded border border-white/20 px-3.5 py-2.5 text-sm text-white/90 underline-offset-4 transition-colors hover:border-brand"
            >
              <MailIcon className="h-4 w-4" />
              info@bhavyaramesh.com
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3">
            {SOCIALS.map(({ label, href, src }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="transition-transform hover:scale-110"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={label} className="h-8 w-8 object-contain" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
