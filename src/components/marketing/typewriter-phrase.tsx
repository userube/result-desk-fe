"use client";

import { useEffect, useState } from "react";

const phrases = ["Programs & Results", "Weekly Reports", "Holiday Coaching", "ResultDesk PDFs"];

export function TypewriterPhrase() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visibleLength, setVisibleLength] = useState(phrases[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    const delay = deleting ? 45 : 80;
    const pause = visibleLength === current.length && !deleting ? 1500 : delay;

    const timeout = window.setTimeout(() => {
      if (!deleting && visibleLength === current.length) {
        setDeleting(true);
        return;
      }

      if (deleting && visibleLength === 0) {
        setDeleting(false);
        setPhraseIndex((index) => (index + 1) % phrases.length);
        return;
      }

      setVisibleLength((length) => length + (deleting ? -1 : 1));
    }, pause);

    return () => window.clearTimeout(timeout);
  }, [deleting, phraseIndex, visibleLength]);

  return (
    <span className="inline-grid h-[1.12em] w-[13.6ch] translate-y-[0.08em] grid-cols-[1fr_auto] items-center justify-center rounded-[0.38em] bg-[#d7f2ef] px-[0.18em] pb-[0.08em] text-brand-dark md:w-[14.2ch]">
      <span className="block overflow-hidden whitespace-nowrap text-center leading-none">{phrases[phraseIndex].slice(0, visibleLength)}</span>
      <span className="ml-[0.08em] h-[0.72em] w-[3px] animate-pulse rounded-full bg-brand-dark" aria-hidden="true" />
    </span>
  );
}
