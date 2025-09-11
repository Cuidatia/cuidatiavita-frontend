import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";
import PopUp from "@/components/popUps/popUp";
import Alerts from "@/components/alerts/alerts";

function ContactData () {
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [modificar, setModificar] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const {id} = router.query
    const {data: session, status} = useSession()

    const [pacienteDatosContacto, setPacienteDatosContacto] = useState({
        contactName: '',
        contactFirstSurname: '',
        contactSecondSurname: '',
        contactAddress: '',
        contactEmail: '',
        contactTelecom: '',
        contactTelegram: '',
        curatela: '',
        deFactoGuardian: ''
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
                'Authorization': `Bearer ${session.user.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setMostrarPaciente(data.paciente)
        }

    }

    const getPacienteDatosContacto = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteDatosContacto?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            console.log('data.contactdata', data.contactdata)
            setPacienteDatosContacto(data.contactdata)
        }
    }

    useEffect(()=>{
        if (status === 'authenticated'){    
            getPaciente()
            getPacienteDatosContacto()
        }
    },[status,session])

    const enviarDatos = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteDatosContacto', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            },
            body: JSON.stringify({
                id: id,
                contactdata: pacienteDatosContacto
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
        <PacienteLayout mostrarPaciente={mostrarPaciente} page={"14"}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="contactName" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo se llama la persona con la que se debe contactar si ocurre algo?</label>
                    <input type="text" name="contactName" id="contactName" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteDatosContacto.contactName}
                         onChange={(e)=> {
                            setIsFormDirty(true);
                            setPacienteDatosContacto({
                            ...pacienteDatosContacto,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="contactFirstSurname" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su primer apellido?</label>
                    <input type="text" name="contactFirstSurname" id="contactFirstSurname" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteDatosContacto.contactFirstSurname}
                         onChange={(e)=> {
                            setIsFormDirty(true);
                            setPacienteDatosContacto({
                            ...pacienteDatosContacto,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="contactSecondSurname" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su segundo apellido?</label>
                    <input type="text" name="contactSecondSurname" id="contactSecondSurname" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteDatosContacto.contactSecondSurname}
                         onChange={(e)=> {
                            setIsFormDirty(true);
                            setPacienteDatosContacto({
                            ...pacienteDatosContacto,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="contactAddress" className="block mb-2 text-sm font-medium text-gray-900">¿Dónde reside esa persona?</label>
                    <input type="text" name="contactAddress" id="contactAddress" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteDatosContacto.contactAddress}
                         onChange={(e)=> {
                            setIsFormDirty(true);
                            setPacienteDatosContacto({
                            ...pacienteDatosContacto,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="contactEmail" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su correo electrónico?</label>
                    <input type="email" name="contactEmail" id="contactEmail" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteDatosContacto.contactEmail}
                         onChange={(e)=> {
                            setIsFormDirty(true);
                            setPacienteDatosContacto({
                            ...pacienteDatosContacto,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="contactTelecom" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su número de teléfono?</label>
                    <input type="text" name="contactTelecom" id="contactTelecom" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteDatosContacto.contactTelecom}
                         onChange={(e)=> {
                            setIsFormDirty(true);
                            setPacienteDatosContacto({
                            ...pacienteDatosContacto,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="contactTelegram" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su número de teléfono?</label>
                    <input type="text" name="contactTelegram" id="contactTelegram" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteDatosContacto.contactTelegram}
                         onChange={(e)=> {
                            setIsFormDirty(true);
                            setPacienteDatosContacto({
                            ...pacienteDatosContacto,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="curatela" className="block mb-2 text-sm font-medium text-gray-900">¿Cuenta con curatela actualmente?</label>
                    <input type="text" name="curatela" id="curatela" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteDatosContacto.curatela}
                         onChange={(e)=> {
                            setIsFormDirty(true);
                            setPacienteDatosContacto({
                            ...pacienteDatosContacto,
                            [e.target.name]:e.target.value
                        })}}
                    />
                </div>
                <div>
                    <label htmlFor="deFactoGuardian" className="block mb-2 text-sm font-medium text-gray-900">¿Tiene alguna persona que le apoye habitualmente para tomar decisiones o cuidarla?</label>
                    <input type="text" name="deFactoGuardian" id="deFactoGuardian" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteDatosContacto.deFactoGuardian}
                         onChange={(e)=> {
                            setIsFormDirty(true);
                            setPacienteDatosContacto({
                            ...pacienteDatosContacto,
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

export default withAuth(ContactData)