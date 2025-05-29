import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays } from "date-fns";
import { z } from "zod";

export const OverviewQuerySchema = z.object({
    from: z.coerce.date(),
    to: z.coerce.date(),
    budgetType: z.enum(["monthly", "yearly"]).optional()
})
.refine((args) => {
    const {from, to, budgetType} = args;
    const days = differenceInDays(to, from);

    if (budgetType === "yearly") return true;

    const isValidRange = days >= 0 && days <= MAX_DATE_RANGE_DAYS;
    return isValidRange;
})