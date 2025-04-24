import { useState } from "react"
import '../../assets/styles.css';
import '../login/styles.css';
import Alerts from "@/components/alerts/alerts";

export default function RecuperarContrasena () {
    const [message, setMessage] = useState()
    const [error, setError] = useState()
    const [email, setEmail] = useState()

    const enviarForm = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'sendMailRecuperacion', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({email})
        })

        if (response.ok){
            const data = await response.json()
            setMessage(data.message)
        } else {
            setError('Correo electrónico desconocido')
        }
    }


    return (
        <div className="body block place-items-center place-content-center h-screen">
            <div className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg my-6 p-4">
                <div class="relative m-2.5 items-center flex justify-center text-white h-24 w-96 rounded-md bg-gray-50 header-login"></div>
                <div>
                    <h2 className='text-2xl font-bold mt-8 text-center'>Recuperar contraseña</h2>
                </div>
                <div className="py-4">
                    <form className="space-y-4 md:space-y-6" action={enviarForm}>
                        <div>
                            <input type="email" name="email" id="email" placeholder="Correo electrónico" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5"
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>
                        {
                            error &&
                                <span>{error}</span>
                        }
                        <button className="cursor-pointer w-full bg-blue-400 text-white border-1 border-zinc-200 hover:bg-blue-600 rounded-lg text-sm px-3 py-2 text-center">Confirmar</button>
                        <div className="w-full text-center">
                            <a href="/login" className="text-sm font-medium text-blue-800 hover:underline">Volver</a>
                        </div>
                        {
                            message &&
                                <Alerts alertContent={message} alertType={"success"} />
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}