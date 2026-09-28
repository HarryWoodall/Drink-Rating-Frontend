import { AboutExtLink } from "./components/AboutExtLink";
import { AboutRow } from "./components/AboutRow";

export function AboutPage() {
  return (
    <section className="max-w-xl py-6" data-testid="about-page">
      <h1
        className="mb-5 font-serif text-4xl font-light italic leading-none"
        data-testid="about-page-heading"
      >
        About
      </h1>
      <p className="mb-12 max-w-[46ch] leading-relaxed text-muted-foreground">
        Nightcap is a small cocktail index. Browse recipes, keep your favourites
        and rate what you've tried.
      </p>

      <dl className="divide-y divide-border border-y border-border">
        <AboutRow label="Made by" testId="about-row-author">
          Harry Woodall <span className="text-muted-foreground">·</span>{" "}
          <AboutExtLink
            href="https://www.linkedin.com/in/harry-woodall-84b031150"
            testId="about-link-linkedin"
          >
            LinkedIn
          </AboutExtLink>
        </AboutRow>
        <AboutRow label="Source" testId="about-row-source">
          <AboutExtLink
            href="https://github.com/HarryWoodall/Drink-Rating-Frontend"
            testId="about-link-github"
          >
            Github
          </AboutExtLink>
        </AboutRow>
        <AboutRow label="Data source" testId="about-row-data-source">
          <AboutExtLink
            href="https://www.thecocktaildb.com/"
            testId="about-link-cocktaildb"
          >
            TheCocktailDB
          </AboutExtLink>
        </AboutRow>
      </dl>
    </section>
  );
}
