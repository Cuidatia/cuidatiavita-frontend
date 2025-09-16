import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";
{/*import Image from "next/image"*/}

function Galeria () {
    const [imagenesPaciente, setImagenesPaciente] = useState({})
    const {data: session, status} = useSession()
    const [selectedFile, setSelectedFile] = useState(null)
    const [categoria, setCategoria] = useState("G")
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
            setImagenesPaciente(data.imagenes || {})
        }

    }

    useEffect(()=>{
        if (status === 'authenticated' && session?.user?.idOrganizacion) {  
            getPaciente()
            getImagenesPaciente()
        }
    },[session, status])

    const uploadImagen = async (e) => {
        e.preventDefault()
        if (!selectedFile) return alert("Selecciona una imagen")

        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("idPaciente", id)
        formData.append("categoria", categoria)

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "uploadImagenPaciente", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${session.user.token}`
                },
                body: formData
            })
            console.log("Subiendo a:", process.env.NEXT_PUBLIC_API_URL + "uploadImagenPaciente")
            if (response.ok) {
                alert("Imagen subida correctamente ✅")
                setSelectedFile(null)
                getImagenesPaciente()
            } else {
                const text = await response.text()
                let err
                try {
                    err = JSON.parse(text)
                } catch {
                    err = { error: text }
                }
                alert("Error al subir: " + (err.error || "desconocido"))
            }
        } catch (error) {
            console.error("Error en uploadImagen:", error)
            alert("Error de red o CORS")
        }
    }

    useEffect(()=>{
        if (status === 'authenticated' && session?.user?.idOrganizacion) {  
            getPaciente()
            getImagenesPaciente()
        }
    },[session, status])

    return(
        <PacienteLayout mostrarPaciente={mostrarPaciente}>

            <div className="p-6 border rounded-lg mb-8 shadow-md bg-white">
                <h3 className="text-lg font-semibold mb-4">Subir nueva imagen</h3>
                <form onSubmit={uploadImagen} className="flex flex-col md:flex-row gap-4">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="border p-2 rounded"
                    />
                    <select 
                        value={categoria}
                        onChange={(e)=> setCategoria(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="P">Perfil</option>
                        <option value="I">Infancia</option>
                        <option value="J">Juventud</option>
                        <option value="A">Edad Adulta</option>
                        <option value="M">Madurez</option>
                        <option value="G">Generales</option>
                    </select>
                    <button 
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Subir
                    </button>
                </form>
            </div>
            <div className="space-y-10 p-6">
            {Object.entries(imagenesPaciente).map(([categoria, images]) => (
                <div key={categoria}>
                <h2 className="text-2xl font-semibold mb-4">
                    {categoria === "P" ? "Perfil" :
                    categoria === "I" ? "Infancia" :
                    categoria === "J" ? "Juventud" :
                    categoria === "A" ? "Adultez" :
                    categoria === "M" ? "Madurez" :
                    "Generales"}
                </h2>
                <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
                    {images.map((img, idx) => (
                    <div
                        key={idx}
                        className="min-w-[400px] h-[300px] relative rounded overflow-hidden shadow-md"
                    >
                    <img
                    src={img.src}
                    alt={`Imagen ${idx}`}
                    width={400}
                    height={300}
                    className="object-cover rounded"
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