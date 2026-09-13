import { PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type PaginationPreviousNumberProps = {
  currentPageNumber: number;
  offset: number;
  onClick: (pageNumber: number) => void;
};

export function PaginationPreviousNumber({
  currentPageNumber,
  offset,
  onClick,
}: PaginationPreviousNumberProps) {
  const value = currentPageNumber - offset - 1;
  console.log(offset);

  if (value <= 0) {
    return null;
  }

  return (
    <PaginationItem className={cn(offset > 0 ? "hidden md:flex" : "")}>
      <PaginationLink
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick(value);
        }}
      >
        {value}
      </PaginationLink>
    </PaginationItem>
  );
}
