import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server'
import { MinusCircle, PlusCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'
import CreateTransactionDialog from './_components/CreateTransactionDialog';
import Overview from './_components/Overview';
import History from './_components/History';

async function Page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }
    return (
      <div className='h-full bg-background'>
        <div className="border-b bg-card">
          <div className="w-full flex flex-wrap items-center justify-between gap-6 py-8">
            <p className="text-3xl font-bold px-8">
              Hello, {user.firstName
                ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
                : "Guest"}
              !
            </p>

            <div className="flex items-center gap-3 px-8">
              <CreateTransactionDialog trigger={
                <Button variant={"outline"} className={cn("relative border",
                  "bg-gradient-to-r from-green-500/90 via-purple-300/90 to-blue-500/90",
                  "text-black font-semibold",
                  "hover:from-green-500/90 hover:via-purple-400/90 hover:to-blue-600/90 hover:text-white cursor-pointer",
                  "transition-all duration-300 ease-in-out")}>
                  <PlusCircle className="w-5 h-5" /> New Income
                </Button>
              }
              type="income"
              />
              <CreateTransactionDialog trigger={
                <Button 
                variant={"outline"}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-black font-semibold",
                  "bg-gradient-to-r from-rose-600 via-amber-200 to-orange-500",
                  "hover:from-rose-700 hover:via-amber-300 hover:to-orange-600 hover:text-white cursor-pointer"
                )}>
                  <MinusCircle className="w-5 h-5" /> New Expense
                </Button>
              } 
              type='expense'
              />
            </div>
          </div>
        </div>
        <Overview userSettings={userSettings} />
        <History userSettings={userSettings} />
      </div>
    )
  }
  
  export default Page
