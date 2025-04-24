import DashboardLayout from "@/pages/dashboard/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';

function Galeria () {
    const [imagenesPaciente, setImagenesPaciente] = useState([])
    const router = useRouter()
    const {id} = router.query

    const getImagenesPaciente = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getImagenesPaciente?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.ok){
            const data = await response.json()
            setImagenesPaciente(data.imagenes)
        }

    }

    useEffect(()=>{
        getImagenesPaciente()
    },[])

    return(
        <DashboardLayout>
            <h2 className='text-2xl font-bold'>Galería de imagenes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="grid gap-4">
                    {
                        imagenesPaciente && imagenesPaciente.map((imagen, index) => (
                            <div key={index}>
                                <img src={imagen.url} alt={`Imagen ${index}`} className="h-auto max-w-full rounded-lg" />
                            </div>
                        ))
                    }
                </div>
            </div>
        </DashboardLayout>
    )
}

export default withAuth(Galeria)