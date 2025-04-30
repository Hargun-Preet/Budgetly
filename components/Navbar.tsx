"use client";
import React, { useState } from 'react'
import Logo, { LogoMobile } from './Logo'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import { ModeToggle } from './global/mode-toggle';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';

function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  )
}

const items = [
    {label: "Dashboard", link: "/dashboard"},
    {label: "Transaction", link: "/transactions"},
    {label: "Manage", link: "/manage"},
]

function MobileNavbar () {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="block border-seperate border-b bg-background md:hidden">
            <nav className="relative flex items-center w-full justify-between px-4 h-[80px]">
                <div className='flex-none'>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className='w-[400px] sm:w-[540px]' side='left'>
                        <div className='p-4'>
                        <Logo />
                        </div>
                        <div className="flex flex-col gap-1 pt-4">
                            {items.map((item) => (
                                <NavbarItem key={item.label} link={item.link} label={item.label} clickCallback={() => setIsOpen((prev) => !prev)}/>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <LogoMobile />
                </div>
                <div className="flex-none flex items-center gap-2">
                    <ModeToggle />
                    <UserButton afterSignOutUrl="/" />
                </div>
            </nav>
        </div>
    )
}

function DesktopNavbar() {
    return (
        <div className="hidden border-seperate border-b bg-background md:block">
            <nav className="w-full flex items-center justify-between px-8">
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
                    <Logo />
                    <div className="flex items-center">
                        {items.map(item => (
                            <NavbarItem
                                key = {item.label}
                                link = {item.link}
                                label = {item.label} 
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-none flex items-center gap-4 ml-auto">
                    <ModeToggle />
                    <UserButton afterSignOutUrl="/" />
                </div>
            </nav>
        </div>
    );
}

function NavbarItem({link, label, clickCallback} : {
    link: string;
    label: string;
    clickCallback?: () => void;
}) {
    const pathname = usePathname();
    const isActive = pathname === link;

    return (
        <div className="relative flex items-center">
            <Link href={link} className={cn(buttonVariants({
                variant: "ghost" }),
                "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
                isActive && "text-foreground"
                )} onClick={() => {
                    if (clickCallback) {
                        clickCallback();
                    }
                }}>{label}
            </Link>
            {
                isActive && (
                    <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block"></div>
                )
            }
        </div>
    )
}

export default Navbar
