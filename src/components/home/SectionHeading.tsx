interface SectionHeadingProps {
  num: string;
  title: string;
  blurb?: string;
}

export function SectionHeading({ num, title, blurb }: SectionHeadingProps) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
      <h2 className="flex items-baseline gap-3.5 font-serif text-3xl font-normal tracking-tight">
        <span className="font-sans text-xs font-bold tracking-[0.2em] text-amber">
          {num} /
        </span>
        {title}
      </h2>
      {blurb && (
        <p className="max-w-[34ch] text-sm text-muted-foreground">{blurb}</p>
      )}
    </div>
  );
}
