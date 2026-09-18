"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export function DeleteCalculationButton({ id }: { id: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "confirming" | "error">("idle");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/calculations/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      router.refresh();
    } catch {
      setIsDeleting(false);
      setStatus("error");
    }
  }

  if (status === "confirming") {
    return (
      <div className="flex flex-col gap-2">
        <Alert tone="warning">Delete this calculation? This can't be undone.</Alert>
        <div className="flex gap-2">
          <Button variant="danger" size="sm" onClick={handleDelete} isLoading={isDeleting}>
            Yes, delete
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setStatus("idle")}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="ghost" size="sm" onClick={() => setStatus("confirming")}>
        Delete
      </Button>
      {status === "error" && (
        <Alert tone="error">Couldn't delete that. Please try again.</Alert>
      )}
    </div>
  );
}
