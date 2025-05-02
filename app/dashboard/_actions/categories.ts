"use server";

import { prisma } from "@/lib/prisma";
import { Category, TransactionType } from "@/lib/types";
import { CreateCategorySchema, CreateCategorySchemaType, DeleteCategorySchema, DeleteCategorySchemaType, UpdateCategorySchema, UpdateCategorySchemaType } from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType): Promise<Category> {
    const parsedBody = CreateCategorySchema.safeParse(form);
    if(!parsedBody.success) {
        throw new Error("bad request");
    }

    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const {name, icon, type, budget, budgetType} = parsedBody.data;
    try {
        const result = await prisma.category.create({
            data: {
                userId: user.id,
                name,
                icon,
                type: type as TransactionType,
                budget: type === "expense" ? budget : null,
                budgetType: type === "expense" ? budgetType : null,
                lastReset: type === "expense" ? new Date() : null,
                used: type === "expense" ? 0 : null,
            },
        });
        
        return {
            name: result.name,
            icon: result.icon,
            type: result.type as TransactionType,
            budget: result.budget,
            budgetType: result.budgetType as "monthly" | "yearly" | null,
            createdAt: result.createdAt,
            userId: result.userId,
            used: result.used,
            lastReset: result.lastReset
        };
    } catch (error) {
        console.error("Failed to create category:", error);
        throw new Error("Failed to create category");
    }
}

export async function UpdateCategory(form: UpdateCategorySchemaType & { oldName?: string }): Promise<Category> {
    const parsedBody = UpdateCategorySchema.safeParse(form);

    if (!parsedBody.success) {
        console.log(parsedBody.error);
        throw new Error("bad request");
    }

    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const { name, icon, type, budget, budgetType} = parsedBody.data;

    const oldName = form.oldName || name;

    try {
        const [result, _] = await prisma.$transaction([
            // Update the category
            prisma.category.update({
                where: {
                    name_userId_type: {
                        name: oldName,
                        userId: user.id,
                        type: type,
                    },
                },
                data: {
                    name,
                    icon,
                    type: type as TransactionType,
                    budget: type === "expense" ? budget : null,
                    budgetType: type === "expense" ? budgetType : null,
                },
            }),

            // Update all transactions that use this category
            prisma.transaction.updateMany({
                where: {
                    userId: user.id,
                    category: oldName,
                    type: type,
                },
                data: {
                    category: name,
                    categoryIcon: icon,
                },
            }),
        ]);
        
        return {
            name: result.name,
            icon: result.icon,
            type: result.type as TransactionType,
            budget: result.budget,
            budgetType: result.budgetType as "monthly" | "yearly" | null,
            createdAt: result.createdAt,
            userId: result.userId,
            used: result.used,
            lastReset: result.lastReset
        };
    } catch (error) {
        console.error("Failed to update category:", error);
        throw new Error("Failed to update category");
    }
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
    const parsedBody =  DeleteCategorySchema.safeParse(form);

    if (!parsedBody.success) {
        console.log(parsedBody.error);
        throw new Error("bad request");
    }

    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const categories = await prisma.category.delete({
        where: {
            name_userId_type: {
                userId: user.id,
                name: parsedBody.data.name,
                type: parsedBody.data.type,
            },
        },
    });

}