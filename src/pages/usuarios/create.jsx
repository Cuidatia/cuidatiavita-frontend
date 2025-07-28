import { useEffect, useState } from "react";
import DashboardLayout from "../dashboard/layout";
import withAuth from '@/components/withAuth';
import Alerts from "@/components/alerts/alerts";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import PopUp from "@/components/popUps/popUp";
import {z} from 'zod';

function CrearPaciente () {
    const {data: session, status} = useSession()
    const router = useRouter()
    const [saveData, setSaveData] = useState(false)
    const [message, setMessage] = useState()
    const [erroresFormulario, setErroresFormulario] = useState()
    const [error, setError] = useState()

    const [nuevoPaciente, setNuevoPaciente] = useState({
        name: '',
        firstSurname: '',
        secondSurname: '',
        alias:'',
        birthDate: '',
        age: '',
        birthPlace: '',
        nationality: '',
        gender: '',
        address: '',
        maritalStatus: '',
        sentimentalCouple:'',
        language: '',
        otherLanguages: '',
        culturalHeritage: '',
        faith: ''
    })

    const validacionFormulario = z.object({
        name: z.string().min(1, 'Este campo es obligatorio'),
        firstSurname: z.string().min(1, 'Este campo es obligatorio'),
        secondSurname: z.string().min(1, 'Este campo es obligatorio'),
        birthDate: z.string().min(1, 'Este campo es obligatorio').refine((val) => !isNaN(Date.parse(val)), {
                message: 'Fecha inválida',
            }),
        age: z.string().min(1, 'Este campo es obligatorio').transform(Number).refine((val) => !isNaN(val) && val > 0, {
                message: 'La edad debe ser un número válido',
            }),
        birthPlace: z.string().min(1, 'Este campo es obligatorio'),
        nationality: z.string().min(1, 'Este campo es obligatorio'),
        gender: z.string().min(1, 'Este campo es obligatorio').refine((val) => ['M', 'F', 'O'].includes(val), {
                message: 'Género no válido',
            }),
        address: z.string().min(1, 'Este campo es obligatorio'),
        maritalStatus: z.string().min(1, 'Este campo es obligatorio').refine((val) => ['ST', 'C', 'V', 'S', 'D', 'P'].includes(val), {
                message: 'Estado civil no válido',
            }),
        language: z.string().min(1, 'Este campo es obligatorio'),
    });

    const handleInpustChange = (e) => {
        const {name, value} = e.target
        setNuevoPaciente((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }


    const enviarDatos = async () => {

        const result = validacionFormulario.safeParse(nuevoPaciente)

        if (!result.success) {
            setErroresFormulario(result.error.flatten().fieldErrors);
            setError('Algunos campos del formulario contienen errores')
            setSaveData(false)
            return;
        }

        setErroresFormulario({})

        let idOrganizacion = session?.user?.idOrganizacion
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'crearPaciente',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({nuevoPaciente, idOrganizacion})
        })

        if(response.ok){
            const data = await response.json()
            setMessage(data.message)
            router.push({
                pathname : '/usuarios/[id]',
                query: { id: data.paciente}
            })
        }else{
            const data = await response.json()
            setError(data.error)
            setSaveData(false)
        }
    }

    useEffect(()=>{
        if (!nuevoPaciente?.birthDate) return;

        const birth = new Date(nuevoPaciente.birthDate);
        if (isNaN(birth)) return;

        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        // Ajusta si aún no ha cumplido años este año
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        console.log('age', age)

        setNuevoPaciente((prev) => ({
            ...prev,
            age: String(age), // lo guardas como string si tu formulario espera strings
        }));
    }, [nuevoPaciente?.birthDate])

    return(
        <DashboardLayout>
            <div className=" py-4 px-6">
                <h2 className='text-2xl font-semibold'>Añadir nuevo usuario</h2>
                <div className="space-y-4 md:space-y-6">
                    <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)] flex flex-col">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">¿Cuál es su nombre?</label>
                            <input type="text" name="name" id="name" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5  ${erroresFormulario?.name && 'border-red-300'}`}
                                onChange={handleInpustChange}
                            />
                            {
                                erroresFormulario?.name && 
                                <p className="text-red-400 text-xs">{erroresFormulario?.name[0]}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="firstSurname" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">¿Cuál es su primer apellido?</label>
                            <input type="text" name="firstSurname" id="firstSurname" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5  ${erroresFormulario?.firstSurname && 'border-red-300'}`}
                                onChange={handleInpustChange}
                            />
                            {
                                erroresFormulario?.firstSurname && 
                                <p className="text-red-400 text-xs">{erroresFormulario?.firstSurname[0]}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="secondSurname" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">¿Cuál es su segundo apellido?</label>
                            <input type="text" name="secondSurname" id="secondSurname" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5  ${erroresFormulario?.secondSurname && 'border-red-300'}`}
                                onChange={handleInpustChange}
                            />
                            {
                                erroresFormulario?.secondSurname && 
                                <p className="text-red-400 text-xs">{erroresFormulario?.secondSurname[0]}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="alias" className="block mb-2 text-sm font-medium text-gray-900">¿Cómo le gustan que le llamen?</label>
                            <input type="text" name="alias" id="alias" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5  ${erroresFormulario?.alias && 'border-red-300'}`}
                                onChange={handleInpustChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">¿Cuál es su fecha de nacimiento?</label>
                            <input type="date" name="birthDate" id="birthDate" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5  ${erroresFormulario?.birthDate && 'border-red-300'}`}
                                onChange={handleInpustChange}
                            />
                            {
                                erroresFormulario?.birthDate && 
                                <p className="text-red-400 text-xs">{erroresFormulario?.birthDate[0]}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900">¿Cuántos años tiene?</label>
                            <input type="number" name="age" id="age" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5  ${erroresFormulario?.age && 'border-red-300'}`}
                                onChange={handleInpustChange}
                                value={nuevoPaciente?.age}
                                disabled={nuevoPaciente?.age}
                            />
                            {
                                erroresFormulario?.age && 
                                <p className="text-red-400 text-xs">{erroresFormulario?.age[0]}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="birthPlace" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">¿En qué lugar nació?</label>
                            <input type="text" name="birthPlace" id="birthPlace" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5  ${erroresFormulario?.birthPlace && 'border-red-300'}`}
                                onChange={handleInpustChange}
                            />
                            {
                                erroresFormulario?.birthPlace && 
                                <p className="text-red-400 text-xs">{erroresFormulario?.birthPlace[0]}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="nationality" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">¿Cuál es su nacionalidad?</label>
                            <input type="text" name="nationality" id="nationality" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5  ${erroresFormulario?.nationality && 'border-red-300'}`}
                                onChange={handleInpustChange}
                            />
                            {
                                erroresFormulario?.nationality && 
                                <p className="text-red-400 text-xs">{erroresFormulario?.nationality[0]}</p>
                            }
                        </div>
                        <div>
                            <fieldset>
                                <legend className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">¿Cuál es su género?</legend>
                                <div className="flex items-center mb-4 ps-1">
                                    <input type="radio" name="gender" id="Masculino" className={`w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 ${erroresFormulario?.gender && 'ring-2 ring-red-300'}`}
                                        onClick={handleInpustChange} value='M' 
                                    />
                                    <label htmlFor="Masculino" className="block ms-2  text-sm font-medium text-gray-900">Masculino</label>
                                </div>
                                <div className="flex items-center mb-4 ps-1">
                                    <input type="radio" name="gender" id="Femenino" className={`w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 ${erroresFormulario?.gender && 'ring-2 ring-red-300'}`}
                                        onClick={handleInpustChange} value='F'
                                    />
                                    <label htmlFor="Femenino" className="block ms-2  text-sm font-medium text-gray-900">Femenino</label>
                                </div>
                                <div className="flex items-center mb-4 ps-1">
                                    <input type="radio" name="gender" id="Otro" className={`w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 ${erroresFormulario?.gender && 'ring-2 ring-red-300'}`}
                                        onClick={handleInpustChange} value='O'
                                    />
                                    <label htmlFor="Otro" className="block ms-2  text-sm font-medium text-gray-900">Otro</label>
                                </div>
                            </fieldset>
                            {
                                erroresFormulario?.gender && 
                                <p className="text-red-400 text-xs">{erroresFormulario?.gender[0]}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">¿Cuál es su dirección actual?</label>
                            <input type="text" name="address" id="address" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5  ${erroresFormulario?.address && 'border-red-300'}`}
                                onChange={handleInpustChange}
                            />
                            {
                                erroresFormulario?.address && 
                                <p className="text-red-400 text-xs">{erroresFormulario?.address[0]}</p>
                            }
                        </div>
                        <div>
                            <fieldset>
                                    <legend className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">¿Cuál es su estado civil?</legend>
                                    <div className="flex items-center mb-4 ps-1">
                                        <input type="radio" name="maritalStatus" id="soltero" className={`w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 ${erroresFormulario?.gender && 'ring-2 ring-red-300'}`}
                                            onClick={handleInpustChange} value='ST' 
                                        />
                                        <label htmlFor="soltero" className="block ms-2  text-sm font-medium text-gray-900">Soltero/a</label>
                                    </div>
                                    <div className="flex items-center mb-4 ps-1">
                                        <input type="radio" name="maritalStatus" id="casado" className={`w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 ${erroresFormulario?.gender && 'ring-2 ring-red-300'}`}
                                            onClick={handleInpustChange} value='C'
                                        />
                                        <label htmlFor="casado" className="block ms-2  text-sm font-medium text-gray-900">Casado/a</label>
                                    </div>
                                    <div className="flex items-center mb-4 ps-1">
                                        <input type="radio" name="maritalStatus" id="viudo" className={`w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 ${erroresFormulario?.gender && 'ring-2 ring-red-300'}`}
                                            onClick={handleInpustChange} value='V'
                                        />
                                        <label htmlFor="viudo" className="block ms-2  text-sm font-medium text-gray-900">Viudo/a</label>
                                    </div>
                                    <div className="flex items-center mb-4 ps-1">
                                        <input type="radio" name="maritalStatus" id="separado" className={`w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 ${erroresFormulario?.gender && 'ring-2 ring-red-300'}`}
                                            onClick={handleInpustChange} value='S'
                                        />
                                        <label htmlFor="separado" className="block ms-2  text-sm font-medium text-gray-900">Separado/a</label>
                                    </div>
                                    <div className="flex items-center mb-4 ps-1">
                                        <input type="radio" name="maritalStatus" id="divorciado" className={`w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 ${erroresFormulario?.gender && 'ring-2 ring-red-300'}`}
                                            onClick={handleInpustChange} value='D'
                                        />
                                        <label htmlFor="divorciado" className="block ms-2  text-sm font-medium text-gray-900">Divorciado/a</label>
                                    </div>
                                    <div className="flex items-center mb-4 ps-1">
                                        <input type="radio" name="maritalStatus" id="parejahecho" className={`w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 ${erroresFormulario?.gender && 'ring-2 ring-red-300'}`}
                                            onClick={handleInpustChange} value='P'
                                        />
                                        <label htmlFor="divorciado" className="block ms-2  text-sm font-medium text-gray-900">Pareja de hecho</label>
                                    </div>
                            </fieldset>
                            {
                                erroresFormulario?.maritalStatus && 
                                <p className="text-red-400 text-xs">{erroresFormulario?.maritalStatus[0]}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="sentimentalCouple" className="block mb-2 text-sm font-medium text-gray-900">¿Quién es su pareja sentimental o persona íntima de convivencia?</label>
                            <input type="text" name="sentimentalCouple" id="sentimentalCouple" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                                onChange={handleInpustChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="language" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:ml-1 after:text-red-500">¿Qué idioma usa en su día a día?</label>
                            <input type="text" name="language" id="language" className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5  ${erroresFormulario?.language && 'border-red-300'}`}
                                onChange={handleInpustChange}
                            />
                            {
                                erroresFormulario?.language && 
                                <p className="text-red-400 text-xs">{erroresFormulario?.language[0]}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="otherLanguages" className="block mb-2 text-sm font-medium text-gray-900">¿Qué otros idiomas conoce?</label>
                            <textarea name="otherLanguages" id="otherLanguages" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                                onChange={handleInpustChange}
                            />
                            {
                                erroresFormulario?.otherLanguages && 
                                <p className="text-red-400 text-xs">{erroresFormulario?.otherLanguages[0]}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="culturalHeritage" className="block mb-2 text-sm font-medium text-gray-900">¿Con qué origen cultural se identifica?</label>
                            <input type="text" name="culturalHeritage" id="culturalHeritage" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                                onChange={handleInpustChange}
                            />
                            {
                                erroresFormulario?.culturalHeritage && 
                                <p className="text-red-400 text-xs">{erroresFormulario?.culturalHeritage[0]}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="faith" className="block mb-2 text-sm font-medium text-gray-900">¿Tiene alguna creencia espiritual o practica alguna creencia religiosa?</label>
                            <input type="text" name="faith" id="faith" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                                onChange={handleInpustChange}
                            />
                            {
                                erroresFormulario?.faith && 
                                <p className="text-red-400 text-xs">{erroresFormulario?.faith[0]}</p>
                            }
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
                        Añadir usuario
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

export default withAuth(CrearPaciente, ['administrador', 'medico/enfermero', 'educador social/terapeuta ocupacional', 'trabajador social', 'auxiliar'])