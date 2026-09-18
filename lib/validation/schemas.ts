import { z } from "zod";

/**
 * Validation lives here so the exact same rules run in the browser (for fast
 * feedback) and on the server (which never trusts client-supplied numbers).
 */

export const subjectNameSchema = z
  .string()
  .trim()
  .min(1, "Subject name is required.")
  .max(120, "Subject name is too long (120 characters max).")
  // Strip anything that isn't plain text-ish; subject names are rendered as
  // text, never as HTML, but we still reject control characters up front.
  .regex(/^[^\u0000-\u001F\u007F]*$/, "Subject name contains invalid characters.");

export const unitsSchema = z.coerce
  .number({ invalid_type_error: "Units must be a number." })
  .finite("Units must be a finite number.")
  .positive("Units must be greater than zero.")
  .max(60, "Units must be 60 or less.");

export function gradeSchema(min: number, max: number) {
  return z.coerce
    .number({ invalid_type_error: "Grade must be a number." })
    .finite("Grade must be a finite number.")
    .min(min, `Grade must be at least ${min}.`)
    .max(max, `Grade must be at most ${max}.`);
}

export function subjectSchema(gradeMin: number, gradeMax: number) {
  return z.object({
    id: z.string().min(1),
    name: subjectNameSchema,
    units: unitsSchema,
    grade: gradeSchema(gradeMin, gradeMax),
  });
}

export function subjectsListSchema(gradeMin: number, gradeMax: number) {
  return z
    .array(subjectSchema(gradeMin, gradeMax))
    .min(1, "Add at least one subject.")
    .max(100, "You can calculate at most 100 subjects at a time.");
}

export const gradingSystemIdSchema = z.string().min(1).max(64);

export const saveCalculationSchema = z.object({
  name: z
    .string()
    .trim()
    .max(120, "Name is too long (120 characters max).")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  gradingSystemId: gradingSystemIdSchema,
  semester: z
    .string()
    .trim()
    .max(60)
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  academicYear: z
    .string()
    .trim()
    .max(20)
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  schoolOrProgram: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  subjects: z
    .array(
      z.object({
        id: z.string().min(1),
        name: subjectNameSchema,
        units: unitsSchema,
        grade: z.coerce.number().finite(),
      })
    )
    .min(1)
    .max(100),
});

export type SaveCalculationInput = z.infer<typeof saveCalculationSchema>;
