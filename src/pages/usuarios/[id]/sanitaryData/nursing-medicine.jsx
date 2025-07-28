import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";
import PopUp from "@/components/popUps/popUp";
import Alerts from "@/components/alerts/alerts";
import { set } from "zod";

function NursingMedicine () {
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [modificar, setModificar] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const {id} = router.query
    const {data: session, status} = useSession()
    const [saveData, setSaveData] = useState(false)

    const [pacienteMedicinaEnfermeria, setPacienteMedicinaEnfermeria] = useState({
        nutritionalSituation: '',
        sleepQuality: '',
        fallRisks: '',
        mobilityNeeds: '',
        healthPreferences: ''
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

    const getPacienteMedicinaEnfermeria = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteMedicinaEnfermeria?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setPacienteMedicinaEnfermeria(data.nursing)
        }
    }

    useEffect(()=>{
        if (status === 'authenticated'){    
            getPaciente()
            getPacienteMedicinaEnfermeria()
        }
    },[status,session])

    const enviarDatos = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteMedicinaEnfermeria', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            },
            body: JSON.stringify({
                id: id,
                nursing: pacienteMedicinaEnfermeria
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
        <PacienteLayout mostrarPaciente={mostrarPaciente} page={"9"}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="nutritionalSituation" className="block mb-2 text-sm font-medium text-gray-900">¿Qué tal come? ¿Cómo es su situación nutricional?</label>
                    <input type="text" name="nutritionalSituation" id="nutritionalSituation" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMedicinaEnfermeria?.nutritionalSituation}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteMedicinaEnfermeria({...pacienteMedicinaEnfermeria, [e.target.name]:e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="sleepQuality" className="block mb-2 text-sm font-medium text-gray-900">¿Qué tal duerme? ¿Cómo es su calidad de sueño actual?</label>
                    <input type="text" name="sleepQuality" id="sleepQuality" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMedicinaEnfermeria?.sleepQuality}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteMedicinaEnfermeria({...pacienteMedicinaEnfermeria, [e.target.name]:e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="fallRisks" className="block mb-2 text-sm font-medium text-gray-900">¿Se ha caído con frecuencia? ¿Cuántas veces ha llegado a caerse en el último año?</label>
                    <input type="text" name="fallRisks" id="fallRisks" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMedicinaEnfermeria?.fallRisks}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteMedicinaEnfermeria({...pacienteMedicinaEnfermeria, [e.target.name]:e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="mobilityNeeds" className="block mb-2 text-sm font-medium text-gray-900">¿Tiene necesidades especiales de movilidad dentro o fuera de casa?</label>
                    <input type="textarea" name="mobilityNeeds" id="mobilityNeeds" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMedicinaEnfermeria?.mobilityNeeds}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteMedicinaEnfermeria({...pacienteMedicinaEnfermeria, [e.target.name]:e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="healthPreferences" className="block mb-2 text-sm font-medium text-gray-900">¿Tiene preferencias sanitarias? ¿Qué relación tiene con su médico?</label>
                    <input type="textarea" name="healthPreferences" id="healthPreferences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMedicinaEnfermeria?.healthPreferences}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteMedicinaEnfermeria({...pacienteMedicinaEnfermeria, [e.target.name]:e.target.value})}}
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

export default withAuth(NursingMedicine, ['administrador', 'medico/enfermero'])