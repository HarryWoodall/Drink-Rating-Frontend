import { PaginationItem, PaginationLink } from "@/components/ui/pagination";

type PaginationNextNumberProps = {
  currentPageNumber: number;
  totalPages: number;
  offset: number;
  onClick: (pageNumber: number) => void;
};

export function PaginationNextNumber({
  currentPageNumber,
  totalPages,
  offset,
  onClick,
}: PaginationNextNumberProps) {
  const value = currentPageNumber + offset + 1;

  if (value > totalPages) {
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
