'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export function UsernameInput() {
    const { user, isLoaded } = useUser();
    const [username, setUsername] = useState(user?.firstName || "");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoaded && user?.firstName) {
            setUsername(capitalizeFirstLetter(user.firstName));
        }
    }, [isLoaded, user?.firstName]);

    const handleSubmit = async () => {
        if (!user) return;

        const toastId = "updating-username";
        
        try {
            setIsLoading(true);
            toast.loading("Updating username...", { id: toastId });
            await user.update({
                firstName: username,
            });
            await user.reload();
            toast.dismiss(toastId);
            toast.success("Username updated successfully!");
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("Failed to update username");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = capitalizeFirstLetter(e.target.value);
        setUsername(value);
    };

    return (
        <div className="flex gap-2">
            <Input
                value={username}
                onChange={handleInputChange}
                placeholder="Enter username"
                disabled={isLoading || !isLoaded}
            />
            <Button 
                onClick={handleSubmit} 
                disabled={isLoading || !username || username === user?.firstName || !isLoaded}
            >
                Save
            </Button>
        </div>
    );
}