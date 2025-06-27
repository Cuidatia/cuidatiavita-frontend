import './styles.css'
import DashboardLayout from './layout';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '@/components/withAuth';
import CardPacientes from '@/components/cards/cardsPacientes';
import { useRouter } from 'next/router';
import { Pie, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend)

function Dashboard() {
    const {data: session, status} = useSession()
    const [ personasReferencia, setPersonasReferencia ] = useState()
    const [organizacion, setOrganizacion] = useState()
    const [resumenOrganizacion, setResumenOrganizacion] = useState(null);

    const router = useRouter()

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
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getResumenOrganizacion?org=' + session.user.idOrganizacion, {
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
        labels: resumenOrganizacion?.total_roles.map(rol => {
            return rol.rol
        }),
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

        if (session?.user?.roles === 'familiar' || session?.user?.roles === 'personal de referencia') {
            getPersonasReferencia()
        }
    }, [session, status]);

    return (
        <DashboardLayout>
            <div className='font-bold'>
                {
                    session?.user?.roles === 'familiar' || session?.user?.roles === 'profesional de referencia' ?
                        personasReferencia &&
                        personasReferencia.map((persona, index) => (
                            <div key={index} className="p-4">
                                <CardPacientes nombre={persona.name} primerApellido={persona.firstSurname} segundoApellido={persona.secondSurname} img={persona.imgPerfil} funcion={()=>router.replace('/usuarios/'+persona.id)} />
                            </div>
                        ))
                    :
                        organizacion &&
                        <p className='text-3xl font-semibold text-gray-800'>{organizacion.nombre}</p>
                        
                }
                {
                resumenOrganizacion && 
                <div className="mt-2 py-6 max-w-5xl mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Resumen General</h2>
                    {/* <table className="mx-auto w-full sm:w-[80%] border-collapse border border-gray-300 text-[10px] sm:text-[12px] md:text-sm">
                        <thead className="bg-blue-300">
                            <tr>
                                <th className="border px-1 py-1 sm:px-2 sm:py-2 text-center">Usuarios Totales</th>
                                <th className="border px-1 py-1 sm:px-2 sm:py-2 text-center">Profesionales Totales</th>
                                <th className="border px-1 py-1 sm:px-2 sm:py-2 text-center">Roles Ocupados</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-1 py-1 sm:px-2 sm:py-2 text-center">
                                    <p>Total: {resumenOrganizacion.total_usuarios.M + resumenOrganizacion.total_usuarios.F + resumenOrganizacion.total_usuarios.O}</p>
                                    <p>Hombres: {resumenOrganizacion.total_usuarios.M}</p>
                                    <p>Mujeres: {resumenOrganizacion.total_usuarios.F}</p>
                                    <p>Otro: {resumenOrganizacion.total_usuarios.O}</p>
                                </td>
                                <td className="border px-1 py-1 sm:px-2 sm:py-2 text-center">
                                    <p>Total: {resumenOrganizacion.total_profesionales}</p>
                                </td>
                                <td className="border px-1 py-1 sm:px-2 sm:py-2 text-center">
                                    {resumenOrganizacion.total_roles.map((rol, index) => {
                                        let nombreRol = '';
                                        switch (rol.rol) {
                                        case 'medico/enfermero':
                                            nombreRol = 'médico';
                                            break;
                                        case 'educador social/terapeuta ocupacional':
                                            nombreRol = 'educador';
                                            break;
                                        default:
                                            nombreRol = rol.rol;
                                        }

                                        return ( <p key={index}> {nombreRol}: {rol.cantidad} </p> );
                                    })}
                                </td>
                            </tr>
                        </tbody>
                    </table> */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                        {/* Tarjeta: Total Usuarios + Gráfico Género */}
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

                        {/* Tarjeta: Total Personal + Gráfico Roles */}
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
            }
            </div>
        </DashboardLayout>
    )
}

export default withAuth(Dashboard,[])