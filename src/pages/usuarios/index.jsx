import '../dashboard/styles.css';
import DashboardLayout from '../dashboard/layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import PopUp from '@/components/popUps/popUp';
import Alerts from '@/components/alerts/alerts';
import { useSession } from 'next-auth/react';
import { GoogleGenAI } from "@google/genai";

import { getContactData, getPersonalData, getPersonality } from '@/api/exportar';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

function Pacientes() {
    const {data: session, status} = useSession()
    const [showAlert, setShowAlert] = useState()
    const [showError, setShowError] = useState()
    const [openPopUp, setOpenPopUp] = useState(false)
    const [openPopUpExportar, setOpenPopUpExportar] = useState(false)
    const [selectedData, setSelectedData] = useState(0)
    const router = useRouter()

    const [buscarPaciente, setBuscarPaciente] = useState('')
    const [pacientes, setPacientes] = useState([])
    const [seleccionarPaciente, setSeleccionarPaciente] = useState()

    const [paginaActual, setPaginaActual] = useState(1)
    const [totalPacientes, setTotalPacientes] = useState(0)
    const pacientesPorPagina = 5

    const getPacientes = async (organizacion) => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getPacientes?idOrganizacion='+ organizacion + '&page=' + paginaActual + '&limit=' + pacientesPorPagina, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            }
        })
        if(response.ok){
            const data = await response.json()
            setPacientes(data.pacientes)
            setTotalPacientes(data.totalPacientes)
        }
    }

    useEffect(()=>{
        if (status === 'authenticated' && session?.user?.idOrganizacion) {
            getPacientes(session?.user?.idOrganizacion)
        }
    },[session, status, paginaActual])

    const getPaciente = async (nombre) => {
        if (!nombre) {getPacientes(session?.user?.idOrganizacion)
            return
        }

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'searchPaciente?nombre=' + nombre + '&idOrganizacion=' + session?.user?.idOrganizacion, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            }
        })

        if (response.ok) {
            const data = await response.json()
            setPacientes(data.pacientes)
        } else {
            setPacientes([])
        }
    }

    const eliminarPaciente = async (pacienteId) => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'eliminarPaciente', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({pacienteId})
        })

        if(response.ok){
            const data = await response.json()
            setShowAlert(data.message)
            getPacientes(session?.user?.idOrganizacion)
        }else {
            setShowError(data.error)
        }
    }

    const contentPopUpExportar = (
        <fieldset>
                <legend className="block mb-4 text-sm font-medium text-gray-900">
                    ¿Que desea exportar?
                </legend>

                {/* <div className="flex items-center mb-4">
                    <input
                        type="radio"
                        name="informe"
                        id="personalData"
                        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                        value="0"
                        onClick={(e)=>setSelectedData(e.target.value)}
                    />
                    <label htmlFor="Masculino" className="block ms-2 text-sm font-medium text-gray-900">
                        Todos
                    </label>
                </div> */}

                <div className="flex items-center mb-4">
                    <input
                        type="radio"
                        name="exportar"
                        id="personalData"
                        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                        value="1"
                        onClick={(e)=>setSelectedData(e.target.value)}
                    />
                    <label htmlFor="personalData" className="block ms-2 text-sm font-medium text-gray-900">
                        Datos personales
                    </label>
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="radio"
                        name="exportar"
                        id="personalidad"
                        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                        value="2"
                        onClick={(e)=>setSelectedData(e.target.value)}
                    />
                    <label htmlFor="personalidad" className="block ms-2 text-sm font-medium text-gray-900">
                        Personalidad
                    </label>
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="radio"
                        name="exportar"
                        id="contactData"
                        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                        value="3"
                        onClick={(e)=>setSelectedData(e.target.value)}
                    />
                    <label htmlFor="contactData" className="block ms-2 text-sm font-medium text-gray-900">
                        Datos de contacto
                    </label>
                </div>
                {/* <div className="flex items-center mb-4">
                    <input
                        type="radio"
                        name="exportar"
                        id="juventud"
                        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                        value="3"
                        onClick={(e)=>setSelectedData(e.target.value)}
                    />
                    <label htmlFor="juventud" className="block ms-2 text-sm font-medium text-gray-900">
                        Juventud
                    </label>
                </div> */}
        </fieldset>
    );


    const exportarPDF = async (id) => {
        try {
            let data;

            switch (selectedData) {
                case '1':
                    data = await getPersonalData(id, session.user.token);
                    break;
                case '2':
                    data = await getPersonality(id,session.user.token);
                    break;
                case '3':
                    data = await getContactData(id,session.user.token);
                    break;
                default:
                    console.warn('No se reconoce el valor de selectedData:', selectedData);
                    return;
            }

            const res = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: "A partir del siguiente objeto JSON que describe la historia de vida de una persona, genera un informe detallado en formato HTML (para introducirlo dentro de una section). El HTML debe tener una estructura clara y profesional, incluyendo secciones con títulos, párrafos bien redactados, y estilos básicos para una presentación legible (usa etiquetas HTML estándar como <h1>, <p>, <ul>, etc.). Por favor, no devuelvas explicaciones ni comentarios, solo el contenido HTML final. Este es el JSON de entrada: " + JSON.stringify(data),
            });

            if (res.text) {
                const dataPaciente = res.text;
                const informe = await fetch(`${process.env.NEXT_PUBLIC_API_URL}exportarInforme`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session.user.token}`
                    },
                    body: JSON.stringify({ dataPaciente })
                });

                if (informe.ok) {
                    const blob = await informe.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'informe.pdf';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    setSelectedData('');
                    setOpenPopUpExportar(false);
                }
            }
        } catch (error) {
            console.error('Error al exportar PDF:', error);
        }
    };

    return (
        <DashboardLayout>
            <div className='flex items-center justify-end'>
                <input type="text" placeholder='Buscar usuario...' className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-64 p-2.5"
                    value={buscarPaciente}
                    onChange={(e)=>{
                        setBuscarPaciente(e.target.value)
                        getPaciente(e.target.value) 
                    }}
                />
            </div>
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className='flex flex-grow flex-col'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-2xl font-semibold'>Usuarios</h2>
                    <div className='w-18 flex items-center justify-between text-gray-500 cursor-pointer hover:text-green-400'
                        onClick={()=>{router.push('usuarios/create')}}
                    >
                        Añadir
                        <svg className="shrink-0 w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd"/>
                        </svg>
                    </div>
                </div>
                <div className="py-4">
                    {
                        pacientes.length > 0 ?
                         pacientes.filter(paciente => paciente.name.toLowerCase().includes(buscarPaciente.toLowerCase())).map((paciente, index) => (
                            <div className='border-b border-gray-100 transition-all duration-[1000ms] ease-[cubic-bezier(0.15,0.83,0.66,1)] hover:scale-[1.01]' key={index}>
                                <div className='bg-white hover:bg-gradient-to-r from-blue-300 to-blue-200 shadow-sm p-4 flex items-center justify-between rounded-sm my-0.5 cursor-pointer'
                                    onClick={()=>router.push('usuarios/'+paciente.id)}>
                                    <div className='flex items-center'>
                                        {/* <img src={paciente.imgPerfil} alt={paciente.nombre} className='rounded-full w-16 h-auto max-w-16 mr-2'/> */}
                                        <p className='text-lg font-semibold'>{paciente.name} {paciente.firstSurname} {paciente.secondSurname}</p>
                                    </div>
                                    
                                    <div className='w-18 flex items-center justify-between'>
                                            <div title='Exportar' className='cursor-pointer' onClick={(e)=> {e.stopPropagation(); setOpenPopUpExportar(!openPopUpExportar); setSeleccionarPaciente(paciente)}}>
                                                <svg class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 hover:text-green-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 17v-5h1.5a1.5 1.5 0 1 1 0 3H5m12 2v-5h2m-2 3h2M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m6 4v5h1.375A1.627 1.627 0 0 0 14 15.375v-1.75A1.627 1.627 0 0 0 12.375 12H11Z"/>
                                                </svg>
                                            </div>
                                        <div className='cursor-pointer' onClick={(e)=> {e.stopPropagation(); router.push('usuarios/'+paciente.id)}}>
                                            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 hover:text-yellow-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                            <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                            </svg>
                                        </div>
                                        <div data-tooltip-target="tooltip-default" className='cursor-pointer' onClick={(e)=> {e.stopPropagation(); setOpenPopUp(!openPopUp); setSeleccionarPaciente(paciente)}}>
                                            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 hover:text-red-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                        :
                            <div className='border-b border-gray-100'>
                                <div role="status" className='bg-white shadow-sm p-4 flex items-center justify-between animate-pulse'>
                                    <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-64'></div>
                                    
                                    <div className='w-12 flex items-center justify-between'>
                                        <div className='h-2.5 ms-2 bg-gray-200 rounded-full w-24'></div>
                                        <div className='h-2.5 ms-2 bg-gray-200 rounded-full w-24'></div>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
                {buscarPaciente === '' && (
                <div className="flex justify-center mt-4">
                    <button
                        className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-300"
                        onClick={() => {
                            const nuevaPagina = paginaActual - 1
                            setPaginaActual(nuevaPagina)
                            getPacientes(session?.user?.idOrganizacion, nuevaPagina)
                        }}
                        disabled={paginaActual === 1}
                    >
                        Anterior
                    </button>
                    <span className="px-4 py-2 mx-2">
                        Página {paginaActual} de {Math.ceil(totalPacientes / pacientesPorPagina)}
                    </span>
                    <button
                        className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-300"
                        onClick={() => {
                            const nuevaPagina = paginaActual + 1
                            setPaginaActual(nuevaPagina)
                            getPacientes(session?.user?.idOrganizacion, nuevaPagina)
                        }}
                        disabled={paginaActual >= Math.ceil(totalPacientes / pacientesPorPagina)}
                    >
                        Siguiente
                    </button>
                </div>
                )}
            </div>
            {
                showAlert &&
                <Alerts alertContent={showAlert} alertType={'success'}/>
            }
            {
                showError &&
                <Alerts alertContent={showError} alertType={'error'}/>
            }
            
            <PopUp
                open={openPopUp} 
                popTitle="Eliminar paciente"
                popContent={`¿Está seguro de que desea eliminar al paciente ${seleccionarPaciente?.name} ${seleccionarPaciente?.firstSurname} ${seleccionarPaciente?.secondSurname}?`}
                popType="option"
                confirmFunction={() => {
                    eliminarPaciente(seleccionarPaciente?.id);
                    setOpenPopUp(false);
                }}
                cancelFunction={() => setOpenPopUp(false)}
            />
            <PopUp
                open={openPopUpExportar} 
                popTitle="Exportar informe"
                popContent={contentPopUpExportar}
                popType="option"
                confirmFunction={() => {
                    exportarPDF(seleccionarPaciente?.id);
                }}
                cancelFunction={() => setOpenPopUpExportar(false)}
            />
                
        </DashboardLayout>
    )
}

export default withAuth(Pacientes, ['administrador', 'medico/enfermero', 'educador social/terapeuta ocupacional', 'auxiliar', 'trabajador social'])