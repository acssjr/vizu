import { redirect } from 'next/navigation';

// Register page redirects to unified login flow
export default function RegisterPage() {
  redirect('/login');
}
