import { PaginationItem, PaginationPrevious } from "@/components/ui/pagination";

type PaginationPreviousButtonProps = {
  currentPageNumber: number;
  onClick: (pageNumber: number) => void;
};

export function PaginationPreviousButton({
  currentPageNumber,
  onClick,
}: PaginationPreviousButtonProps) {
  if (currentPageNumber <= 1) {
    return null;
  }

  return (
    <PaginationItem>
      <PaginationPrevious
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick(currentPageNumber - 1);
        }}
      />
    </PaginationItem>
  );
}
