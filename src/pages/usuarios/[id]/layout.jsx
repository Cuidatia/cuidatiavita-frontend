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
                <h2 className='text-2xl font-bold'>{mostrarPaciente.name} {mostrarPaciente.firstSurname} {mostrarPaciente.secondSurname}</h2>            
                <button className="cursor-pointer border-2 border-red-600 bg-white text-red-600 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 hover:bg-red-600 hover:text-white"
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