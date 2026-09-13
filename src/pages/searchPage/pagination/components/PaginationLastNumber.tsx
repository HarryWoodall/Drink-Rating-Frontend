import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

type PaginationLastNumberProps = {
  currentPageNumber: number;
  totalPages: number;
  offsetAmount: number;
  onClick: (pageNumber: number) => void;
};

export function PaginationLastNumber({
  currentPageNumber,
  totalPages,
  offsetAmount,
  onClick,
}: PaginationLastNumberProps) {
  if (currentPageNumber >= totalPages - offsetAmount) {
    return null;
  }

  return (
    <div className="hidden md:flex">
      {currentPageNumber < totalPages - offsetAmount - 1 && (
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      )}

      <PaginationItem>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onClick(totalPages);
          }}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    </div>
  );
}
