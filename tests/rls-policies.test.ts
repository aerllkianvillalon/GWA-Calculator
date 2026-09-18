import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

const migration = readFileSync(
  path.resolve(__dirname, "../supabase/migrations/0001_saved_calculations.sql"),
  "utf-8"
);

describe("saved_calculations RLS migration", () => {
  it("enables row level security on the table", () => {
    expect(migration).toMatch(/enable row level security/i);
  });

  it("defines an ownership-checked policy for every write/read operation", () => {
    for (const op of ["select", "insert", "update", "delete"]) {
      const policyBlockRegex = new RegExp(`for ${op}[\\s\\S]*?;`, "i");
      const block = migration.match(policyBlockRegex)?.[0] ?? "";
      expect(block, `expected a "${op}" policy`).not.toBe("");
      expect(block).toMatch(/auth\.uid\(\)\s*=\s*user_id/);
    }
  });

  it("does not grant the anon role any access to the table", () => {
    expect(migration).toMatch(/revoke all on public\.saved_calculations from anon/i);
    expect(migration).not.toMatch(/grant[^;]*to anon/i);
  });
});
