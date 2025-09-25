import Alerts from "@/components/alerts/alerts"
import Link from "next/link"
import Card from "@/components/cards/card"
import withAuth from "@/components/withAuth"
import PacienteLayout from "../layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

function lifeStory () {
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const router = useRouter()
    const {id} = router.query

    const [error, setError] = useState()

    const getPaciente = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getPaciente?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user?.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setMostrarPaciente(data.paciente)
        }else {
            const data = await response.json()
            
            setError(data.error)
        }

    }


    useEffect(()=>{
        if (status === 'authenticated') {  
            getPaciente()
        }
    },[session, status])

    return(
        <PacienteLayout mostrarPaciente={mostrarPaciente} page={"16"}>
            <div className="py-4 px-4">
                <div className="grid grid-cols-1 gap-4">
                    {
                        (session?.user?.roles.split(',').includes('educador social/terapeuta ocupacional') || session?.user?.roles.split(',').includes('auxiliar') || session?.user?.roles.split(',').includes('superadmin') || session?.user?.roles.split(',').includes('administrador') || session?.user?.roles.split(',').includes('familiar') || session?.user?.roles.split(',').includes('paciente')) &&
                            <Card color={"linear-gradient(to left, #fff3a4 0%, #fee64f 100%)"} icon={''} title={'Infancia'} link={'/usuarios/'+mostrarPaciente.id+'/lifeStory/childhood'} />
                    }
                    {
                        (session?.user?.roles.split(',').includes('educador social/terapeuta ocupacional') || session?.user?.roles.split(',').includes('auxiliar') || session?.user?.roles.split(',').includes('superadmin') || session?.user?.roles.split(',').includes('administrador') || session?.user?.roles.split(',').includes('familiar') || session?.user?.roles.split(',').includes('paciente')) &&
                            <Card color={"linear-gradient(to right, #70dcff 0%, #a4e9ff 100%)"} icon={''} title={'Juventud'} link={'/usuarios/'+mostrarPaciente.id+'/lifeStory/youth'} />
                    }
                    {
                        (session?.user?.roles.split(',').includes('educador social/terapeuta ocupacional') || session?.user?.roles.split(',').includes('auxiliar') || session?.user?.roles.split(',').includes('superadmin') || session?.user?.roles.split(',').includes('administrador') || session?.user?.roles.split(',').includes('familiar') || session?.user?.roles.split(',').includes('paciente')) &&
                            <Card color={"linear-gradient(to left, #ffd495 0%, #ffbf62 100%)"} icon={''} title={'Edad Adulta'} link={'/usuarios/'+mostrarPaciente.id+'/lifeStory/adulthood'} />
                    }
                    {
                        (session?.user?.roles.split(',').includes('educador social/terapeuta ocupacional') || session?.user?.roles.split(',').includes('auxiliar') || session?.user?.roles.split(',').includes('superadmin') || session?.user?.roles.split(',').includes('administrador') || session?.user?.roles.split(',').includes('familiar') || session?.user?.roles.split(',').includes('paciente')) &&
                            <Card color={"linear-gradient(to left, #c6ffb2 30%, #acff8f 80%)"} icon={''} title={'Madurez'} link={'/usuarios/'+mostrarPaciente.id+'/lifeStory/maturity'} />
                    }
                </div>
            </div>
            {
                error &&
                <Alerts alertContent={error} alertType={'error'}/>
            }
        </PacienteLayout>
    )
}

export default withAuth(lifeStory, [])