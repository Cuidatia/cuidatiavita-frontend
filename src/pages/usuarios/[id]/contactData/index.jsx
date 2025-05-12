import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';

function ContactData () {
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [modificar, setModificar] = useState(false)
    const [roles, setRoles] = useState()
    const router = useRouter()
    const {id} = router.query

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

    return(
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-220px)]">
                <div>
                    <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
                    <input type="text" name="nombre" id="nombre" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled
                    />
                </div>
                <div>
                    <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">Primer Apellido</label>
                    <input type="text" name="nombre" id="nombre" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled
                    />
                </div>
                <div>
                    <label htmlFor="segundoApellido" className="block mb-2 text-sm font-medium text-gray-900">Segundo Apellido</label>
                    <input type="text" name="segundoApellido" id="segundoApellido" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled
                    />
                </div>
                <div>
                    <label htmlFor="direccion" className="block mb-2 text-sm font-medium text-gray-900">Dirección</label>
                    <input type="text" name="direccion" id="direccion" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled
                    />
                </div>
                <div>
                    <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-900">Teléfono</label>
                    <input type="text" name="telefono" id="telefono" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled
                    />
                </div>
            </div>
        </PacienteLayout>
    )
}

export default withAuth(ContactData)