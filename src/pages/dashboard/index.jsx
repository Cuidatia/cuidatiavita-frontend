"use client"
import './styles.css'
import DashboardLayout from './layout';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '@/components/withAuth';
import CardPacientes from '@/components/cards/cardsPacientes';
import Call from '@/components/Call';
import { useRouter } from 'next/navigation';
import { Pie, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LineElement, PointElement, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend)

function Dashboard() {
    const {data: session, status} = useSession()
    const [ personasReferencia, setPersonasReferencia ] = useState()
    const [organizacion, setOrganizacion] = useState()
    const [resumenOrganizacion, setResumenOrganizacion] = useState(null);

    const router = useRouter()

    const [roomName, setRoomName] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const channel = e.target.channel.value.trim();
        if (channel) {
            console.log(channel)
            setRoomName(channel);
        }
    };

    const getPersonasReferencia = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getPacientesReferencia?user=' + session.user.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            }
        })
        if(response.ok){
            const data = await response.json()
            setPersonasReferencia(data.pacientes)
        }
    }

    const getOrganizacion = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getOrganizacion?org=' + session.user.idOrganizacion,{
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            },
        })
        if(response.ok){
            const data = await response.json()
            setOrganizacion(data.organizacion)
        }
    }

    const getResumenOrganizacion = async () => {
        const isSuperAdmin = session?.user?.roles.split(',').includes('superadmin')
        const endpoint = 'getResumenOrganizacion?org=' + session.user.idOrganizacion + '&rol=' + isSuperAdmin
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setResumenOrganizacion(data.resumen);
        }
    };

    const chartDataRoles = {
        labels: resumenOrganizacion?.total_roles.map(rol => rol.rol),
        datasets: [
            {
                label: 'Roles Ocupados',
                data: resumenOrganizacion?.total_roles.map(rol => rol.cantidad),
                backgroundColor: ['#4B8BBE', '#F7DF1E', '#FF6F61', '#56C596', '#FF9F00'],
                borderColor: ['#fff', '#fff', '#fff', '#fff', '#fff'],
                borderWidth: 2
            },
        ],
    }

    const chartDataGenre = {
        labels: ['Hombres', 'Mujeres', 'Otros'],
        datasets: [
            {
                label: 'Usuarios por género',
                data: [resumenOrganizacion?.total_usuarios?.M, resumenOrganizacion?.total_usuarios?.F, resumenOrganizacion?.total_usuarios?.O],
                backgroundColor: ['#4B8BBE', '#F7DF1E', '#FF6F61'],
                borderColor: ['#fff', '#fff'],
                borderWidth: 2
            },
        ],
    }

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.idOrganizacion) {
            getOrganizacion()
            getResumenOrganizacion()
        }

        if (session?.user?.roles.split(',').includes('familiar') || session?.user?.roles.split(',').includes('personal de referencia')) {
            getPersonasReferencia()
        }
    }, [session, status]);

    return (
        <DashboardLayout>
            <div className='font-bold py-6 px-8 bg-white h-full'>
            {session?.user?.roles.split(',').includes('familiar') || session?.user?.roles.split(',').includes('personal de referencia') || session?.user?.roles.split(',').includes('paciente') ? ( 
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {personasReferencia &&
                    personasReferencia.map((persona, index) => {
                    return (
                        <div key={index} className="bg-white shadow-md rounded-xl overflow-hidden transform transition duration-200 hover:shadow-xl hover:-translate-y-1 hover:bg-blue-200">
                        <CardPacientes
                            nombre={persona.name}
                            primerApellido={persona.firstSurname}
                            segundoApellido={persona.secondSurname}
                            img={"/static/6073873.png"}
                            funcion={() => router.replace('/usuarios/' + persona.id)}
                        />
                        </div>
                    );
                    })}
                </div>
                
            ) : (
                organizacion && (
                <p className="text-3xl font-semibold text-gray-800">
                    {organizacion.nombre}
                </p>
                )
            )
            }
                {
                resumenOrganizacion && 
                !['familiar', 'personal de referencia', 'paciente'].some(r => session?.user?.roles.split(',').includes(r)) && (
                <div className="mt-2 py-6 max-w-5xl mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Resumen General</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-md p-6">
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-gray-500 text-sm uppercase tracking-wider">Total de Usuarios</p>
                                <p className="text-4xl font-bold text-blue-600 mt-2">
                                    {resumenOrganizacion.total_usuarios.M + resumenOrganizacion.total_usuarios.F + resumenOrganizacion.total_usuarios.O}
                                </p>
                            </div>
                            <div className="w-full md:w-1/2 max-w-xs mt-4 md:mt-0 md:ml-6">
                                <Doughnut data={chartDataGenre} />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-md p-6">
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-gray-500 text-sm uppercase tracking-wider">Total de Personal</p>
                                <p className="text-4xl font-bold text-blue-600 mt-2">
                                    {resumenOrganizacion.total_profesionales}
                                </p>
                            </div>
                            <div className="w-full md:w-1/2 max-w-xs mt-4 md:mt-0 md:ml-6">
                                <Pie data={chartDataRoles} />
                            </div>
                        </div>
                    </div>
                </div>
                )
            }

            <div className="flex items-start justify-center gap-8 pt-10 pb-10">
            {/* Crear Sala */}
            <div className="p-8 bg-white rounded-xl border-2 border-black w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">Crear Sala de Videollamada</h2>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                <div>
                    <label
                    htmlFor="channel"
                    className="block text-gray-700 font-medium mb-2"
                    >
                    Nombre de la sala
                    </label>
                    <input
                    id="channel"
                    name="channel"
                    type="text"
                    placeholder="Introduce el nombre de la sala"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-5 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
                >
                    Crear sala
                </button>
                </form>
            </div>

            {/* Unirse a sala personal */}
            <div className="p-8 bg-white rounded-xl border-2 border-black w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">Unirse a sala personal</h2>
                <p className="text-gray-600 text-center mb-6">
                Tu sala personal está vinculada a tu nombre de usuario.
                </p>
                <button
                onClick={() => setRoomName(session?.user?.nombre.replace(/\s+/g, "_"))}
                className="w-full px-5 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
                >
                Unirme a mi sala
                </button>
            </div>
            </div>

            {/* Renderizar llamada si hay roomName */}
            {roomName && (
            <div className="mt-8">
                <Call roomName={roomName} />
            </div>
            )}

            </div>
        </DashboardLayout>
    )
}

export default withAuth(Dashboard, [])
