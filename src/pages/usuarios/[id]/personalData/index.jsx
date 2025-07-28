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
    
    
    const [isFormDirty, setIsFormDirty] = useState(false)

    useEffect(() => {
        // Interceptar cierre/recarga
        const handleBeforeUnload = (e) => {
            if (modificar && isFormDirty) {
                e.preventDefault()
                e.returnValue = ''
            }
        }

        // Interceptar navegación interna
        const handleRouteChangeStart = (url) => {
            if (modificar && isFormDirty) {
                const confirmExit = window.confirm("Tienes cambios sin guardar. ¿Estás seguro de salir?")
                if (!confirmExit) {
                    router.events.emit("routeChangeError")
                    throw "Abortar navegación"
                }
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        router.events.on("routeChangeStart", handleRouteChangeStart)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            router.events.off("routeChangeStart", handleRouteChangeStart)
        }
    }, [modificar, isFormDirty])


    const handleInpustChange = (e) => {
        const {name, value} = e.target
        setIsFormDirty(true);
        setMostrarPaciente((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

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

    const enviarDatos = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'upsertPaciente', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify(mostrarPaciente)
        })

        if (response.ok) {
            setMessage('Datos actualizados correctamente')
            setError(null)
            setSaveData(false)
            setModificar(false)
            setIsFormDirty(false)
        } else {
            const errorData = await response.json()
            setError(errorData.message || 'Error al actualizar los datos')
            setMessage(null)
        }
    }

    return(
        mostrarPaciente &&
        <PacienteLayout mostrarPaciente={mostrarPaciente} page={"1"}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)] flex flex-col">
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su nombre?</label>
                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.name} disabled={!modificar} onChange={handleInpustChange}
                    />
                </div>
                <div>
                    <label htmlFor="firstSurname" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su primer apellido?</label>
                    <input type="text" name="firstSurname" id="firstSurname" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.firstSurname} disabled={!modificar} onChange={handleInpustChange}
                    />
                </div>
                <div>
                    <label htmlFor="secondSurname" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su segundo apellido?</label>
                    <input type="text" name="secondSurname" id="secondSurname" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.secondSurname} disabled={!modificar} onChange={handleInpustChange}
                    />
                </div>
                <div>
                    <label htmlFor="alias" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo le gustan que le llamen?</label>
                    <input type="text" name="alias" id="alias" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.alias} disabled={!modificar} onChange={handleInpustChange}
                    />
                </div>
                <div>
                    <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su fecha de nacimiento?</label>
                    <input type="date" name="birthDate" id="birthDate" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.birthDate} disabled={!modificar} onChange={handleInpustChange}
                    />
                </div>
                <div>
                    <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900">¿Cuántos años tiene?</label>
                    <input type="number" name="age" id="age" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.age} disabled={!modificar} onChange={handleInpustChange}
                    />
                </div>
                <div>
                    <label htmlFor="birthPlace" className="block mb-2 text-sm font-medium text-gray-900">¿En qué lugar nació?</label>
                    <input type="text" name="birthPlace" id="birthPlace" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.birthPlace} disabled={!modificar} onChange={handleInpustChange}
                    />
                </div>
                <div>
                    <label htmlFor="nationality" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su nacionalidad?</label>
                    <input type="text" name="nationality" id="nationality" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.nationality} disabled={!modificar} onChange={handleInpustChange}
                    />
                </div>
                <div>
                    <fieldset disabled={!modificar}>
                        <legend className="block mb-4 text-sm font-medium text-gray-900">¿Cuál es su género?</legend>
                        <div className="flex items-center mb-4">
                            <input type="radio" name="gender" id="Masculino" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                value='M' checked={mostrarPaciente?.gender === 'M'} onClick={handleInpustChange} 
                            />
                            <label htmlFor="Masculino" className="block ms-2  text-sm font-medium text-gray-900">Masculino</label>
                        </div>
                        <div className="flex items-center mb-4">
                            <input type="radio" name="gender" id="Femenino" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                value='F' checked={mostrarPaciente?.gender === 'F'} onClick={handleInpustChange}
                            />
                            <label htmlFor="Femenino" className="block ms-2  text-sm font-medium text-gray-900">Femenino</label>
                        </div>
                        <div className="flex items-center mb-4">
                            <input type="radio" name="gender" id="Otro" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                value='O' checked={mostrarPaciente?.gender === 'O'} onClick={handleInpustChange}
                            />
                            <label htmlFor="Otro" className="block ms-2  text-sm font-medium text-gray-900">Otros</label>
                        </div>
                    </fieldset>
                </div>
                <div>
                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">¿Cuál es su dirección actual?</label>
                    <input type="text" name="address" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.address} disabled={!modificar} onChange={handleInpustChange}
                    />
                </div>
                <div>
                    <fieldset disabled={!modificar}>
                            <legend className="block mb-4 text-sm font-medium text-gray-900">¿Cuál es su estado civil?</legend>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="maritalStatus" id="soltero" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente?.maritalStatus === 'ST'} value='ST' onClick={handleInpustChange}
                                />
                                <label htmlFor="soltero" className="block ms-2  text-sm font-medium text-gray-900">Soltero/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="maritalStatus" id="casado" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente?.maritalStatus === 'C'} value='C' onClick={handleInpustChange}
                                />
                                <label htmlFor="casado" className="block ms-2  text-sm font-medium text-gray-900">Casado/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="maritalStatus" id="viudo" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente?.maritalStatus === 'V'} value='V' onClick={handleInpustChange} 
                                />
                                <label htmlFor="viudo" className="block ms-2  text-sm font-medium text-gray-900">Viudo/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="maritalStatus" id="separado" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente?.maritalStatus === 'S'} value='S' onClick={handleInpustChange}
                                />
                                <label htmlFor="separado" className="block ms-2  text-sm font-medium text-gray-900">Separado/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="maritalStatus" id="divorciado" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente?.maritalStatus === 'D'} value='D' onClick={handleInpustChange}
                                />
                                <label htmlFor="divorciado" className="block ms-2  text-sm font-medium text-gray-900">Divorciado/a</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="maritalStatus" id="parejahecho" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={mostrarPaciente?.maritalStatus === 'P'} value='P' onClick={handleInpustChange}
                                />
                                <label htmlFor="divorciado" className="block ms-2  text-sm font-medium text-gray-900">Pareja de hecho</label>
                            </div>
                    </fieldset>
                </div>
                <div>
                    <label htmlFor="sentimentalCouple" className="block mb-2 text-sm font-medium text-gray-900">¿Quién es su pareja sentimental o persona íntima de convivencia?</label>
                    <input type="text" name="sentimentalCouple" id="sentimentalCouple" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.sentimentalCouple} disabled={!modificar} onChange={handleInpustChange}
                    />
                </div>
                <div>
                    <label htmlFor="language" className="block mb-2 text-sm font-medium text-gray-900">¿Qué idioma usa en su día a día?</label>
                    <input type="text" name="language" id="language" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.language} disabled={!modificar} onChange={handleInpustChange}
                    />
                </div>
                <div>
                    <label htmlFor="otherLanguages" className="block mb-2 text-sm font-medium text-gray-900">¿Qué otros idiomas conoce?</label>
                    <textarea name="otherLanguages" id="otherLanguages" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.otherLanguages} disabled={!modificar} onChange={handleInpustChange}
                    />
                </div>
                <div>
                    <label htmlFor="culturalHeritage" className="block mb-2 text-sm font-medium text-gray-900">¿Con qué origen cultural se identifica?</label>
                    <input type="text" name="culturalHeritage" id="culturalHeritage" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.culturalHeritage} disabled={!modificar} onChange={handleInpustChange}
                    />
                </div>
                <div>
                    <label htmlFor="faith" className="block mb-2 text-sm font-medium text-gray-900">¿Tiene alguna creencia espiritual o practica alguna creencia religiosa?</label>
                    <input type="textarea" name="faith" id="faith" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        value={mostrarPaciente?.faith} onChange={handleInpustChange}
                        disabled={!modificar}
                    />
                </div>
            </div>
            <div className="my-2 py-2 border-t-1 border-gray-300">
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