import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';

function Maturity () {
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
                    <label htmlFor="maturityGrandcildren" className="block mb-2 text-sm font-medium text-gray-900">Nietos</label>
                    <input type="text" name="maturityCildren" id="maturityCildren" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="maturityWorkplace" className="block mb-2 text-sm font-medium text-gray-900">Lugar de trabajo</label>
                    <input type="text" name="maturityWorkplace" id="maturityWorkplace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="maturityWorkrol" className="block mb-2 text-sm font-medium text-gray-900">Rol en el trabajo</label>
                    <input type="text" name="maturityWorkrol" id="maturityWorkrol" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
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
                    <label htmlFor="maturityTravels" className="block mb-2 text-sm font-medium text-gray-900">Viajes</label>
                    <input type="text" name="maturityTravels" id="maturityTravels" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="favouritePlace" className="block mb-2 text-sm font-medium text-gray-900">Lugar favorito durante la madurez</label>
                    <input type="text" name="favouritePlace" id="favouritePlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="maturityRoutine" className="block mb-2 text-sm font-medium text-gray-900">Rutina</label>
                    <input type="text" name="maturityRoutine" id="maturityRoutine" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="maturityPositiveExperiences" className="block mb-2 text-sm font-medium text-gray-900">Experiencias positivas durante la madurez</label>
                    <input type="text" name="maturityPositiveExperiences" id="maturityPositiveExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="maturityNegativeExperiences" className="block mb-2 text-sm font-medium text-gray-900">Experiencias negativas durante la madurez</label>
                    <input type="text" name="maturityNegativeExperiences" id="maturityNegativeExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="maturityRetirement" className="block mb-2 text-sm font-medium text-gray-900">Jubilacion</label>
                    <input type="text" name="maturityRetirement" id="maturityRetirement" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="maturityWills" className="block mb-2 text-sm font-medium text-gray-900">Deseo para la última etapa de la vida</label>
                    <input type="text" name="maturityWills" id="maturityWills" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="maturityProjects" className="block mb-2 text-sm font-medium text-gray-900">Proyectos en la madurez</label>
                    <input type="text" name="maturityProjects" id="maturityProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="maturityUncompleteProjects" className="block mb-2 text-sm font-medium text-gray-900">Proyectos por completar en la madurez</label>
                    <input type="text" name="maturityUncompleteProjects" id="maturityUncompleteProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="maturityIllness" className="block mb-2 text-sm font-medium text-gray-900">Enfermedades en la madurez</label>
                    <input type="text" name="maturityIllness" id="maturityIllness" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled
                    />
                </div>
                <div>
                    <label htmlFor="maturityPersonalCrysis" className="block mb-2 text-sm font-medium text-gray-900">Crisis personal</label>
                    <input type="text" name="maturityPersonalCrysis" id="maturityPersonalCrysis" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
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

export default withAuth(Maturity)