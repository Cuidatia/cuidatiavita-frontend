import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";

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
        maturityTravels: "",
        maturityFavouritePlace: "",
        maturityRoutine: "",
        maturityPositiveExperiences: "",
        maturityNegativeExperiences: "",
        maturityRetirement: "",
        maturityWills: "",
        maturityProjects: "",
        maturityUncompletedProjects: "",
        maturityIllness: "",
        maturityPersonalCrisis: "",
    })

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
            console.log('data.madurez', data.madurez)
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
            alert('data', data)
        }else {
            const data = await response.json()
            alert('data.error', data.error)
            setError(data.error)
        }
    }

    return(
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="maturityGrandchildren" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo se llaman sus nietos?</label>
                    <input type="text" name="maturityGrandchildren" id="maturityGrandchildren" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityGrandchildren}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityWorkPlace" className="block mb-2 text-sm font-medium text-gray-900">¿Dónde trabajaba?</label>
                    <input type="text" name="maturityWorkPlace" id="maturityWorkPlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityWorkPlace}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityWorkRol" className="block mb-2 text-sm font-medium text-gray-900">¿Qué rol desempeñaba?</label>
                    <input type="text" name="maturityWorkRol" id="maturityWorkRol" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityWorkRol}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityFamilyCore" className="block mb-2 text-sm font-medium text-gray-900">¿Quiénes formaban su núcleo familiar?</label>
                    <input type="text" name="maturityFamilyCore" id="maturityFamilyCore" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityFamilyCore}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityFriendsGroup" className="block mb-2 text-sm font-medium text-gray-900">¿Quiénes formaban su grupo de amigos?</label>
                    <input type="text" name="maturityFriendsGroup" id="maturityFriendsGroup" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityFriendsGroup}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityWorkGroup" className="block mb-2 text-sm font-medium text-gray-900">¿Qué relaciones tenía en el entorno laboral?</label>
                    <input type="text" name="maturityWorkGroup" id="maturityWorkGroup" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityWorkGroup}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityTravels" className="block mb-2 text-sm font-medium text-gray-900">¿Dónde ha viajado?</label>
                    <input type="text" name="maturityTravels" id="maturityTravels" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityTravels}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityFavouritePlace" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál era su lugar favorito?</label>
                    <input type="text" name="maturityFavouritePlace" id="maturityFavouritePlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityFavouritePlace}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityRoutine" className="block mb-2 text-sm font-medium text-gray-900">¿Qué rutina seguía?</label>
                    <input type="text" name="maturityRoutine" id="maturityRoutine" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityRoutine}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityPositiveExperiences" className="block mb-2 text-sm font-medium text-gray-900">¿Qué experiencias positivas tuvo?</label>
                    <input type="text" name="maturityPositiveExperiences" id="maturityPositiveExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityPositiveExperiences}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityNegativeExperiences" className="block mb-2 text-sm font-medium text-gray-900">¿Qué experiencias negativas tuvo?</label>
                    <input type="text" name="maturityNegativeExperiences" id="maturityNegativeExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityNegativeExperiences}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityRetirement" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo planteó su jubilación?</label>
                    <input type="text" name="maturityRetirement" id="maturityRetirement" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityRetirement}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityWills" className="block mb-2 text-sm font-medium text-gray-900">¿Qué deseos ha planteado para su última etapa de vida?</label>
                    <input type="text" name="maturityWills" id="maturityWills" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityWills}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityProjects" className="block mb-2 text-sm font-medium text-gray-900">¿Te propusiste iniciar algún proyecto?</label>
                    <input type="text" name="maturityProjects" id="maturityProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityProjects}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityUncompletedProjects" className="block mb-2 text-sm font-medium text-gray-900">¿Te quedó alguna tarea por completar?</label>
                    <input type="text" name="maturityUncompletedProjects" id="maturityUncompletedProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityUncompletedProjects}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityIllness" className="block mb-2 text-sm font-medium text-gray-900">¿Sufrió alguna enfermedad?</label>
                    <input type="text" name="maturityIllness" id="maturityIllness" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityIllness}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
                            })}
                    />
                </div>
                <div>
                    <label htmlFor="maturityPersonalCrisis" className="block mb-2 text-sm font-medium text-gray-900">¿Sufrió alguna crisis emocional?</label>
                    <input type="text" name="maturityPersonalCrisis" id="maturityPersonalCrisis" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityPersonalCrisis}
                            onChange={(e)=> setPacienteMadurez({
                                ...pacienteMadurez,
                                [e.target.name]: e.target.value
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
                        onClick={enviarDatos}
                    >
                        Guardar
                    </button>
            }
            </div>
        </PacienteLayout>
    )
}

export default withAuth(Maturity)