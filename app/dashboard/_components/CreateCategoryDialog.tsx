"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CreateCategorySchema, CreateCategorySchemaType } from '@/schema/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleOff, Loader2, PlusSquare } from 'lucide-react';
import React, { ReactNode, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Form } from "@/components/ui/form";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCategory, UpdateCategory } from '../_actions/categories';
import { Category } from '@/lib/types';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface Props {
    type: TransactionType;
    successCallback: (category: Category) => void;
    trigger?: ReactNode;
    mode?: 'create' | 'edit';
    initialData?: Category;
}

function CreateCategoryDialog({type, successCallback, trigger, mode = 'create', initialData} : Props) {
    const [open, setOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    const form = useForm<CreateCategorySchemaType> ({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            type,
            name: initialData?.name || "",
            icon: initialData?.icon || "",
            budget: initialData?.budget || undefined,
            budgetType: initialData?.budgetType as "monthly" | "yearly" | undefined || (type === "expense" ? "monthly" : undefined),
        },
    });

    const queryClient = useQueryClient();
    const theme = useTheme();

    const {mutate, isPending} = useMutation<
    Category,
    Error,
    CreateCategorySchemaType
>({
        mutationFn: mode === 'create' ? CreateCategory : UpdateCategory,
        onSuccess: async (data: Category) => {
            if (mode === 'create') {
                form.reset({
                    name: "",
                    icon: "",
                    type,
                    budget: undefined,
                    budgetType: type === "expense" ? "monthly" : undefined,
                });
            }

            toast.success(`Category ${mode === 'create' ? 'created' : 'updated'} successfully!`, {
                id: "create-category",
            });

            successCallback(data);

            toast.dismiss(mode === 'create' ? 'create-category' : 'update-category');
            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            
            setOpen((prev) => !prev);
            
        },
        onError: () => {
            toast.dismiss(mode === 'create' ? 'create-category' : 'update-category');
            toast.error("Something went wrong", {
                id: mode === 'create' ? 'create-category' : 'update-category',
            });
        },
    });

    const onSubmit =  useCallback((values: CreateCategorySchemaType) => {
        if (values.budget && !values.budgetType) {
            toast.error("Please select a budget period");
            return;
        }

        const toastId = mode === 'create' ? 'create-category' : 'update-category';
        const toastMessage = mode === 'create' ? "Creating category..." : "Updating category...";

        toast.loading(toastMessage, { id: toastId });

        // Add oldName when in edit mode
        const mutationData = mode === 'edit' ? 
        { ...values, oldName: initialData?.name } : 
        values;

        mutate(mutationData);
}, [mutate, mode, initialData]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        {trigger ? (trigger) : (
            <Button variant={"ghost"} className='flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground cursor-pointer'>
                <PlusSquare className='mr-2 h-4 w-4'/> Create new
            </Button>
        )}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {mode === 'create' ? 'Create' : 'Edit'} <span className={cn(
                        "m-1",
                        type === "income" ? "text-emerald-500" : "text-rose-500"
                    )}>{type}</span>
                    category
                </DialogTitle>
                <DialogDescription>
                    Categories are used to group your transactions
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                    control={form.control} 
                    name="name" 
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input className="border-1 border-black-350" autoComplete="off" placeholder='Category' {...field} />
                            </FormControl>
                            <FormDescription>This is how your category will appear in the app</FormDescription>
                        </FormItem>
                    )}
                    />

                <FormField
                    control={form.control} 
                    name="icon" 
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Icon</FormLabel>
                            <FormControl>
                                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className='h-[100px] w-full cursor-pointer'>
                                            {form.watch("icon") ? (
                                                <div className='flex flex-col items-center gap-2'>
                                                    <span className="text-5xl" role='img'>
                                                        {field.value}
                                                    </span>
                                                    <p className='text-xs text-muted-foreground'>Click to change</p>
                                                </div>
                                            ) : (
                                                <div className='flex flex-col items-center gap-2'>
                                                    <CircleOff className='h-[48px] w-[48px]'/>
                                                    <p className='text-xs text-muted-foreground'>Click to select</p>
                                                </div>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-full absolute bottom-[-100px] right-[150px] bg-transparent border-none'>
                                            <Picker
                                            data={data} 
                                            theme={theme.resolvedTheme}
                                            onEmojiSelect={(emoji : {native : string}) => {
                                                field.onChange(emoji.native);
                                                setPopoverOpen(false);
                                            }}/>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormDescription>This is how your category will look in the app</FormDescription>
                        </FormItem>
                    )}
                    />

                    {type === "expense" && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="budget"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Budget Amount</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value === '' ? undefined : Number(e.target.value);
                                                                field.onChange(value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>Set a budget limit for this category</FormDescription>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="budgetType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Budget Period</FormLabel>
                                                    <Select 
                                                        onValueChange={field.onChange} 
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select budget period" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="monthly">Monthly</SelectItem>
                                                            <SelectItem value="yearly">Yearly</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>Choose budget reset period</FormDescription>
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}
                </form>
            </Form>
                <DialogFooter>
                <DialogClose asChild>
                    <Button
                    type="button"
                    className="cursor-pointer"
                    variant={"secondary"}
                    onClick={() => {
                        form.reset();
                    }}>
                        Cancel
                    </Button>
                </DialogClose>
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className="cursor-pointer">
                    {!isPending && (mode === 'create' ? "Create" : "Save")}
                    {isPending && <Loader2 className='animate-spin'/>}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default CreateCategoryDialog
