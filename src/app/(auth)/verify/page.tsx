export default function VerifyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
          <svg
            className="h-8 w-8 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold">Verifique seu email</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enviamos um link de acesso para o seu email. Clique no link para entrar na sua conta.
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Não recebeu o email? Verifique sua pasta de spam ou{' '}
            <a href="/login" className="font-medium text-primary-600 hover:underline">
              tente novamente
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
