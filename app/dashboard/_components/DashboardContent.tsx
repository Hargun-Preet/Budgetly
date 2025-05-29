"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MinusCircle, PlusCircle } from 'lucide-react';
import React, { useState } from 'react';
import CreateTransactionDialog from './CreateTransactionDialog';
import Overview from './Overview';
import History from './History';
import { startOfMonth } from "date-fns";
import { SerializedUser } from '@/lib/types';
import { UserSettings } from '@prisma/client';

interface DashboardContentProps {
  user: SerializedUser;
  userSettings: UserSettings;
}

function DashboardContent({ user, userSettings }: DashboardContentProps) {
  const [dateRange, setDateRange] = useState<{from: Date; to: Date}>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <div className='h-full bg-background'>
      <div className="border-b bg-card">
        <div className="w-full flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold px-8">
            Hello, {user.firstName
              ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
              : "Guest"}!
          </p>

          <div className="flex items-center gap-3 px-8">
            <CreateTransactionDialog 
              trigger={
                <Button variant={"outline"} className={cn("relative border",
                  "bg-gradient-to-r from-green-500/90 via-purple-300/90 to-blue-500/90",
                  "text-black font-semibold",
                  "hover:from-green-500/90 hover:via-purple-400/90 hover:to-blue-600/90 hover:text-white cursor-pointer",
                  "transition-all duration-300 ease-in-out")}>
                  <PlusCircle className="w-5 h-5" /> New Income
                </Button>
              }
              type="income"
              dateRange={dateRange}
            />
            <CreateTransactionDialog 
              trigger={
                <Button variant={"outline"}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-black font-semibold",
                    "bg-gradient-to-r from-rose-600 via-amber-200 to-orange-500",
                    "hover:from-rose-700 hover:via-amber-300 hover:to-orange-600 hover:text-white cursor-pointer"
                  )}>
                  <MinusCircle className="w-5 h-5" /> New Expense
                </Button>
              } 
              type='expense'
              dateRange={dateRange}
            />
          </div>
        </div>
      </div>
      <Overview 
        userSettings={userSettings} 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      <History userSettings={userSettings} />
    </div>
  );
}

export default DashboardContent;