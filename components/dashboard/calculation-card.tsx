import type { SavedCalculationRow } from "@/types/database";
import { Card } from "@/components/ui/card";
import { getGradingSystem } from "@/lib/calculator/grading-systems";
import { DeleteCalculationButton } from "@/components/dashboard/delete-calculation-button";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function CalculationCard({ calculation }: { calculation: SavedCalculationRow }) {
  const gradingSystem = getGradingSystem(calculation.grading_system_id);
  const meta = [calculation.semester, calculation.academic_year, calculation.school_or_program]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-serif text-lg font-medium text-ink-900">
            {calculation.name || "Untitled calculation"}
          </p>
          <p className="text-xs text-ink-500">
            Saved {formatDate(calculation.created_at)}
            {meta && ` · ${meta}`}
          </p>
        </div>
        <div className="text-right">
          <p className="font-serif text-2xl font-medium tabular text-ledger-900">
            {calculation.gwa.toFixed(2)}
          </p>
          <p className="text-xs text-ink-500">{calculation.total_units} units</p>
        </div>
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer text-sm text-ink-700 underline">
          Show breakdown ({calculation.subjects.length} subjects, {gradingSystem.label})
        </summary>
        <table className="mt-2 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-ink-500">
              <th scope="col" className="py-1.5 pr-2 font-medium">Subject</th>
              <th scope="col" className="py-1.5 pr-2 font-medium">Units</th>
              <th scope="col" className="py-1.5 font-medium">Grade</th>
            </tr>
          </thead>
          <tbody>
            {calculation.subjects.map((s) => (
              <tr key={s.id} className="border-b border-ink-100 last:border-b-0">
                <td className="py-1.5 pr-2">{s.name}</td>
                <td className="py-1.5 pr-2 tabular">{s.units}</td>
                <td className="py-1.5 tabular">{s.grade.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <div className="mt-3">
        <DeleteCalculationButton id={calculation.id} />
      </div>
    </Card>
  );
}
