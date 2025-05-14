import Alerts from "@/components/alerts/alerts"
import Link from "next/link"
import Card from "@/components/cards/card"
import withAuth from "@/components/withAuth"
import PacienteLayout from "../layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

function sanitaryData () {
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const router = useRouter()
    const {id} = router.query

    const [modificar, setModificar] = useState(false)

    const [mainSanitaryData, setMainSanitaryData] = useState({
        mainIllness: '',
        allergies: '',
        otherIllness: ''
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
        if (status === 'authenticated' && session?.user?.idOrganizacion) {  
            getPaciente()
        }
    },[session, status])

    const enviarDatos = async () =>{
        console.log('mainSanitaryData', mainSanitaryData)
    }

    return(
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 px-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div className="grid grid-cols-2 gap-4">
                    {
                        (session?.user?.roles === 'auxiliar' || session?.user?.roles === 'admin') &&
                            <Card color={"linear-gradient(to left, #fff3a4 0%, #fee64f 100%)"} icon={'pharmacy'} title={'Farmacia'} link={'/usuarios/'+mostrarPaciente.id+'/sanitaryData/pharmacy'} />
                    }
                    {
                        (session?.user?.roles === 'medico' || session?.user?.roles === 'enfermero' || session?.user?.roles === 'admin') &&
                            <Card color={"linear-gradient(to right, #70dcff 0%, #a4e9ff 100%)"} icon={'nursig/medicine'} title={'Medicina/Enfermería'} link={'/usuarios/'+mostrarPaciente.id+'/sanitaryData/nursing-medicine'} />
                    }
                    {
                        (session?.user?.roles === 'terapeuta' || session?.user?.roles === 'admin') &&
                            <Card color={"linear-gradient(to left, #ffd495 0%, #ffbf62 100%)"} icon={'socialEducation/occupationalTherapy'} title={'Educacion social/Terapia ocupacional'} link={'/usuarios/'+mostrarPaciente.id+'/sanitaryData/socialEducation-OccupationalTherapy'} />
                    }
                    {
                        (session?.user?.roles === 'trabajador social' || session?.user?.roles === 'admin') &&
                            <Card color={"linear-gradient(to left, #c6ffb2 30%, #acff8f 80%)"} icon={'socialWork'} title={'Trabajo social'} link={'/usuarios/'+mostrarPaciente.id+'/sanitaryData/socialWork'} />
                    }
                    {
                        (session?.user?.roles === 'auxiliar' || session?.user?.roles === 'admin') &&
                            <Card color={"linear-gradient(to left, #e5c0fdaf 30%, #e5c0fd 80%)"} icon={'kitchen/Hygiene'} title={'Cocina/Higiene'} link={'/usuarios/'+mostrarPaciente.id+'/sanitaryData/kitchen-Hygiene'} />
                    }
                    <Card color={"linear-gradient(to right, #ff8a71 0%, #ffa390 100%)"} icon={'others'} title={'Otros'} link={'/usuarios/'+mostrarPaciente.id+'/sanitaryData/others'} />
                </div>
                <div className="py-4 space-y-4 mt-6">
                    <div>
                        <label htmlFor="mainIllness" className="block mb-2 text-sm font-medium text-gray-900">Diagnóstico principal</label>
                        <textarea name="mainIllness" id="mainIllness" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" 
                            disabled={!modificar}
                            value={mainSanitaryData?.mainIllness}
                            onChange={(e)=>{setMainSanitaryData({...mainSanitaryData, [e.target.name]:e.target.value})}}
                        />
                    </div>
                    <div>
                        <label htmlFor="allergies" className="block mb-2 text-sm font-medium text-gray-900">Alergias</label>
                        <textarea name="allergies" id="allergies" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" 
                            disabled={!modificar}
                            value={mainSanitaryData?.allergies}
                            onChange={(e)=>{setMainSanitaryData({...mainSanitaryData, [e.target.name]:e.target.value})}}
                        />
                    </div>
                    <div>
                        <label htmlFor="otherIllness" className="block mb-2 text-sm font-medium text-gray-900">Otros trastornos</label>
                        <textarea name="otherIllness" id="otherIllness" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" 
                            disabled={!modificar}
                            value={mainSanitaryData?.otherIllness}
                            onChange={(e)=>{setMainSanitaryData({...mainSanitaryData, [e.target.name]:e.target.value})}}
                        />
                    </div>
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

export default withAuth(sanitaryData, [])