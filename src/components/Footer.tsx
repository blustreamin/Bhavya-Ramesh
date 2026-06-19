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
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "YouTube", href: "#", Icon: YoutubeIcon },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black px-5 pb-16 pt-20 sm:px-8">
      {/* Oversized "SHINE ON" watermark behind the content. */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-4 left-1/2 w-full -translate-x-1/2 select-none text-center font-serif font-semibold leading-none text-white/[0.04] text-[26vw] sm:text-[22vw]"
      >
        SHINE ON
      </span>

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
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

          <div className="mt-8 flex items-center gap-4">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-white/85 transition-colors hover:text-brand"
              >
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
