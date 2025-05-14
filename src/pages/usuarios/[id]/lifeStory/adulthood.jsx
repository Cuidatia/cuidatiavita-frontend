import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";

function Adulthood () {
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const router = useRouter()
    const {id} = router.query

    const [pacienteAdultez, setPacienteAdultez] = useState({
        adulthoodSentimentalCouple: '',
        adulthoodChildren: '',
        adulthoodStudy: '',
        adulthoodWorkPlace: '',
        adulthoodWorkRol: '',
        adulthoodFamilyCore: '',
        adulthoodFriendsGroup: '',
        adulhoodWorkGroup: '',
        adulthoodTravels: '',
        adulthoodFavouritePlace: '',
        adulthoodRoutine: '',
        adulthoodPositiveExperiences: '',
        adulthoodNegativeExperiences: '',
        adulthoodAddress: '',
        adulthoodRelocated: '',
        adulthoodEconomicSituation: '',
        adulthoodProjects: '',
        adulthoodUncompleteProjects: '',
        adulthoodIllness: '',
        adulthoodPersonalCrysis: ''
    })

    const [modificar, setModificar] = useState(false)

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

    const enviarDatos = async () =>{
        console.log('pacienteAdultez', pacienteAdultez)
    }

    return(
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="adulthoodSentimentalCouple" className="block mb-2 text-sm font-medium text-gray-900">Pareja sentimental</label>
                    <input type="text" name="adulthoodSentimentalCouple" id="adulthoodSentimentalCouple" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodSentimentalCouple}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodChildren" className="block mb-2 text-sm font-medium text-gray-900">Hijos</label>
                    <input type="text" name="adulthoodChildren" id="adulthoodChildren" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodChildren}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodStudy" className="block mb-2 text-sm font-medium text-gray-900">Estudios</label>
                    <input type="text" name="adulthoodStudy" id="adulthoodStudy" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodStudies}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodWorkPlace" className="block mb-2 text-sm font-medium text-gray-900">Lugar de trabajo</label>
                    <input type="text" name="adulthoodWorkPlace" id="adulthoodWorkPlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodWorkplace}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodWorkRol" className="block mb-2 text-sm font-medium text-gray-900">Rol en el trabajo</label>
                    <input type="text" name="adulthoodWorkRol" id="adulthoodWorkRol" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodWorkrol}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodFamilyCore" className="block mb-2 text-sm font-medium text-gray-900">Familia</label>
                    <input type="text" name="adulthoodFamilyCore" id="adulthoodFamilyCore" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodFamilyCore}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodFriendsGroup" className="block mb-2 text-sm font-medium text-gray-900">Amistades</label>
                    <input type="text" name="adulthoodFriendsGroup" id="adulthoodFriendsGroup" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodFriendsGroup}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulhoodWorkGroup" className="block mb-2 text-sm font-medium text-gray-900">Grupo de trabajo</label>
                    <input type="text" name="adulhoodWorkGroup" id="adulhoodWorkGroup" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulhoodWorkGroup}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodTravels" className="block mb-2 text-sm font-medium text-gray-900">Viajes</label>
                    <input type="text" name="adulthoodTravels" id="adulthoodTravels" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodTravels}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodFavouritePlace" className="block mb-2 text-sm font-medium text-gray-900">Lugar favorito durante la adultez</label>
                    <input type="text" name="adulthoodFavouritePlace" id="adulthoodFavouritePlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodFavouritePlace}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodRoutine" className="block mb-2 text-sm font-medium text-gray-900">Rutina</label>
                    <input type="text" name="adulthoodRoutine" id="adulthoodRoutine" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodRoutine}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodPositiveExperiences" className="block mb-2 text-sm font-medium text-gray-900">Experiencias positivas durante la adultez</label>
                    <input type="text" name="adulthoodPositiveExperiences" id="adulthoodPositiveExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodPositiveExperiences}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodNegativeExperiences" className="block mb-2 text-sm font-medium text-gray-900">Experiencias negativas durante la adultez</label>
                    <input type="text" name="adulthoodNegativeExperiences" id="adulthoodNegativeExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodNegativeExperiences}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodAddress" className="block mb-2 text-sm font-medium text-gray-900">Direccion</label>
                    <input type="text" name="adulthoodAddress" id="adulthoodAddress" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodAddress}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodRelocated" className="block mb-2 text-sm font-medium text-gray-900">Traslado a una nueva vivienda</label>
                    <input type="text" name="adulthoodRelocated" id="adulthoodRelocated" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodRelocated}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodEconomicSituation" className="block mb-2 text-sm font-medium text-gray-900">Situación económmica</label>
                    <input type="text" name="adulthoodEconomicSituation" id="adulthoodEconomicSituation" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodEconomicSituation}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodProjects" className="block mb-2 text-sm font-medium text-gray-900">Proyectos en la adultez</label>
                    <input type="text" name="adulthoodProjects" id="adulthoodProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodProjects}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodUncompleteProjects" className="block mb-2 text-sm font-medium text-gray-900">Proyectos por completar en la adultez</label>
                    <input type="text" name="adulthoodUncompleteProjects" id="adulthoodUncompleteProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodUncompleteProjects}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodIllness" className="block mb-2 text-sm font-medium text-gray-900">Enfermedades en la adultez</label>
                    <input type="text" name="adulthoodIllness" id="adulthoodIllness" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodIllness}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodPersonalCrysis" className="block mb-2 text-sm font-medium text-gray-900">Crisis personal</label>
                    <input type="text" name="adulthoodPersonalCrysis" id="adulthoodPersonalCrysis" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteAdultez?.adulthoodPersonalCrysis}
                            onChange={(e) => setPacienteAdultez({...pacienteAdultez, [e.target.name]:e.target.value})}
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

export default withAuth(Adulthood)