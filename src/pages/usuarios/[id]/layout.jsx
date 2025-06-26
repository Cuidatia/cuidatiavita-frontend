import DashboardLayout from "@/pages/dashboard/layout"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import { useRouter } from "next/router"
import PopUp from '@/components/popUps/popUp';

    

export default function PacienteLayout({ children, mostrarPaciente }) {
    const {data: session, status} = useSession()
    const [openPopUp, setOpenPopUp] = useState(false)
    const [message, setMessage] = useState()
    const [error, setError] = useState()
    const router = useRouter()
    const {id} = router.query
    const eliminarPaciente = async (pacienteId) => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'eliminarPaciente', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({pacienteId})
        })

        if(response.ok){
            const data = await response.json()
            setMessage(data.message)
            router.push("/usuarios/");
        }else {
            setError(data.error)
        }
    }
 
    return(
        <DashboardLayout>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-semibold'>{mostrarPaciente.name} {mostrarPaciente.firstSurname} {mostrarPaciente.secondSurname}</h2>            
                <button className="cursor-pointer text-red-700 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    onClick={()=>{setOpenPopUp(!openPopUp);}}>
                    Eliminar usuario
                </button>
            </div>
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t mt-2 border-gray-300"></div>
            </div>
            {children}

            <PopUp
                open={openPopUp} 
                popTitle="Eliminar usuario"
                popContent={`¿Está seguro de que desea eliminar al usuario ${mostrarPaciente.name} ${mostrarPaciente.firstSurname} ${mostrarPaciente.secondSurname}?`}
                popType="option"
                confirmFunction={() => {
                    eliminarPaciente(mostrarPaciente.id);
                    setOpenPopUp(false);
                }}
                cancelFunction={() => setOpenPopUp(false)}
            />
        </DashboardLayout>
    )
}