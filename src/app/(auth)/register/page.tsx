import { redirect } from 'next/navigation';

/**
 * Redirects the request to the unified login route.
 *
 * When invoked (rendered), triggers an immediate redirect to `/login`.
 */
export default function RegisterPage() {
  redirect('/login');
}