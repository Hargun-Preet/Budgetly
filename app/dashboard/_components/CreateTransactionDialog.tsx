"use client";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import React , { ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "../_actions/transactions";
import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helpers";
import { Category } from "@prisma/client";

interface Props {
    trigger: ReactNode;
    type: TransactionType;
}

function CreateTransactionDialog({trigger, type} : Props) {
    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type,
            date: new Date(),
        },
    });

    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const { data: userSettings } = useQuery({
        queryKey: ["userSettings"],
        queryFn: async () => {
            const response = await fetch("/api/user-settings");
            return response.json();
        },
    });

    const handleCategoryChange = useCallback((value: string, category: Category) => {
        form.setValue("category", value);
        setSelectedCategory(category);
    }, [form]);

    // Add this function to handle dialog close
    const handleDialogClose = useCallback(() => {
        setSelectedCategory(null);
        form.reset({
            type,
            description: "",
            amount: 0,
            date: new Date(),
            category: undefined,
        });
        setOpen(false);
    }, [form, type]);

    const queryClient = useQueryClient();

    const {mutate, isPending} = useMutation({
        mutationFn: CreateTransaction,
        onSuccess: () => {
            toast.success("Transaction created successfully!", {
                id: "create-transaction",
            });

            setSelectedCategory(null);
            form.reset({
                type,
                description: "",
                amount: 0,
                date: new Date(),
                category: undefined,
            });

            //after creating a transaction, we need to inavlidate the overview query which will refetch the data in the dashboard
            queryClient.invalidateQueries({
                queryKey: ["overview"],
            });

            setOpen((prev) => !prev);
        },
    });

    const onSubmit = useCallback((values: CreateTransactionSchemaType) => {
        const showLoadingToast = () => {
            toast.loading("Creating Transaction...", {
                id: "create-transaction"
            });
    
            mutate({
                ...values,
                date: DateToUTCDate(values.date),
            });
        };

        if (type === "expense" && selectedCategory?.budget) {
            const newAmount = values.amount;
            const currentUsed = selectedCategory.used || 0;
            
            if (currentUsed + newAmount > selectedCategory.budget) {
                toast.warning(`This transaction will exceed the budget for ${selectedCategory.name}`, {
                    id: "budget-warning",
                    duration: 6000, // Show for 4 seconds
                    position: "top-center"
                });

            }
        }

        showLoadingToast();
    }, [mutate, type, selectedCategory]);

    return <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
            handleDialogClose();
        } else {
            setOpen(true);
        }
    }}>
        <DialogTrigger asChild>
            {trigger}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create a new<span className={cn(
                    "m-1",
                    type === "income" ? "text-emerald-500" : "text-rose-500"
                )}>{type}</span> transaction
                </DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                    control={form.control} 
                    name="description" 
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input className="border-1 border-black-350" autoComplete="off" defaultValue={""} {...field} />
                            </FormControl>
                            <FormDescription>Transaction description (optional)</FormDescription>
                        </FormItem>
                    )}
                    />

                    <FormField 
                    control={form.control} 
                    name="amount" 
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input className="border-1 border-black-350" defaultValue={0} type="number" {...field} />
                            </FormControl>
                            <FormDescription>Transaction amount (required)</FormDescription>
                        </FormItem>
                    )}
                    />

                    <div className="flex items-center justify-between gap-2 mt-4 ">
                    <FormField 
                        control={form.control} 
                        name="category" 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <CategoryPicker type = {type} onChange={handleCategoryChange}/>
                                </FormControl>
                                <FormDescription>Select a category for this transaction</FormDescription>
                                
                            </FormItem>
                        )}
                        />

                    <FormField 
                        control={form.control} 
                        name="date" 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Transaction date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button 
                                            variant={"outline"}
                                            className={cn(
                                                "w-[200px] pl-3 text-left font-normal cursor-pointer",
                                                !field.value && "text-muted-foreground"
                                            )}>
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 cursor-pointer">
                                        <Calendar 
                                        mode="single" 
                                        selected={field.value} 
                                        onSelect={(value) => {
                                            if (!value) return;
                                            console.log("@@CALENDER", value);
                                            field.onChange(value);
                                        }} 
                                        initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>Select a date for this transaction</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                                {type === "expense" && selectedCategory?.budget && (
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        Budget: {userSettings?.currency} {(selectedCategory.used || 0).toFixed(2)} used / {userSettings?.currency} {selectedCategory.budget.toFixed(2)} 
                                        ({selectedCategory.budgetType === "monthly" ? "monthly" : "yearly"})
                                    </div>
                                )}
                </form>
            </Form>
            <DialogFooter>
            <DialogClose asChild>
                <Button
                type="button"
                className="cursor-pointer"
                variant={"secondary"}
                onClick={handleDialogClose}>
                    Cancel
                </Button>
            </DialogClose>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className="cursor-pointer">
            {!isPending && "Save"}
            {isPending && <Loader2 className='animate-spin'/>}
                </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
}

export default CreateTransactionDialog;