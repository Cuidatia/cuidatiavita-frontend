import { useRouter } from "next/router";
import DashboardLayout from "../dashboard/layout";
import { useEffect, useState } from "react";
import Card from "@/components/cards/card";
import { useSessionStore } from "@/hooks/useSessionStorage";
import { UsuarioContext } from "@/contexts/UsuarioContext";
import withAuth from '@/components/withAuth';

function PerfilPaciente () {
    const [Usuario, setUsuario]  = useSessionStore(UsuarioContext)
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [modificar, setModificar] = useState(false)
    const [roles, setRoles] = useState()
    const router = useRouter()
    const {id} = router.query

    const getPaciente = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getPaciente?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.ok){
            const data = await response.json()
            setMostrarPaciente(data.paciente)
        }

    }

    useEffect(()=>{
        getPaciente()
    },[])

    return(
        <DashboardLayout>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>{mostrarPaciente.nombre}</h2>
            </div>
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t mt-2 border-gray-300"></div>
            </div>
            <div className="py-4 px-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grow" onClick={()=>{router.push('/pacientes/'+mostrarPaciente.id+'/datos-personales')}}>
                        <Card tipo={'general'} title={'Datos Personales'} />
                    </div>
                    {
                        (Usuario.roles === 'Auxiliar' || Usuario.roles === 'admin') &&
                            <div className="grow">
                                <Card tipo={'trabajo'} title={'Trabajo'} />
                            </div>
                    }
                    {
                        (Usuario.roles === 'medico' || Usuario.roles === 'admin') &&
                            <div className="grow">
                                <Card tipo={'medico'} title={'Datos médicos'} />
                            </div>
                    }
                    {
                        Usuario.roles === 'admin' &&
                            <div className="grow">
                                <Card tipo={'otros'} title={'Otros'} />
                            </div>
                    }
                    {
                        (Usuario.roles === 'Auxiliar' || Usuario.roles === 'admin') &&
                            <div className="grow" onClick={()=>{router.push('/pacientes/'+mostrarPaciente.id+'/galeria')}}>
                                <Card tipo={'fotos'} title={'Fotos'} />
                            </div>
                    }
                </div>
            </div>
        </DashboardLayout>
    )
}

export default withAuth(PerfilPaciente)