"use client";

import { useState } from "react";
import type { GradingSystem } from "@/types/calculator";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { compareToTarget } from "@/lib/calculator/gwa";
import { Card } from "@/components/ui/card";

export function TargetGwaPanel({
  gwa,
  gradingSystem,
}: {
  gwa: number;
  gradingSystem: GradingSystem;
}) {
  const [target, setTarget] = useState("");

  const targetNum = Number(target);
  const isValidTarget =
    target.trim() !== "" &&
    Number.isFinite(targetNum) &&
    targetNum >= gradingSystem.minValue &&
    targetNum <= gradingSystem.maxValue;

  const comparison = isValidTarget
    ? compareToTarget(gwa, targetNum, gradingSystem)
    : null;

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-serif text-lg font-medium text-ink-900">Target GWA</h2>
      <p className="mt-1 text-sm text-ink-500">
        Set a goal and see how far your current result is from it.
      </p>
      <div className="mt-3 max-w-xs">
        <Input
          label="Target GWA"
          type="number"
          inputMode="decimal"
          step={gradingSystem.step}
          min={gradingSystem.minValue}
          max={gradingSystem.maxValue}
          placeholder={gradingSystem.lowerIsBetter ? "e.g. 1.75" : "e.g. 90"}
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
      </div>
      {target.trim() !== "" && !isValidTarget && (
        <Alert tone="error" className="mt-3">
          Enter a target between {gradingSystem.minValue} and {gradingSystem.maxValue}.
        </Alert>
      )}
      {comparison && (
        <Alert tone={comparison.met ? "success" : "info"} className="mt-3">
          {comparison.met
            ? `You're already at or better than your target (by ${comparison.difference.toFixed(2)}).`
            : `You're ${comparison.difference.toFixed(2)} away from your target.`}
        </Alert>
      )}
    </Card>
  );
}
