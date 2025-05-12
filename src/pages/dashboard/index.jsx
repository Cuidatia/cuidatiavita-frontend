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

    const router = useRouter()

    const getPersonasReferencia = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getPacientesReferencia?user=' + session.user.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
                'Content-Type' : 'application/json'
            },
        })
        if(response.ok){
            const data = await response.json()
            setOrganizacion(data.organizacion)
        }
    }

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.idOrganizacion) {
            getOrganizacion()
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
                                <CardPacientes nombre={persona.name} primerApellido={persona.firstSurname} segundoApellido={persona.secondSurname} img={persona.imgPerfil} funcion={()=>router.replace('/pacientes/'+persona.id)} />
                            </div>
                        ))
                    :
                        organizacion &&
                        <p className='text-2xl font-bold'>{organizacion.nombre}</p>
                        
                }
            </div>
        </DashboardLayout>
    )
}

export default withAuth(Dashboard,[])