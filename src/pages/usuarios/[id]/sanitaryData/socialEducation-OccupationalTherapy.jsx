import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";
import PopUp from "@/components/popUps/popUp";
import Alerts from "@/components/alerts/alerts";

function SocialEducationOccupationalTherapy () {
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [modificar, setModificar] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const [saveData, setSaveData] = useState(false)
    const {id} = router.query
    const {data: session, status} = useSession()

    const [pacienteTOES, setPacienteTOES] = useState({
        cognitiveAbilities: '',
        affectiveCapacity: '',
        behaviorCapacity: '',
        collaborationLevel: '',
        autonomyLevel: '',
        groupParticipation: ''
    })

    
    const [isFormDirty, setIsFormDirty] = useState(false);

    useEffect(() => {
        // Interceptar cierre/recarga
        const handleBeforeUnload = (e) => {
            if (modificar && isFormDirty) {
                e.preventDefault()
                e.returnValue = ''
            }
        }

        // Interceptar navegación interna
        const handleRouteChangeStart = (url) => {
            if (modificar && isFormDirty) {
                const confirmExit = window.confirm("Tienes cambios sin guardar. ¿Estás seguro de salir?")
                if (!confirmExit) {
                    router.events.emit("routeChangeError")
                    throw "Abortar navegación"
                }
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        router.events.on("routeChangeStart", handleRouteChangeStart)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            router.events.off("routeChangeStart", handleRouteChangeStart)
        }
    }, [modificar, isFormDirty])


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

    const getPacienteTOES = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteTOES?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setPacienteTOES(data.socialedu)
        }
    }

    useEffect(()=>{
        if (status === 'authenticated'){    
            getPaciente()
            getPacienteTOES()
        }
    },[status,session])

    const enviarDatos = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteTOES', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            },
            body: JSON.stringify({
                id: id,
                socialedu: pacienteTOES
            })
        })

        if (response.ok){
            const data = await response.json()
            setMessage(data.message)
            setModificar(false)
            setSaveData(false)
            setIsFormDirty(false);
        }else {
            const data = await response.json()
            setError(data.error)
        }
    }

    return(
        mostrarPaciente &&
        <PacienteLayout mostrarPaciente={mostrarPaciente} page={"10"}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="cognitiveAbilities" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo describiría su capacidad cognitiva?</label>
                    <input type="textarea" name="cognitiveAbilities" id="cognitiveAbilities" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.cognitiveAbilities}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteTOES({...pacienteTOES, [e.target.name]:e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="affectiveCapacity" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo maneja sus emociones y afectos?</label>
                    <input type="textarea" name="affectiveCapacity" id="affectiveCapacity" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.affectiveCapacity}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteTOES({...pacienteTOES, [e.target.name]:e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="behaviorCapacity" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo suele comportarse frente a normas o límites?</label>
                    <input type="textarea" name="behaviorCapacity" id="behaviorCapacity" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.behaviorCapacity}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteTOES({...pacienteTOES, [e.target.name]:e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="collaborationLevel" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo es su participación en actividades del hogar?</label>
                    <input type="textarea" name="collaborationLevel" id="collaborationLevel" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.collaborationLevel}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteTOES({
                            ...pacienteTOES,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="autonomyLevel" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo lleva su situación económica o sanitaria? ¿Puede hacerlo de forma autónoma?</label>
                    <input type="text" name="autonomyLevel" id="autonomyLevel" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.autonomyLevel}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteTOES({
                            ...pacienteTOES,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="groupParticipation" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo es su participación en actividades de grupo?</label>
                    <input type="textarea" name="groupParticipation" id="groupParticipation" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.groupParticipation}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteTOES({
                            ...pacienteTOES,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
            </div>
            <div className="border-t-1 border-gray-300">
                <button className="cursor-pointer bg-zinc-100 border-1 border-zinc-200 hover:bg-zinc-300 me-1 rounded-lg text-sm px-3 py-2 text-center"
                    onClick={() => setModificar(!modificar)}
                >
                    {!modificar ? 'Modificar': 'Cancelar'}
                </button>
            {
                modificar &&
                    <button className="cursor-pointer mx-2 bg-zinc-100 hover:text-white border-1 border-zinc-200 hover:bg-blue-500 rounded-lg text-sm px-3 py-2 text-center"
                        onClick={() => setSaveData(true)}
                    >
                        Guardar
                    </button>
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
            </div>
            {
                <PopUp
                    open={saveData}
                    popContent={'¿Desea guardar los cambios?'}
                    popTitle="Guardar cambios"
                    popType="option"
                    confirmFunction={enviarDatos}
                    cancelFunction={() => setSaveData(false)}
                />
            }
        </PacienteLayout>
    )
}

export default withAuth(SocialEducationOccupationalTherapy, ['administrador', 'educador social/terapeuta ocupacional'])