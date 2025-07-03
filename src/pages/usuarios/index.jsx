import '../dashboard/styles.css';
import DashboardLayout from '../dashboard/layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import PopUp from '@/components/popUps/popUp';
import Alerts from '@/components/alerts/alerts';
import { useSession } from 'next-auth/react';
import { GoogleGenAI } from "@google/genai";

import { 
    getAdultez,
    getContactData,
    getInfancia, 
    getJuventud, 
    getKitchenHygiene, 
    getMadurez, 
    getNursingMedicine, 
    getPersonalData, 
    getPersonality, 
    getPharmacy, 
    getSanitaryData,
    getSocialEdu,
    getSocialWork} from '@/api/exportar';
import CheckboxAccordion from '@/components/chekboxAcordeon/checkboxAcordeon';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

function Pacientes() {
    const {data: session, status} = useSession()
    const [showAlert, setShowAlert] = useState()
    const [showError, setShowError] = useState()
    const [openPopUp, setOpenPopUp] = useState(false)
    const [openPopUpExportar, setOpenPopUpExportar] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState(["0"])
    const router = useRouter()
    const [showPopUpExportar, setShowPopUpExportar] = useState(false)
    const [buscarPaciente, setBuscarPaciente] = useState('')
    const [pacientes, setPacientes] = useState([])
    const [seleccionarPaciente, setSeleccionarPaciente] = useState()
    const [loadingExport, setLoadingExport] = useState(false);
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

    const exportarPDF = async (id) => {
        try {
            setLoadingExport(true);
            const dataRecolectada = {};

            for (const option of selectedOptions) {
                let result;
                let result_json;
                let result_gender;
                let result_maritalStatus;
                let result_paymentMethod;

                switch (option) {
                    case '1':
                        result = await getPersonalData(id, session.user.token);
                        switch (result.gender){
                            case 'M':
                                result_gender = 'Hombre'
                                break;
                            case 'F':
                                result_gender = 'Mujer'
                                break;
                            case 'O':
                                result_gender = 'Otro'
                                break;
                        }
                        switch (result.maritalStatus){
                            case 'ST':
                                result_maritalStatus = 'Soltero/a'
                                break;
                            case 'C':
                                result_maritalStatus = 'Casado/a'
                                break;
                            case 'V':
                                result_maritalStatus = 'Viudo/a'
                                break;
                            case 'S':
                                result_maritalStatus = 'Separado/a'
                                break;
                            case 'D':
                                result_maritalStatus = 'Divorciado/a'
                                break;
                            case 'P':
                                result_maritalStatus = 'Pareja de hecho'
                                break;
                        }
                        result_json = {  "¿Cuál es su nombre?": result.name, 
                                    "¿Cuál es su primer apellido?": result.firstSurname,
                                    "¿Cuál es su segundo apellido?": result.secondSurname,
                                    "¿Cómo le gustan que le llamen?": result.alias,
                                    "¿Cuál es su fecha de nacimiento?": result.birthDate,
                                    "¿Cuántos años tiene?": result.age,
                                    "¿En qué lugar nació?": result.birthPlace,
                                    "¿Cuál es su nacionalidad?": result.nationality,
                                    "¿Cuál es su género?": result_gender,
                                    "¿Cuál es su dirección actual?": result.address,
                                    "¿Cuál es su estado civil?": result_maritalStatus,
                                    "¿Quién es su pareja sentimental o persona íntima de convivencia?": result.sentimentalCouple,
                                    "¿Qué idioma usa en su día a día?": result.language,
                                    "¿Qué otros idiomas conoce?": result.otherLanguages,
                                    "¿Con qué origen cultural se identifica?": result.culturalHeritage,
                                    "¿Tiene alguna creencia espiritual o practica alguna creencia religiosa?": result.faith
                                }
                        dataRecolectada["Datos personales"] = result_json;
                        break;
                    case '2':
                        result = await getPersonality(id, session.user.token);
                        result_json = {  "¿Cómo describiría su carácter?": result.nature, 
                                    "¿Qué hábitos o costumbres tiene o repite con frecuencia?": result.habits,
                                    "¿Cuáles son sus gustos actuales?": result.likes,
                                    "¿Qué le provoca rechazo o no le gusta actualmente?": result.dislikes,
                                    "¿Qué le tranquiliza o calma?": result.calmMethods,
                                    "¿Qué le incomoda o molesta?": result.disturbMethods,
                                    "¿Cuáles son sus hobbies o intereses personales?": result.hobbies,
                                    "¿Qué relación tiene con la tecnología?": result.technologyLevel,
                                    "¿Cuáles son sus objetivos personales o metas actuales?": result.goals,
                                    "¿Cuáles son sus canciones favoritas?": result.favouriteSongs,
                                    "¿Qué ropa suele llevar?": result.clothes
                                }
                        dataRecolectada["Personalidad"] = result_json;
                        break;
                    case '3':
                        result = await getInfancia(id, session.user.token);
                        result_json = {  "¿Qué estudios realizó?": result.childhoodStudies, 
                                    "¿Dónde realizó sus estudios?": result.childhoodSchool,
                                    "¿Qué motivaciones tenía?": result.childhoodMotivations,
                                    "¿Qué personas formaban su núcleo familiar? ¿Cómo se llevaba con ellos?": result.childhoodFamilyCore,
                                    "¿Quiénes formaban su grupo de amigos? ¿Cómo se llevaba con ellos?": result.childhoodFriendsGroup,
                                    "¿Quién fue su persona más importante durante esta etapa?": result.childhoodImportantPerson,
                                    "¿Qué lugares pudo visitar? ¿Dónde ha viajado?": result.childhoodTravels,
                                    "¿Cuál era su lugar favorito?": result.childhoodFavouritePlace,
                                    "¿Qué experiencias positivas tuvo?": result.childhoodPositiveExperiences,
                                    "¿Qué experiencias negativas tuvo?": result.childhoodNegativeExperiences,
                                    "¿Qué responsabilidades tenía durante esta etapa?": result.childhoodResponsabilities,
                                    "¿Dónde vivió? ¿Cómo era el lugar donde vivía?": result.childhoodAddress,
                                    "¿Qué gustos tenía en esta etapa de vida?": result.childhoodLikes,
                                    "¿Qué le daba miedo o provocaba temor?": result.childhoodAfraids
                                }
                        dataRecolectada["Infancia"] = result_json;
                        break;
                    case '4':
                        result = await getJuventud(id, session.user.token);
                        result_json = {  "¿Qué estudios realizó?": result.youthStudies, 
                                    "¿Dónde realizó sus estudios?": result.youthSchool,
                                    "En esta etapa de vida, ¿Comenzó a trabajar? ¿Dónde trabajaba?": result.youthWorkPlace,
                                    "Si trabajaba, ¿Qué rol desempeñaba?": result.youthWorkRol,
                                    "¿Qué personas formaban su núcleo familiar? ¿Cómo se llevaba con ellos?": result.youthFamilyCore,
                                    "¿Quiénes formaban su grupo de amigos? ¿Cómo se llevaba con ellos?": result.youthFriendsGroup,
                                    "¿Quién fue su persona más importante durante esta etapa?": result.youthImportantPerson,
                                    "¿Qué lugares pudo visitar? ¿Dónde ha viajado?": result.youthTravels,
                                    "¿Cuál era su lugar favorito?": result.youthFavouritePlace,
                                    "¿Qué rutina seguía en su día a día?": result.youthRoutine,
                                    "¿Qué experiencias positivas tuvo?": result.youthPositiveExperiences,
                                    "¿Qué experiencias negativas tuvo?": result.youthNegativeExperiences,
                                    "¿Qué responsabilidades tenía durante esta etapa?": result.youthResponsabilities,
                                    "¿Dónde vivió? ¿Cómo era el lugar donde vivía?": result.youthAddress,
                                    "¿Qué gustos tenía en esta etapa de vida?": result.youthLikes,
                                    "¿Qué hobbies o aficiones desarrolló?": result.youthHobbies,
                                    "¿Qué le daba miedo o provocaba temor?": result.youthAfraids,
                                    "¿Tuvo parejas sentimentales o relaciones amorosas durante su juventud?": result.youthSentimentalCouple,
                                    "¿Se propuso iniciar algún proyecto?": result.youthProjects,
                                    "¿Acabó algún proyecto que se propuso? ¿Le quedó alguna tarea por completar?": result.youthUncompletedProjects,
                                    "¿Sufrió alguna enfermedad que le marcase durante esta etapa de vida?": result.youthIllness,
                                    "¿Sufrió alguna crisis emocional que le marcase durante esta etapa de vida?": result.youthPersonalCrisis
                                }
                        dataRecolectada["Juventud"] = result_json;
                        break;
                    case '5':
                        result = await getAdultez(id, session.user.token);
                        result_json = {  "¿Quién es su pareja sentimental o persona íntima de convivencia?": result.adulthoodSentimentalCouple, 
                                    "¿Cuántos hijos tuvo? ¿Cómo se llaman sus hijos?": result.adulthoodChildren,
                                    "¿Qué estudios realizó?": result.adulthoodStudies,
                                    "En esta etapa de vida, ¿Comenzó a trabajar? ¿Dónde trabajaba?": result.adulthoodWorkPlace,
                                    "Si trabajaba, ¿Qué rol desempeñaba?": result.adulthoodWorkRol,
                                    "¿Qué personas formaban su núcleo familiar? ¿Cómo se llevaba con ellos?": result.adulthoodFamilyCore,
                                    "¿Quiénes formaban su grupo de amigos? ¿Cómo se llevaba con ellos?": result.adulthoodFriendsGroup,
                                    "¿Qué relaciones mantenía en el entorno laboral? ¿Cómo se llevaba con ellos?": result.adulthoodWorkGroup,
                                    "¿Quién fue su persona más importante durante esta etapa?": result.adulthoodImportantPerson,
                                    "¿Qué lugares pudo visitar? ¿Dónde ha viajado?": result.adulthoodTravels,
                                    "¿Cuál era su lugar favorito?": result.adulthoodFavouritePlace,
                                    "¿Qué rutina seguía en su día a día?": result.adulthoodRoutine,
                                    "¿Qué experiencias positivas tuvo?": result.adulthoodPositiveExperiences,
                                    "¿Qué experiencias negativas tuvo?": result.adulthoodNegativeExperiences,
                                    "¿Qué responsabilidades tenía durante esta etapa?": result.adulthoodResponsabilities,
                                    "¿Dónde vivió? ¿Cómo era el lugar donde vivía?": result.adulthoodAddress,
                                    "¿Cómo era su situación económica?": result.adulthoodEconomicSituation,
                                    "¿Se propuso iniciar algún proyecto?": result.adulthoodProjects,
                                    "¿Acabó algún proyecto que se propuso? ¿Le quedó alguna tarea por completar?": result.adulthoodUncompletedProjects,
                                    "¿Sufrió alguna enfermedad que le marcase durante esta etapa de vida?": result.adulthoodIllness,
                                    "¿Sufrió alguna crisis emocional que le marcase durante esta etapa de vida?": result.adulthoodPersonalCrisis
                                }
                        dataRecolectada["Edad adulta"] = result_json;
                        break;
                    case '6':
                        result = await getMadurez(id, session.user.token);
                        result_json = {  "¿Cuántos nietos tuvo? ¿Cómo se llaman sus nietos?": result.maturityGrandchildren, 
                                    "¿Dónde trabajaba?": result.maturityWorkPlace,
                                    "¿Qué rol desempeñaba?": result.maturityWorkRol,
                                    "¿Qué personas formaban su núcleo familiar? ¿Cómo se llevaba con ellos?": result.maturityFamilyCore,
                                    "¿Quiénes formaban su grupo de amigos? ¿Cómo se llevaba con ellos?": result.maturityFriendsGroup,
                                    "¿Qué relaciones mantenía en el entorno laboral? ¿Cómo se llevaba con ellos?": result.maturityWorkGroup,
                                    "¿Quién fue su persona más importante durante esta etapa?": result.maturityImportantPerson,
                                    "¿Qué lugares pudo visitar? ¿Dónde ha viajado?": result.maturityTravels,
                                    "¿Cuál era su lugar favorito?": result.maturityFavouritePlace,
                                    "¿Qué rutina seguía en su día a día?": result.maturityRoutine,
                                    "¿Qué experiencias positivas tuvo?": result.maturityPositiveExperiences,
                                    "¿Qué experiencias negativas tuvo?": result.maturityNegativeExperiences,
                                    "¿Qué responsabilidades tenía durante esta etapa?": result.maturityResponsabilities,
                                    "¿Cómo planteó su jubilación?": result.maturityRetirement,
                                    "¿Qué deseos ha planteado para su última etapa de vida?": result.maturityWills,
                                    "¿Se propuso iniciar algún proyecto?": result.maturityProjects,
                                    "¿Acabó algún proyecto que se propuso? ¿Le quedó alguna tarea por completar?": result.maturityUncompletedProjects,
                                    "¿Sufrió alguna enfermedad que le marcase durante esta etapa de vida?": result.maturityIllness,
                                    "¿Sufrió alguna crisis emocional que le marcase durante esta etapa de vida?": result.maturityPersonalCrisis
                                }
                        dataRecolectada["Madurez"] = result_json;
                        break;
                    case '7':
                        result = await getSanitaryData(id, session.user.token);
                        result_json = {  "¿Cuál es su diagnóstico principal?": result.mainIllness, 
                                    "¿Tiene alguna alergia?": result.allergies,
                                    "¿Padece otras enfermedades o transtornos?": result.otherIllness
                                }
                        dataRecolectada["Datos sanitarios"] = result_json;
                        break;
                    case '8':
                        result = await getPharmacy(id, session.user.token);
                        switch (result.paymentMethod){
                            case 'S':
                                result_paymentMethod = 'Seguros de salud'
                                break;
                            case 'P':
                                result_paymentMethod = 'Pagos particulares'
                                break;
                            case 'D':
                                result_paymentMethod = 'Programas de descuentos'
                                break;
                        }
                        result_json = {  "¿Toma alguna medicación de forma habitual?": result.treatment, 
                                    "¿Qué farmacia suele frecuentar para adquirir sus medicamentos?": result.regularPharmacy,
                                    "¿Con qué frecuencia visita la farmacia?": result.visitFrequency,
                                    "¿Qué método de pago suele utilizar para adquirir sus medicamentos?": result_paymentMethod
                                }
                        dataRecolectada["Farmacia"] = result_json;
                        break;
                    case '9':
                        result = await getNursingMedicine(id, session.user.token);
                        result_json = {  "¿Qué tal come? ¿Cómo es su situación nutricional?": result.nutritionalSituation, 
                                    "¿Qué tal duerme? ¿Cómo es su calidad de sueño actual?": result.sleepQuality,
                                    "¿Se ha caído con frecuencia? ¿Cuántas veces ha llegado a caerse?": result.fallRisks,
                                    "¿Tiene necesidades especiales de movilidad dentro o fuera de casa?": result.mobilityNeeds,
                                    "¿Tiene preferencias sanitarias? ¿Qué relación tiene con su médico?": result.healthPreferences
                                }
                        dataRecolectada["Medicina/enfermería"] = result_json;
                        break;
                    case '10':
                        result = await getSocialEdu(id, session.user.token);
                        result_json = {  "¿Cómo describiría su capacidad cognitiva?": result.cognitiveAbilities, 
                                    "¿Cómo maneja sus emociones y afectos?": result.affectiveCapacity,
                                    "¿Cómo suele comportarse frente a normas o límites?": result.behaviorCapacity,
                                    "¿Cómo es su participación en actividades del hogar?": result.collaborationLevel,
                                    "¿Cómo lleva su situación económica o sanitaria? ¿Puede hacerlo de forma autónoma?": result.autonomyLevel,
                                    "¿Cómo es su participación en actividades de grupo?": result.groupParticipation
                                }
                        dataRecolectada["Educación social/terapia ocupacional"] = result_json;
                        break;
                    case '11':
                        result = await getSocialWork(id, session.user.token);
                        result_json = {  "¿Vive con otras personas?¿Cuál es su relación con ellas?": result.residentAndRelationship, 
                                    "¿Tiene mascota?¿Qué animal es y cómo se llama?": result.petNameAndBreedPet,
                                    "¿Con qué recursos o prestaciones cuenta?": result.resources,
                                    "¿Con qué apoyos legales cuenta?": result.legalSupport
                                }
                        dataRecolectada["Trabajo social"] = result_json;
                        break;
                    case '12':
                        result = await getKitchenHygiene(id, session.user.token);
                        result_json = {  "¿Cuál es su comida favorita?": result.favouriteFood, 
                                    "¿Tiene restricciones alimentarias?": result.dietaryRestrictions,
                                    "¿Qué cosas le hacen sentir cómodo y seguro en su entorno?": result.confortAdvices,
                                    "¿Cómo es su rutina diaria?": result.routine,
                                    "¿Sigue algún plan de cuidado específico?": result.carePlan
                                }
                        dataRecolectada["Cocina/higiene"] = result_json;
                        break;
                    case '13':
                        // Si hay una función específica para "Otros", llámala aquí
                        dataRecolectada["Otros"] = "No implementado"; // Ajusta si tienes función real
                        break;
                    case '14':
                        result = await getContactData(id, session.user.token);
                        result_json = {  "¿Cómo se llama la persona con la que se debe contactar si ocurre algo?": result.contactName, 
                                    "¿Cuál es su primer apellido?": result.contactFirstSurname,
                                    "¿Cuál es su segundo apellido?": result.contactSecondSurname,
                                    "¿Dónde reside esa persona?": result.contactAddress,
                                    "¿Cuál es su correo electrónico?": result.contactEmail,
                                    "¿Cuál es su número de teléfono?": result.contactTelecom,
                                    "¿Cuenta con curatela actualmente?": result.curatela,
                                    "¿Tiene alguna persona que le apoye habitualmente para tomar decisiones o cuidarla?": result.deFactoGuardian
                                }
                        dataRecolectada["Datos de contacto"] = result_json;
                        break;
                    default:
                        console.warn('Valor no reconocido en selectedOptions:', option);
                }
            }

            if (Object.keys(dataRecolectada).length === 0) {
                console.warn("No se seleccionaron datos válidos.");
                setLoadingExport(false);
                return;
            }

            /*const res = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents:
                    "A partir del siguiente objeto JSON que describe diferentes aspectos de la vida de una persona, genera un informe detallado en formato HTML (para introducirlo dentro de una sección). El HTML debe ser profesional, con títulos y párrafos bien redactados. Aquí va el JSON: " +
                    JSON.stringify(dataRecolectada),
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
                }
                */

                const informe = await fetch(`${process.env.NEXT_PUBLIC_API_URL}exportarInforme`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session.user.token}`
                    },
                    body: JSON.stringify({ datos: dataRecolectada })
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
                    setSelectedOptions([]);
                    setOpenPopUpExportar(false);
                }

        } catch (err) {
            console.error("Error al exportar PDF:", err);
        } finally {
            setLoadingExport(false);
            setShowPopUpExportar(false);
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
                popContent={<CheckboxAccordion selected={selectedOptions} setSelected={setSelectedOptions} />}
                popType="option"
                confirmFunction={() => {
                    exportarPDF(seleccionarPaciente?.id);
                }}
                cancelFunction={() => setOpenPopUpExportar(false)}
                loading={loadingExport}
            />
            {loadingExport && (
            <div className="fixed top-0 left-0 w-full z-50">
                <div className="h-2 w-full bg-gradient-to-r bg-green-500" />
            </div>
            )}
                
        </DashboardLayout>
    )
}

export default withAuth(Pacientes, ['administrador', 'medico/enfermero', 'educador social/terapeuta ocupacional', 'auxiliar', 'trabajador social'])