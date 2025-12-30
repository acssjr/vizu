export default function AppLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Carregando...</p>
      </div>
    </div>
  );
}
