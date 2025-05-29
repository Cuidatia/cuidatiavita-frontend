import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";
import PopUp from "@/components/popUps/popUp";
import Alerts from "@/components/alerts/alerts";

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
            alert(data.message)
            setMessage(data.message)
            setModificar(false)
            setSaveData(false)
        }else {
            const data = await response.json()
            alert(data.error)
            setError(data.error)
        }
    }

    return(
        mostrarPaciente &&
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="nutritionalSituation" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo describiría su situación nutricional?</label>
                    <input type="text" name="nutritionalSituation" id="nutritionalSituation" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMedicinaEnfermeria?.nutritionalSituation}
                         onChange={(e)=>setPacienteMedicinaEnfermeria({...pacienteMedicinaEnfermeria, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="sleepQuality" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo califica su calidad de sueño actual?</label>
                    <input type="text" name="sleepQuality" id="sleepQuality" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMedicinaEnfermeria?.sleepQuality}
                         onChange={(e)=>setPacienteMedicinaEnfermeria({...pacienteMedicinaEnfermeria, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="fallRisks" className="block mb-2 text-sm font-medium text-gray-900">¿Existe algún riesgo de caída?</label>
                    <input type="text" name="fallRisks" id="fallRisks" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMedicinaEnfermeria?.fallRisks}
                         onChange={(e)=>setPacienteMedicinaEnfermeria({...pacienteMedicinaEnfermeria, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="mobilityNeeds" className="block mb-2 text-sm font-medium text-gray-900">¿Tiene necesidades especiales de movilidad?</label>
                    <input type="text" name="mobilityNeeds" id="mobilityNeeds" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMedicinaEnfermeria?.mobilityNeeds}
                         onChange={(e)=>setPacienteMedicinaEnfermeria({...pacienteMedicinaEnfermeria, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="healthPreferences" className="block mb-2 text-sm font-medium text-gray-900">¿Tiene preferencias sanitarias?</label>
                    <input type="text" name="healthPreferences" id="healthPreferences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMedicinaEnfermeria?.healthPreferences}
                         onChange={(e)=>setPacienteMedicinaEnfermeria({...pacienteMedicinaEnfermeria, [e.target.name]:e.target.value})}
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