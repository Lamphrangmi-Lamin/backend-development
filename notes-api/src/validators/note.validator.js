import z from "zod";

export const noteSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  content: z.string().min(1, "Content cannot be empty"),
});

export const noteIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateNoteSchema = noteSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Provide at least one field to update",
  );
