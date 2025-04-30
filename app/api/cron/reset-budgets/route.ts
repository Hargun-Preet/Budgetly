import { resetBudgets } from "@/lib/budget";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await resetBudgets();
        return NextResponse.json({ message: "Budgets reset successfully" });
    } catch (error) {
        console.error("Failed to reset budgets:", error);
        return NextResponse.json({ error: "Failed to reset budgets" }, { status: 500 });
    }
}