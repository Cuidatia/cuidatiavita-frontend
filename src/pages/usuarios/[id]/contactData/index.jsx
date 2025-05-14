import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';

function ContactData () {
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [modificar, setModificar] = useState(false)

    const router = useRouter()
    const {id} = router.query

    const [pacienteDatosContacto, setPacienteDatosContacto] = useState({
        contactName: '',
        contactFirstSurname: '',
        contactSecondSurname: '',
        contactAddress: '',
        contactEmail: '',
        contactTelecom: '',
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
        console.log('pacienteDatosContacto', pacienteDatosContacto)
    }

    return(
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div>
                    <label htmlFor="contactName" className="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
                    <input type="text" name="contactName" id="contactName" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteDatosContacto.contactName}
                         onChange={(e)=>{setPacienteDatosContacto({...pacienteDatosContacto,[e.target.name]:e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="contactFirstSurname" className="block mb-2 text-sm font-medium text-gray-900">Primer Apellido</label>
                    <input type="text" name="contactFirstSurname" id="contactFirstSurname" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteDatosContacto.contactFirstSurname}
                         onChange={(e)=>{setPacienteDatosContacto({...pacienteDatosContacto,[e.target.name]:e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="contactSecondSurname" className="block mb-2 text-sm font-medium text-gray-900">Segundo Apellido</label>
                    <input type="text" name="contactSecondSurname" id="contactSecondSurname" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabledisabled={!modificar}
                         value={pacienteDatosContacto.contactSecondSurname}
                         onChange={(e)=>{setPacienteDatosContacto({...pacienteDatosContacto,[e.target.name]:e.target.value})}}d
                    />
                </div>
                <div>
                    <label htmlFor="contactAddress" className="block mb-2 text-sm font-medium text-gray-900">Dirección</label>
                    <input type="text" name="contactAddress" id="contactAddress" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteDatosContacto.contactAddress}
                         onChange={(e)=>{setPacienteDatosContacto({...pacienteDatosContacto,[e.target.name]:e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="contactEmail" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                    <input type="email" name="contactEmail" id="contactEmail" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteDatosContacto.contactEmail}
                         onChange={(e)=>{setPacienteDatosContacto({...pacienteDatosContacto,[e.target.name]:e.target.value})}}
                    />
                </div>
                <div>
                    <label htmlFor="contactTelecom" className="block mb-2 text-sm font-medium text-gray-900">Teléfono</label>
                    <input type="text" name="contactTelecom" id="contactTelecom" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteDatosContacto.contactTelecom}
                         onChange={(e)=>{setPacienteDatosContacto({...pacienteDatosContacto,[e.target.name]:e.target.value})}}
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
                        onClick={enviarDatos}
                    >
                        Guardar
                    </button>
            }
            </div>
        </PacienteLayout>
    )
}

export default withAuth(ContactData)