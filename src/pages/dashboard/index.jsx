import './styles.css'
import DashboardLayout from './layout';
import { useSessionStore } from '@/hooks/useSessionStorage';
import { UsuarioContext } from '@/contexts/UsuarioContext';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '@/components/withAuth';

function Dashboard() {
    const {data: session, status} = useSession()
    const [ Usuario, setUsuario ] = useSessionStore(UsuarioContext)
    const [ tipo, setTipo ] = useState()
    const [organizacion, setOrganizacion] = useState()

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
            getOrganizacion().then(data => {
                setUsuario({...session.user, organizacion: data})
            });
        }
    }, [session, status]);

    return (
        <DashboardLayout>
            <div className='py-4 font-bold'>
                {
                    organizacion &&
                    <p className='text-2xl font-bold'>{organizacion.nombre}</p>
                }
            </div>
        </DashboardLayout>
    )
}

export default withAuth(Dashboard)