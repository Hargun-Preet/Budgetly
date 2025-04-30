// app/dashboard/components/BudgetStats.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import React, { useMemo } from "react";
import { GetBudgetStatsResponseType } from "@/app/api/stats/budget/route";
import { BudgetRadialChart } from "@/components/ui/budget-radial-chart";
import { UserSettings } from "@prisma/client";
import { Card } from "@/components/ui/card";

interface BudgetStatsProps {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

function BudgetStats({userSettings, from, to }: BudgetStatsProps) {
  const statsQuery = useQuery<GetBudgetStatsResponseType>({
    queryKey: ["overview", "stats", "budget", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/budget?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => GetFormatterForCurrency(userSettings.currency), [userSettings.currency]);

  return (
    <div className="w-full mt-4 px-8">
      <h1 className="text-3xl font-bold mb-4 py-4">Budget Usage</h1>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        {statsQuery.data && statsQuery.data.length > 0 ? (
          <ScrollArea>
            <div className="flex gap-2">
              {statsQuery.data.map((item) => (
                <BudgetRadialChart
                  key={item.category}
                  category={item.category}
                  icon={item.categoryIcon}
                  budget={item.budget}
                  used={item.used}
                  currency={userSettings.currency}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <Card className="h-[400px] flex w-full items-center justify-center ">
            <div className="flex h-60 w-full flex-col items-center justify-center">
                        No data available for the selected period
                        <p className="text-sm text-muted-foreground px-4">
                            Try selecting a different period
                        </p>
                    </div>
          </Card>
        )}
      </SkeletonWrapper>
    </div>
  );
}

export default BudgetStats;
