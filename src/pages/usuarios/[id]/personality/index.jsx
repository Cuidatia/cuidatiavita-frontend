import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import PopUp from "@/components/popUps/popUp";
import { useSession } from "next-auth/react";

function Personality () {
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [modificar, setModificar] = useState(false)
    const [saveData, setSaveData] = useState(false)
    const router = useRouter()
    const {id} = router.query

    const [nature, setNature] = useState('')
    const [habits, setHabits] = useState('')
    const [likes, setLikes] = useState('')
    const [dislikes, setDislikes] = useState('')
    const [calmMethods, setCalmMethods] = useState('')
    const [disturbMethods, setDisturbMethods] = useState('')
    const [hobbies, setHobbies] = useState('')
    const [technologyLevel, setTechnologyLevel] = useState('')
    const [goals, setGoals] = useState('')

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

    const getPersonality = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacientePersonality?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            console.log('data', data)
            setNature(data.personality.nature)
            setHabits(data.personality.habits)
            setLikes(data.personality.likes)
            setDislikes(data.personality.dislikes)
            setCalmMethods(data.personality.calmMethods)
            setDisturbMethods(data.personality.disturbMethods)
            setHobbies(data.personality.hobby)
            setTechnologyLevel(data.personality.tecnologyLevel)
            setGoals(data.personality.goals)
        } else {
            const data = await response.json()
            console.log('data.error', data.error)
        }
    }

    useEffect(()=>{
        getPaciente()
        getPersonality()
    },[])

    const handleSave = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacientePersonality', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({
                id,
                nature,
                habits,
                likes,
                dislikes,
                calmMethods,
                disturbMethods,
                hobbies,
                technologyLevel,
                goals
            })
        })
        if (response.ok){
            const data = await response.json()
            alert(data.message)
            setModificar(false)
            setSaveData(false)
        }
    }

    return(
        mostrarPaciente &&
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)] flex flex-col">
                <div>
                    <label htmlFor="nature" className="block mb-2 text-sm font-medium text-gray-900">Carácter</label>
                    <input type="text" name="nature" id="nature" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={nature}
                         onChange={(e) => setNature(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="habits" className="block mb-2 text-sm font-medium text-gray-900">Habitos</label>
                    <input type="text" name="habits" id="habits" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={habits}
                         onChange={(e) => setHabits(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="likes" className="block mb-2 text-sm font-medium text-gray-900">Gustos</label>
                    <input type="text" name="likes" id="likes" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={likes}
                         onChange={(e) => setLikes(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="dislikes" className="block mb-2 text-sm font-medium text-gray-900">Desagrados</label>
                    <input type="text" name="dislikes" id="dislikes" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={dislikes}
                         onChange={(e) => setDislikes(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="calmMethods" className="block mb-2 text-sm font-medium text-gray-900">¿Qué le tranquiliza o calma?</label>
                    <input type="text" name="calmMethods" id="calmMethods" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={calmMethods}
                         onChange={(e) => setCalmMethods(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="disturbMethods" className="block mb-2 text-sm font-medium text-gray-900">¿Qué le incomoda o molesta?</label>
                    <input type="text" name="disturbMethods" id="disturbMethods" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={disturbMethods}
                        onChange={(e) => setDisturbMethods(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="hobbies" className="block mb-2 text-sm font-medium text-gray-900">Hobbies</label>
                    <input type="text" name="hobbies" id="hobbies" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={hobbies}
                        onChange={(e) => setHobbies(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="technologyLevel" className="block mb-2 text-sm font-medium text-gray-900">Relación con la tecnología</label>
                    <input type="text" name="technologyLevel" id="technologyLevel" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={technologyLevel}
                        onChange={(e) => setTechnologyLevel(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="goals" className="block mb-2 text-sm font-medium text-gray-900">Objetivos actuales</label>
                    <input type="text" name="goals" id="goals" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                    />
                </div>
            </div>
            <div className="my-2 border-t-1 border-gray-300">
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
            </div>
            {
                <PopUp
                    open={saveData}
                    popContent={'¿Desea guardar los cambios?'}
                    popTitle="Guardar cambios"
                    popType="option"
                    confirmFunction={handleSave}
                    cancelFunction={() => setSaveData(false)}
                />
            }
        </PacienteLayout>
    )
}

export default withAuth(Personality)