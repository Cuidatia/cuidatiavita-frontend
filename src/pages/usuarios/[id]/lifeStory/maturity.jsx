import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';

function Maturity () {
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const router = useRouter()
    const {id} = router.query

    const [modificar, setModificar] = useState(false)

    const [pacienteMadurez, setPacienteMadurez] = useState({
        maturityGrandChildren: '',
        maturityWorkPlace: '',
        maturityWorkRol: '',
        maturityFamilyCore: '',
        maturityFriendsGroup: '',
        maturityWorkGroup: '',
        maturityTravels: '',
        maturityFavouritePlace: '',
        maturityRoutine: '',
        maturityPositiveExperiences: '',
        maturityNegativeExperiences: '',
        maturityRetirement: '',
        maturityWills: '',
        maturityProjects: '',
        maturityUncompleteProjects: '',
        maturityIllness: '',
        maturityPersonalCrysis: ''
    })

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

    const enviarDatos = async () => {
        console.log('pacienteMadurez', pacienteMadurez)
    }

    return(
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="maturityGrandChildren" className="block mb-2 text-sm font-medium text-gray-900">Nietos</label>
                    <input type="text" name="maturityGrandChildren" id="maturityGrandChildren" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityGrandChildren}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityWorkPlace" className="block mb-2 text-sm font-medium text-gray-900">Lugar de trabajo</label>
                    <input type="text" name="maturityWorkPlace" id="maturityWorkPlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityWorkPlace}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityWorkRol" className="block mb-2 text-sm font-medium text-gray-900">Rol en el trabajo</label>
                    <input type="text" name="maturityWorkRol" id="maturityWorkRol" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityWorkRol}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityFamilyCore" className="block mb-2 text-sm font-medium text-gray-900">Familia</label>
                    <input type="text" name="maturityFamilyCore" id="maturityFamilyCore" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityFamilyCore}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityFriendsGroup" className="block mb-2 text-sm font-medium text-gray-900">Amistades</label>
                    <input type="text" name="maturityFriendsGroup" id="maturityFriendsGroup" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityFriendsGroup}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityWorkGroup" className="block mb-2 text-sm font-medium text-gray-900">Grupo de trabajo</label>
                    <input type="text" name="maturityWorkGroup" id="maturityWorkGroup" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityWorkGroup}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityTravels" className="block mb-2 text-sm font-medium text-gray-900">Viajes</label>
                    <input type="text" name="maturityTravels" id="maturityTravels" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityTravels}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityFavouritePlace" className="block mb-2 text-sm font-medium text-gray-900">Lugar favorito durante la madurez</label>
                    <input type="text" name="maturityFavouritePlace" id="maturityFavouritePlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityFavouritePlace}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityRoutine" className="block mb-2 text-sm font-medium text-gray-900">Rutina</label>
                    <input type="text" name="maturityRoutine" id="maturityRoutine" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityRoutine}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityPositiveExperiences" className="block mb-2 text-sm font-medium text-gray-900">Experiencias positivas durante la madurez</label>
                    <input type="text" name="maturityPositiveExperiences" id="maturityPositiveExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityPositiveExperiences}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityNegativeExperiences" className="block mb-2 text-sm font-medium text-gray-900">Experiencias negativas durante la madurez</label>
                    <input type="text" name="maturityNegativeExperiences" id="maturityNegativeExperiences" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityNegativeExperiences}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityRetirement" className="block mb-2 text-sm font-medium text-gray-900">Jubilacion</label>
                    <input type="text" name="maturityRetirement" id="maturityRetirement" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityRetirement}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityWills" className="block mb-2 text-sm font-medium text-gray-900">Deseo para la última etapa de la vida</label>
                    <input type="text" name="maturityWills" id="maturityWills" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityWills}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityProjects" className="block mb-2 text-sm font-medium text-gray-900">Proyectos en la madurez</label>
                    <input type="text" name="maturityProjects" id="maturityProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityProjects}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityUncompleteProjects" className="block mb-2 text-sm font-medium text-gray-900">Proyectos por completar en la madurez</label>
                    <input type="text" name="maturityUncompleteProjects" id="maturityUncompleteProjects" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityUncompleteProjects}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityIllness" className="block mb-2 text-sm font-medium text-gray-900">Enfermedades en la madurez</label>
                    <input type="text" name="maturityIllness" id="maturityIllness" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityIllness}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="maturityPersonalCrysis" className="block mb-2 text-sm font-medium text-gray-900">Crisis personal</label>
                    <input type="text" name="maturityPersonalCrysis" id="maturityPersonalCrysis" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            disabled={!modificar}
                            value={pacienteMadurez?.maturityPersonalCrysis}
                            onChange={(e)=>{setPacienteMadurez({...pacienteMadurez, [e.target.name]: e.target.value})}}
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