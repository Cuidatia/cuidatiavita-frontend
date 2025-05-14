import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";

function Youth () {
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const router = useRouter()
    const {id} = router.query

    const [modificar, setModificar] = useState(false)

    const [pacienteJuventud, setPacienteJuventud] = useState({
        youthStudies: '',
        youthSchool: '',
        youthWorkPlace: '',
        youthWorkRol: '',
        youthMotivations: '',
        youthFamilyCore: '',
        youthFriendsGroup: '',
        youthTravels: '',
        youthFavouritePlace: '',
        youthRoutine: '',
        youthPositiveExperiences: '',
        youthNegativeExperiences: '',
        youthAddress: '',
        youthLikes: '',
        youthHobbies: '',
        youthAfraids: '',
        youthProjects: '',
        youthUncompleteProjects: '',
        youthIllness: '',
        youthPersonalCrysis: ''
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

    useEffect(()=>{
        getPaciente()
    },[])

    const enviarDatos = async () => {
        console.log('pacienteJuventud', pacienteJuventud)
    }

    return(
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="youthStudies" className="block mb-2 text-sm font-medium text-gray-900">Estudios</label>
                    <input type="text" name="youthStudies" id="youthStudies" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthStudies}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthSchool" className="block mb-2 text-sm font-medium text-gray-900">Escuela a la que asistió</label>
                    <input type="text" name="youthSchool" id="youthSchool" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthSchool}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthWorkPlace" className="block mb-2 text-sm font-medium text-gray-900">Lugar de trabajo</label>
                    <input type="text" name="youthWorkPlace" id="youthWorkPlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthWorkPlace}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthWorkRol" className="block mb-2 text-sm font-medium text-gray-900">Rol en el trabajo</label>
                    <input type="text" name="youthWorkRol" id="youthWorkRol" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthWorkRol}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthMotivations" className="block mb-2 text-sm font-medium text-gray-900">Motivaciones en la juventud</label>
                    <input type="text" name="youthMotivations" id="youthMotivations" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthMotivations}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthFamilyCore" className="block mb-2 text-sm font-medium text-gray-900">Familia</label>
                    <input type="text" name="youthFamilyCore" id="youthFamilyCore" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthFamilyCore}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthFriendsGroup" className="block mb-2 text-sm font-medium text-gray-900">Amistades</label>
                    <input type="text" name="youthFriendsGroup" id="youthFriendsGroup" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthFriendsGroup}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthTravels" className="block mb-2 text-sm font-medium text-gray-900">Viajes</label>
                    <input type="text" name="youthTravels" id="youthTravels" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthTravels}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthFavouritePlace" className="block mb-2 text-sm font-medium text-gray-900">Lugar favorito durante la juventud</label>
                    <input type="text" name="youthFavouritePlace" id="youthFavouritePlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthFavouritePlace}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthRoutine" className="block mb-2 text-sm font-medium text-gray-900">Rutina</label>
                    <input type="text" name="youthRoutine" id="youthRoutine" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthRoutine}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthPositiveExperiences" className="block mb-2 text-sm font-medium text-gray-900">Experiencias positivas durante la juventud</label>
                    <input type="text" name="youthPositiveExperiences" id="youthPositiveExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthPositiveExperiences}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthNegativeExperiences" className="block mb-2 text-sm font-medium text-gray-900">Experiencias negativas durante la juventud</label>
                    <input type="text" name="youthNegativeExperiences" id="youthNegativeExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthNegativeExperiences}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthAddress" className="block mb-2 text-sm font-medium text-gray-900">Direccion</label>
                    <input type="text" name="youthAddress" id="youthAddress" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthAddress}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthLikes" className="block mb-2 text-sm font-medium text-gray-900">Gustos en la juventud</label>
                    <input type="text" name="youthLikes" id="youthLikes" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthLikes}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthHobbies" className="block mb-2 text-sm font-medium text-gray-900">Hobbies en la juventud</label>
                    <input type="text" name="youthHobbies" id="youthHobbies" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthHobbies}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthAfraids" className="block mb-2 text-sm font-medium text-gray-900">Temores en la juventud</label>
                    <input type="text" name="youthAfraids" id="youthAfraids" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthAfraids}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthProjects" className="block mb-2 text-sm font-medium text-gray-900">Proyectos en la juventud</label>
                    <input type="text" name="youthProjects" id="youthProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthProjects}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthUncompleteProjects" className="block mb-2 text-sm font-medium text-gray-900">Proyectos por completar en la juventud</label>
                    <input type="text" name="youthUncompleteProjects" id="youthUncompleteProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthUncompleteProjects}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthIllness" className="block mb-2 text-sm font-medium text-gray-900">Enfermedades en la juventud</label>
                    <input type="text" name="youthIllness" id="youthIllness" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthIllness}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="youthPersonalCrysis" className="block mb-2 text-sm font-medium text-gray-900">Crisis personal</label>
                    <input type="text" name="youthPersonalCrysis" id="youthPersonalCrysis" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteJuventud?.youthPersonalCrysis}
                            onChange={(e)=>{setPacienteJuventud({...pacienteJuventud,[e.target.name]: e.target.value})}}
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

export default withAuth(Youth)