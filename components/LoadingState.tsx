// components/LoadingState.tsx
// A skeleton loader instead of plain text — gives the user a sense of
// *what* is loading (cards taking shape) rather than just "please wait."

export default function LoadingState() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-24" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-32" />
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-32" />
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-32" />
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-32" />
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-20" />
    </div>
  );
}