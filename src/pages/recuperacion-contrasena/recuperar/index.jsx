import { useEffect, useState } from 'react';
import '../../../assets/styles.css';
import '../../login/styles.css';
import Alerts from "@/components/alerts/alerts";
import {signIn} from 'next-auth/react'
import { useRouter } from "next/router"
import { usePathname, useSearchParams } from 'next/navigation';

export default function Recuperar () {
    const [message, setMessage] = useState()
    const [error, setError] = useState()
    const [newPassword, setNewPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [email, setEmail] = useState()
    const router = useRouter()

    const pathName = usePathname()
    const searchParams = useSearchParams()

    useEffect(()=>{
        // const paramMail = searchParams.get("m")

        // setEmail(paramMail)
        let token = searchParams.get("token")

        async function getData(token) {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'api/decoded',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            })

            if(res.ok){
                let data = await res.json()
                
                setEmail(data.decoded.email)
            }
        }
        
        getData(token)
    },[searchParams, pathName])

    const validarContrasena = () => {
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return false
        } else if (newPassword.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres')
            return false
        } else {
            setError(null)
            return true
        }
    }

    const enviarForm = async () => {
        if (!validarContrasena()) return
        
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'recuperarPassword', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({email, newPassword})
        })

        if (response.ok){
            const data = await response.json()
            setMessage(data.message)
            const result = await signIn('credentials', {
                        email: email,
                        password: newPassword,
                        redirect: false,
                    })
            
            if (result?.error) {
                setError(result.error)
            } else {
                setMessage('Inicio de sesión exitoso')
                router.push('/dashboard')
            }
        } else {    
            setError('Error al cambiar la contraseña')
        }
    }

    return (
        <div className="body block place-items-center place-content-center h-screen">
            <div className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg my-6 p-4">
                <div class="relative m-2.5 items-center flex justify-center text-white h-24 w-96 rounded-md bg-gray-50 header-login"></div>
                <div>
                    <h2 className='text-2xl font-semibold mt-8 text-center'>Recuperar contraseña</h2>
                </div>
                <div className="py-4">
                    <form className="space-y-4 md:space-y-6" action={enviarForm}>
                        <div>
                            <input type="password" name="nueva" id="nueva" placeholder="Nueva contraseña" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5"
                                onChange={(e)=>setNewPassword(e.target.value)}
                            />
                            <small className="text-xs italic text-gray-500">Debe tener un mínimo de 8 caracteres.</small>
                        </div>
                        <div>
                            <input type="password" name="confirmar" id="confirmar" placeholder="Confirmar contraseña" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5"
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                            />
                            <small className="text-xs italic text-gray-500">Debe tener un mínimo de 8 caracteres.</small>
                        </div>
                        {
                            error &&
                                <span className="text-red-500">{error}</span>
                        }
                        {
                            message &&
                                <Alerts alertContent={message} alertType={"success"} />
                        }
                        <button className="cursor-pointer w-full bg-blue-400 text-white border-1 border-zinc-200 hover:bg-blue-600 rounded-lg text-sm px-3 py-2 text-center">Confirmar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}