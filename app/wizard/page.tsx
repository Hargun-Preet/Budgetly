import { CurrencyComboBox } from '@/components/CurrencyComboBox';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import { UsernameInput } from '../dashboard/_components/Username';

async function Page() {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className="container max-w-2xl flex flex-col items-center space-y-8">
                <div className="w-full space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-center text-4xl">
                            Welcome, <span className="ml-2 font-bold">{user.firstName}</span>
                        </h1>
                        <h2 className="text-center text-lg text-muted-foreground">
                            Let&apos;s get started by setting up your currency
                        </h2>
                        <h3 className="text-center text-base text-muted-foreground">
                            You can change these settings at any time
                        </h3>
                    </div>

                    <Separator className="my-6" />

                    <Card className="w-full border border-neutral-200 bg-card text-card-foreground shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                        <CardHeader>
                            <CardTitle>Username</CardTitle>
                            <CardDescription>Set your username for your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UsernameInput />
                        </CardContent>
                    </Card>

                    <Card className="w-full border border-neutral-200 bg-card text-card-foreground shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                        <CardHeader>
                            <CardTitle>Currency</CardTitle>
                            <CardDescription>Set your default currency for transactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CurrencyComboBox  />
                        </CardContent>
                    </Card>

                    <Separator className="my-6" />

                    <div className="flex flex-col items-center space-y-8">
                        <Button className="w-full" asChild>
                            <Link href={"/dashboard"}>
                                I&apos;m done! Take me to the dashboard
                            </Link>
                        </Button>

                        <Logo />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Page
