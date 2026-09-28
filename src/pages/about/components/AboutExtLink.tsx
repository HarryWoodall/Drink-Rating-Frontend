import { ArrowUpRight } from "lucide-react";

type AboutExtLinkProps = {
  href: string;
  testId: string;
  children: React.ReactNode;
};

export function AboutExtLink({ href, testId, children }: AboutExtLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 underline decoration-amber/40 underline-offset-4 transition-colors hover:text-amber hover:decoration-amber"
      data-testid={testId}
    >
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden />
    </a>
  );
}
