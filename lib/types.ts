export type TransactionType = "income" | "expense";

export type Timeframe = "month" | "year";
export type Period ={year: number; month: number};

export interface Category {
    name: string;
    icon: string;
    type: TransactionType;
    budget: number | null;
    budgetType: "monthly" | "yearly" | null;
    createdAt: Date;
    userId: string;
    used: number | null;
    lastReset: Date | null;
}