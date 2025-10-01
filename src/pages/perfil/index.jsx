import DashboardLayout from "../dashboard/layout";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import Alerts from "@/components/alerts/alerts";
import { useSession } from "next-auth/react";

function Perfil() {
    const { data: session, status } = useSession()
    const [mostrarUsuario, setMostrarUsuario] = useState([])
    const [modificarDatos, setModificarDatos] = useState(false)
    const [modificarPass, setModificarPass] = useState(false)
    const [newPassword, setNewPassword] = useState({
        'nuevaContraseña': '',
        'repetirContraseña': ''
    })
    const [roles, setRoles] = useState()

    const [passError, setPassError] = useState()
    const [message, setMessage] = useState()
    const [error, setError] = useState()

    useEffect(()=>{
        if (status === 'authenticated' && session?.user) {
            setMostrarUsuario(session.user)
            getRoles()
        }
    },[session, status])

    const getRoles = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getRoles', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            }
        })
        if(response.ok){
            const data = await response.json()
            console.log(data)
            const rolesUsuario = Array.isArray(session.user.roles)
                ? session.user.roles
                : [session.user.roles]

            const idsRolesUsuario = data.roles
            .filter(rol => rolesUsuario.includes(rol.nombre))
            .map(rol => rol.id)

            setRoles(session.user.roles)

            // actualizar mostrarUsuario con IDs
            setMostrarUsuario(prev => ({
            ...prev,
            roles: idsRolesUsuario
            }))
        }
    }

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
            <div className="p-6 bg-white h-full">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">{mostrarUsuario.nombre}</h2>
                </div>

                <div className="space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto">
                    {/* Datos usuario */}
                    <div className="space-y-4">
                    <div>
                        <label htmlFor="nombre" className="block mb-1 text-sm font-medium text-gray-700">Nombre</label>
                        <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        className="w-full p-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                        value={mostrarUsuario.nombre}
                        disabled={!modificarDatos}
                        onChange={(e) => setMostrarUsuario({ ...mostrarUsuario, nombre: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                        <input
                        type="email"
                        name="email"
                        id="email"
                        className="w-full p-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                        value={mostrarUsuario.email}
                        disabled={!modificarDatos}
                        onChange={(e) => setMostrarUsuario({ ...mostrarUsuario, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="idTelegram" className="block mb-1 text-sm font-medium text-gray-700"><p>
                        ¿Cuál es su id de Telegram? (Para obtenerlo debe iniciar una conversación con el CuidatiaVita Bot)
                        <br />
                        Utilice el siguiente enlace para obtener su Id de Telegram -{'>'} https://t.me/CuidatiaVitaBot
                        </p></label>
                        <input type="text" name="idTelegram" id="idTelegram" className="w-full p-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                            value={mostrarUsuario.idTelegram}
                            disabled={!modificarDatos}
                            onChange={(e) => setMostrarUsuario({ ...mostrarUsuario, idTelegram: e.target.value })}
                        />
                    </div>
                    <div className="flex space-x-3">
                        <button className="cursor-pointer bg-zinc-100 border-1 border-zinc-200 hover:bg-zinc-300 me-1 rounded-lg text-sm px-3 py-2 text-center"
                            onClick={()=>{setModificarDatos(!modificarDatos)}}
                        >
                            {!modificarDatos ? 'Modificar' : 'Cancelar'}
                        </button>
                        {modificarDatos && (
                        <button className="cursor-pointer text-white bg-blue-400 hover:text-white border-1 border-zinc-200 hover:bg-blue-600 rounded-lg text-sm px-3 py-2 text-center"
                            onClick={()=>{modificarDatosUsuario()}}
                        >
                            Guardar
                        </button>
                        )}
                    </div>
                    </div>

                    <hr className="border-gray-300" />

                    {/* Cambio de contraseña */}
                    <div className="space-y-5">
                    <h3 className="text-xl font-semibold text-gray-800">Establecer nueva contraseña</h3>
                    <div>
                        <label htmlFor="newpassword" className="block mb-1 text-sm font-medium text-gray-700">Nueva contraseña</label>
                        <input
                        type="password"
                        name="newpassword"
                        id="newpassword"
                        className="w-full p-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                        disabled={!modificarPass}
                        onChange={(e) => setNewPassword({ ...newPassword, nuevaContraseña: e.target.value })}
                        />
                        <small className="text-xs italic text-gray-500">Debe tener un mínimo de 8 caracteres.</small>
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Repetir contraseña</label>
                        <input
                        type="password"
                        name="password"
                        id="password"
                        className="w-full p-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                        disabled={!modificarPass}
                        onChange={(e) => setNewPassword({ ...newPassword, repetirContraseña: e.target.value })}
                        />
                        <small className="text-xs italic text-gray-500">Debe tener un mínimo de 8 caracteres.</small>
                    </div>

                    {passError && (
                        <div className="text-sm text-red-600 rounded-md p-2 bg-red-100" role="alert">
                        Las contraseñas no coinciden.
                        </div>
                    )}

                    <div className="flex space-x-3">
                        <button className="cursor-pointer bg-zinc-100 border-1 border-zinc-200 hover:bg-zinc-300 me-1 rounded-lg text-sm px-3 py-2 text-center"
                            onClick={()=>{setModificarPass(!modificarPass)}}
                        >
                            {!modificarPass ? 'Modificar' : 'Cancelar'}
                        </button>
                        {modificarPass && (
                        <button className="cursor-pointer text-white bg-blue-400 hover:text-white border-1 border-zinc-200 hover:bg-blue-600 rounded-lg text-sm px-3 py-2 text-center"
                        onClick={()=>{modificarPassUsuario(mostrarUsuario.id)}}
                        >
                            Guardar
                        </button>
                        )}
                    </div>
                    </div>

                    {/* <hr className="border-gray-300" /> */}

                    {/* Roles */}
                    {/* <div>
                        <label htmlFor="roles" className="block mb-2 text-sm font-medium text-gray-700">Roles</label>
                        <span className="inline-block bg-gray-100 border border-gray-300 rounded px-2 py-1 text-gray-700">
                            {roles}
                        </span>
                    </div> */}
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