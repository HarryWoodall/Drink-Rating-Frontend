export function AboutPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-bold">About</h1>

      <p>Created by Harry Woodall</p>
      <a
        className="font-bold underline text-base block"
        href="https://www.linkedin.com/in/harry-woodall-84b031150"
      >
        LinkedIn
      </a>

      <a
        className="font-bold underline text-base block"
        href="https://github.com/HarryWoodall/Drink-Rating-Frontend"
      >
        Project Repo
      </a>
      <div className="my-8">
        <h2 className="text-xl font-bold">Data source</h2>
        <a
          className="font-bold underline text-sm"
          href="https://www.thecocktaildb.com/"
        >
          The Cocktail Db
        </a>
      </div>
    </section>
  );
}
