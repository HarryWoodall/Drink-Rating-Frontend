import { PaginationItem, PaginationLink } from "@/components/ui/pagination";

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

  if (value <= 0) {
    return null;
  }

  return (
    <PaginationItem>
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
