import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";
import PopUp from "@/components/popUps/popUp";
import Alerts from "@/components/alerts/alerts";

function Maturity () {

    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [modificar, setModificar] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const {id} = router.query
    const {data: session, status} = useSession()

    const [pacienteMadurez, setPacienteMadurez] = useState({
        maturityGrandchildren: "",
        maturityWorkPlace: "",
        maturityWorkRol: "",
        maturityFamilyCore: "",
        maturityFriendsGroup: "",
        maturityWorkGroup: "",
        maturityImportantPerson:"",
        maturityTravels: "",
        maturityFavouritePlace: "",
        maturityRoutine: "",
        maturityPositiveExperiences: "",
        maturityNegativeExperiences: "",
        maturityResponsabilities:"",
        maturityRetirement: "",
        maturityWills: "",
        maturityProjects: "",
        maturityUncompletedProjects: "",
        maturityIllness: "",
        maturityPersonalCrisis: "",
    })

    const [saveData, setSaveData] = useState(false)
    
    const [isFormDirty, setIsFormDirty] = useState(false)

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
                "Authorization": `Bearer ${session?.user?.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setMostrarPaciente(data.paciente)
        }

    }

    const getPacienteMadurez = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteMadurez?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setPacienteMadurez(data.madurez)
        }
    }

    useEffect(()=>{
        if (status === 'authenticated'){    
            getPaciente()
            getPacienteMadurez()
        }
    },[status,session])

    const enviarDatos = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteMadurez', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            },
            body: JSON.stringify({
                id: id,
                maturity: pacienteMadurez
            })
        })

        if (response.ok){
            const data = await response.json()
            setMessage(data.message)
            setSaveData(false)
            setIsFormDirty(false)
        }else {
            const data = await response.json()
            setError(data.error)
            setSaveData(false)
        }
    }

    return(
        <PacienteLayout mostrarPaciente={mostrarPaciente} page={"6"}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="maturityGrandchildren" className="block mb-2 text-sm font-medium text-gray-900">¿Tuvo nietos? Si es así, ¿Cuántos nietos tuvo? ¿Cómo se llaman sus nietos? ¿Puede verlos con frecuencia?</label>
                    <input type="textarea" name="maturityGrandchildren" id="maturityGrandchildren" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityGrandchildren}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityWorkPlace" className="block mb-2 text-sm font-medium text-gray-900">¿Dónde trabajaba? ¿Disfrutaba de su trabajo?</label>
                    <input type="text" name="maturityWorkPlace" id="maturityWorkPlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityWorkPlace}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityWorkRol" className="block mb-2 text-sm font-medium text-gray-900">¿Qué rol desempeñaba? ¿Cambió a lo largo de los años?</label>
                    <input type="text" name="maturityWorkRol" id="maturityWorkRol" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityWorkRol}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityFamilyCore" className="block mb-2 text-sm font-medium text-gray-900">¿Qué personas formaban su núcleo familiar? ¿Cómo se llevaba con ellos?</label>
                    <input type="textarea" name="maturityFamilyCore" id="maturityFamilyCore" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityFamilyCore}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityFriendsGroup" className="block mb-2 text-sm font-medium text-gray-900">¿Quiénes formaban su grupo de amigos? ¿Cómo se llevaba con ellos?</label>
                    <input type="textarea" name="maturityFriendsGroup" id="maturityFriendsGroup" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityFriendsGroup}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityWorkGroup" className="block mb-2 text-sm font-medium text-gray-900">¿Qué relaciones mantenía en el entorno laboral? ¿Cómo se llevaba con ellos?</label>
                    <input type="textarea" name="maturityWorkGroup" id="maturityWorkGroup" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityWorkGroup}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityImportantPerson" className="block mb-2 text-sm font-medium text-gray-900">¿Quién fue su persona más importante durante esta etapa?</label>
                    <input type="textarea" name="maturityImportantPerson" id="maturityImportantPerson" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMadurez.maturityImportantPerson}
                         onChange={(e) => {
                            setIsFormDirty(true);
                            setPacienteMadurez({
                            ...pacienteMadurez,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityTravels" className="block mb-2 text-sm font-medium text-gray-900">¿Qué lugares pudo visitar? ¿Recuerda alguno con especial cariño?</label>
                    <input type="text" name="maturityTravels" id="maturityTravels" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityTravels}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityFavouritePlace" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál era su lugar favorito? ¿Ha cambiado respecto a otras etapas?</label>
                    <input type="text" name="maturityFavouritePlace" id="maturityFavouritePlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityFavouritePlace}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityRoutine" className="block mb-2 text-sm font-medium text-gray-900">¿Qué rutina seguía en su día a día?</label>
                    <input type="textarea" name="maturityRoutine" id="maturityRoutine" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityRoutine}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityPositiveExperiences" className="block mb-2 text-sm font-medium text-gray-900">¿Qué experiencias positivas tuvo?</label>
                    <input type="textarea" name="maturityPositiveExperiences" id="maturityPositiveExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityPositiveExperiences}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityNegativeExperiences" className="block mb-2 text-sm font-medium text-gray-900">¿Qué experiencias negativas tuvo?</label>
                    <input type="textarea" name="maturityNegativeExperiences" id="maturityNegativeExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityNegativeExperiences}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityResponsabilities" className="block mb-2 text-sm font-medium text-gray-900">¿Qué responsabilidades tenía durante esta etapa?</label>
                    <input type="textarea" name="maturityResponsabilities" id="maturityResponsabilities" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMadurez.maturityResponsabilities}
                         onChange={(e) => {
                            setIsFormDirty(true);
                            setPacienteMadurez({
                            ...pacienteMadurez,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityRetirement" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo planteó su jubilación?</label>
                    <input type="text" name="maturityRetirement" id="maturityRetirement" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityRetirement}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityWills" className="block mb-2 text-sm font-medium text-gray-900">¿Qué deseos ha planteado para su última etapa de vida?</label>
                    <input type="text" name="maturityWills" id="maturityWills" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityWills}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityProjects" className="block mb-2 text-sm font-medium text-gray-900">¿Se propuso iniciar algún proyecto?</label>
                    <input type="textarea" name="maturityProjects" id="maturityProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityProjects}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityUncompletedProjects" className="block mb-2 text-sm font-medium text-gray-900">¿Acabó algún proyecto que se propuso? ¿Le quedó alguna tarea por completar?</label>
                    <input type="textarea" name="maturityUncompletedProjects" id="maturityUncompletedProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityUncompletedProjects}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityIllness" className="block mb-2 text-sm font-medium text-gray-900">¿Sufrió alguna enfermedad que le marcase durante esta etapa de vida?</label>
                    <input type="textarea" name="maturityIllness" id="maturityIllness" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityIllness}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityPersonalCrisis" className="block mb-2 text-sm font-medium text-gray-900">¿Sufrió alguna crisis emocional que le marcase durante esta etapa de vida?</label>
                    <input type="textarea" name="maturityPersonalCrisis" id="maturityPersonalCrisis" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityPersonalCrisis}
                            onChange={(e)=> {
                                setIsFormDirty(true);
                                setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
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
                        onClick={()=>setSaveData(true)}
                    >
                        Guardar
                    </button>
            }
            </div>
            {
                message &&
                    <Alerts alertContent={message} alertType={'success'} />
            }
            {
                error &&
                    <Alerts alertContent={error} alertType={'error'} />
            }
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

export default withAuth(Maturity)