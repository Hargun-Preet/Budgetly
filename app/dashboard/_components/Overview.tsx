"use client";

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { UserSettings } from '@prisma/client';
import { differenceInDays, startOfMonth } from 'date-fns';
import React, { useState } from 'react'
import { toast } from 'sonner';
import StatsCards from './StatsCards';
import CategoriesStats from './CategoriesStats';
import BudgetStats from './BudgetStats';

interface OverviewProps {
  userSettings: UserSettings;
  dateRange: {
    from: Date;
    to: Date;
  };
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
}

function Overview({ userSettings, dateRange, onDateRangeChange }: OverviewProps) {
    // const [dateRange, setDateRange] = useState<{from: Date; to: Date}> ({
    //     from: startOfMonth(new Date()),
    //     to: new Date(),
    // });


  return (
    <>
      <div className="w-full flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold px-8">
            Overview
        </h2>
        <div className="flex items-center gap-3 px-8">
            <DateRangePicker 
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
                const {from, to} = values.range;

                if (!from || !to) return;
                if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                    toast.error(
                        `The selected date range is too big. Maximum allowed range is ${MAX_DATE_RANGE_DAYS} days!`
                    );
                    return;
                }

                onDateRangeChange({from, to});
            }}/>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 px-8">
      <StatsCards
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
        />
      </div>

      <CategoriesStats
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
        />

        <BudgetStats  userSettings={userSettings} from={dateRange.from} to={dateRange.to} />
    </>
  )
}

export default Overview
