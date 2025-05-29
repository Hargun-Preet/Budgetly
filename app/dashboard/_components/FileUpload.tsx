"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

interface FileUploadProps {
    onChange: (base64String: string) => Promise<void>;
    value?: string;
    disabled?: boolean;
}

export function FileUpload({ onChange, value, disabled }: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false);

    const handleChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64String = event.target?.result as string;
                await onChange(base64String);
            };
            reader.readAsDataURL(file);
        },
        [onChange]
    );

    return (
        <div
            className={cn(
                "group relative border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 hover:from-pink-500/40 hover:via-purple-500/40 hover:to-blue-500/40 hover:shadow-lg",
                dragActive && "border-primary/50 bg-accent/50",
                disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
            )}
            onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={async (e) => {
                e.preventDefault();
                setDragActive(false);

                const file = e.dataTransfer.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = async (event) => {
                    const base64String = event.target?.result as string;
                    await onChange(base64String);
                };
                reader.readAsDataURL(file);
            }}
        >
            <Input
                type="file"
                accept="image/*"
                disabled={disabled}
                className="hidden"
                onChange={handleChange}
                id="receipt-upload"
            />
            <label
                htmlFor="receipt-upload"
                className="flex flex-col items-center gap-2 cursor-pointer"
            >
                {value ? (
                    <div className="relative w-40 h-40">
                        <Image
                            src={value}
                            alt="Receipt"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-10 h-10 text-purple-500/70 transition-all duration-700 ease-in-out group-hover:rotate-180 group-hover:scale-110 group-hover:text-purple-500" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Use AI to upload receipt and auto-fill details
                        </p>
                    </>
                )}
            </label>
        </div>
    );
}