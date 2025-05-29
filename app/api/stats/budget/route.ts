// app/dashboard/api/stats/budget/route.ts
import { prisma } from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const budgetType = searchParams.get("budgetType");

  const queryParams = OverviewQuerySchema.safeParse({ from, to, budgetType: budgetType || undefined  });
  if (!queryParams.success) {
    throw new Error(queryParams.error.message);
  }

  const stats = await getBudgetStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
}

export type GetBudgetStatsResponseType = Awaited<ReturnType<typeof getBudgetStats>>;

async function getBudgetStats(userId: string, from: Date, to: Date) {
  // Get all expense categories with a defined budget
  const categories = await prisma.category.findMany({
    where: {
      userId,
      type: "expense",
      budget: {
        not: null,
      },
    },
  });

  // For each category, sum the expenses in the given date range
  // (Note: since there's no relation between Category and Transaction, we match on category name.)
  const stats = await Promise.all(
    categories.map(async (cat) => {
      let queryFrom = from;
      let queryTo = to;
      const now = new Date();

      // For yearly budgets, use start of year to current date
      if (cat.budgetType === "yearly") {
        queryFrom = new Date(from.getFullYear(), 0, 1); // January 1st
        queryTo = to;
      } else {
        // For monthly budgets, use the provided date range
        queryFrom = from;
        queryTo = to;
      }
      const transactions = await prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId,
          type: "expense",
          category: cat.name,
          date: {
            gte: queryFrom,
            lte: queryTo,
          },
        },
      });

      return {
        category: cat.name,
        categoryIcon: cat.icon,
        budget: cat.budget || 0,
        used: transactions._sum.amount || 0,
        budgetType: cat.budgetType,
      };
    })
  );

  return stats.filter(item => item.used > 0);
}
