// components/DecisionCard.tsx
// A dedicated component for the INVEST/PASS verdict, confidence bar, and reasoning.
// Pulled out separately because it has unique conditional styling (green vs red)
// that doesn't belong inside the generic Card component.

export default function DecisionCard({
  decision,
  confidence,
  reasoning,
}: {
  decision: "INVEST" | "PASS";
  confidence: number;
  reasoning: string;
}) {
  const isInvest = decision === "INVEST";

  return (
    <div
      className={`rounded-xl border p-5 sm:p-6 flex flex-col gap-3 ${
        isInvest
          ? "bg-green-950/30 border-green-800"
          : "bg-red-950/30 border-red-800"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <span
          className={`text-xl sm:text-2xl font-bold whitespace-nowrap ${
            isInvest ? "text-green-400" : "text-red-400"
          }`}
        >
          {isInvest ? "✅ INVEST" : "🔴 PASS"}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Confidence</span>
            <span>{confidence}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isInvest ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed">{reasoning}</p>
    </div>
  );
}