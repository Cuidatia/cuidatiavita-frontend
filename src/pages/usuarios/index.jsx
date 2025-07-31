import '../dashboard/styles.css';
import DashboardLayout from '../dashboard/layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import PopUp from '@/components/popUps/popUp';
import Alerts from '@/components/alerts/alerts';
import { useSession } from 'next-auth/react';
import { Trash, FilePenLine, FileDown } from 'lucide-react';

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
    const pacientesPorPagina = 25

    const getPacientes = async (organizacion) => {
        const isSuperAdmin = session?.user?.roles.split(',').includes('superadmin')
        const endpoint = isSuperAdmin
        ? 'getAllPacientes?page=' + paginaActual + '&limit=' + pacientesPorPagina
        : 'getPacientes?idOrganizacion='+ organizacion + '&page=' + paginaActual + '&limit=' + pacientesPorPagina
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, {
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
        const isSuperAdmin = session?.user?.roles.split(',').includes('superadmin')
        const endpoint = isSuperAdmin
        ? 'searchPaciente?nombre=' + nombre
        : 'searchPaciente?nombre=' + nombre + '&idOrganizacion=' + session?.user?.idOrganizacion
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, {
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
                        result_json = {  "¿Fue usted al colegio? ¿Qué estudios realizó?": result.childhoodStudies, 
                                    "¿Dónde realizó sus estudios? ¿A qué centro formativo asistió?": result.childhoodSchool,
                                    "¿Qué motivaciones tenía?": result.childhoodMotivations,
                                    "¿Qué personas formaban su núcleo familiar? ¿Qué relación tenía con ellos?": result.childhoodFamilyCore,
                                    "¿Quiénes formaban su grupo de amigos? ¿Cómo se llevaba con ellos?": result.childhoodFriendsGroup,
                                    "¿Quién fue su persona más importante durante esta etapa?": result.childhoodImportantPerson,
                                    "¿Pudo viajar en esta etapa de vida? ¿Qué lugares visitó?": result.childhoodTravels,
                                    "¿Cuál era su lugar favorito? ¿Recuerda cómo era?": result.childhoodFavouritePlace,
                                    "¿Qué experiencias positivas tuvo?": result.childhoodPositiveExperiences,
                                    "¿Qué experiencias negativas tuvo?": result.childhoodNegativeExperiences,
                                    "¿Qué responsabilidades tenía durante esta etapa?": result.childhoodResponsabilities,
                                    "¿Dónde vivió? ¿Cómo era el lugar donde vivía?": result.childhoodAddress,
                                    "¿Qué gustos tenía en esta etapa de vida?": result.childhoodLikes,
                                    "¿Qué le daba miedo o provocaba temor?": result.childhoodAfraids,
                                    "¿Cantaba alguna canción en su infancia? ¿Recuerda cómo era?": result.childhoodMusic
                                }
                        dataRecolectada["Infancia"] = result_json;
                        break;
                    case '4':
                        result = await getJuventud(id, session.user.token);
                        result_json = {  "¿Qué estudios realizó? ¿Qué le gustaba? ¿Pudo estudiar lo que quería?": result.youthStudies, 
                                    "¿Dónde realizó sus estudios? ¿A qué centro formativo asistió?": result.youthSchool,
                                    "En esta etapa de vida, ¿Comenzó a trabajar? ¿Dónde trabajaba?": result.youthWorkPlace,
                                    "Si trabajaba, ¿Qué rol desempeñaba? ¿Disfrutaba de ese trabajo?": result.youthWorkRol,
                                    "¿Qué personas formaban su núcleo familiar? ¿Cómo se llevaba con ellos?": result.youthFamilyCore,
                                    "¿Quiénes formaban su grupo de amigos? ¿Cómo se llevaba con ellos?": result.youthFriendsGroup,
                                    "¿Quién fue su persona más importante durante esta etapa?": result.youthImportantPerson,
                                    "¿Qué lugares pudo visitar? ¿Dónde ha viajado?": result.youthTravels,
                                    "¿Cuál era su lugar favorito? ¿Cómo describiría este lugar?": result.youthFavouritePlace,
                                    "¿Qué rutina seguía en su día a día?": result.youthRoutine,
                                    "¿Qué experiencias positivas tuvo?": result.youthPositiveExperiences,
                                    "¿Qué experiencias negativas tuvo?": result.youthNegativeExperiences,
                                    "¿Qué responsabilidades tenía durante esta etapa?": result.youthResponsabilities,
                                    "¿Dónde vivió? ¿Cómo era el lugar donde vivía?": result.youthAddress,
                                    "¿Qué gustos tenía en esta etapa de vida? ¿Eran los mismos que tenía en la infancia?": result.youthLikes,
                                    "¿Qué hobbies o aficiones desarrolló?": result.youthHobbies,
                                    "¿Qué le daba miedo o provocaba temor?": result.youthAfraids,
                                    "¿Tuvo parejas sentimentales o relaciones amorosas? ¿Qué recuerdos tiene de esas personas?": result.youthSentimentalCouple,
                                    "¿Se propuso iniciar algún proyecto?": result.youthProjects,
                                    "¿Acabó algún proyecto que se propuso? ¿Le quedó alguna tarea por completar?": result.youthUncompletedProjects,
                                    "¿Sufrió alguna enfermedad que le marcase durante esta etapa de vida?": result.youthIllness,
                                    "¿Sufrió alguna crisis emocional que le marcase durante esta etapa de vida?": result.youthPersonalCrisis,
                                    "¿Qué tipo de música escuchaba?": result.youthMusic
                                }
                        dataRecolectada["Juventud"] = result_json;
                        break;
                    case '5':
                        result = await getAdultez(id, session.user.token);
                        result_json = {  "¿Quién es su pareja sentimental o persona íntima de convivencia? ¿Qué momentos significativos vivieron juntos?": result.adulthoodSentimentalCouple, 
                                    "¿Cuántos hijos tuvo? ¿Cómo se llaman sus hijos?": result.adulthoodChildren,
                                    "¿Siguió estudiando en esta etapa de vida? Si es así, ¿Qué estudios realizó?": result.adulthoodStudies,
                                    "En esta etapa de vida, ¿Comenzó a trabajar? ¿Dónde trabajaba?": result.adulthoodWorkPlace,
                                    "Si trabajaba, ¿En qué consistía su trabajo? ¿Qué rol desempeñaba?": result.adulthoodWorkRol,
                                    "¿Qué personas formaban su núcleo familiar? ¿Cómo se llevaba con ellos?": result.adulthoodFamilyCore,
                                    "¿Quiénes formaban su grupo de amigos? ¿Cómo se llevaba con ellos?": result.adulthoodFriendsGroup,
                                    "¿Qué relaciones mantenía en el entorno laboral? ¿Cómo se llevaba con ellos?": result.adulthoodWorkGroup,
                                    "¿Quién fue su persona más importante durante esta etapa?": result.adulthoodImportantPerson,
                                    "¿Qué lugares pudo visitar? ¿Dónde ha viajado?": result.adulthoodTravels,
                                    "¿Cuál era su lugar favorito? ¿Tiene alguna anécdota o vivencia en ese lugar?": result.adulthoodFavouritePlace,
                                    "¿Qué rutina seguía en su día a día? ¿Cómo organizaba la vida en el hogar?": result.adulthoodRoutine,
                                    "¿Qué experiencias positivas tuvo?": result.adulthoodPositiveExperiences,
                                    "¿Qué experiencias negativas tuvo?": result.adulthoodNegativeExperiences,
                                    "¿Qué responsabilidades tenía durante esta etapa?": result.adulthoodResponsabilities,
                                    "¿Dónde vivió? ¿Cómo era el lugar donde vivía?": result.adulthoodAddress,
                                    "¿Cómo era su situación económica? ¿Cómo compaginaba su vida laboral con su vida familiar?": result.adulthoodEconomicSituation,
                                    "¿Se propuso iniciar algún proyecto?": result.adulthoodProjects,
                                    "¿Acabó algún proyecto que se propuso? ¿Le quedó alguna tarea por completar?": result.adulthoodUncompletedProjects,
                                    "¿Sufrió alguna enfermedad que le marcase durante esta etapa de vida?": result.adulthoodIllness,
                                    "¿Sufrió alguna crisis emocional que le marcase durante esta etapa de vida?": result.adulthoodPersonalCrisis,
                                    "¿Qué música sonaba en esta etapa de su vida? ¿Recuerda alguna canción?": result.adulthoodMusic
                                }
                        dataRecolectada["Edad adulta"] = result_json;
                        break;
                    case '6':
                        result = await getMadurez(id, session.user.token);
                        result_json = {  "¿Tuvo nietos? Si es así, ¿Cuántos nietos tuvo? ¿Cómo se llaman sus nietos? ¿Puede verlos con frecuencia?": result.maturityGrandchildren, 
                                    "¿Dónde trabajaba? ¿Disfrutaba de su trabajo?": result.maturityWorkPlace,
                                    "¿Qué rol desempeñaba? ¿Cambió a lo largo de los años?": result.maturityWorkRol,
                                    "¿Qué personas formaban su núcleo familiar? ¿Cómo se llevaba con ellos?": result.maturityFamilyCore,
                                    "¿Quiénes formaban su grupo de amigos? ¿Cómo se llevaba con ellos?": result.maturityFriendsGroup,
                                    "¿Qué relaciones mantenía en el entorno laboral? ¿Cómo se llevaba con ellos?": result.maturityWorkGroup,
                                    "¿Quién fue su persona más importante durante esta etapa?": result.maturityImportantPerson,
                                    "¿Qué lugares pudo visitar? ¿Recuerda alguno con especial cariño?": result.maturityTravels,
                                    "¿Cuál era su lugar favorito? ¿Ha cambiado respecto a otras etapas?": result.maturityFavouritePlace,
                                    "¿Qué rutina seguía en su día a día?": result.maturityRoutine,
                                    "¿Qué experiencias positivas tuvo?": result.maturityPositiveExperiences,
                                    "¿Qué experiencias negativas tuvo?": result.maturityNegativeExperiences,
                                    "¿Qué responsabilidades tenía durante esta etapa?": result.maturityResponsabilities,
                                    "¿Cómo planteó su jubilación?": result.maturityRetirement,
                                    "¿Qué deseos ha planteado para su última etapa de vida?": result.maturityWills,
                                    "¿Se propuso iniciar algún proyecto?": result.maturityProjects,
                                    "¿Acabó algún proyecto que se propuso? ¿Le quedó alguna tarea por completar?": result.maturityUncompletedProjects,
                                    "¿Sufrió alguna enfermedad que le marcase durante esta etapa de vida?": result.maturityIllness,
                                    "¿Sufrió alguna crisis emocional que le marcase durante esta etapa de vida?": result.maturityPersonalCrisis,
                                    "¿Cuáles son sus canciones favoritas?": result.maturityMusic
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
                                    "¿Se ha caído con frecuencia? ¿Cuántas veces ha llegado a caerse en el último año?": result.fallRisks,
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
            <div className="flex items-center justify-end px-8 pt-6">
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    className="border border-gray-300 rounded-xl px-4 py-2 text-sm w-64 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    value={buscarPaciente}
                    onChange={(e) => {
                    setBuscarPaciente(e.target.value);
                    getPaciente(e.target.value);
                    }}
                />
                </div>

                <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <div className="flex flex-col px-8">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-800">Usuarios</h2>
                    {!session?.user?.roles.split(',').includes('superadmin') && (
                    <button
                    onClick={() => router.push("usuarios/create")}
                    className="cursor-pointer flex items-center gap-1 text-sm text-gray-600 hover:text-green-500 transition"
                    >
                    Añadir
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                        />
                    </svg>
                    </button>
                    )}
                </div>

                <div className="py-4">
                    {pacientes.length > 0 ? (
                    pacientes
                        .filter((p) =>
                        p.name.toLowerCase().includes(buscarPaciente.toLowerCase())
                        )
                        .map((paciente, index) => (
                        <div
                            key={index}
                            className="border-b border-gray-200 transition-transform hover:scale-[1.005]"
                            >
                            <div
                                className="bg-white hover:bg-blue-100 transition-colors duration-200 p-4 flex items-center justify-between rounded-md cursor-pointer"
                                onClick={() => router.push(`usuarios/${paciente.id}`)}
                            >
                                <p className="text-base font-medium text-gray-800 truncate">
                                {paciente.name} {paciente.firstSurname} {paciente.secondSurname}
                                </p>

                                <div className="flex items-center gap-3">
                                <button
                                    title="Exportar"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenPopUpExportar(!openPopUpExportar);
                                    setSeleccionarPaciente(paciente);
                                    }}
                                    className="text-gray-500 hover:text-green-500 transition-colors cursor-pointer"
                                >
                                    <FileDown className="w-5 h-5" />
                                </button>

                                <button
                                    title="Editar"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`usuarios/${paciente.id}`);
                                    }}
                                    className="cursor-pointer text-gray-500 hover:text-yellow-500 transition-colors"
                                >
                                    <FilePenLine className="w-5 h-5" />
                                </button>

                                <button
                                    title="Eliminar"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenPopUp(!openPopUp);
                                    setSeleccionarPaciente(paciente);
                                    }}
                                    className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                    <Trash className="w-5 h-5" />
                                </button>
                                </div>
                            </div>
                            </div>
                        ))
                    ) : (
                    <div className="border border-gray-200 rounded-md">
                        <div
                        role="status"
                        className="bg-white p-4 animate-pulse flex justify-between items-center"
                        >
                        <div className="h-2.5 bg-gray-300 rounded w-64"></div>
                        <div className="h-2.5 bg-gray-200 rounded w-24"></div>
                        </div>
                    </div>
                    )}
                </div>

                {buscarPaciente === "" && (
                    <div className="flex justify-center mt-6">
                    <button
                        className="px-4 py-2 mx-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-md disabled:opacity-50"
                        onClick={() => {
                        const nuevaPagina = paginaActual - 1;
                        setPaginaActual(nuevaPagina);
                        getPacientes(session?.user?.idOrganizacion, nuevaPagina);
                        }}
                        disabled={paginaActual === 1}
                    >
                        Anterior
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                        Página {paginaActual} de{" "}
                        {Math.ceil(totalPacientes / pacientesPorPagina)}
                    </span>
                    <button
                        className="px-4 py-2 mx-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-md disabled:opacity-50"
                        onClick={() => {
                        const nuevaPagina = paginaActual + 1;
                        setPaginaActual(nuevaPagina);
                        getPacientes(session?.user?.idOrganizacion, nuevaPagina);
                        }}
                        disabled={
                        paginaActual >= Math.ceil(totalPacientes / pacientesPorPagina)
                        }
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

export default withAuth(Pacientes, ['superadmin','administrador', 'medico/enfermero', 'educador social/terapeuta ocupacional', 'auxiliar', 'trabajador social'])