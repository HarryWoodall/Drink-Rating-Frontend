import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="text-center" data-testid="not-found-page">
      <h1 className="mb-2 text-4xl font-bold" data-testid="not-found-page-heading">
        404
      </h1>
      <p className="mb-4 text-gray-600 dark:text-gray-400">Page not found.</p>
      <Link
        to="/"
        className="font-medium text-indigo-500 hover:underline"
        data-testid="not-found-page-home-link"
      >
        Go home
      </Link>
    </section>
  );
}
