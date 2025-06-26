import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";

function Galeria () {
    const [imagenesPaciente, setImagenesPaciente] = useState([])
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
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

    const getImagenesPaciente = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getImagenesPaciente?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setImagenesPaciente(data.imagenes)
        }

    }

    useEffect(()=>{
        if (status === 'authenticated' && session?.user?.idOrganizacion) {  
            getPaciente()
            getImagenesPaciente()
        }
    },[session, status])

    const galleryData= [
        {
            title: "Generales",
            images: [
            { src: "/static/juan.png" },
            { src: "/static/manolo.jpeg" },
            ],
        },
        {
            title: "Infancia",
            images: [
            { src: "/static/marta.jpg" },
            ],
        },
        {
            title: "Juventud",
            images: [
            { src: "/static/antonio.jpg" },
            ],
        },
    ];

    return(
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            {/*<div className="py-4 px-4">
                <h2 className='text-xl font-semibold'>Galería de imagenes</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="grid gap-4">
                        {
                            galleryData.map((imagenes) => (
                                imagenes.images.map((imagen, index)=>(
                                    <div key={index}>
                                        <img src={imagen.src} alt={`Imagen ${index}`} className="h-auto max-w-full rounded-lg" />
                                    </div>
                                ))
                            ))
                        }
                    </div>
                </div>
            </div>*/}
            <div className="space-y-10 p-6">
                {galleryData.map((section) => (
                    <div key={section.title}>
                    <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                    <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
                        {section.images.map((img, idx) => (
                        <div
                            key={idx}
                            className="min-w-[200px] h-[150px] relative rounded overflow-hidden shadow-md"
                        >
                            <img
                            src={img.src}
                            alt={img.alt || section.title}
                            fill
                            className="object-cover max-w-64"
                            />
                        </div>
                        ))}
                    </div>
                    </div>
                ))}
                </div>
        </PacienteLayout>
    )
}

export default withAuth(Galeria)