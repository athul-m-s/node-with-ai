import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Generic Zod validation middleware (compatible with Zod v4).
 * Validates req.body against the provided schema.
 * On success, replaces req.body with the parsed (sanitized + coerced) output.
 * On failure, returns a 400 with structured field-level errors.
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const zodError = result.error as ZodError;
      // Zod v4 uses .issues, v3 used .errors — handle both
      const issues = zodError.issues ?? (zodError as any).errors ?? [];
      const errors = issues.map((e: any) => ({
        field: (e.path as PropertyKey[]).map(String).join(".") || "root",
        message: e.message as string,
      }));

      res.status(400).json({
        message: "Validation failed",
        errors,
      });
      return;
    }

    // Replace body with the sanitized/coerced output (email lowercased, strings trimmed, etc.)
    req.body = result.data;
    next();
  };
