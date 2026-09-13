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
    <span className="inline-flex h-[1.16em] w-[13.8ch] translate-y-[0.05em] items-center justify-center rounded-[0.38em] bg-[#d7f2ef] px-[0.2em] text-brand-dark md:w-[14.4ch]">
      <span className="inline-flex h-[1em] items-center justify-center overflow-hidden whitespace-nowrap leading-none">
        <span>{phrases[phraseIndex].slice(0, visibleLength)}</span>
        <span className="ml-[0.06em] inline-block h-[0.76em] w-[3px] shrink-0 animate-pulse rounded-full bg-brand-dark align-middle" aria-hidden="true" />
      </span>
    </span>
  );
}
