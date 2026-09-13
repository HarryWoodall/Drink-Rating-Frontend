import { PaginationItem, PaginationNext } from "@/components/ui/pagination";

type PaginationNextButtonProps = {
  currentPageNumber: number;
  totalPages: number;
  onClick: (pageNumber: number) => void;
};

export function PaginationNextButton({
  currentPageNumber,
  totalPages,
  onClick,
}: PaginationNextButtonProps) {
  if (currentPageNumber == totalPages) {
    return null;
  }

  return (
    <PaginationItem>
      <PaginationNext
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick(currentPageNumber + 1);
        }}
      />
    </PaginationItem>
  );
}
