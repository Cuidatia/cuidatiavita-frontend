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
            console.log('data.socialedu', data.socialedu)
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
                    <label htmlFor="cognitiveAbilities" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo describiría su capacidad cognitiva?</label>
                    <input type="text" name="cognitiveAbilities" id="cognitiveAbilities" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.cognitiveAbilities}
                         onChange={(e)=>setPacienteTOES({...pacienteTOES, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="affectiveCapacity" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo maneja sus emociones y afectos?</label>
                    <input type="text" name="affectiveCapacity" id="affectiveCapacity" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.affectiveCapacity}
                         onChange={(e)=>setPacienteTOES({...pacienteTOES, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="behaviorCapacity" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo suele comportarse frente a normas o límites?</label>
                    <input type="text" name="behaviorCapacity" id="behaviorCapacity" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.behaviorCapacity}
                         onChange={(e)=>setPacienteTOES({...pacienteTOES, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="collaborationLevel" className="block mb-2 text-sm font-medium text-gray-900">¿Suele participar en actividades del hogar?</label>
                    <input type="text" name="collaborationLevel" id="collaborationLevel" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.collaborationLevel}
                         onChange={(e)=>setPacienteTOES({
                            ...pacienteTOES,
                            [e.target.name]:e.target.value
                        })}
                    />
                </div>
                <div>
                    <label htmlFor="autonomyLevel" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su grado de autonnomía?</label>
                    <input type="text" name="autonomyLevel" id="autonomyLevel" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.autonomyLevel}
                         onChange={(e)=>setPacienteTOES({
                            ...pacienteTOES,
                            [e.target.name]:e.target.value
                        })}
                    />
                </div>
                <div>
                    <label htmlFor="groupParticipation" className="block mb-2 text-sm font-medium text-gray-900">¿Cuánto participa en actividades de grupo?</label>
                    <input type="text" name="groupParticipation" id="groupParticipation" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.groupParticipation}
                         onChange={(e)=>setPacienteTOES({
                            ...pacienteTOES,
                            [e.target.name]:e.target.value
                        })}
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