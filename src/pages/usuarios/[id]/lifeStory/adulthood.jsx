import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';

function Adulthood () {
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const router = useRouter()
    const {id} = router.query

    const getPaciente = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getPaciente?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
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

    return(
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-220px)]">
                <div>
                    <label htmlFor="adulthoodSentimentalCouple" className="block mb-2 text-sm font-medium text-gray-900">Pareja sentimental</label>
                    <input type="text" name="adulthoodSentimentalCouple" id="adulthoodSentimentalCouple" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodCildren" className="block mb-2 text-sm font-medium text-gray-900">Hijos</label>
                    <input type="text" name="adulthoodCildren" id="adulthoodCildren" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodStudies" className="block mb-2 text-sm font-medium text-gray-900">Estudios</label>
                    <input type="text" name="adulthoodStudies" id="adulthoodStudies" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodWorkplace" className="block mb-2 text-sm font-medium text-gray-900">Lugar de trabajo</label>
                    <input type="text" name="adulthoodWorkplace" id="adulthoodWorkplace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodWorkrol" className="block mb-2 text-sm font-medium text-gray-900">Rol en el trabajo</label>
                    <input type="text" name="adulthoodWorkrol" id="adulthoodWorkrol" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="familyCore" className="block mb-2 text-sm font-medium text-gray-900">Familia</label>
                    <input type="text" name="familyCore" id="familyCore" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="friendsGroup" className="block mb-2 text-sm font-medium text-gray-900">Amistades</label>
                    <input type="text" name="friendsGroup" id="friendsGroup" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="WorkGroup" className="block mb-2 text-sm font-medium text-gray-900">Grupo de trabajo</label>
                    <input type="text" name="WorkGroup" id="WorkGroup" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodTravels" className="block mb-2 text-sm font-medium text-gray-900">Viajes</label>
                    <input type="text" name="adulthoodTravels" id="adulthoodTravels" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="favouritePlace" className="block mb-2 text-sm font-medium text-gray-900">Lugar favorito durante la adultez</label>
                    <input type="text" name="favouritePlace" id="favouritePlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodRoutine" className="block mb-2 text-sm font-medium text-gray-900">Rutina</label>
                    <input type="text" name="adulthoodRoutine" id="adulthoodRoutine" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodPositiveExperiences" className="block mb-2 text-sm font-medium text-gray-900">Experiencias positivas durante la adultez</label>
                    <input type="text" name="adulthoodPositiveExperiences" id="adulthoodPositiveExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodNegativeExperiences" className="block mb-2 text-sm font-medium text-gray-900">Experiencias negativas durante la adultez</label>
                    <input type="text" name="adulthoodNegativeExperiences" id="adulthoodNegativeExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodAddress" className="block mb-2 text-sm font-medium text-gray-900">Direccion</label>
                    <input type="text" name="adulthoodAddress" id="adulthoodAddress" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodRelocated" className="block mb-2 text-sm font-medium text-gray-900">Traslado a una nueva vivienda</label>
                    <input type="text" name="adulthoodRelocated" id="adulthoodRelocated" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodEconomicSituation" className="block mb-2 text-sm font-medium text-gray-900">Situación económmica</label>
                    <input type="text" name="adulthoodEconomicSituation" id="adulthoodEconomicSituation" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodProjects" className="block mb-2 text-sm font-medium text-gray-900">Proyectos en la adultez</label>
                    <input type="text" name="adulthoodProjects" id="adulthoodProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodUncompleteProjects" className="block mb-2 text-sm font-medium text-gray-900">Proyectos por completar en la adultez</label>
                    <input type="text" name="adulthoodUncompleteProjects" id="adulthoodUncompleteProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodIllness" className="block mb-2 text-sm font-medium text-gray-900">Enfermedades en la adultez</label>
                    <input type="text" name="adulthoodIllness" id="adulthoodIllness" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="adulthoodPersonalCrysis" className="block mb-2 text-sm font-medium text-gray-900">Crisis personal</label>
                    <input type="text" name="adulthoodPersonalCrysis" id="adulthoodPersonalCrysis" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <button className="cursor-pointer mx-2 bg-zinc-100 hover:text-white border-1 border-zinc-200 hover:bg-blue-500 rounded-lg text-sm px-3 py-2 text-center"
                        
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </PacienteLayout>
    )
}

export default withAuth(Adulthood)