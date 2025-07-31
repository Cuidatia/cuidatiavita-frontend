import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";
import PopUp from "@/components/popUps/popUp";
import Alerts from "@/components/alerts/alerts";

function Adulthood () {
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [modificar, setModificar] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const {id} = router.query
    const {data: session, status} = useSession()

    const [pacienteAdultez, setPacienteAdultez] = useState({
        adulthoodSentimentalCouple: '',
        adulthoodChildren: '',
        adulthoodStudies: '',
        adulthoodWorkPlace: '',
        adulthoodWorkRol: '',
        adulthoodFamilyCore: '',
        adulthoodFriendsGroup: '',
        adulthoodWorkGroup: '',
        adulthoodImportantPerson:'',
        adulthoodTravels: '',
        adulthoodFavouritePlace: '',
        adulthoodRoutine: '',
        adulthoodPositiveExperiences: '',
        adulthoodNegativeExperiences: '',
        adulthoodResponsabilities:'',
        adulthoodAddress: '',
        adulthoodEconomicSituation: '',
        adulthoodProjects: '',
        adulthoodUncompletedProjects: '',
        adulthoodIllness: '',
        adulthoodPersonalCrisis: '',
        adulthoodMusic: ''
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

    const getPacienteAdultez = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteAdultez?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setPacienteAdultez(data.adultez)
        }
    }

    useEffect(()=>{
        if (status == 'authenticated'){
            getPaciente()
            getPacienteAdultez()
        }
    },[status, session])

    const enviarDatos = async () =>{
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteAdultez', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            },
            body: JSON.stringify({
                id: id,
                adulthood: pacienteAdultez
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
        <PacienteLayout mostrarPaciente={mostrarPaciente} page={"5"}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="adulthoodSentimentalCouple" className="block mb-2 text-sm font-medium text-gray-900">¿Quién es su pareja sentimental o persona íntima de convivencia? ¿Qué momentos significativos vivieron juntos?</label>
                    <input type="text" name="adulthoodSentimentalCouple" id="adulthoodSentimentalCouple" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodSentimentalCouple}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodChildren" className="block mb-2 text-sm font-medium text-gray-900">¿Cuántos hijos tuvo? ¿Cómo se llaman sus hijos?</label>
                    <input type="textarea" name="adulthoodChildren" id="adulthoodChildren" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodChildren}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodStudies" className="block mb-2 text-sm font-medium text-gray-900">¿Siguió estudiando en esta etapa de vida? Si es así, ¿Qué estudios realizó?</label>
                    <input type="text" name="adulthoodStudies" id="adulthoodStudies" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodStudies}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodWorkPlace" className="block mb-2 text-sm font-medium text-gray-900">En esta etapa de vida, ¿Comenzó a trabajar? ¿Dónde trabajaba?</label>
                    <input type="text" name="adulthoodWorkPlace" id="adulthoodWorkPlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodWorkPlace}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodWorkRol" className="block mb-2 text-sm font-medium text-gray-900">Si trabajaba, ¿En qué consistía su trabajo? ¿Qué rol desempeñaba?</label>
                    <input type="text" name="adulthoodWorkRol" id="adulthoodWorkRol" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodWorkRol}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodFamilyCore" className="block mb-2 text-sm font-medium text-gray-900">¿Qué personas formaban su núcleo familiar? ¿Cómo se llevaba con ellos?</label>
                    <input type="textarea" name="adulthoodFamilyCore" id="adulthoodFamilyCore" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodFamilyCore}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodFriendsGroup" className="block mb-2 text-sm font-medium text-gray-900">¿Quiénes formaban su grupo de amigos? ¿Cómo se llevaba con ellos?</label>
                    <input type="textarea" name="adulthoodFriendsGroup" id="adulthoodFriendsGroup" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodFriendsGroup}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodWorkGroup" className="block mb-2 text-sm font-medium text-gray-900">¿Qué relaciones mantenía en el entorno laboral? ¿Cómo se llevaba con ellos?</label>
                    <input type="textarea" name="adulthoodWorkGroup" id="adulthoodWorkGroup" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodWorkGroup}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodImportantPerson" className="block mb-2 text-sm font-medium text-gray-900">¿Quién fue su persona más importante durante esta etapa?</label>
                    <input type="textarea" name="adulthoodImportantPerson" id="adulthoodImportantPerson" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteAdultez.adulthoodImportantPerson}
                         onChange={(e) => {
                            setIsFormDirty(true);
                            setPacienteAdultez({
                            ...pacienteAdultez,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodTravels" className="block mb-2 text-sm font-medium text-gray-900">¿Qué lugares pudo visitar? ¿Dónde ha viajado?</label>
                    <input type="text" name="adulthoodTravels" id="adulthoodTravels" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodTravels}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodFavouritePlace" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál era su lugar favorito? ¿Tiene alguna anécdota o vivencia en ese lugar?</label>
                    <input type="text" name="adulthoodFavouritePlace" id="adulthoodFavouritePlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodFavouritePlace}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodRoutine" className="block mb-2 text-sm font-medium text-gray-900">¿Qué rutina seguía en su día a día? ¿Cómo organizaba la vida en el hogar?</label>
                    <input type="textarea" name="adulthoodRoutine" id="adulthoodRoutine" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodRoutine}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodPositiveExperiences" className="block mb-2 text-sm font-medium text-gray-900">¿Qué experiencias positivas tuvo?</label>
                    <input type="textarea" name="adulthoodPositiveExperiences" id="adulthoodPositiveExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodPositiveExperiences}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodNegativeExperiences" className="block mb-2 text-sm font-medium text-gray-900">¿Qué experiencias negativas tuvo?</label>
                    <input type="textarea" name="adulthoodNegativeExperiences" id="adulthoodNegativeExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodNegativeExperiences}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodResponsabilities" className="block mb-2 text-sm font-medium text-gray-900">¿Qué responsabilidades tenía durante esta etapa?</label>
                    <input type="textarea" name="adulthoodResponsabilities" id="adulthoodResponsabilities" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteAdultez.adulthoodResponsabilities}
                         onChange={(e) => {
                            setIsFormDirty(true);
                            setPacienteAdultez({
                            ...pacienteAdultez,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodAddress" className="block mb-2 text-sm font-medium text-gray-900">¿Dónde vivió? ¿Cómo era el lugar donde vivía?</label>
                    <input type="textarea" name="adulthoodAddress" id="adulthoodAddress" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodAddress}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodEconomicSituation" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo era su situación económica? ¿Cómo compaginaba su vida laboral con su vida familiar?</label>
                    <input type="text" name="adulthoodEconomicSituation" id="adulthoodEconomicSituation" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodEconomicSituation}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodProjects" className="block mb-2 text-sm font-medium text-gray-900">¿Se propuso iniciar algún proyecto?</label>
                    <input type="textarea" name="adulthoodProjects" id="adulthoodProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodProjects}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodUncompletedProjects" className="block mb-2 text-sm font-medium text-gray-900">¿Acabó algún proyecto que se propuso? ¿Le quedó alguna tarea por completar?</label>
                    <input type="textarea" name="adulthoodUncompletedProjects" id="adulthoodUncompletedProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodUncompletedProjects}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodIllness" className="block mb-2 text-sm font-medium text-gray-900">¿Sufrió alguna enfermedad que le marcase durante esta etapa de vida?</label>
                    <input type="textarea" name="adulthoodIllness" id="adulthoodIllness" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodIllness}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodPersonalCrisis" className="block mb-2 text-sm font-medium text-gray-900">¿Sufrió alguna crisis emocional que le marcase durante esta etapa de vida?</label>
                    <input type="textarea" name="adulthoodPersonalCrisis" id="adulthoodPersonalCrisis" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodPersonalCrisis}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
                                [e.target.name]:e.target.value
                            })}}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodMusic" className="block mb-2 text-sm font-medium text-gray-900">¿Qué música sonaba en esta etapa de su vida? ¿Recuerda alguna canción?</label>
                    <input type="textarea" name="adulthoodMusic" id="adulthoodMusic" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez.adulthoodMusic}
                            onChange={(e) => {
                                setIsFormDirty(true);
                                setPacienteAdultez({
                                ...pacienteAdultez,
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

export default withAuth(Adulthood)