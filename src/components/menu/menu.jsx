import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";


export default function Menu () {
    const {data: session} = useSession()
    const router = useRouter();
    const pathname = router.pathname;

    const cerrarSesion = async () => {
        signOut({ callbackUrl: '/login' })
    }

    const isActive = (route) => pathname === route || pathname.startsWith(route + '/');

    const LeftArrow = () => (
        <svg
          className="w-4 h-4 text-blue-900 me-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    );

    return(
        <div className="h-full px-5 py-5 overflow-y-auto bg-blue-100 rounded-2xl">
            {
                session?.user?.roles &&
                <ul className="space-y-2 py-2 font-medium border-b border-blue-200">
                    <li>
                        <a href="/dashboard" className={`flex items-center p-2 rounded-lg group hover:text-blue-900 hover:bg-blue-200
                            ${isActive('/dashboard') ? 'text-blue-900 font-semibold' : 'text-blue-500'}`}>
                            {isActive('/dashboard') && <LeftArrow />}
                            <svg className="shrink-0 w-5 h-5 text-blue-500 transition duration-75 group-hover:text-blue-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd"/>
                            </svg>
                            <span className="ms-3">Inicio</span>
                        </a>
                    </li>
                    <li>
                        <a href="/perfil" className={`flex items-center p-2 rounded-lg group hover:text-blue-900 hover:bg-blue-200
                            ${isActive('/perfil') ? 'text-blue-900 font-semibold' : 'text-blue-500'}`}>
                            {isActive('/perfil') && <LeftArrow />}
                        <svg className="shrink-0 w-5 h-5 text-blue-500 transition duration-75 group-hover:text-blue-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z" clipRule="evenodd"/>
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">Perfil</span>
                        </a>
                    </li>
                    {
                        session?.user?.roles === 'administrador' &&
                        <li>
                            <a href="/personal" className={`flex items-center p-2 rounded-lg group hover:text-blue-900 hover:bg-blue-200
                            ${isActive('/personal') ? 'text-blue-900 font-semibold' : 'text-blue-500'}`}>
                            {isActive('/personal') && <LeftArrow />}
                            <svg className="shrink-0 w-5 h-5 text-blue-500 transition duration-75 group-hover:text-blue-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z" clipRule="evenodd"/>
                            </svg>
                            <span className="flex-1 ms-3 whitespace-nowrap">Personal</span>
                            </a>
                        </li>
                    }
                    {
                        session?.user?.roles !== 'familiar' &&
                        <li>
                            <a href="/usuarios" className={`flex items-center p-2 rounded-lg group hover:text-blue-900 hover:bg-blue-200
                            ${isActive('/usuarios') ? 'text-blue-900 font-semibold' : 'text-blue-500'}`}>
                            {isActive('/usuarios') && <LeftArrow />}
                            <svg className="shrink-0 w-5 h-5 text-blue-500 transition duration-75 group-hover:text-blue-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clipRule="evenodd"/>
                            </svg>
                            <span className="flex-1 ms-3 whitespace-nowrap">Usuarios</span>
                            </a>
                        </li>
                    }
                    {
                        session?.user?.roles === 'administrador'  &&
                        <li>
                            <a href="/roles" className={`flex items-center p-2 rounded-lg group hover:text-blue-900 hover:bg-blue-200
                            ${isActive('/roles') ? 'text-blue-900 font-semibold' : 'text-blue-500'}`}>
                            {isActive('/roles') && <LeftArrow />}
                            <svg className="shrink-0 w-5 h-5 text-blue-500 transition duration-75 group-hover:text-blue-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M5.005 10.19a1 1 0 0 1 1 1v.233l5.998 3.464L18 11.423v-.232a1 1 0 1 1 2 0V12a1 1 0 0 1-.5.866l-6.997 4.042a1 1 0 0 1-1 0l-6.998-4.042a1 1 0 0 1-.5-.866v-.81a1 1 0 0 1 1-1ZM5 15.15a1 1 0 0 1 1 1v.232l5.997 3.464 5.998-3.464v-.232a1 1 0 1 1 2 0v.81a1 1 0 0 1-.5.865l-6.998 4.042a1 1 0 0 1-1 0L4.5 17.824a1 1 0 0 1-.5-.866v-.81a1 1 0 0 1 1-1Z" clipRule="evenodd"/>
                                <path d="M12.503 2.134a1 1 0 0 0-1 0L4.501 6.17A1 1 0 0 0 4.5 7.902l7.002 4.047a1 1 0 0 0 1 0l6.998-4.04a1 1 0 0 0 0-1.732l-6.997-4.042Z"/>
                            </svg>

                            <span className="flex-1 ms-3 whitespace-nowrap">Roles</span>
                            </a>
                        </li>
                    }
                    {
                        session?.user?.roles === 'superadmin' &&
                        <li>
                            <a href="#" className="flex items-center p-2 text-blue-500 hover:text-blue-900 rounded-lg hover:bg-blue-200 group">
                            <svg className="shrink-0 w-5 h-5 text-blue-500 transition duration-75 group-hover:text-blue-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M10 2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v2.382l1.447.723.005.003.027.013.12.056c.108.05.272.123.486.212.429.177 1.056.416 1.834.655C7.481 13.524 9.63 14 12 14c2.372 0 4.52-.475 6.08-.956.78-.24 1.406-.478 1.835-.655a14.028 14.028 0 0 0 .606-.268l.027-.013.005-.002L22 11.381V9a3 3 0 0 0-3-3h-2V5a3 3 0 0 0-3-3h-4Zm5 4V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1h6Zm6.447 7.894.553-.276V19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-5.382l.553.276.002.002.004.002.013.006.041.02.151.07c.13.06.318.144.557.242.478.198 1.163.46 2.01.72C7.019 15.476 9.37 16 12 16c2.628 0 4.98-.525 6.67-1.044a22.95 22.95 0 0 0 2.01-.72 15.994 15.994 0 0 0 .707-.312l.041-.02.013-.006.004-.002.001-.001-.431-.866.432.865ZM12 10a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clipRule="evenodd"/>
                            </svg>
                            <span className="flex-1 ms-3 whitespace-nowrap">Organizaciones</span>
                            </a>
                        </li>
                    }
                </ul>
            }         
            <ul className="py-2 font-medium">
                <li onClick={cerrarSesion}>
                    <span className="flex items-center p-2 text-blue-500 hover:text-blue-900 rounded-lg hover:bg-blue-200 hover:cursor-pointer group">
                    <svg className="shrink-0 w-5 h-5 text-blue-500 transition duration-75 group-hover:text-blue-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">Cerrar sesión</span>
                    </span>
                </li>
            </ul>
        </div>
    )
}