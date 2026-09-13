import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { PaginationPreviousButton } from "./components/PaginationPreviousButton";
import { PaginationPreviousNumber } from "./components/PaginationPreviousNumber";
import { PaginationNextNumber } from "./components/PaginationNextNumber";
import { PaginationLastNumber } from "./components/PaginationLastNumber";
import { PaginationNextButton } from "./components/PaginationNextButton";

export type SearchResultsPaginationProps = {
  offsetAmmount: number;
  currentPageNumber: number;
  totalPages: number;
  onClick: (pageNumber: number) => void;
};

export function SearchResultsPagination({
  currentPageNumber,
  totalPages,
  offsetAmmount = 4,
  onClick,
}: SearchResultsPaginationProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationPreviousButton
          currentPageNumber={currentPageNumber}
          onClick={onClick}
        />
        {Array.from({ length: offsetAmmount }, (_, offset) => (
          <PaginationPreviousNumber
            key={offset}
            currentPageNumber={currentPageNumber}
            offset={offsetAmmount - offset - 1}
            onClick={onClick}
          />
        ))}
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {currentPageNumber}
          </PaginationLink>
        </PaginationItem>
        {Array.from({ length: offsetAmmount }, (_, offset) => (
          <PaginationNextNumber
            key={offset}
            currentPageNumber={currentPageNumber}
            totalPages={totalPages}
            offset={offset}
            onClick={onClick}
          />
        ))}
        <PaginationLastNumber
          currentPageNumber={currentPageNumber}
          totalPages={totalPages}
          offsetAmount={offsetAmmount}
          onClick={onClick}
        />
        <PaginationNextButton
          currentPageNumber={currentPageNumber}
          totalPages={totalPages}
          onClick={onClick}
        />
      </PaginationContent>
    </Pagination>
  );
}
