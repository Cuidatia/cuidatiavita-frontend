import DashboardLayout from "@/pages/dashboard/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';

function DatosPersonales () {
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
        <DashboardLayout>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>{mostrarPaciente.nombre} {mostrarPaciente.primerApellido} {mostrarPaciente.segundoApellido}</h2>
            </div>
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t mt-2 border-gray-300"></div>
            </div>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-220px)]">
                <div>
                    <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
                    <input type="text" name="nombre" id="nombre" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente.nombre} disabled
                    />
                </div>
                <div>
                    <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">Primer Apellido</label>
                    <input type="text" name="nombre" id="nombre" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente.primerApellido} disabled
                    />
                </div>
                <div>
                    <label htmlFor="segundoApellido" className="block mb-2 text-sm font-medium text-gray-900">Segundo Apellido</label>
                    <input type="text" name="segundoApellido" id="segundoApellido" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente.segundoApellido} disabled
                    />
                </div>
                <div>
                    <label htmlFor="alias" className="block mb-2 text-sm font-medium text-gray-900">Alias</label>
                    <input type="text" name="alias" id="alias" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente.alias} disabled
                    />
                </div>
                <div>
                    <label htmlFor="fechaNacimiento" className="block mb-2 text-sm font-medium text-gray-900">Fecha de nacimiento</label>
                    <input type="date" name="fechaNacimiento" id="fechaNacimiento" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente.fechaNacimiento} disabled
                    />
                </div>
                <div>
                    <label htmlFor="direccion" className="block mb-2 text-sm font-medium text-gray-900">Dirección</label>
                    <input type="text" name="direccion" id="direccion" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente.direccion} disabled
                    />
                </div>
                <div>
                    <label htmlFor="localidad" className="block mb-2 text-sm font-medium text-gray-900">Localidad</label>
                    <input type="text" name="localidad" id="localidad" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente.localidad} disabled
                    />
                </div>
                <div>
                    <label htmlFor="nacionalidad" className="block mb-2 text-sm font-medium text-gray-900">Nacionalidad</label>
                    <input type="text" name="nacionalidad" id="nacionalidad" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente.nacionalidad} disabled
                    />
                </div>
                <div>
                    <fieldset>
                        <legend className="block mb-2 text-sm font-medium text-gray-900">Género</legend>
                        <div className="flex items-center mb-4">
                            <input type="radio" name="genero" id="Masculino" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                value='M' checked={mostrarPaciente.genero === 'M'} 
                            />
                            <label htmlFor="Masculino" className="block ms-2  text-sm font-medium text-gray-900">Masculino</label>
                        </div>
                        <div className="flex items-center mb-4">
                            <input type="radio" name="genero" id="Femenino" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                value='F' checked={mostrarPaciente.genero === 'F'} 
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
                                    checked={mostrarPaciente.estadoCivil === 'ST'} value='ST' 
                                />
                                <label htmlFor="soltero" className="block ms-2  text-sm font-medium text-gray-900">Soltero/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="estadoCivil" id="casado" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente.estadoCivil === 'C'} value='C'
                                />
                                <label htmlFor="casado" className="block ms-2  text-sm font-medium text-gray-900">Casado/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="estadoCivil" id="viudo" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente.estadoCivil === 'V'} value='V' 
                                />
                                <label htmlFor="viudo" className="block ms-2  text-sm font-medium text-gray-900">Viudo/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="estadoCivil" id="separado" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente.estadoCivil === 'S'} value='S'
                                />
                                <label htmlFor="separado" className="block ms-2  text-sm font-medium text-gray-900">Separado/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="estadoCivil" id="divorciado" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente.estadoCivil === 'D'} value='D'
                                />
                                <label htmlFor="divorciado" className="block ms-2  text-sm font-medium text-gray-900">Divorciado/a</label>
                            </div>
                    </fieldset>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default withAuth(DatosPersonales)