import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="text-center">
      <h1 className="mb-2 text-4xl font-bold">404</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-400">Page not found.</p>
      <Link to="/" className="font-medium text-indigo-500 hover:underline">
        Go home
      </Link>
    </section>
  );
}
