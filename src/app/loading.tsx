export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
      </div>
    </div>
  );
}
