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

  const queryParams = OverviewQuerySchema.safeParse({ from, to });
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
      const transactions = await prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId,
          type: "expense",
          category: cat.name,
          date: {
            gte: from,
            lte: to,
          },
        },
      });

      return {
        category: cat.name,
        categoryIcon: cat.icon,
        budget: cat.budget || 0,
        used: transactions._sum.amount || 0,
      };
    })
  );

  return stats.filter(item => item.used > 0);
}
