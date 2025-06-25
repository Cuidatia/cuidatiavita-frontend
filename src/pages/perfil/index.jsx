import { useSessionStore } from "@/hooks/useSessionStorage";
import DashboardLayout from "../dashboard/layout";
import { UsuarioContext } from "@/contexts/UsuarioContext";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import Alerts from "@/components/alerts/alerts";
import { useSession } from "next-auth/react";

function Perfil() {
    const { data: session, status } = useSession()
    const [Usuario, setUsuario] = useSessionStore(UsuarioContext)
    const [mostrarUsuario, setMostrarUsuario] = useState([])
    const [modificarDatos, setModificarDatos] = useState(false)
    const [modificarPass, setModificarPass] = useState(false)
    const [newPassword, setNewPassword] = useState({
        'nuevaContraseña': '',
        'repetirContraseña': ''
    })

    const [passError, setPassError] = useState()
    const [message, setMessage] = useState()
    const [error, setError] = useState()

    useEffect(()=>{
        if (status === 'authenticated' && session?.user) {
            setMostrarUsuario(session.user)
        }
    },[session, status])

    const modificarDatosUsuario = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'modificarUsuario', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({mostrarUsuario})
        })

        if (response.ok) {
            const data = await response.json()
            setMostrarUsuario(data.usuario)
            setMessage(data.message)
        }
        else {
            const data = await response.json()
            setError(data.error)
        }

        setModificarDatos(!modificarDatos)
    }

    const modificarPassUsuario = async (id) => {

        if (newPassword.nuevaContraseña !== newPassword.repetirContraseña) {
            setPassError('Las contraseñas no coinciden')
            return
        }
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'modificarPassword', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({id, newPassword})
        })

        if (response.ok) {
            if (passError){setPassError('')}
            const data = await response.json()
            setMessage(data.message)
        }
        else {
            const data = await response.json()
            setError(data.error)
        }

        setModificarPass(!modificarPass)
    }

    return(
        <DashboardLayout>
        {
            mostrarUsuario &&
            <div >
                <div className='flex items-center justify-between'>
                    <h2 className='text-2xl font-bold'>{mostrarUsuario.nombre}</h2>
                </div> 
                <div className="py-4 my-4 overflow-y-scroll h-[calc(100vh-220px)]">
                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
                            <input type="text" name="nombre" id="nombre" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5"
                                value={mostrarUsuario.nombre}
                                disabled={!modificarDatos}
                                onChange={(e) => setMostrarUsuario({ ...mostrarUsuario, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5"
                                value={mostrarUsuario.email}
                                disabled={!modificarDatos}
                                onChange={(e) => setMostrarUsuario({ ...mostrarUsuario, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <button className="cursor-pointer bg-zinc-100 border-1 border-zinc-200 hover:bg-zinc-300 me-1 rounded-lg text-sm px-3 py-2 text-center"
                                onClick={()=>{setModificarDatos(!modificarDatos)}}
                            >
                                {!modificarDatos ? 'Modificar' : 'Cancelar'}
                            </button>
                            {
                                modificarDatos &&
                                <button className="cursor-pointer text-white bg-blue-400 hover:text-white border-1 border-zinc-200 hover:bg-blue-600 rounded-lg text-sm px-3 py-2 text-center"
                                    onClick={()=>{modificarDatosUsuario()}}
                                >
                                    Guardar
                                </button>
                            }
                        </div>
                    </div>
                    <div className="relative flex py-2 my-4 items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <div className="py-4 md:space-y-6">
                        <h3 className="text-xl font-semibold">Establecer nueva contraseña</h3>
                        <div>
                            <label htmlFor="passsword" className="block mb-2 text-sm font-medium text-gray-900">Nueva contraseña</label>
                            <input type="password" name="newpassword" id="newpassword" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5" 
                                disabled={!modificarPass}
                                onChange={(e) => setNewPassword({ ...newPassword, nuevaContraseña: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="passsword" className="block mb-2 text-sm font-medium text-gray-900">Repetir contraseña</label>
                            <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5" 
                                disabled={!modificarPass}
                                onChange={(e) => setNewPassword({ ...newPassword, repetirContraseña: e.target.value })}
                            />
                        </div>
                        {
                            passError &&
                            <div class="py-1 mb-4 text-sm text-red-600 rounded-lg" role="alert">
                                Las contraseñas no coinciden.
                            </div>
                        }
                        <div>
                            <button className="cursor-pointer bg-zinc-100 border-1 border-zinc-200 hover:bg-zinc-300 me-1 rounded-lg text-sm px-3 py-2 text-center"
                                onClick={()=>{setModificarPass(!modificarPass)}}
                            >
                                {!modificarPass ? 'Modificar' : 'Cancelar'}
                            </button>

                            {
                                modificarPass &&
                                <button className="cursor-pointer text-white bg-blue-400 hover:text-white border-1 border-zinc-200 hover:bg-blue-600 rounded-lg text-sm px-3 py-2 text-center"
                                onClick={()=>{modificarPassUsuario(mostrarUsuario.id)}}
                                >
                                    Guardar
                                </button>
                            }
                        </div>
                    </div>
                    <div className="relative flex py-2 my-4 items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <div className="py-4">
                        <div>
                            <label htmlFor="roles" className="block mb-2 text-sm font-medium text-gray-900">Roles</label>
                            <span className="border-1 border-zinc-200 p-1 rounded-sm bg-gray-100">
                                {mostrarUsuario.roles}
                            </span>
                            {/* {
                                mostrarUsuario.roles.map((rol, index) => (
                                    <span key={index} className="border-1 border-zinc-200 p-1 rounded-sm bg-gray-100 mr-2">
                                        {rol}
                                    </span>
                                ))
                            } */}
                        </div>
                    </div>
                </div>
            </div>
        }
        {
            message ? 
            <Alerts 
                alertType={'success'}
                alertContent={message}
            />
            : error &&
            <Alerts 
                alertType={'error'}
                alertContent={error}
            />
        }
        
    </DashboardLayout>
    )
}

export default withAuth(Perfil)