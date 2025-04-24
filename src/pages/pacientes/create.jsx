import { useState } from "react";
import DashboardLayout from "../dashboard/layout";
import withAuth from '@/components/withAuth';
import Alerts from "@/components/alerts/alerts";
import { useSessionStore } from "@/hooks/useSessionStorage";
import { UsuarioContext } from "@/contexts/UsuarioContext";
import { useRouter } from 'next/navigation';

function CrearPaciente () {
    const [ Usuario, setUsuario ] = useSessionStore(UsuarioContext)
    const router = useRouter()
    const [message, setMessage] = useState()
    const [error, setError] = useState()

    const [nombre,setNombre] = useState()
    const [primerApellido,setPrimerApellido] = useState()
    const [segundoApellido,setSegundoApellido] = useState()
    const [alias,setAlias] = useState()
    const [fechaNacimiento, setFechaNacimiento] = useState()
    const [direccion, setDireccion] = useState()
    const [localidad, setLocalidad] = useState()
    const [nacionalidad, setNacionalidad] = useState()
    const [genero, setGenero] = useState()
    const [estadoCivil, setEstadoCivil] = useState()
    const [imgPerfil, setImgPerfil] = useState()


    const enviarForm = async () => {
        let idOrganizacion = Usuario.idOrganizacion
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'crearPaciente',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nombre,primerApellido,segundoApellido,alias,fechaNacimiento,
                direccion,localidad,nacionalidad,genero,estadoCivil,imgPerfil,idOrganizacion})
        })

        if(response.ok){
            const data = await response.json()
            setMessage(data.message)
            router.push({
                pathname : '/pacientes/[id]',
                query: { id: data.paciente}
            })
        }else{
            const data = await response.json()
            setError(data.error)
        }
    }
    return(
        <DashboardLayout>
            <div>
                <h2 className='text-2xl font-bold'>Añadir nuevo paciente</h2>
            </div>
            <div className="p-4 overflow-y-scroll h-[calc(100vh-220px)]">
                <form action={enviarForm} className="space-y-4 md:space-y-6">
                    <div>
                        <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
                        <input type="text" name="nombre" id="nombre" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            onChange={(e)=>{setNombre(e.target.value)}} required
                        />
                    </div>
                    <div>
                        <label htmlFor="primerApellido" className="block mb-2 text-sm font-medium text-gray-900">Primer apellido</label>
                        <input type="text" name="primerApellido" id="primerApellido" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            onChange={(e)=>{setPrimerApellido(e.target.value)}} required
                        />
                    </div>
                    <div>
                        <label htmlFor="segundoApellido" className="block mb-2 text-sm font-medium text-gray-900">Segundo apellido</label>
                        <input type="text" name="segundoApellido" id="segundoApellido" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            onChange={(e)=>{setSegundoApellido(e.target.value)}} required
                        />
                    </div>
                    <div>
                        <label htmlFor="alias" className="block mb-2 text-sm font-medium text-gray-900">Alias</label>
                        <input type="text" name="alias" id="alias" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            onChange={(e)=>{setAlias(e.target.value)}} required
                        />
                    </div>
                    <div>
                        <label htmlFor="fechaNacimiento" className="block mb-2 text-sm font-medium text-gray-900">Fecha de nacimiento</label>
                        <input type="date" name="fechaNacimiento" id="fechaNacimiento" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            onChange={(e)=>{setFechaNacimiento(e.target.value)}} required
                        />
                    </div>
                    <div>
                        <label htmlFor="direccion" className="block mb-2 text-sm font-medium text-gray-900">Dirección</label>
                        <input type="text" name="direccion" id="direccion" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            onChange={(e)=>{setDireccion(e.target.value)}} required
                        />
                    </div>
                    <div>
                        <label htmlFor="localidad" className="block mb-2 text-sm font-medium text-gray-900">Localidad</label>
                        <input type="text" name="localidad" id="localidad" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            onChange={(e)=>{setLocalidad(e.target.value)}} required
                        />
                    </div>
                    <div>
                        <label htmlFor="nacionalidad" className="block mb-2 text-sm font-medium text-gray-900">Nacionalidad</label>
                        <input type="text" name="nacionalidad" id="nacionalidad" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            onChange={(e)=>{setNacionalidad(e.target.value)}} required
                        />
                    </div>
                    <div>
                        <fieldset>
                            <legend className="block mb-2 text-sm font-medium text-gray-900">Género</legend>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="genero" id="Masculino" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    onClick={(e)=>{setGenero(e.target.value)}} value='M' 
                                />
                                <label htmlFor="Masculino" className="block ms-2  text-sm font-medium text-gray-900">Masculino</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="genero" id="Femenino" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    onClick={(e)=>{setGenero(e.target.value)}} value='F'
                                />
                                <label htmlFor="Femenino" className="block ms-2  text-sm font-medium text-gray-900">Femenino</label>
                            </div>
                        </fieldset>
                    </div>
                    <div>
                        <fieldset>
                            <legend className="block mb-2 text-sm font-medium text-gray-900">Estado civil</legend>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="estadoCivil" id="soltero" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    onClick={(e)=>{setEstadoCivil(e.target.value)}} value='ST' 
                                />
                                <label htmlFor="soltero" className="block ms-2  text-sm font-medium text-gray-900">Soltero/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="estadoCivil" id="casado" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    onClick={(e)=>{setEstadoCivil(e.target.value)}} value='C'
                                />
                                <label htmlFor="casado" className="block ms-2  text-sm font-medium text-gray-900">Casado/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="estadoCivil" id="viudo" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    onClick={(e)=>{setEstadoCivil(e.target.value)}} value='V' 
                                />
                                <label htmlFor="viudo" className="block ms-2  text-sm font-medium text-gray-900">Viudo/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="estadoCivil" id="separado" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    onClick={(e)=>{setEstadoCivil(e.target.value)}} value='S'
                                />
                                <label htmlFor="separado" className="block ms-2  text-sm font-medium text-gray-900">Separado/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="estadoCivil" id="divorciado" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    onClick={(e)=>{setEstadoCivil(e.target.value)}} value='D'
                                />
                                <label htmlFor="divorciado" className="block ms-2  text-sm font-medium text-gray-900">Divorciado/a</label>
                            </div>
                        </fieldset>
                    </div>
                    <div>
                    <label htmlFor="imagenPerfil" className="block mb-2 text-sm font-medium text-gray-900">Seleccionar imagen</label>
                    <input type="file" name="imagenPerfil" id="imagenPerfil" className="block w-96 border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 file:hover:bg-blue-500  file:hover:text-white file:cursor-pointer disabled:opacity-50 disabled:pointer-events-none file:bg-gray-50 file:border-0 file:py-3 file:px-4"
                        onChange={(e)=>{setImgPerfil(e.target.value)}} required
                    />
                    </div>
                    <button className="cursor-pointer bg-zinc-100 hover:text-white border-1 border-zinc-200 hover:bg-blue-500 rounded-lg text-sm px-3 py-2 text-center">Añadir paciente</button>
                </form>
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
        </DashboardLayout>
    )
}

export default withAuth(CrearPaciente)