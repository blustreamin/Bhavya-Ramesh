import Link from "next/link";
import { Newsletter } from "./Newsletter";
import {
  PhoneIcon,
  MailIcon,
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
} from "./ui/Icons";

const SERVICES = [
  { label: "Jewellery", href: "#jewellery" },
  { label: "The Archive", href: "#archive" },
  { label: "Client Diaries", href: "#client-diaries" },
  { label: "Style Guide", href: "#style-guide" },
  { label: "Our Crafts", href: "#crafts" },
  { label: "Blogs", href: "#blogs" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    Icon: InstagramIcon,
    // Instagram brand gradient.
    badge: "bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]",
  },
  { label: "Facebook", href: "#", Icon: FacebookIcon, badge: "bg-[#1877F2]" },
  { label: "YouTube", href: "#", Icon: YoutubeIcon, badge: "bg-[#FF0000]" },
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
            {SOCIALS.map(({ label, href, Icon, badge }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={`flex h-8 w-8 items-center justify-center rounded-[7px] text-white transition-transform hover:scale-110 ${badge}`}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
