import './styles.css'
import DashboardLayout from './layout';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '@/components/withAuth';
import CardPacientes from '@/components/cards/cardsPacientes';
import { useRouter } from 'next/router';

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
            <div className='py-4 font-bold'>
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
                        <p className='text-2xl font-bold'>{organizacion.nombre}</p>
                        
                }
                {
                resumenOrganizacion && 
                <div className="mt-6 p-4 bg-white shadow rounded-xl">
                    <h2 className="text-xl font-bold mb-4">Resumen General</h2>
                    <table className="mx-auto w-full sm:w-[80%] border-collapse border border-gray-300 text-[10px] sm:text-[12px] md:text-sm">
                        <thead className="bg-blue-300">
                            <tr>
                                <th className="border px-1 py-1 sm:px-2 sm:py-2 text-center">Usuarios Totales</th>
                                <th className="border px-1 py-1 sm:px-2 sm:py-2 text-center">Profesionales Totales</th>
                                <th className="border px-1 py-1 sm:px-2 sm:py-2 text-center">Roles Ocupados</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {/* Usuarios por género */}
                                <td className="border px-1 py-1 sm:px-2 sm:py-2 text-center">
                                    <p>Total: {resumenOrganizacion.total_usuarios.M + resumenOrganizacion.total_usuarios.F + resumenOrganizacion.total_usuarios.O}</p>
                                    <p>Hombres: {resumenOrganizacion.total_usuarios.M}</p>
                                    <p>Mujeres: {resumenOrganizacion.total_usuarios.F}</p>
                                    <p>Otro: {resumenOrganizacion.total_usuarios.O}</p>
                                </td>

                                {/* Total de profesionales */}
                                <td className="border px-1 py-1 sm:px-2 sm:py-2 text-center">
                                    <p>Total: {resumenOrganizacion.total_profesionales}</p>
                                </td>

                                {/* Puestos ocupados */}
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
                    </table>
                </div>
            }
            </div>
        </DashboardLayout>
    )
}

export default withAuth(Dashboard,[])