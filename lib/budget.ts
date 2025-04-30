import { prisma } from "@/lib/prisma";

export async function resetBudgets() {
    const now = new Date();
    const categories = await prisma.category.findMany({
        where: {
            type: "expense",
            budget: { not: null },
        },
    });

    for (const category of categories) {
        const lastReset = category.lastReset;
        if (!lastReset) continue;

        const shouldReset = category.budgetType === "monthly" 
            ? isNewMonth(lastReset, now)
            : isNewYear(lastReset, now);

        if (shouldReset) {
            await prisma.category.update({
                where: { 
                    name_userId_type: {
                        name: category.name,
                        userId: category.userId,
                        type: category.type
                    }
                },
                data: {
                    used: 0,
                    lastReset: now,
                },
            });
        }
    }
}

function isNewMonth(lastReset: Date, now: Date): boolean {
    return lastReset.getMonth() !== now.getMonth() || 
           lastReset.getFullYear() !== now.getFullYear();
}

function isNewYear(lastReset: Date, now: Date): boolean {
    return lastReset.getFullYear() !== now.getFullYear();
}