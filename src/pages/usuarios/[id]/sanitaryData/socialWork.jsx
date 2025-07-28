import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";
import PopUp from "@/components/popUps/popUp";
import Alerts from "@/components/alerts/alerts";
import { set } from "zod";

function SocialWork () {
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [modificar, setModificar] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const {id} = router.query
    const {data: session, status} = useSession()
    const [saveData, setSaveData] = useState(false)


    const [pacienteTrabajoSocial, setPacienteTrabajoSocial] = useState({
        residentAndRelationship: '',
        petNameAndBreedPet: '',
        resources: '',
        legalSupport: ''
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

    const getPacienteTrabajoSocial = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteTrabajoSocial?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setPacienteTrabajoSocial(data.trabajoSocial)
        }
    }

    useEffect(()=>{
        if (status === 'authenticated'){    
            getPaciente()
            getPacienteTrabajoSocial()
        }
    },[status,session])

    const enviarDatos = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteTrabajoSocial', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            },
            body: JSON.stringify({
                id: id,
                socialwork: pacienteTrabajoSocial
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
        <PacienteLayout mostrarPaciente={mostrarPaciente} page={"11"}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="residentAndRelationship" className="block mb-2 text-sm font-medium text-gray-900">¿Vive con otras personas?¿Cuál es su relación con ellas?</label>
                    <input type="text" name="residentAndRelationship" id="residentAndRelationship" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTrabajoSocial?.residentAndRelationship}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteTrabajoSocial({
                            ...pacienteTrabajoSocial,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="petNameAndBreedPet" className="block mb-2 text-sm font-medium text-gray-900">¿Tiene mascota?¿Qué animal es y cómo se llama?</label>
                    <input type="text" name="petNameAndBreedPet" id="petNameAndBreedPet" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTrabajoSocial?.petNameAndBreedPet}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteTrabajoSocial({
                            ...pacienteTrabajoSocial,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="resources" className="block mb-2 text-sm font-medium text-gray-900">¿Con qué recursos o prestaciones cuenta?</label>
                    <input type="text" name="resources" id="resources" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTrabajoSocial?.resources}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteTrabajoSocial({
                            ...pacienteTrabajoSocial,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="legalSupport" className="block mb-2 text-sm font-medium text-gray-900">¿Con qué apoyos legales cuenta?</label>
                    <input type="text" name="legalSupport" id="legalSupport" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTrabajoSocial?.legalSupport}
                         onChange={(e)=>{
                            setIsFormDirty(true);
                            setPacienteTrabajoSocial({
                            ...pacienteTrabajoSocial,
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

export default withAuth(SocialWork, ['administrador', 'trabajador social'])