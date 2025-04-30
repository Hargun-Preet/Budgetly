"use client";

import { CurrencyComboBox } from '@/components/CurrencyComboBox';
import Navbar from '@/components/Navbar';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Category, TransactionType } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { Pencil, PlusSquare, TrashIcon, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react'
import CreateCategoryDialog from '../dashboard/_components/CreateCategoryDialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import DeleteCategoryDialog from '../dashboard/_components/DeleteCategoryDialog';
import { UsernameInput } from '../dashboard/_components/Username';

function page() {
  return (
    <>
        <Navbar />
      <div className="border-b bg-card px-8">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
            <div>
                <p className="text-3xl font-bold">Manage</p>
                <p className="text-muted-foreground">
                    Manage your account settings and categories
                </p>
            </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 py-4 px-8">
      <Card>
            <CardHeader>
                <CardTitle>Username</CardTitle>
                    <CardDescription>Set your username for your account</CardDescription>
            </CardHeader>
            <CardContent>
                <UsernameInput />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Currency</CardTitle>
                <CardDescription>
                    Set your default currency for transactions
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CurrencyComboBox />
            </CardContent>
        </Card>

        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  )
}

export default page

function CategoryList({type} : {type: TransactionType}) {
    const categoriesQuery = useQuery<Category[]>({
        queryKey: ["categories", type],
        queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json()),
    });

    const userSettingsQuery = useQuery({
        queryKey: ["user-settings"],
        queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
    });

    const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

    return (
        <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center justify-between gap-2'>
                        <div className="flex items-center gap-2">
                            {type === "expense" ? (
                                <TrendingDown className='h-12 w-12 items-center rounded-lg bg-rose-400/10 p-2 text-rose-500' />
                            ) : (
                                <TrendingUp className='h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500' />
                            )}

                            <div>
                                {type === "income" ? "Income" : "Expense"} categories
                                <div className="text-sm text-muted-foreground">Sorted by name</div>
                            </div>
                        </div>
                        <CreateCategoryDialog
                            type={type}
                            successCallback={() => categoriesQuery.refetch()}
                            trigger={
                                <Button className='gap-2 text-sm cursor-pointer'>
                                    <PlusSquare className='h-4 w-4' />
                                    Create Category
                                </Button>
                            }
                        />
                    </CardTitle>
                </CardHeader>
                <Separator />
                {
                    !dataAvailable && (
                        <div className="flex h-40 w-full flex-col items-center justify-center">
                            <p>
                                No
                                <span className={cn(
                                    "m-1",
                                    type === "income" ? "text-emerald-500" : "text-rose-500"
                                )}>{type}</span> categories yet
                            </p>

                            <p className='text-sm text-muted-forground'>
                                Create one to get started
                            </p>
                        </div>
                    )
                }

                {
                    dataAvailable && (
                        <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {categoriesQuery.data.map((category: Category) => (
                                <CategoryCard category={category} key={category.name} currency={userSettingsQuery.data?.currency}/>
                            ))}
                        </div>
                    )
                }

                {/*<CardContent className="grid gap-4 p-6">
                    {categoriesQuery.data?.map((category) => (
                        <div key={`${category.name}-${category.type}`} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">{category.icon}</span>
                                <div>
                                    <p className="font-medium">{category.name}</p>
                                    {category.budget && (
                                        <p className="text-sm text-muted-foreground">
                                            Budget: {category.budget} ({category.budgetType})
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <CreateCategoryDialog
                                    mode="edit"
                                    type={type}
                                    initialData={category}
                                    successCallback={() => categoriesQuery.refetch()}
                                    trigger={
                                        <Button variant="outline" size="sm">
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    }
                                />
                                <DeleteCategoryDialog 
                                    category={category}
                                    trigger={
                                        <Button variant="destructive" size="sm">
                                            <TrashIcon className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </CardContent> */}
            </Card>
        </SkeletonWrapper>
    )
}

function CategoryCard({category, currency} : {category: Category; currency: string}) {
    
    return (
        <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
            <div className="flex flex-col items-center gap-2 p-4">
                <span className="text-3xl" role="img">
                    {category.icon}
                </span>
                <span>{category.name}</span>
                {category.budget && (
                                        <p className="text-sm text-muted-foreground">
                                            Budget: {currency}{" "}{category.budget} ({category.budgetType})
                                        </p>
                                    )}
                <div className="flex w-full gap-2">
                    <CreateCategoryDialog
                        mode="edit"
                        type={category.type}
                        initialData={category}
                        successCallback={() => {}}
                        trigger={
                            <Button 
                                className='flex flex-1 items-center gap-2 rounded text-muted-foreground hover:bg-blue-500/20 cursor-pointer' 
                                variant={"secondary"}
                            >
                                <Pencil className='h-4 w-4' />
                                Edit
                            </Button>
                        }
                    />
                    <DeleteCategoryDialog 
                        category={category} 
                        trigger={
                            <Button 
                                className='flex flex-1 items-center gap-2 rounded text-muted-foreground hover:bg-rose-500/20 cursor-pointer' 
                                variant={"secondary"}
                            >
                                <TrashIcon className='h-4 w-4' />
                                Remove
                            </Button>
                        }
                    />
                </div>
                
            </div>
        </div>
    )
}
