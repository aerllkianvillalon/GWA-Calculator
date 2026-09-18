"use client";

import { Select } from "@/components/ui/select";
import { listGradingSystems } from "@/lib/calculator/grading-systems";

export function GradingSystemSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const systems = listGradingSystems();
  const active = systems.find((s) => s.id === value) ?? systems[0]!;

  return (
    <div className="flex flex-col gap-2">
      <Select
        label="Grading system"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={systems.map((s) => ({ value: s.id, label: s.label }))}
      />
      <p className="text-xs text-ink-500">{active.description}</p>
    </div>
  );
}
