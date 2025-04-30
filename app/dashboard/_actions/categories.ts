"use server";

import { prisma } from "@/lib/prisma";
import { CreateCategorySchema, CreateCategorySchemaType } from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType) {
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
        return await prisma.category.create({
            data: {
                userId: user.id,
                name,
                icon,
                type,
                budget: type === "expense" ? budget : null,
                budgetType: type === "expense" ? budgetType : null,
                lastReset: type === "expense" ? new Date() : null,
                used: type === "expense" ? 0 : null,
            },
        });
    } catch (error) {
        console.error("Failed to create category:", error);
        throw new Error("Failed to create category");
    }
}

