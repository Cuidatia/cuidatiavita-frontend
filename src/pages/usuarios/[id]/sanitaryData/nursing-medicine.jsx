import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";

function NursingMedicine () {
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const router = useRouter()
    const {id} = router.query

    const [modificar, setModificar] = useState(false)

    const [pacienteMdicinaEnfermeria, setPacienteMdicinaEnfermeria] = useState({
        weight: '',
        height: '',
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

    useEffect(()=>{
        getPaciente()
    },[])

    const enviarDatos = async () => {
        console.log(pacienteMdicinaEnfermeria)
    }

    return(
        mostrarPaciente &&
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900">Peso</label>
                    <input type="text" name="weight" id="weight" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMdicinaEnfermeria?.weight}
                         onChange={(e)=>setPacienteMdicinaEnfermeria({...pacienteMdicinaEnfermeria, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="height" className="block mb-2 text-sm font-medium text-gray-900">Altura</label>
                    <input type="text" name="height" id="height" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMdicinaEnfermeria?.height}
                         onChange={(e)=>setPacienteMdicinaEnfermeria({...pacienteMdicinaEnfermeria, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="nutritionalSituation" className="block mb-2 text-sm font-medium text-gray-900">Situación nutricional</label>
                    <input type="text" name="nutritionalSituation" id="nutritionalSituation" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         didisabled={!modificar}
                         value={pacienteMdicinaEnfermeria?.nutritionalSituation}
                         onChange={(e)=>setPacienteMdicinaEnfermeria({...pacienteMdicinaEnfermeria, [e.target.name]:e.target.value})}sabled
                    />
                </div>
                <div>
                    <label htmlFor="sleepQuality" className="block mb-2 text-sm font-medium text-gray-900">Calidad de sueño</label>
                    <input type="text" name="sleepQuality" id="sleepQuality" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMdicinaEnfermeria?.sleepQuality}
                         onChange={(e)=>setPacienteMdicinaEnfermeria({...pacienteMdicinaEnfermeria, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="fallRisks" className="block mb-2 text-sm font-medium text-gray-900">Riesgo de caída</label>
                    <input type="text" name="fallRisks" id="fallRisks" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMdicinaEnfermeria?.fallRisks}
                         onChange={(e)=>setPacienteMdicinaEnfermeria({...pacienteMdicinaEnfermeria, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="mobilityNeeds" className="block mb-2 text-sm font-medium text-gray-900">Necesidad de movilidad</label>
                    <input type="text" name="mobilityNeeds" id="mobilityNeeds" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMdicinaEnfermeria?.mobilityNeeds}
                         onChange={(e)=>setPacienteMdicinaEnfermeria({...pacienteMdicinaEnfermeria, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="healthPreferences" className="block mb-2 text-sm font-medium text-gray-900">Preferencias sanitarias</label>
                    <input type="text" name="healthPreferences" id="healthPreferences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteMdicinaEnfermeria?.healthPreferences}
                         onChange={(e)=>setPacienteMdicinaEnfermeria({...pacienteMdicinaEnfermeria, [e.target.name]:e.target.value})}
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

export default withAuth(NursingMedicine)