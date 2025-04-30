// components/BudgetRadialChart.tsx
"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { GetFormatterForCurrency } from "@/lib/helpers";

interface BudgetRadialChartProps {
  category: string;
  icon: string;
  budget: number;
  used: number;
  currency: string; 
}

export function BudgetRadialChart({
  category,
  icon,
  budget,
  used,
  currency,
}: BudgetRadialChartProps) {
  const percentage = Math.min((used / budget) * 100, 100);

  const computedEndAngle = (360 * (percentage / 100));
  const formatter = GetFormatterForCurrency(currency);

      // Add this function to determine color based on percentage
  const getColorByPercentage = (percentage: number) => {
    if (percentage <= 25) return "var(--success)";       // Green for 0-25%
    if (percentage <= 50) return "var(--warning)";       // Yellow for 26-50%
    if (percentage <= 75) return "var(--caution)";       // Orange for 51-75%
    return "var(--destructive)";                         // Red for 76-100%
  };

  const chartData = [
    { name: "Used", value: percentage, fill: getColorByPercentage(percentage) }
  ];


    // Define a minimal chart configuration to satisfy ChartContainer requirements.
    const chartConfig: ChartConfig = {
        value: {
          label: "Budget Usage",
          color: getColorByPercentage(percentage),
        },
      };

  return (
    <Card className="flex flex-col min-w-[250px]">
      <CardHeader className="items-center h-18">
        <CardTitle className="flex items-center gap-2">
          <span>{icon}</span>
          {category}
        </CardTitle>
        <CardDescription>
            {formatter.format(used)} spent of {formatter.format(budget)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
            config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={computedEndAngle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} fill="var(--color-primary)" />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          className="fill-foreground text-4xl font-bold"
                        >
                          {percentage.toFixed(0)}%
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
      <div className="flex items-center gap-2 text-lg leading-none text-center">
        {used / budget <= 1 ? (
            <>
            You are within budget
            <TrendingUp className="h-4 w-4" />
            </>
        ) : (
            <>
            Over budget by 
            <div className="text-destructive">
            {((used - budget) / budget) * 100 | 0}%
            </div>
            <TrendingDown className="h-4 w-4" />
            </>
        )}
        </div>
      </CardFooter>
    </Card>
  );
}
