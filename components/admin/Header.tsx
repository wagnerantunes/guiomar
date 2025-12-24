"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#e7f3eb] bg-[#f6f8f6]/95 backdrop-blur-sm dark:bg-[#102216]/95 dark:border-white/10">
            <div className="px-4 md:px-10 lg:px-8 flex justify-center w-full">
                <div className="flex h-16 w-full items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-[#0d1b12] dark:text-white cursor-pointer">
                        <span className="material-symbols-outlined text-3xl text-[#13ec5b]">spa</span>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-bold leading-tight tracking-tight">RenovaMente</h2>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Admin Panel</span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex flex-1 justify-end gap-6 items-center">
                        <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 p-1 rounded-full border border-gray-200 dark:border-gray-700">
                            <span className="material-symbols-outlined text-gray-400 p-1 text-[20px]">search</span>
                            <input
                                className="bg-transparent border-none text-sm focus:ring-0 w-48 text-gray-700 dark:text-gray-200 placeholder-gray-400"
                                placeholder="Search..."
                                type="text"
                            />
                        </div>

                        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 dark:text-gray-200 dark:border-gray-700 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">visibility</span>
                                View Live Site
                            </Link>

                            <button className="relative p-2 text-gray-500 hover:text-[#13ec5b] transition-colors dark:text-gray-400">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
                            </button>

                            <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                                <img
                                    alt="Admin"
                                    className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700"
                                    src="https://lh3.googleusercontent.com/a/ACg8ocL0O7T_F-zL7W3J_GhcBEox7bdUyHxk5JShcprT5YPMDd3e7Q=s96-c"
                                />
                                <span className="text-sm font-medium dark:text-gray-200 hidden lg:block">Admin User</span>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
