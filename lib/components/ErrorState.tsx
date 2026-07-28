// components/ErrorState.tsx
// A dedicated error display with a retry button, instead of just red text.
// Takes an onRetry callback so the parent page controls what "retry" does.

export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="bg-red-900/20 border border-red-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <p className="text-red-300 text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="bg-red-800 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
      >
        Try Again
      </button>
    </div>
  );
}