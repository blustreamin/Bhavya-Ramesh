"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "./ui/Button";

/**
 * Newsletter subscription block. Client-side only: validation + UI state.
 * TODO: wire `onSubmit` to the real subscription endpoint / server action.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !accepted) return;
    setSubmitted(true);
  }

  return (
    <div className="max-w-md">
      <h2 className="font-serif text-5xl font-light leading-[1.05] text-white sm:text-6xl">
        Subscribe to
        <br />
        Newsletter
      </h2>
      <p className="mt-6 text-sm leading-relaxed text-white/60">
        Exciting news and inspiration on all things lighting – straight to your
        inbox.
      </p>

      {submitted ? (
        <p className="mt-10 text-sm text-brand" role="status">
          Thank you — you&apos;re on the list.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL"
              className="h-14 w-full border border-white/25 bg-transparent px-5 text-sm tracking-wide text-white placeholder:text-white/50 focus:border-brand focus:outline-none"
            />
            <Button type="submit" className="h-14 shrink-0">
              Submit
            </Button>
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-2 text-[11px] uppercase tracking-wider text-white/60">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="h-4 w-4 appearance-none rounded-full border border-white/40 checked:border-brand checked:bg-brand"
            />
            <span>
              I accept the{" "}
              <Link href="#privacy" className="underline">
                Privacy Policy
              </Link>
            </span>
          </label>
        </form>
      )}
    </div>
  );
}
