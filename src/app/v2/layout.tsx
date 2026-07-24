import type { Metadata } from "next";

/* Fonts are declared in the root layout so the shared header/footer
   pick them up too. */

export const metadata: Metadata = {
  title: "Bhavya Ramesh — A silverware house",
  description:
    "A silverware house fostering love & oneness — cast in 925, worn without apology.",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
