import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';

function Others () {
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const router = useRouter()
    const {id} = router.query
    
    const [modificar, setModificar] = useState(false)

    const [pacienteOtros, setPacienteOtros] = useState({
        profesionalNotes: ''
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
        console.log('pacienteOtros', pacienteOtros)
    }

    return(
        mostrarPaciente &&
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="profesionalNotes" className="block mb-2 text-sm font-medium text-gray-900">Notas adicionales</label>
                    <textarea name="profesionalNotes" id="profesionalNotes" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" 
                        disabled={!modificar}
                        value={pacienteOtros?.profesionalNotes}
                        onChange={(e)=>setPacienteOtros({...pacienteOtros, [e.target.name]: e.target.value})}
                    />
                </div>
                {/* <div>
                    <label htmlFor="photos" className="block mb-2 text-sm font-medium text-gray-900">Foto</label>
                    <input type="text" name="photos" id="photos" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled
                    />
                </div> */}
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

export default withAuth(Others)