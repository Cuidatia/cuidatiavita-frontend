import { useRouter } from "next/router";
import DashboardLayout from "../dashboard/layout";
import { use, useEffect, useState } from "react";
import Card from "@/components/cards/card";
import withAuth from '@/components/withAuth';
import Alerts from "@/components/alerts/alerts";
import { useSession } from "next-auth/react";

function PerfilPaciente () {
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [personalReferencia, setPersonalReferencia] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState()
    const [message, setMessage] = useState()
    const [error, setError] = useState()
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

    const getUsuarios = async (organizacion) => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getUsuarios?org=' + organizacion,{
            method:'GET',
            headers: {
                "Content-Type": "application/json"
            },
        })

        if(response.ok) {
            const data = await response.json()
            setUsuarios(data.usuarios)
        }
    }

    const getUsuariosReferencia = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getUsuariosReferencia?id='+ mostrarPaciente?.id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.ok){
            const data = await response.json()
            setPersonalReferencia(data.usuarios)
        }
    }

    const asignarPersonalReferencia = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'asignarPersonaReferencia', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pacienteId: mostrarPaciente.id,
                usuarioId: usuarioSeleccionado
            })
        })

        if(response.ok){
            const data = await response.json()
            setMessage(data.message)
        }else {
            const data = await response.json()
            setError(data.error)
        }
    }

    useEffect(()=>{
        if (status === 'authenticated' && session?.user?.idOrganizacion) {  
            getPaciente()
            getUsuarios(session?.user?.idOrganizacion)
        }
    },[session, status])

    useEffect(()=>{
        if (mostrarPaciente?.id) {
            getUsuariosReferencia()
        }
    }, [mostrarPaciente])

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
                        (session?.user?.roles === 'Auxiliar' || session?.user?.roles === 'admin') &&
                            <div className="grow">
                                <Card tipo={'trabajo'} title={'Trabajo'} />
                            </div>
                    }
                    {
                        (session?.user?.roles === 'medico' || session?.user?.roles === 'admin') &&
                            <div className="grow">
                                <Card tipo={'medico'} title={'Datos Médicos'} />
                            </div>
                    }
                    {
                        session?.user?.roles === 'admin' &&
                            <div className="grow">
                                <Card tipo={'otros'} title={'Otros'} />
                            </div>
                    }
                    {
                        (session?.user?.roles === 'Auxiliar' || session?.user?.roles === 'admin') &&
                            <div className="grow" onClick={()=>{router.push('/pacientes/'+mostrarPaciente.id+'/galeria')}}>
                                <Card tipo={'fotos'} title={'Fotos'} />
                            </div>
                    }
                </div>
            </div>
            <div className="py-2">
                <label htmlFor="personal" className="block mb-2 text-sm font-medium text-gray-900">Personal de referencia:</label>
                <div id="personal" className="block p-2.5 w-full text-sm max-h-fit text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    {
                        personalReferencia && 
                        personalReferencia.map((persona, index) => (
                            <p>{persona.nombre}</p>
                        ))

                    }
                </div>
            </div>
            {
                session?.user?.roles === 'admin' &&
                <div className="flex py-2">
                    <select name="personal" id="personal"  className="block p-2.5 text-sm max-h-fit text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e)=>setUsuarioSeleccionado(e.target.value)}
                    >
                        <option value="personal">Añadir nuevo</option>
                        {
                            usuarios && 
                            usuarios.map((usuario, index) => (
                                <option key={index} value={usuario.id}>{usuario.nombre}</option>
                            ))
                        }
                    </select>
                    <button className="cursor-pointer mx-2 bg-zinc-100 hover:text-white border-1 border-zinc-200 hover:bg-blue-500 rounded-lg text-sm px-3 py-2 text-center"
                        onClick={()=>asignarPersonalReferencia()}
                    >
                        Asignar
                    </button>
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

export default withAuth(PerfilPaciente)