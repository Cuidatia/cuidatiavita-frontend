import './header.css'
import logoCuidatiaVita from '../../../public/static/logoCuidatiaVita.png'

export default function Header() {
    return(
        <header className='flex flex-wrap justify-between px-5 h-16 min-h-16 items-center text-center'>
            <div className='w-32 mx-4 inline-flex justify-center'>
                <img src={logoCuidatiaVita.src} alt="logo" className='w-24 h-auto' />
            </div>
            <div className='menu_responsive sm:hidden block'>
                <div className='p-4 hover:ring-1 hover:ring-gray-300 cursor-pointer'>
                    <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
                    </svg>
                </div>
            </div>
        </header>
    )
}