import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';

function KitchenHygiene () {
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const router = useRouter()
    const {id} = router.query
    
    const [modificar, setModificar] = useState(false)

    const [pacienteCocinaHigiene, setPacienteCocinaHigiene] = useState({
        favouriteFood: '',
        dietaryRestrictions: '',
        confortAdvices: '',
        routine: '',
        carePlan: ''
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
        console.log('pacienteCocinaHigiene', pacienteCocinaHigiene)
    }

    return(
        mostrarPaciente &&
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="favouriteFood" className="block mb-2 text-sm font-medium text-gray-900">Comida favorita</label>
                    <input type="text" name="favouriteFood" id="favouriteFood" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteCocinaHigiene?.favouriteFood}
                         onChange={(e)=>setPacienteCocinaHigiene({...pacienteCocinaHigiene, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="dietaryRestrictions" className="block mb-2 text-sm font-medium text-gray-900">Restricciones alimentarias</label>
                    <input type="text" name="dietaryRestrictions" id="dietaryRestrictions" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteCocinaHigiene?.dietaryRestrictions}
                         onChange={(e)=>setPacienteCocinaHigiene({...pacienteCocinaHigiene, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="confortAdvices" className="block mb-2 text-sm font-medium text-gray-900">Confort y seguridad</label>
                    <input type="text" name="confortAdvices" id="confortAdvices" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteCocinaHigiene?.confortAdvices}
                         onChange={(e)=>setPacienteCocinaHigiene({...pacienteCocinaHigiene, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="routine" className="block mb-2 text-sm font-medium text-gray-900">Rutina diaria</label>
                    <input type="text" name="routine" id="routine" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteCocinaHigiene?.routine}
                         onChange={(e)=>setPacienteCocinaHigiene({...pacienteCocinaHigiene, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="carePlan" className="block mb-2 text-sm font-medium text-gray-900">Plan de cuidados</label>
                    <input type="text" name="carePlan" id="carePlan" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteCocinaHigiene?.carePlan}
                         onChange={(e)=>setPacienteCocinaHigiene({...pacienteCocinaHigiene, [e.target.name]:e.target.value})}
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

export default withAuth(KitchenHygiene)