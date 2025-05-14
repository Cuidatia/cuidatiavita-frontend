import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";

function SocialWork () {
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const router = useRouter()
    const {id} = router.query

    const [modificar, setModificar] = useState(false)

    const [pacienteTrabajoSocial, setPacienteTrabajoSocial] = useState({
        residentAndRelationship: '',
        petNameAndBreedPet: '',
        collaborationLevel: '',
        autonomyLevel: '',
        groupParticipation: '',
        resources: '',
        legalSupport: ''
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
        console.log('pacienteTrabajoSocial', pacienteTrabajoSocial)
    }


    return(
        mostrarPaciente &&
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="residentAndRelationship" className="block mb-2 text-sm font-medium text-gray-900">Residente/Relación</label>
                    <input type="text" name="residentAndRelationship" id="residentAndRelationship" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTrabajoSocial?.residentAndRelationship}
                         onChange={(e)=>setPacienteTrabajoSocial({...pacienteTrabajoSocial, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="petNameAndBreedPet" className="block mb-2 text-sm font-medium text-gray-900">Tipo y Nombre de mascota</label>
                    <input type="text" name="petNameAndBreedPet" id="petNameAndBreedPet" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTrabajoSocial?.petNameAndBreedPet}
                         onChange={(e)=>setPacienteTrabajoSocial({...pacienteTrabajoSocial, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="collaborationLevel" className="block mb-2 text-sm font-medium text-gray-900">Nivel de colaboración en casa</label>
                    <input type="text" name="collaborationLevel" id="collaborationLevel" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTrabajoSocial?.collaborationLevel}
                         onChange={(e)=>setPacienteTrabajoSocial({...pacienteTrabajoSocial, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="autonomyLevel" className="block mb-2 text-sm font-medium text-gray-900">Grado de autonomía</label>
                    <input type="text" name="autonomyLevel" id="autonomyLevel" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTrabajoSocial?.autonomyLevel}
                         onChange={(e)=>setPacienteTrabajoSocial({...pacienteTrabajoSocial, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="groupParticipation" className="block mb-2 text-sm font-medium text-gray-900">Participación en grupo</label>
                    <input type="text" name="groupParticipation" id="groupParticipation" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTrabajoSocial?.groupParticipation}
                         onChange={(e)=>setPacienteTrabajoSocial({...pacienteTrabajoSocial, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="resources" className="block mb-2 text-sm font-medium text-gray-900">Resursos y prestaciones</label>
                    <input type="text" name="resources" id="resources" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTrabajoSocial?.resources}
                         onChange={(e)=>setPacienteTrabajoSocial({...pacienteTrabajoSocial, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="legalSupport" className="block mb-2 text-sm font-medium text-gray-900">Apoyos legales</label>
                    <input type="text" name="legalSupport" id="legalSupport" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteTrabajoSocial?.legalSupport}
                         onChange={(e)=>setPacienteTrabajoSocial({...pacienteTrabajoSocial, [e.target.name]:e.target.value})}
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

export default withAuth(SocialWork)