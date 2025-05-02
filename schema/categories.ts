import { TransactionType } from "@/lib/types";
import { z } from "zod";

export const CreateCategorySchema = z.object({
    name: z.string().min(3).max(20),
    icon: z.string().max(20),
    type: z.enum(["income", "expense"]) as z.ZodType<TransactionType>,
    budget: z.number().optional().nullable(),
    budgetType: z.enum(["monthly", "yearly"]).optional(),
}).refine((data) => {
    // If budget is set, budgetType must also be set
    if (data.budget && !data.budgetType) {
        return false;
    }
    // If budgetType is set, budget must also be set
    if (data.budgetType && !data.budget) {
        return false;
    }
    return true;
}, {
    message: "Budget period is required when setting a budget amount"
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;

// Combine id and form data into a single schema for update
export const UpdateCategorySchema = CreateCategorySchema;

export type UpdateCategorySchemaType = z.infer<typeof UpdateCategorySchema>;

export const DeleteCategorySchema = z.object({
    name: z.string().min(3).max(20),
    type: z.enum(["income", "expense"]),
})

export type DeleteCategorySchemaType = z.infer<typeof DeleteCategorySchema >;