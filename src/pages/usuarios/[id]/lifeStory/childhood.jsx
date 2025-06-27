import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";
import PopUp from "@/components/popUps/popUp";
import Alerts from "@/components/alerts/alerts";

function Childhood () {
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [modificar, setModificar] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const {id} = router.query
    const {data: session, status} = useSession()

    const [pacienteInfancia, setPacienteInfancia] = useState({
        childhoodStudies: "",
        childhoodSchool: "",
        childhoodMotivations: "",
        childhoodFamilyCore: "",
        childhoodFriendsGroup: "",
        childhoodTravels: "",
        childhoodFavouritePlace: "",
        childhoodPositiveExperiences: "",
        childhoodNegativeExperiences: "",
        childhoodAddress: "",
        childhoodLikes: "",
        childhoodAfraids: "",
    })

    const [saveData, setSaveData] = useState(false)


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

    const getPacienteInfancia = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteInfancia?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setPacienteInfancia(data.infancia)
        }
    }

    useEffect(()=>{
        if (status === 'authenticated'){    
            getPaciente()
            getPacienteInfancia()
        }
    },[status,session])

    const enviarDatos = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteInfancia', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            },
            body: JSON.stringify({
                id: id,
                childhood: pacienteInfancia
            })
        })

        if (response.ok){
            const data = await response.json()
            setMessage(data.message)
            setSaveData(false)
        }else {
            const data = await response.json()
            setError(data.error)
            setSaveData(false)
        }
    }

    return(
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="childhoodStudies" className="block mb-2 text-sm font-medium text-gray-900">¿Qué estudios realizó?</label>
                    <input type="text" name="childhoodStudies" id="childhoodStudies" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteInfancia.childhoodStudies}
                         onChange={(e) => setPacienteInfancia({
                            ...pacienteInfancia,
                            [e.target.name]: e.target.value
                          })}
                    />
                </div>
                <div>
                    <label htmlFor="childhoodSchool" className="block mb-2 text-sm font-medium text-gray-900">¿Dónde realizó sus estudios?</label>
                    <input type="text" name="childhoodSchool" id="childhoodSchool" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteInfancia.childhoodSchool}
                         onChange={(e) => setPacienteInfancia({
                            ...pacienteInfancia,
                            [e.target.name]:e.target.value
                        })}
                    />
                </div>
                <div>
                    <label htmlFor="childhoodMotivations" className="block mb-2 text-sm font-medium text-gray-900">¿Qué motivaciones tenía?</label>
                    <input type="textarea" name="childhoodMotivations" id="childhoodMotivations" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteInfancia.childhoodMotivations}
                         onChange={(e) => setPacienteInfancia({
                            ...pacienteInfancia,
                            [e.target.name]:e.target.value
                        })}
                    />
                </div>
                <div>
                    <label htmlFor="childhoodFamilyCore" className="block mb-2 text-sm font-medium text-gray-900">¿Qué personas formaban su núcleo familiar? ¿Cómo se llevaba con ellos?</label>
                    <input type="textarea" name="childhoodFamilyCore" id="childhoodFamilyCore" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteInfancia.childhoodFamilyCore}
                         onChange={(e) => setPacienteInfancia({
                            ...pacienteInfancia,
                            [e.target.name]:e.target.value
                        })}
                    />
                </div>
                <div>
                    <label htmlFor="childhoodFriendsGroup" className="block mb-2 text-sm font-medium text-gray-900">¿Quiénes formaban su grupo de amigos? ¿Cómo se llevaba con ellos?</label>
                    <input type="textarea" name="childhoodFriendsGroup" id="childhoodFriendsGroup" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteInfancia.childhoodFriendsGroup}
                         onChange={(e) => setPacienteInfancia({
                            ...pacienteInfancia,
                            [e.target.name]:e.target.value
                        })}
                    />
                </div>
                <div>
                    <label htmlFor="childhoodTravels" className="block mb-2 text-sm font-medium text-gray-900">¿Qué lugares pudo visitar? ¿Dónde ha viajado?</label>
                    <input type="textarea" name="childhoodTravels" id="childhoodTravels" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteInfancia.childhoodTravels}
                         onChange={(e) => setPacienteInfancia({
                            ...pacienteInfancia,
                            [e.target.name]:e.target.value
                        })}
                    />
                </div>
                <div>
                    <label htmlFor="childhoodFavouritePlace" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál era su lugar favorito?</label>
                    <input type="text" name="childhoodFavouritePlace" id="childhoodFavouritePlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                        value={pacienteInfancia.childhoodFavouritePlace}
                        onChange={(e) => setPacienteInfancia({
                            ...pacienteInfancia,
                            [e.target.name]:e.target.value
                        })}
                    />
                </div>
                <div>
                    <label htmlFor="childhoodPositiveExperiences" className="block mb-2 text-sm font-medium text-gray-900">¿Qué experiencias positivas tuvo?</label>
                    <input type="textarea" name="childhoodPositiveExperiences" id="childhoodPositiveExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                        value={pacienteInfancia.childhoodPositiveExperiences}
                        onChange={(e) => setPacienteInfancia({
                            ...pacienteInfancia,
                            [e.target.name]:e.target.value
                        })}
                    />
                </div>
                <div>
                    <label htmlFor="childhoodNegativeExperiences" className="block mb-2 text-sm font-medium text-gray-900">¿Qué experiencias negativas tuvo?</label>
                    <input type="textarea" name="childhoodNegativeExperiences" id="childhoodNegativeExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                        value={pacienteInfancia.childhoodNegativeExperiences}
                        onChange={(e) => setPacienteInfancia({
                            ...pacienteInfancia,
                            [e.target.name]:e.target.value
                        })}
                    />
                </div>
                <div>
                    <label htmlFor="childhoodAddress" className="block mb-2 text-sm font-medium text-gray-900">¿Dónde vivió? ¿Cómo era el lugar donde vivía?</label>
                    <input type="textarea" name="childhoodAddress" id="childhoodAddress" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                        value={pacienteInfancia.childhoodAddress}
                        onChange={(e) => setPacienteInfancia({
                            ...pacienteInfancia,
                            [e.target.name]:e.target.value
                        })}
                    />
                </div>
                <div>
                    <label htmlFor="childhoodLikes" className="block mb-2 text-sm font-medium text-gray-900">¿Qué gustos tenía en esta etapa de vida?</label>
                    <input type="textarea" name="childhoodLikes" id="childhoodLikes" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                        value={pacienteInfancia.childhoodLikes}
                        onChange={(e) => setPacienteInfancia({
                            ...pacienteInfancia,
                            [e.target.name]:e.target.value
                        })}
                    />
                </div>
                <div>
                    <label htmlFor="childhoodAfraids" className="block mb-2 text-sm font-medium text-gray-900">¿Qué le daba miedo o provocaba temor?</label>
                    <input type="textarea" name="childhoodAfraids" id="childhoodAfraids" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                        value={pacienteInfancia.childhoodAfraids}
                        onChange={(e) => setPacienteInfancia({
                            ...pacienteInfancia,
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

export default withAuth(Childhood)