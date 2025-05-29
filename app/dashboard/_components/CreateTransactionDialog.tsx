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
// Add to imports at the top
import { FileUpload } from "./FileUpload";
import { parseISO } from "date-fns";

// Add this helper function at the top of the file after imports
const stripEmoji = (text: string) => {
    return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2300}-\u{23FF}]|[\u{2B50}]|[\u{20E3}]|[\u{FE0F}]|[\u{E0020}-\u{E007F}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '').trim();
};


interface Props {
    trigger: ReactNode;
    type: TransactionType;
    dateRange: {
        from: Date;
        to: Date;
    };
}

function CreateTransactionDialog({trigger, type, dateRange} : Props) {
    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type,
            date: new Date(),
        },
    });

    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

        // Add these states after existing useState declarations
    const [isScanning, setIsScanning] = useState(false);
    const [receiptImage, setReceiptImage] = useState<string>();
    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [suggestedCategory, setSuggestedCategory] = useState<string>("");

    const { data: userSettings } = useQuery({
        queryKey: ["userSettings"],
        queryFn: async () => {
            const response = await fetch("/api/user-settings");
            return response.json();
        },
    });

    const handleCategoryChange = useCallback((value: string, category: Category) => {
        form.setValue("category", value, { 
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        });
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

    // Add this query to get current period usage
    const categoryUsageQuery = useQuery({
        queryKey: ["category-usage", selectedCategory?.name, dateRange.from, dateRange.to],
        queryFn: async () => {
            if (!selectedCategory?.name) return 0;
            
            const startDate = selectedCategory.budgetType === "yearly"
                ? new Date(dateRange.from.getFullYear(), 0, 1)  // Start of year
                : dateRange.from

            const response = await fetch(
                `/api/stats/budget?from=${DateToUTCDate(startDate)}&to=${DateToUTCDate(dateRange.to)}&budgetType=${selectedCategory.budgetType}`
            );
            const budgetStats = await response.json();
            const categoryStats = budgetStats.find(
                (stat: any) => stat.category === selectedCategory.name
            );
            return categoryStats?.used || 0;
        },
        enabled: !!selectedCategory?.name,
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
            const currentUsed = categoryUsageQuery.data || 0;
            
            if (currentUsed + newAmount > selectedCategory.budget) {
                toast.warning(`This transaction will exceed the budget for ${selectedCategory.name}`, {
                    id: "budget-warning",
                    duration: 6000, // Show for 4 seconds
                    position: "top-center"
                });

            }
        }

        showLoadingToast();
    }, [mutate, type, selectedCategory, categoryUsageQuery.data]);

    // Add categories query after existing queries
    const { data: categories } = useQuery({
        queryKey: ["categories", type],
        queryFn: async () => {
            const response = await fetch(`/api/categories?type=${type}`);
            return response.json();
        },
    });

    // Add receipt handling function after existing handlers
    const handleReceiptUpload = useCallback(async (base64String: string) => {
        setReceiptImage(base64String);
        setIsScanning(true);

        try {
            const response = await fetch("/api/scan-receipt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    image: base64String,
                    type,
                    categories: categories || []
                }),
            });

            if (!response.ok) throw new Error("Failed to scan receipt");
            const data = await response.json();

            // Update form with extracted data
            if (data.total_amount) form.setValue("amount", parseFloat(data.total_amount));
            if (data.description) form.setValue("description", data.description);
            if (data.date) form.setValue("date", parseISO(data.date));

            // Handle category selection
            if (data.category_suggestion && data.category_suggestion !== "NEW_CATEGORY_NEEDED") {
                console.log("Looking for category:", data.category_suggestion);
                console.log("Available categories:", categories);

                const matchingCategory = categories?.find(
                    (cat: Category) => cat.name.toLowerCase().trim() === data.category_suggestion.toLowerCase().trim()
                );

                console.log("Matched category:", matchingCategory);

                if (matchingCategory) {
                    form.setValue("category", matchingCategory.name, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true
                    });
                    setSelectedCategory(matchingCategory);
                    handleCategoryChange(matchingCategory.name, matchingCategory);
                    toast.success(`Matched category: ${matchingCategory.name} (${Math.round(data.category_confidence * 100)}% confident)`);
                }
            } else if (data.suggested_category_name) {
                setSuggestedCategory(data.suggested_category_name);
                toast.info(
                    `No matching category found. Would you like to create "${data.suggested_category_name}"?`,
                    {
                        action: {
                            label: "Create Category",
                            onClick: () => setShowCreateCategory(true),
                        },
                        duration: 10000,
                    }
                );
            }

            toast.success("Receipt scanned successfully!");
        } catch (error) {
            console.error("Receipt scanning error:", error);
            toast.error("Failed to scan receipt");
        } finally {
            setIsScanning(false);
        }
    }, [categories, form, type, handleCategoryChange, setShowCreateCategory]);

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
                <div className="mb-4">
                    <FormLabel className="mb-2">Scan Receipt</FormLabel>
                    <FileUpload
                        onChange={handleReceiptUpload}
                        value={receiptImage}
                        disabled={isScanning}
                    />
                    {isScanning && (
                        <div className="mt-2 flex items-center justify-center text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Scanning receipt...
                        </div>
                    )}
                </div>

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
                                    <CategoryPicker type = {type} value={form.watch("category")} onChange={handleCategoryChange}/>
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
                                        Budget: {userSettings?.currency} {categoryUsageQuery.data?.toFixed(2) || "0.00"} used / {userSettings?.currency} {selectedCategory.budget.toFixed(2)} 
                                        ({selectedCategory.budgetType === "monthly" ? "monthly" : "yearly"})
                                        <div className="text-xs text-muted-foreground">
                                            (Usage from {format(selectedCategory.budgetType === "yearly"
                                                ? new Date(dateRange.from.getFullYear(), 0, 1)  // Start of year
                                                : dateRange.from, "PP")}
                                                { } to {format(dateRange.to, "PP")})
                                        </div>
                                    </div>
                                )}
                </form>

                {/*{showCreateCategory && (
                    <CreateCategoryDialog
                        type={type}
                        successCallback={(category) => {
                            handleCategoryChange(category.name, category);
                            setShowCreateCategory(false);
                        }}
                        initialData={{
                            name: suggestedCategory,
                            type,
                            icon: "📝",
                        }}
                        mode="create"
                    />
                )}*/}
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