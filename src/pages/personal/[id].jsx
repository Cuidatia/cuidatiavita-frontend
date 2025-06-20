import { useRouter } from "next/router"
import DashboardLayout from "../dashboard/layout"
import { useEffect, useState } from "react"
import withAuth from '@/components/withAuth';
import Alerts from "@/components/alerts/alerts";
import PopUp from '@/components/popUps/popUp';
import { useSession } from "next-auth/react";

function PerfilPaciente () {
    const {data: session, status} = useSession()
    const [mostrarUsuario, setMostrarUsuario] = useState([])
    const [modificar, setModificar] = useState(false)
    const [message, setMessage] = useState()
    const [openPopUp, setOpenPopUp] = useState(false)
    const [error, setError] = useState()
    const [roles, setRoles] = useState()
    const router = useRouter()
    const {id} = router.query

    const getUsuario = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getUsuario?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setMostrarUsuario(data.usuario)
        }

    }

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
            setRoles(data.roles)
        }
    }

    useEffect(()=>{
        if (status === 'authenticated') {
            getUsuario()
            getRoles()
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

    const eliminarUsuario = async (usuarioId) => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'eliminarUsuario', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({usuarioId})
        })

        if(response.ok){
            const data = await response.json()
            setMessage(data.message)
            router.push("/personal/");
        }else{
            const data = await response.json()
            setError(data.error)
        }
    }

    return(
        <DashboardLayout>
            {
                mostrarUsuario &&
                <div>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-2xl font-bold'>{mostrarUsuario.nombre}</h2>
                        <button className="cursor-pointer border-2 border-red-600 bg-white text-red-600 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 hover:bg-red-600 hover:text-white"
                         onClick={()=>{setOpenPopUp(!openPopUp);}}>
                            Eliminar personal
                        </button>
                    </div>
                    <div className="py-4">
                        <form action="" className="space-y-4 md:space-y-6">
                            <div>
                                <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
                                <input type="text" name="nombre" id="nombre" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5"
                                    value={mostrarUsuario.nombre}
                                    disabled
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5"
                                    value={mostrarUsuario.email}
                                    disabled
                                />
                            </div>
                            <div>
                                <label htmlFor="passsword" className="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
                                <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5" 
                                    disabled
                                />
                            </div>
                            <div>
                                <label htmlFor="roles" className="block mb-2 text-sm font-medium text-gray-900">Roles</label>
                                <select name="roles" id="roles" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                                    disabled
                                >
                                    {
                                        roles && 
                                        roles.map((rol)=> (
                                            rol.nombre === mostrarUsuario.roles ? 
                                            <option selected key={rol.id} value={rol.id}>{rol.nombre}</option>
                                            :<option key={rol.id} value={rol.id}>{rol.nombre}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <button className="cursor-pointer bg-zinc-100 hover:text-white border-1 border-zinc-200 hover:bg-blue-500 rounded-lg text-sm px-3 py-2 text-center">Modificar</button>
                        </form>
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

            <PopUp
                open={openPopUp} 
                popTitle="Eliminar personal"
                popContent={`¿Está seguro de que desea eliminar al personal ${mostrarUsuario.nombre}?`}
                popType="option"
                confirmFunction={() => {
                    eliminarUsuario(mostrarUsuario.id);
                    setOpenPopUp(false);
                }}
                cancelFunction={() => setOpenPopUp(false)}
            />
        </DashboardLayout>
    )
}

export default withAuth(PerfilPaciente, ['administrador'])