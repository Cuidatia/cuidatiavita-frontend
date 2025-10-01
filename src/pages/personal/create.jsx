import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import '../dashboard/styles.css';
import '../../assets/styles.css';
import Header from "@/components/header/header";
import { useRouter } from "next/router";
import { UsuarioContext } from "@/contexts/UsuarioContext";
import {useSessionStore} from '../../hooks/useSessionStorage';
import { signIn } from "next-auth/react";
import Alerts from "@/components/alerts/alerts";



export default function CrearUsuario () {
    const [Usuario, setUsuario] = useSessionStore(UsuarioContext)
    const [datosUsuario, setDatosUsuario] = useState({
        "id":0,
        "nombre":"",
        "email": "",
        "organizacionId": 0,
        "rol": "",
        "idTelegram" : ""
    })

    const router = useRouter()
    const pathName = usePathname()
    const searchParams = useSearchParams()

    const [rol, setRol] = useState([])
    const [email, setEmail] = useState()
    const [nombre, setNombre] = useState()
    const [password, setPassword] = useState()
    const [organizacion, setOrganizacion] = useState()
    const [idTelegram, setIdTelegram] = useState()

    const [message, setMessage] = useState()
    const [error, setError] = useState()
    
    useEffect(()=>{
        const emailParam = searchParams.get("m");
        const orgParam = searchParams.get("o");
        const rolParam = searchParams.get("r");

        if(emailParam) setEmail(emailParam);
        if(orgParam) setOrganizacion({ id: parseInt(orgParam), nombre: orgParam });
        if(rolParam) setRol(rolParam.split(',').map(r => parseInt(r)));

        let token = searchParams.get("token")

        async function getData(token) {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'api/decoded',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            })

            if(res.ok){
                let data = await res.json()
                
                getOrganizacion(data.decoded.organizacion)
                setEmail(data.decoded.email)
                setRol(data.decoded.roles?.split(','))
            }
        }
        
        getData(token)
    },[searchParams, pathName])

    const getOrganizacion = async (org) => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getOrganizacion?org=' + org, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json'
            }
        })

        if(response.ok){
            const data = await response.json()
            setOrganizacion(data.organizacion)
        }
    }

    const enviarForm = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'crearUsuario',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nombre,email,password,organizacion:organizacion.id,rol,idTelegram})
        })

        if(response.ok){
            const data = await response.json()
            setMessage(data.message)
            const result = signIn('credentials', {
                email: email,
                password: password,
                redirect: false
            })
            router.push('/dashboard')
        }else{
            const data = await response.json()
            setError(data['error'])
        }
    }


    return(                
        <div className="block place-items-center place-content-center h-screen">
            <div className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg my-6 p-4">
                <div class="relative m-2.5 items-center flex justify-center text-white h-24 w-96 rounded-md bg-gray-50 header-login"></div>
                <div>
                    <h2 className='text-2xl font-bold mt-8 text-center'>Unirse</h2>
                </div>
                <div className="py-4">
                    <form className="space-y-4 md:space-y-6" action={enviarForm}>
                        <div>
                            <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
                            <input type="text" name="nombre" id="nombre" placeholder="Nombre" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5" 
                                onChange={(e)=>setNombre(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Correo</label>
                            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5" disabled value={email}/>
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
                            <input type="password" name="password" id="password" placeholder="Escribir contraseña" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" required
                                onChange={(e)=>setPassword(e.target.value)}
                            />
                            <small className="text-xs italic text-gray-500">Debe tener un mínimo de 8 caracteres.</small>
                        </div>
                        <div>
                            <label htmlFor="organizacion" className="block mb-2 text-sm font-medium text-gray-900">Organización</label>
                            <input type="text" name="organizacion" id="organizacion" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5" value={organizacion && organizacion?.nombre} disabled/>
                        </div>
                        {
                            message &&
                                <Alerts alertContent={message} alertType={'success'} />
                        }
                        {
                            error &&
                                <Alerts alertContent={error} alertType={'error'} />
                        }
                        <button className="cursor-pointer w-full bg-blue-400 text-white border-1 border-zinc-200 hover:bg-blue-600 rounded-lg text-sm px-3 py-2 text-center">Crear Usuario</button>
                    </form>
                </div>
            </div>
        </div>
    )
}