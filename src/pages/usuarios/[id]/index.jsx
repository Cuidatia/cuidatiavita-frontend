import { useRouter } from "next/router";
import PacienteLayout from "./layout";
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
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 px-4">
                <div className="grid grid-cols-2 gap-4">
                    <Card color={"linear-gradient(to left, #e5c0fdaf 30%, #e5c0fd 80%)"} icon={'personalData'} title={'Datos Personales'} link={'/usuarios/'+mostrarPaciente.id+'/personalData'} />
                    {
                        session?.user?.roles === 'admin' &&
                            <Card color={"linear-gradient(to right, #70dcff 0%, #a4e9ff 100%)"} icon={"personality"} title={'Personalidad'} link={'/usuarios/'+mostrarPaciente.id+'/personality/'} />
                    }
                    {
                        (session?.user?.roles === 'Auxiliar' || session?.user?.roles === 'admin') &&
                            <Card color={"linear-gradient(to left, #ffd495 0%, #ffbf62 100%)"} icon={"lifeStory"} title={'Historia de vida'} link={'/usuarios/'+mostrarPaciente.id+'/lifeStory'} />

                    }
                    {
                        (session?.user?.roles === 'medico' || session?.user?.roles === 'admin') &&
                            <Card color={"linear-gradient(to left, #c6ffb2 30%, #acff8f 80%)"} icon={"medico"} title={'Datos Médicos'} link={'/usuarios/'+mostrarPaciente.id+'/sanitaryData'} />
                    }
                    {
                        session?.user?.roles === 'admin' &&
                            <Card color={"linear-gradient(to left, #fff3a4 0%, #fee64f 100%)"} icon={"contactData"} title={'Contacto'} link={'/usuarios/'+mostrarPaciente.id+'/contactData'} />
                    }
                    {
                        (session?.user?.roles === 'Auxiliar' || session?.user?.roles === 'admin') &&
                            <Card color={"linear-gradient(to right, #ff8a71 0%, #ffa390 100%)"} icon={"gallery"} title={'Galería'} link={'/usuarios/'+mostrarPaciente.id+'/gallery'} />
                    }
                </div>
            </div>
            <div className="py-2">
                <label htmlFor="personal" className="block mb-2 text-sm font-medium text-gray-900">Personal de referencia:</label>
                <div id="personal" className="block p-2.5 w-full text-sm max-h-fit text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    {
                        personalReferencia ? 
                        personalReferencia.map((persona, index) => (
                            <p>{persona.nombre}</p>
                        ))
                        : <p>No tiene personal de referencia asignado</p>
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
        </PacienteLayout>
    )
}

export default withAuth(PerfilPaciente)