import { useRouter } from "next/router";
import PacienteLayout from "./layout";
import { use, useEffect, useState } from "react";
import Card from "@/components/cards/card";
import withAuth from '@/components/withAuth';
import Alerts from "@/components/alerts/alerts";
import PopUp from '@/components/popUps/popUp';
import { useSession } from "next-auth/react";

function PerfilPaciente () {
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [personalReferencia, setPersonalReferencia] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState()
    const [openPopUp, setOpenPopUp] = useState(false)
    const [message, setMessage] = useState()
    const [error, setError] = useState()
    const [roles, setRoles] = useState()
    const router = useRouter()
    const {id} = router.query

    const getPaciente = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getPaciente?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
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
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
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
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
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
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
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
        <PacienteLayout mostrarPaciente={mostrarPaciente} page={"0"}>
            <div className="py-4 px-4 space-y-8">
                {/* Bloque: Historial de Vida */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial de Vida</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                        color={"linear-gradient(to left, #e5c0fdaf 30%, #e5c0fd 80%)"}
                        icon={'personalData'}
                        title={'Datos Personales'}
                        link={`/usuarios/${mostrarPaciente.id}/personalData`}
                    />
                    {session?.user?.roles === 'administrador' && (
                        <Card
                            color={"linear-gradient(to right, #70dcff 0%, #a4e9ff 100%)"}
                            icon={"personality"}
                            title={'Personalidad'}
                            link={`/usuarios/${mostrarPaciente.id}/personality/`}
                        />
                    )}
                    {(session?.user?.roles === 'auxiliar' || session?.user?.roles === 'administrador') && (
                        <Card
                        color={"linear-gradient(to left, #ffd495 0%, #ffbf62 100%)"}
                        icon={"lifeStory"}
                        title={'Historia de vida'}
                        link={`/usuarios/${mostrarPaciente.id}/lifeStory`}
                        />
                    )}
                    <Card
                        color={"linear-gradient(to left, #fff3a4 0%, #fee64f 100%)"}
                        icon={"contactData"}
                        title={'Contacto'}
                        link={`/usuarios/${mostrarPaciente.id}/contactData`}
                    />
                    <Card
                        color={"linear-gradient(to right, #ff8a71 0%, #ffa390 100%)"}
                        icon={"gallery"}
                        title={'Galería'}
                        link={`/usuarios/${mostrarPaciente.id}/gallery`}
                    />
                    </div>
                </div>

                {/* Bloque: Historial Clínico */}
                {(session?.user?.roles === 'medico/enfermero' || session?.user?.roles === 'administrador' || session?.user?.roles === 'trabajador social' || session?.user?.roles === 'educador social/terapeuta ocupacional') && (
                    <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial Sanitario</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card
                        color={"linear-gradient(to left, #c6ffb2 30%, #acff8f 80%)"}
                        icon={"medico"}
                        title={'Datos Sanitarios'}
                        link={`/usuarios/${mostrarPaciente.id}/sanitaryData`}
                        />
                    </div>
                    </div>
                )}
                </div>
            <div className="py-2">
                <label htmlFor="personal" className="block mb-2 text-sm font-medium text-gray-900"><strong>Personal de referencia</strong> asignados:</label>
                <div id="personal" className="block p-2.5 w-full text-sm max-h-fit text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    {
                        personalReferencia && personalReferencia.filter(persona => persona.roles?.includes('medico/enfermero','trabajador social','educador social/terapeuta ocupacional')).length > 0 ? 
                        personalReferencia.filter(persona => persona.roles !== 'auxiliar' && persona.roles !== 'familiar').map((persona, index) => (
                            <p>{persona.nombre}</p>
                        ))
                        : <p>A este usuario no se le ha asignado ningún <strong>personal de referencia</strong>.</p>
                    }
                </div>
            </div>
            <div className="py-2">
                <label htmlFor="personal" className="block mb-2 text-sm font-medium text-gray-900"><strong>Cuidadores</strong> asignados:</label>
                <div id="personal" className="block p-2.5 w-full text-sm max-h-fit text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    {
                        personalReferencia && personalReferencia.filter(persona => persona.roles?.includes('auxiliar')).length > 0 ? 
                        personalReferencia.filter(persona => persona.roles === 'auxiliar').map((persona, index) => (
                            <p>{persona.nombre}</p>
                        ))
                        : <p>A este usuario no se le ha asignado ningún <strong>cuidador</strong>.</p>
                    }
                </div>
            </div>
            <div className="py-2">
                <label htmlFor="personal" className="block mb-2 text-sm font-medium text-gray-900"><strong>Familiares</strong> asignados:</label>
                <div id="personal" className="block p-2.5 w-full text-sm max-h-fit text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    {
                        personalReferencia && personalReferencia.filter(persona => persona.roles?.includes('familiar')).length > 0 ? 
                        personalReferencia.filter(persona => persona.roles === 'familiar').map((persona, index) => (
                            <p>{persona.nombre}</p>
                        ))
                        : <p>A este usuario no se le ha asignado ningún <strong>familiar</strong>.</p>
                    }
                </div>
            </div>
            {
                session?.user?.roles === 'administrador' &&
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

export default withAuth(PerfilPaciente, ['administrador', 'medico/enfermero', 'educador social/terapeuta ocupacional', 'trabajador social', 'auxiliar', 'familiar'])