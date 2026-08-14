import { Wine } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { TopRatedResponse } from "@/types/cocktail";
import { SectionHeading } from "../SectionHeading";
import { TopRatedCard } from "./TopRatedCard";
import { RatedCard } from "./RatedCard";

interface TopRatedSectionProps {
  topRatedResponseList: TopRatedResponse[] | undefined;
  loading: boolean;
  error: string | null;
}

export function TopRatedSection({
  topRatedResponseList,
  loading,
  error,
}: TopRatedSectionProps) {
  return (
    <section id="top" className="scroll-mt-24 py-8">
      <SectionHeading
        num="02"
        title="The Top Shelf"
        blurb="The highest-rated pour, as voted by the room."
      />

      {error ? (
        <p className="text-sm text-destructive">
          Failed to load the top-rated cocktail.
        </p>
      ) : loading ? (
        <div className="overflow-hidden rounded-[1.6rem] border border-border bg-card">
          <div className="flex flex-col md:flex-row">
            <Skeleton className="h-60 w-full md:h-auto md:w-80 shrink-0" />
            <div className="flex flex-1 flex-col gap-3 p-8">
              <Skeleton className="h-9 w-2/3" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      ) : !topRatedResponseList || topRatedResponseList.length == 0 ? (
        <div className="rounded-[1.6rem] border border-dashed border-border bg-black/15 py-16 text-center">
          <Wine className="mx-auto mb-3 h-9 w-9 text-amber/60" />
          <p className="font-medium">No cocktails rated yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first to leave your verdict.
          </p>
        </div>
      ) : (
        <div>
          <TopRatedCard cocktail={topRatedResponseList[0]} />
          <div className="py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <RatedCard topRatedResponse={topRatedResponseList[1]} number={2} />
            <RatedCard topRatedResponse={topRatedResponseList[2]} number={3} />
            <RatedCard topRatedResponse={topRatedResponseList[3]} number={4} />
            <RatedCard topRatedResponse={topRatedResponseList[4]} number={5} />
          </div>
        </div>
      )}
    </section>
  );
}
