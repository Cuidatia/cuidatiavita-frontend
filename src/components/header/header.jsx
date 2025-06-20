import './header.css'
import logoCuidatiaVita from '../../../public/static/logoCuidatiaVita.png'
import { useRouter } from 'next/router';
import Menu from "@/components/menu/menu";
import { useState } from 'react';

export default function Header() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    
    return(
        <>
        <header className='flex flex-wrap justify-between px-5 h-16 min-h-16 items-center text-center'>
            <div className='w-32 mx-4 inline-flex justify-center cursor-pointer' onClick={()=>router.push('/dashboard')}>
                <img src={logoCuidatiaVita.src} alt="logo" className='w-24 h-auto' />
            </div>
            <div className='menu_responsive sm:hidden block'>
                <div className='p-4 hover:ring-1 hover:ring-gray-300 cursor-pointer' onClick={() => setMenuOpen(!menuOpen)}>
                    <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
                    </svg>
                </div>
            </div>
        </header>

        {menuOpen && (
                <div className="absolute top-16 left-0 w-full h-[calc(100vh-4rem)] bg-blue-300 z-40 p-4 pb-32 sm:hidden animate-slide-down rounded-b-2xl shadow-md">
                    <Menu />
                </div>
            )}
        </>
    )
}