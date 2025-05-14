import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";

function SocialEducationOccupationalTherapy () {
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const router = useRouter()
    const {id} = router.query

    const [modificar, setModificar] = useState(false)

    const [pacienteTOES, setPacienteTOES] = useState({
        cognitiveAbility: '',
        affectiveCapacity: '',
        nutritionalSituation: '',
        behaviourCapacity: ''
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

    useEffect(()=>{
        getPaciente()
    },[])

    const enviarDatos = async () => {
        console.log('pacienteTOES', pacienteTOES)
    }

    return(
        mostrarPaciente &&
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="cognitiveAbility" className="block mb-2 text-sm font-medium text-gray-900">Capacidad cognitiva</label>
                    <input type="text" name="cognitiveAbility" id="cognitiveAbility" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.cognitiveAbility}
                         onChange={(e)=>setPacienteTOES({...pacienteTOES, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="affectiveCapacity" className="block mb-2 text-sm font-medium text-gray-900">Capacidad afectiva</label>
                    <input type="text" name="affectiveCapacity" id="affectiveCapacity" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.affectiveCapacity}
                         onChange={(e)=>setPacienteTOES({...pacienteTOES, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="behaviourCapacity" className="block mb-2 text-sm font-medium text-gray-900">Capacidad conductual</label>
                    <input type="text" name="behaviourCapacity" id="behaviourCapacity" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTOES?.behaviourCapacity}
                         onChange={(e)=>setPacienteTOES({...pacienteTOES, [e.target.name]:e.target.value})}
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
                        onClick={enviarDatos}
                    >
                        Guardar
                    </button>
            }
            </div>
        </PacienteLayout>
    )
}

export default withAuth(SocialEducationOccupationalTherapy)