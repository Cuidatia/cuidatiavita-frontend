import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";
import PopUp from "@/components/popUps/popUp";
import Alerts from "@/components/alerts/alerts";

function Pharmacy () {
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [modificar, setModificar] = useState(false)
    const [saveData, setSaveData] = useState(false)
    const [message, setMessage] = useState()
    const [error, setError] = useState('')

    const [pacienteFarmacia, setPacienteFarmacia] = useState({
        treatment: '',
        regularPharmacy: '',
        visitFrequency: '',
        paymentMethod: ''
    })

    const router = useRouter()
    const {id} = router.query

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

    const getPacienteFarmacia = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteFarmacia?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setPacienteFarmacia(data.pharmacy)
        }
    }

    useEffect(()=>{
        if(status === 'authenticated'){
            getPaciente()
            getPacienteFarmacia()
        }
    },[status,session])

    const enviarDatos = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteFarmacia', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({
                id: id,
                pharmacy: pacienteFarmacia
            })
        })

        if (response.ok){
            const data = await response.json()
            alert(data.message)
            setMessage(data.message)
            setModificar(false)
            setSaveData(false)
        }else{
            const data = await response.json()
            alert(data.error)
            setError(data.error)
        }
    }

    return(
        mostrarPaciente &&
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="treatment" className="block mb-2 text-sm font-medium text-gray-900">¿Toma alguna medicación de forma habitual?</label>
                    <input type="text" name="treatment" id="treatment" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteFarmacia?.treatment}
                         onChange={(e)=>setPacienteFarmacia({...pacienteFarmacia, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="regularPharmacy" className="block mb-2 text-sm font-medium text-gray-900">¿Qué farmacia suele frecuentar para adquirir sus medicamentos?</label>
                    <input type="text" name="regularPharmacy" id="regularPharmacy" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteFarmacia?.regularPharmacy}
                         onChange={(e)=>setPacienteFarmacia({...pacienteFarmacia, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="visitFrequency" className="block mb-2 text-sm font-medium text-gray-900">¿Con qué frecuencia visita la farmacia?</label>
                    <input type="text" name="visitFrequency" id="visitFrequency" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteFarmacia?.visitFrequency}
                         onChange={(e)=>setPacienteFarmacia({...pacienteFarmacia, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="paymentMethod" className="block mb-2 text-sm font-medium text-gray-900">¿Qué método de pago suele utilizar para adquirir sus medicamentos?</label>
                    <input type="text" name="paymentMethod" id="paymentMethod" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteFarmacia?.paymentMethod}
                         onChange={(e)=>setPacienteFarmacia({...pacienteFarmacia, [e.target.name]:e.target.value})}
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
                        onClick={() => setSaveData(true)}
                    >
                        Guardar
                    </button>
            }
            {
                message ?
                    <Alerts
                        alertType={'success'}
                        alertContent={message}
                    />
                : error && 
                    <Alerts
                        alertType={'error'}
                        alertContent={error}
                    />
            }
            </div>
            {
                <PopUp
                    open={saveData}
                    popContent={'¿Desea guardar los cambios?'}
                    popTitle="Guardar cambios"
                    popType="option"
                    confirmFunction={enviarDatos}
                    cancelFunction={() => setSaveData(false)}
                />
            }
        </PacienteLayout>
    )
}

export default withAuth(Pharmacy, ['administrador'])