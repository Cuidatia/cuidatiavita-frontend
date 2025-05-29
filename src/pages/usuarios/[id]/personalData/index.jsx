import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";
import PopUp from "@/components/popUps/popUp";
import Alerts from "@/components/alerts/alerts";

function DatosPersonales () {
    const {data:session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [modificar, setModificar] = useState(false)
    const [message, setMessage] = useState()
    const [error, setError] = useState()
    const router = useRouter()
    const {id} = router.query

    const [saveData, setSaveData] = useState(false)

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

    useEffect(()=>{
        if(status === 'authenticated'){
            getPaciente()
        }
    },[session, status])

    const enviarDatos = async () => {setSaveData(false)}

    return(
        mostrarPaciente &&
        <PacienteLayout mostrarPaciente={mostrarPaciente}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)] flex flex-col">
                <div>
                    <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su nombre?</label>
                    <input type="text" name="nombre" id="nombre" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.name} disabled={!modificar}
                    />
                </div>
                <div>
                    <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su primer apellido?</label>
                    <input type="text" name="nombre" id="nombre" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.firstSurname} disabled={!modificar}
                    />
                </div>
                <div>
                    <label htmlFor="segundoApellido" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su segundo apellido?</label>
                    <input type="text" name="segundoApellido" id="segundoApellido" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.secondSurname} disabled={!modificar}
                    />
                </div>
                <div>
                    <label htmlFor="alias" className="block mb-2 text-sm font-medium text-gray-900">¿Se le conoce por algún alias o apodo?</label>
                    <input type="text" name="alias" id="alias" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.alias} disabled={!modificar}
                    />
                </div>
                <div>
                    <label htmlFor="fechaNacimiento" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su fecha de nacimiento?</label>
                    <input type="date" name="fechaNacimiento" id="fechaNacimiento" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.birthDate} disabled={!modificar}
                    />
                </div>
                <div>
                    <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900">¿Cuántos años tiene?</label>
                    <input type="number" name="age" id="age" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.age} disabled={!modificar}
                    />
                </div>
                <div>
                    <label htmlFor="birthPlace" className="block mb-2 text-sm font-medium text-gray-900">¿En qué lugar nació?</label>
                    <input type="text" name="birthPlace" id="birthPlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.birthPlace} disabled={!modificar}
                    />
                </div>
                <div>
                    <label htmlFor="nacionality" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su nacionalidad?</label>
                    <input type="text" name="nacionality" id="nacionality" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.nationality} disabled={!modificar}
                    />
                </div>
                <div>
                    <fieldset>
                        <legend className="block mb-4 text-sm font-medium text-gray-900">¿Cuál es su género?</legend>
                        <div className="flex items-center mb-4">
                            <input type="radio" name="genero" id="Masculino" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                value='M' checked={mostrarPaciente?.gender === 'M'} 
                            />
                            <label htmlFor="Masculino" className="block ms-2  text-sm font-medium text-gray-900">Masculino</label>
                        </div>
                        <div className="flex items-center mb-4">
                            <input type="radio" name="genero" id="Femenino" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                value='F' checked={mostrarPaciente?.gender === 'F'} 
                            />
                            <label htmlFor="Femenino" className="block ms-2  text-sm font-medium text-gray-900">Femenino</label>
                        </div>
                    </fieldset>
                </div>
                <div>
                    <label htmlFor="direccion" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su dirección actual?</label>
                    <input type="text" name="direccion" id="direccion" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.address} disabled={!modificar}
                    />
                </div>
                <div>
                    <fieldset>
                            <legend className="block mb-4 text-sm font-medium text-gray-900">¿Cuál es su estado civil?</legend>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="estadoCivil" id="soltero" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente?.maritalStatus === 'ST'} value='ST' 
                                />
                                <label htmlFor="soltero" className="block ms-2  text-sm font-medium text-gray-900">Soltero/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="estadoCivil" id="casado" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente?.maritalStatus === 'C'} value='C'
                                />
                                <label htmlFor="casado" className="block ms-2  text-sm font-medium text-gray-900">Casado/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="estadoCivil" id="viudo" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente?.maritalStatus === 'V'} value='V' 
                                />
                                <label htmlFor="viudo" className="block ms-2  text-sm font-medium text-gray-900">Viudo/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="estadoCivil" id="separado" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente?.maritalStatus === 'S'} value='S'
                                />
                                <label htmlFor="separado" className="block ms-2  text-sm font-medium text-gray-900">Separado/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="estadoCivil" id="divorciado" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente?.maritalStatus === 'D'} value='D'
                                />
                                <label htmlFor="divorciado" className="block ms-2  text-sm font-medium text-gray-900">Divorciado/a</label>
                            </div>
                    </fieldset>
                </div>
                <div>
                    <label htmlFor="language" className="block mb-2 text-sm font-medium text-gray-900">¿Qué idioma usa en su día a día?</label>
                    <input type="text" name="language" id="language" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.language} disabled={!modificar}
                    />
                </div>
                <div>
                    <label htmlFor="otherLanguages" className="block mb-2 text-sm font-medium text-gray-900">¿Qué otros idiomas conoce?</label>
                    <textarea name="otherLanguages" id="otherLanguages" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.otherLanguages} disabled={!modificar}
                    />
                </div>
                <div>
                    <label htmlFor="culturalHeritage" className="block mb-2 text-sm font-medium text-gray-900">¿Con qué origen cultural se identifica?</label>
                    <input type="text" name="culturalHeritage" id="culturalHeritage" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.culturalHeritage} disabled={!modificar}
                    />
                </div>
                <div>
                    <label htmlFor="faith" className="block mb-2 text-sm font-medium text-gray-900">¿Tiene alguna creencia espiritual o practica alguna creencia religiosa?</label>
                    <input type="text" name="faith" id="faith" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.faith}
                        disabled={!modificar}
                    />
                </div>
            </div>
            <div className="my-2 border-t-1 border-gray-300">
                <button className="cursor-pointer bg-zinc-100 border-1 border-zinc-200 hover:bg-zinc-300 me-1 rounded-lg text-sm px-3 py-2 text-center"
                    onClick={() => setModificar(!modificar)}
                >
                    {!modificar ? 'Modificar': 'Cancelar'}
                </button>
            {
                modificar &&
                    <button className="cursor-pointer mx-2 bg-zinc-100 hover:text-white border-1 border-zinc-200 hover:bg-blue-500 rounded-lg text-sm px-3 py-2 text-center"
                        onClick={()=>setSaveData(true)}
                    >
                        Guardar
                    </button>
            }
            </div>
            {
                message &&
                    <Alerts alertContent={message} alertType={'success'} />
            }
            {
                error &&
                    <Alerts alertContent={error} alertType={'error'} />
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
        </PacienteLayout>
    )
}

export default withAuth(DatosPersonales)