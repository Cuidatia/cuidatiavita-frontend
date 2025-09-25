import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";
import PopUp from "@/components/popUps/popUp";
import Alerts from "@/components/alerts/alerts";

function Others () {
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const router = useRouter()
    const {id} = router.query
    const [message, setMessage] = useState()
    const [saveData, setSaveData] = useState(false)   
    const [modificar, setModificar] = useState(false)
    const [error, setError] = useState('')

    const [pacienteOtros, setPacienteOtros] = useState({
        professionalNotes: ''
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
            console.log('data', data)
            setMostrarPaciente(data.paciente)
        }

    }

    const getPacienteOtros = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteOtherData?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setPacienteOtros(data.otherData)
        }
    }
    useEffect(()=>{
        if (status === 'authenticated'){
            getPaciente()
            getPacienteOtros()
        }
    },[session, status])

    const enviarDatos = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteOtherData', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.user.token}`
            }, 
            body: JSON.stringify({
                id: id,
                pacienteOtros: pacienteOtros
            })
        })

        if(response.ok){
            const data = await response.json()
            setMessage(data.message)
            setModificar(false)
            setSaveData(false)
            setIsFormDirty(false);
        } else{
            const data = await response.json()
            setError(data.error)
        }
    }

    return(
        mostrarPaciente &&
        <PacienteLayout mostrarPaciente={mostrarPaciente} page={"13"}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="professionalNotes" className="block mb-2 text-sm font-medium text-gray-900">Notas adicionales</label>
                    <textarea name="professionalNotes" id="professionalNotes" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" 
                        disabled={!modificar}
                        value={pacienteOtros?.professionalNotes}
                        onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteOtros({...pacienteOtros, [e.target.name]: e.target.value})}}
                    />
                </div>
                {/* <div>
                    <label htmlFor="photos" className="block mb-2 text-sm font-medium text-gray-900">Foto</label>
                    <input type="text" name="photos" id="photos" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled
                    />
                </div> */}
            </div>
            {!(session?.user?.roles.split(',').includes('familiar') || session?.user?.roles.split(',').includes('paciente')) && (
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
            )}
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

export default withAuth(Others, ['superadmin','administrador', 'medico/enfermero', 'educador social/terapeuta ocupacional', 'trabajador social', 'auxiliar'])