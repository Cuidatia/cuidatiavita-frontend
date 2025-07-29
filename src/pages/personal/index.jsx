import '../dashboard/styles.css';
import DashboardLayout from "../dashboard/layout";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import PopUp from '@/components/popUps/popUp';
import Alerts from '@/components/alerts/alerts';
import { useSession } from 'next-auth/react';
import { Trash, FilePenLine } from 'lucide-react';

function Usuarios () {
    const {data: session, status} = useSession()
    const [usuarios, setUsuarios] = useState([])
    const [roles, setRoles] = useState([])
    const [buscarUsuario, setBuscarUsuario] = useState('')

    const [filtro, setFiltro] = useState("")

    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState()
    const [openPopUp, setOpenPopUp] = useState(false)

    const [error, setError] = useState()
    const [message, setMessage] = useState()

    const router = useRouter()

    const [paginaActual, setPaginaActual] = useState(1)
    const [totalUsuarios, setTotalUsuarios] = useState(0)
    const usuariosPorPagina = 20

    const getUsuarios = async (organizacion) => {
        const isSuperAdmin = session?.user?.roles.split(',').includes('superadmin')
        const endpoint = isSuperAdmin
        ? 'getAllUsuarios?page=' + paginaActual + '&limit=' + usuariosPorPagina
        : 'getUsuarios?org=' + organizacion + '&page=' + paginaActual + '&limit=' + usuariosPorPagina
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + endpoint,{
            method:'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            },
        })

        if(response.ok) {
            const data = await response.json()
            setUsuarios(data.usuarios)
            setTotalUsuarios(data.totalUsuarios)
        }
    }

    useEffect(()=>{
        if (status === 'authenticated' && session?.user?.idOrganizacion) {
            getUsuarios(session?.user?.idOrganizacion);
            getRoles();
        }
    },[session, status, paginaActual])

    const getUsuario = async (nombre) => {
        if (!nombre) {getUsuarios(session?.user?.idOrganizacion)
            return
        }

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'searchUsuario?nombre=' + nombre + '&idOrganizacion=' + session?.user?.idOrganizacion, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            }
        })

        if (response.ok) {
            const data = await response.json()
            setUsuarios(data.usuarios)
        } else {
            setUsuarios([])
        }
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
            getUsuarios()
            setMessage(data.message)
        }else{
            const data = await response.json()
            setError(data.error)
        }
    }

    const getRoles = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getRoles', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.user?.token}`
            }
        })
        if(response.ok){
            const data = await response.json()
            setRoles(data.roles)
        }
    }

    return(
        <DashboardLayout>
            <div className="flex items-center justify-between px-8 pt-6">
                <select
                    name="filtro"
                    className="border border-gray-300 rounded-xl px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    defaultValue=""
                    onChange={(e) => setFiltro(e.target.value)}
                >
                    <option value="">Todos</option>
                    {roles &&
                    roles.map((rol, index) => (
                        <option key={index} value={rol.nombre}>
                        {rol.nombre}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Buscar personal..."
                    className="border border-gray-300 rounded-xl px-4 py-2 text-sm w-64 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    value={buscarUsuario}
                    onChange={(e) => {
                    setBuscarUsuario(e.target.value);
                    getUsuario(e.target.value);
                    }}
                />
                </div>

                <div className="border-t border-gray-200 my-4 mx-8" />

                <div className="px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Personal</h2>
                        <button
                            className="cursor-pointer flex items-center gap-1 text-sm text-gray-600 hover:text-green-500 transition"
                            onClick={() => router.push("personal/add")}
                        >
                            Añadir
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                                />
                            </svg>
                        </button>
                    </div>

                    {usuarios.length > 0 ? (
                        usuarios
                        .filter(
                            (usuario) =>
                            usuario.nombre.toLowerCase().includes(buscarUsuario.toLowerCase()) &&
                            usuario.roles.includes(filtro)
                        )
                        .map(
                            (usuario, index) =>
                            usuario.id !== session.user.id && (
                            <div
                                key={index}
                                className="border-b border-gray-200 transition-transform hover:scale-[1.005]"
                                onClick={() => router.push(`personal/${usuario.id}`)}
                            >
                                <div className="bg-white hover:bg-blue-100 transition-colors duration-200 p-4 flex items-center justify-between rounded-md cursor-pointer">
                                    <div className="text-base font-medium text-gray-800">
                                    {usuario.nombre}
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span
                                            title={usuario.roles}
                                            className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 max-w-[150px] truncate"
                                        >
                                            {usuario.roles}
                                        </span>

                                        <div className="flex gap-3 items-center">
                                            <button
                                                title="Editar"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`personal/${usuario.id}`);
                                                }}
                                                className="text-gray-500 hover:text-yellow-500 transition cursor-pointer"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <FilePenLine className="w-5 h-5" />
                                                </svg>
                                            </button>
                                            <button
                                                title="Eliminar"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenPopUp(!openPopUp);
                                                    setUsuarioSeleccionado(usuario);
                                                }}
                                                className="text-gray-500 hover:text-red-500 transition cursor-pointer"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <Trash className="w-5 h-5" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )
                        )
                    ) : (
                        <div className="animate-pulse bg-white p-4 rounded-xl border border-gray-100">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                        </div>
                    )}

                    {buscarUsuario === "" && filtro === "" && (
                        <div className="flex justify-center mt-6">
                        <button
                            className="px-4 py-2 mx-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
                            onClick={() => {
                            const nuevaPagina = paginaActual - 1;
                            setPaginaActual(nuevaPagina);
                            getUsuarios(session?.user?.idOrganizacion, nuevaPagina);
                            }}
                            disabled={paginaActual === 1}
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2 text-sm text-gray-700">
                            Página {paginaActual} de{" "}
                            {Math.ceil(totalUsuarios / usuariosPorPagina)}
                        </span>
                        <button
                            className="px-4 py-2 mx-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
                            onClick={() => {
                            const nuevaPagina = paginaActual + 1;
                            setPaginaActual(nuevaPagina);
                            getUsuarios(session?.user?.idOrganizacion, nuevaPagina);
                            }}
                            disabled={paginaActual >= Math.ceil(totalUsuarios / usuariosPorPagina)}
                        >
                            Siguiente
                        </button>
                        </div>
                    )}
                </div>           

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
                popTitle="Eliminar usuario"
                popContent={`¿Está seguro de que desea eliminar al usuario ${usuarioSeleccionado?.nombre}?`}
                popType="option"
                confirmFunction={() => {
                    eliminarUsuario(usuarioSeleccionado?.id);
                    setOpenPopUp(false);
                }}
                cancelFunction={() => setOpenPopUp(false)}
            />

        </DashboardLayout>
    )
}

export default withAuth(Usuarios, ['superadmin','administrador'])