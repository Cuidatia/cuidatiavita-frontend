import LogInLayout from "./layout"
import './styles.css'
import {signIn} from 'next-auth/react'
import { useRouter } from "next/router"
import { useState } from "react"
import Alerts from "@/components/alerts/alerts";

export default function Login(){
    const router = useRouter()
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ message, setMessage ] = useState()
    const [ errorMessage, setErrorMessage ] = useState()

    async function handleSubmit(){
        const result = await signIn('credentials', {
            email: email,
            password: password,
            redirect: false,
        })

        if (result?.error) {
            setErrorMessage(result.error)
        } else {
            setMessage('Inicio de sesión exitoso')
            router.push('/dashboard')
        }


    }
    return (
        <LogInLayout>
            <div className="flex flex-col bg-white shadow-sm border border-slate-200 w-96 rounded-lg my-6">
                <div class="relative m-2.5 items-center flex justify-center text-white h-24 rounded-md bg-gray-50 header-login"></div>
                <form className="space-y-4 md:space-y-6 m-4 py-6" action={handleSubmit}>
                    <h1 className="font-bold text-2xl">Inicar Sesión</h1>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Correo</label>
                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" placeholder="ejemplo@ejemplo.com" required
                                onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
                        <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" required
                                onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>
                    {
                        errorMessage &&
                        <div class="py-1 mb-4 text-sm text-red-600 rounded-lg" role="alert">
                            Usuario o contraseña incorrectos.
                        </div>
                    }
                    
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50"/>
                            </div>
                            <div className="ml-3 text-sm">
                                <label for="remember" className="text-gray-800">Recuérdame</label>
                            </div>
                        </div>
                        <a href="/recuperacion-contrasena" className="text-sm font-medium text-blue-800 hover:underline">Forgot password?</a>
                    </div>
                    <button className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Iniciar sesión</button>
                </form>
                {
                    message &&
                    <Alerts alertContent={message} />
                }
            </div>
        </LogInLayout>
    )
}