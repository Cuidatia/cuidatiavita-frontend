import './header.css'
import logoCuidatiaVita from '../../../public/static/logoCuidatiaVita.png'
import { useRouter } from 'next/router';
import Menu from "@/components/menu/menu";
import { useState } from 'react';
import Head from "next/head";

export default function Header() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    
    return(
        <>
        <Head>
            <title>Cuidatia Vita</title>
        </Head>
        <header className="flex items-center justify-between h-16 px-6 shadow-sm bg-white border-b border-gray-200">
            <div onClick={() => router.push('/dashboard')} className="cursor-pointer flex items-center">
                <img src={logoCuidatiaVita.src} alt="logo" className="h-10 w-auto" />
                </div>
                <div className="sm:hidden">
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:ring-2 hover:ring-gray-300 rounded-md">
                    <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </header>

        {menuOpen && (
        <div className="absolute inset-x-0 top-16 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow transition-all duration-300 animate-fade-in-down">
            <div className="px-4 py-6">
            <Menu />
            </div>
        </div>
        )}
        </>
    )
}