import Alerts from "@/components/alerts/alerts"
import Link from "next/link"
import Card from "@/components/cards/card"
import withAuth from "@/components/withAuth"
import PacienteLayout from "../layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import PopUp from "@/components/popUps/popUp";

function sanitaryData () {
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const router = useRouter()
    const {id} = router.query
    const [saveData, setSaveData] = useState(false)
    const [modificar, setModificar] = useState(false)
    const [message, setMessage] = useState()
    const [error, setError] = useState('')

    const [mainSanitaryData, setMainSanitaryData] = useState({
        mainIllness: '',
        allergies: '',
        otherIllness: ''
    })

      
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
                'Authorization': `Bearer ${session.user.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setMostrarPaciente(data.paciente)
        }

    }

    const getMainSanitaryData = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteMainSanitaryData?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setMainSanitaryData(data.sanitaryData)
        }
    }


    useEffect(()=>{
        if (status === 'authenticated' && session?.user?.idOrganizacion) {  
            getPaciente()
            getMainSanitaryData()
        }
    },[session, status])

    const enviarDatos = async () =>{
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteMainSanitaryData', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({
                id: id,
                mainSanitaryData: mainSanitaryData
            })
        })

        if (response.ok){
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
        <PacienteLayout mostrarPaciente={mostrarPaciente} page={"7"}>
            <div className="py-4 px-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div className="grid grid-cols-2 gap-4">
                    {
                        (session?.user?.roles.split(',').includes('auxiliar') || session?.user?.roles.split(',').includes('administrador')) &&
                            <Card color={"linear-gradient(to left, #fff3a4 0%, #fee64f 100%)"} icon={'pharmacy'} title={'Farmacia'} link={'/usuarios/'+mostrarPaciente.id+'/sanitaryData/pharmacy'} />
                    }
                    {
                        (session?.user?.roles.split(',').includes('medico/enfermero') || session?.user?.roles.split(',').includes('administrador')) &&
                            <Card color={"linear-gradient(to right, #70dcff 0%, #a4e9ff 100%)"} icon={'nursig/medicine'} title={'Medicina/Enfermería'} link={'/usuarios/'+mostrarPaciente.id+'/sanitaryData/nursing-medicine'} />
                    }
                    {
                        (session?.user?.roles.split(',').includes('educador social/terapeuta ocupacional') || session?.user?.roles.split(',').includes('administrador')) &&
                            <Card color={"linear-gradient(to left, #ffd495 0%, #ffbf62 100%)"} icon={'socialEducation/occupationalTherapy'} title={'Educacion social/Terapia ocupacional'} link={'/usuarios/'+mostrarPaciente.id+'/sanitaryData/socialEducation-OccupationalTherapy'} />
                    }
                    {
                        (session?.user?.roles.split(',').includes('trabajador social') || session?.user?.roles.split(',').includes('administrador')) &&
                            <Card color={"linear-gradient(to left, #c6ffb2 30%, #acff8f 80%)"} icon={'socialWork'} title={'Trabajo social'} link={'/usuarios/'+mostrarPaciente.id+'/sanitaryData/socialWork'} />
                    }
                    {
                        (session?.user?.roles.split(',').includes('auxiliar') || session?.user?.roles.split(',').includes('administrador')) &&
                            <Card color={"linear-gradient(to left, #e5c0fdaf 30%, #e5c0fd 80%)"} icon={'kitchen/Hygiene'} title={'Cocina/Higiene'} link={'/usuarios/'+mostrarPaciente.id+'/sanitaryData/kitchen-Hygiene'} />
                    }
                    <Card color={"linear-gradient(to right, #ff8a71 0%, #ffa390 100%)"} icon={'others'} title={'Otros'} link={'/usuarios/'+mostrarPaciente.id+'/sanitaryData/others'} />
                </div>
                <div className="py-4 space-y-4 mt-6">
                    <div>
                        <label htmlFor="mainIllness" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su diagnóstico principal?</label>
                        <textarea name="mainIllness" id="mainIllness" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" 
                            disabled={!modificar}
                            value={mainSanitaryData?.mainIllness}
                            onChange={(e)=>{
                                setIsFormDirty(true);
                                setMainSanitaryData({...mainSanitaryData, [e.target.name]:e.target.value})}}
                        />
                    </div>
                    <div>
                        <label htmlFor="allergies" className="block mb-2 text-sm font-medium text-gray-900">¿Tiene alguna alergia?</label>
                        <textarea name="allergies" id="allergies" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" 
                            disabled={!modificar}
                            value={mainSanitaryData?.allergies}
                            onChange={(e)=>{
                                setIsFormDirty(true);
                                setMainSanitaryData({...mainSanitaryData, [e.target.name]:e.target.value})}}
                        />
                    </div>
                    <div>
                        <label htmlFor="otherIllness" className="block mb-2 text-sm font-medium text-gray-900">¿Padece otras enfermedades o transtornos?</label>
                        <textarea name="otherIllness" id="otherIllness" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" 
                            disabled={!modificar}
                            value={mainSanitaryData?.otherIllness}
                            onChange={(e)=>{
                                setIsFormDirty(true);
                                setMainSanitaryData({...mainSanitaryData, [e.target.name]:e.target.value})}}
                        />
                    </div>
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

export default withAuth(sanitaryData, ['administrador', 'medico/enfermero', 'educador social/terapeuta ocupacional', 'trabajador social', 'auxiliar'])