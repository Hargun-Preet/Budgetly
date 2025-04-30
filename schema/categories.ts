import { z } from "zod";

export const CreateCategorySchema = z.object({
    name: z.string().min(3).max(20),
    icon: z.string().max(20),
    type: z.enum(["income", "expense"]),
    budget: z.number().optional().nullable(),
    budgetType: z.enum(["monthly", "yearly"]).optional(),
    oldName: z.string().optional(), 
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

export const DeleteCategorySchema = z.object({
    name: z.string().min(3).max(20),
    type: z.enum(["income", "expense"]),
})

export type DeleteCategorySchemaType = z.infer<typeof DeleteCategorySchema >;