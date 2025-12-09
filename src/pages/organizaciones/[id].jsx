import { useRouter } from "next/router"
import DashboardLayout from "../dashboard/layout"
import { useEffect, useState } from "react"
import withAuth from '@/components/withAuth';
import Alerts from "@/components/alerts/alerts";
import PopUp from '@/components/popUps/popUp';
import { useSession } from "next-auth/react";

function PerfilOrganizacion () {
    const {data: session, status} = useSession()
    const [mostrarOrganizacion, setMostrarOrganizacion] = useState({})
    const [modificar, setModificar] = useState(false)
    const [message, setMessage] = useState()
    const [openPopUp, setOpenPopUp] = useState(false)
    const [error, setError] = useState()

    const router = useRouter()
    const {id} = router.query

    const getOrganizacion = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getOrganizacion?org='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setMostrarOrganizacion({...data.organizacion})
        } else {
            const data = await response.json()
            setError(data.error)
        }

    }

    useEffect(() => {
        if (id && session?.user?.token) {
            getOrganizacion();
        }
    }, [id, session]);

    const modificarDatosOrganizacion = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'modificarOrganizacion', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({mostrarOrganizacion})
        })

        if (response.ok) {
            const data = await response.json()
            setMostrarOrganizacion(data.organizacion)
            setMessage(data.message)
        }
        else {
            const data = await response.json()
            setError(data.error)
        }

        setModificar(!modificar)
    }

    const eliminarOrganizacion = async (organizacionId) => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'eliminarOrganizacion', {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({organizacionId})
        })

        if(response.ok){
            const data = await response.json()
            setMessage(data.message)
            router.push("/organizaciones/");
        }else{
            const data = await response.json()
            setError(data.error)
        }
    }

    return(
        <DashboardLayout>
            {
                mostrarOrganizacion && 
                <div className="px-8 py-4 space-y-8">
                    <div className='flex items-center justify-between'>
                        <h2 className='text-2xl font-bold'>{mostrarOrganizacion.nombre}</h2>
                        <button className="cursor-pointer text-red-700 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                         onClick={()=>{setOpenPopUp(!openPopUp);}}>
                            Eliminar organizacion
                        </button>
                    </div>
                    <div className="py-4">
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
                                <input type="text" name="nombre" id="nombre" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5"
                                    value={mostrarOrganizacion.nombre}
                                    onChange={(e) => setMostrarOrganizacion({ ...mostrarOrganizacion, nombre: e.target.value })}
                                    disabled={!modificar}
                                />
                            </div>
                            <div>
                                <label htmlFor="direccion" className="block mb-2 text-sm font-medium text-gray-900">Direccion</label>
                                <input type="text" name="direccion" id="direccion" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5"
                                    value={mostrarOrganizacion.direccion}
                                    onChange={(e) => setMostrarOrganizacion({ ...mostrarOrganizacion, direccion: e.target.value })}
                                    disabled={!modificar}
                                />
                            </div>
                            <div>
                                <label htmlFor="localidad" className="block mb-2 text-sm font-medium text-gray-900">Localidad</label>
                                <input type="text" name="localidad" id="localidad" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5"
                                    value={mostrarOrganizacion.localidad}
                                    onChange={(e) => setMostrarOrganizacion({ ...mostrarOrganizacion, localidad: e.target.value })}
                                    disabled={!modificar}
                                />
                            </div>
                            <div>
                                <label htmlFor="provincia" className="block mb-2 text-sm font-medium text-gray-900">Provincia</label>
                                <input type="text" name="provincia" id="provincia" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5"
                                    value={mostrarOrganizacion.provincia}
                                    onChange={(e) => setMostrarOrganizacion({ ...mostrarOrganizacion, provincia: e.target.value })}
                                    disabled={!modificar}
                                />
                            </div>
                            <div>
                                <label htmlFor="codigo_postal" className="block mb-2 text-sm font-medium text-gray-900">Código Postal</label>
                                <input type="text" name="codigo_postal" id="codigo_postal" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5"
                                    value={mostrarOrganizacion.codigo_postal}
                                    onChange={(e) => setMostrarOrganizacion({ ...mostrarOrganizacion, codigo_postal: e.target.value })}
                                    disabled={!modificar}
                                />
                            </div>
                            <div>
                                <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-900">Teléfono</label>
                                <input type="text" name="telefono" id="telefono" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5"
                                    value={mostrarOrganizacion.telefono}
                                    onChange={(e) => setMostrarOrganizacion({ ...mostrarOrganizacion, telefono: e.target.value })}
                                    disabled={!modificar}
                                />
                            </div>
                            {/* <div>
                                <label htmlFor="passsword" className="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
                                <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full block p-2.5" 
                                    //onChange={(e) => setMostrarUsuario({ ...mostrarUsuario, password: e.target.value })}
                                    disabled={!modificar}
                                />
                            </div> */}
                            <div>
                                <button className="cursor-pointer bg-zinc-100 border-1 border-zinc-200 hover:bg-zinc-300 me-1 rounded-lg text-sm px-3 py-2 text-center"
                                    onClick={()=>{setModificar(!modificar)}}
                                >
                                    {!modificar ? 'Modificar' : 'Cancelar'}
                                </button>
                                {
                                    modificar &&
                                    <button className="cursor-pointer text-white bg-blue-400 hover:text-white border-1 border-zinc-200 hover:bg-blue-600 rounded-lg text-sm px-3 py-2 text-center"
                                        onClick={()=>{modificarDatosOrganizacion()}}
                                    >
                                        Guardar
                                    </button>
                                }
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

            <PopUp
                open={openPopUp} 
                popTitle="Eliminar organizacion"
                popContent={`¿Está seguro de que desea eliminar a la organizacion ${mostrarOrganizacion.nombre}?`}
                popType="option"
                confirmFunction={() => {
                    eliminarOrganizacion(mostrarOrganizacion.id);
                    setOpenPopUp(false);
                }}
                cancelFunction={() => setOpenPopUp(false)}
            />
        </DashboardLayout>
    )
}

export default withAuth(PerfilOrganizacion, ['superadmin'])