type AboutRowProps = {
  label: string;
  testId: string;
  children: React.ReactNode;
};

export function AboutRow({ label, testId, children }: AboutRowProps) {
  return (
    <div
      className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 py-4"
      data-testid={testId}
    >
      <dt
        className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground"
        data-testid={`${testId}-label`}
      >
        {label}
      </dt>
      <dd data-testid={`${testId}-value`}>{children}</dd>
    </div>
  );
}
