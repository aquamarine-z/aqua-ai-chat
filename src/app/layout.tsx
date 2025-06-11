'use client'
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner"
import {ThemeProvider} from "@/components/theme-provider";
import React, {useEffect} from "react";
import {useLanguageSettingsStore} from "@/store/language-settings-store";
import {useLanguageStore} from "@/store/language-store";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const languageStore = useLanguageStore();
    const languageSettingStore = useLanguageSettingsStore()
    useEffect(() => {
        languageStore.setLanguageByName(languageSettingStore.languageName)
        //console.log(languageSettingStore.languageName)
    }, [languageSettingStore.languageName]);
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-full`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Toaster position={"top-center"} visibleToasts={2} duration={500} mobileOffset={{top:"12vh"}} />
                    {children}
                </ThemeProvider>

            </body>
        </html>
    );
}
