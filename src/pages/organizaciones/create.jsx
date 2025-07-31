import { useEffect, useState } from "react";
import DashboardLayout from "../dashboard/layout";
import withAuth from '@/components/withAuth';
import Alerts from "@/components/alerts/alerts";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import PopUp from "@/components/popUps/popUp";

function CrearOrganizacion () {
    const {data: session, status} = useSession()
    const router = useRouter()
    const [saveData, setSaveData] = useState(false)
    const [message, setMessage] = useState()
    const [error, setError] = useState()

    const [nuevaOrganizacion, setNuevaOrganizacion] = useState({
        nombre: '',
        direccion: '',
        localidad: '',
        provincia:'',
        codigo_postal: '',
        telefono: ''
    })

    const handleInpustChange = (e) => {
        const {name, value} = e.target
        setNuevaOrganizacion((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }


    const enviarDatos = async () => {

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'crearOrganizacion',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({nuevaOrganizacion})
        })

        if(response.ok){
            const data = await response.json()
            setMessage(data.message)
            router.push({
                pathname : '/organizaciones/[id]',
                query: { id: data.organizacion.id}
            })
        }else{
            const data = await response.json()
            setError(data.error)
            setSaveData(false)
        }
    }

    return(
        <DashboardLayout>
            <div className=" py-4 px-6">
                <h2 className='text-2xl font-semibold'>Añadir nueva organizacion</h2>
                <div className="space-y-4 md:space-y-6">
                    <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)] flex flex-col">
                        <div>
                            <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">Nombre de la organizacion</label>
                            <input type="text" name="nombre" id="nombre" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 `}
                                onChange={handleInpustChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="direccion" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">Direccion de la organizacion</label>
                            <input type="text" name="direccion" id="direccion" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 `}
                                onChange={handleInpustChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="localidad" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">Localidad de la organizacion</label>
                            <input type="text" name="localidad" id="localidad" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 `}
                                onChange={handleInpustChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="provincia" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">Provincia de la organizacion</label>
                            <input type="text" name="provincia" id="provincia" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 `}
                                onChange={handleInpustChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="codigo_postal" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">Código postal de la organizacion</label>
                            <input type="text" name="codigo_postal" id="codigo_postal" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 `}
                                onChange={handleInpustChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">Teléfono de la organizacion</label>
                            <input type="text" name="telefono" id="telefono" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5`}
                                onChange={handleInpustChange}
                            />
                        </div>
                        {/* <div>
                            <label htmlFor="imagenPerfil" className="block mb-2 text-sm font-medium text-gray-900">Seleccionar imagen</label>
                            <input type="file" name="imagenPerfil" id="imagenPerfil" className="block w-96 border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 file:hover:bg-blue-500  file:hover:text-white file:cursor-pointer disabled:opacity-50 disabled:pointer-events-none file:bg-gray-50 file:border-0 file:py-3 file:px-4"
                                onChange={handleInpustChange} required
                            />
                        </div> */}
                    
                    </div>
                    <button className="cursor-pointer bg-zinc-100 hover:text-white border-1 border-zinc-200 hover:bg-blue-500 rounded-lg text-sm px-3 py-2 text-center w-32"
                        onClick={()=>setSaveData(true)}
                    >
                        Añadir organizacion
                    </button>
                </div>
                
            </div>

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
        </DashboardLayout>
    )
}

export default withAuth(CrearOrganizacion, ['superadmin'])