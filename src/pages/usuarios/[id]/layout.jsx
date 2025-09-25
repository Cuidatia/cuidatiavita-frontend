import DashboardLayout from "@/pages/dashboard/layout"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import { useRouter } from "next/router"
import PopUp from '@/components/popUps/popUp';
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
import { CloudCog } from "lucide-react";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

    

export default function PacienteLayout({ children, mostrarPaciente, page }) {
    const {data: session, status} = useSession()
    const [openPopUp, setOpenPopUp] = useState(false)
    const [message, setMessage] = useState()
    const [error, setError] = useState()
    const router = useRouter()
    const {id} = router.query

    const [selectedOptions, setSelectedOptions] = useState([page])
    const [loadingExport, setLoadingExport] = useState(false);
    const [showPopUpExportar, setShowPopUpExportar] = useState(false)

    const exportarDatos = async () => {
        setLoadingExport(true);
        const dataRecolectada = {};
         try {
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
                setShowPopUpExportar(false);
            }
        } catch (err) {
            console.error("Error al exportar PDF:", err);
        } finally {
            setLoadingExport(false);
            setShowPopUpExportar(false);
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
            setMessage(data.message)
            router.push("/usuarios/");
        }else {
            setError(data.error)
        }
    }
 
    return(
        <DashboardLayout>
            <div className="flex items-center bg-white justify-between px-4 py-4">
                <h2
                    className="text-xl font-medium text-gray-800 hover:text-blue-400 transition-colors cursor-pointer"
                    onClick={() => router.push("/usuarios/" + mostrarPaciente.id)}
                >
                    {mostrarPaciente?.name} {mostrarPaciente?.firstSurname} {mostrarPaciente?.secondSurname}
                </h2>

                <div className="flex gap-2">
                    {session?.user?.roles.split(',').includes('superadmin') || session?.user?.roles.split(',').includes('administrador') &&
                    <button
                        onClick={() => setOpenPopUp(!openPopUp)}
                        className="text-red-600 border border-red-500 hover:bg-red-500 hover:text-white transition-all px-4 py-1.5 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-red-300 cursor-pointer"
                        >
                        Eliminar
                        </button>
                    }
                    <button
                    onClick={() => setShowPopUpExportar(!showPopUpExportar)}
                    disabled={loadingExport}
                    className="text-green-600 border border-green-500 hover:bg-green-500 hover:text-white transition-all px-4 py-1.5 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-green-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                    Exportar
                    </button>
                </div>
            </div>

            <div className="border-t border-gray-200 mb-4"></div>

            <div className="px-4 py-2 space-y-8">
                {children}
            </div>

            <PopUp
                open={openPopUp} 
                popTitle="Eliminar usuario"
                popContent={`¿Está seguro de que desea eliminar al usuario ${mostrarPaciente?.name} ${mostrarPaciente?.firstSurname} ${mostrarPaciente?.secondSurname}?`}
                popType="option"
                confirmFunction={() => {
                    eliminarPaciente(mostrarPaciente.id);
                    setOpenPopUp(false);
                }}
                cancelFunction={() => setOpenPopUp(false)}
            />
            
            <PopUp 
                open={showPopUpExportar}
                popContent={<CheckboxAccordion  selected={selectedOptions} setSelected={setSelectedOptions} />}
                popTitle="Exportar"
                popType="option"
                confirmFunction={exportarDatos}
                cancelFunction={() => setShowPopUpExportar(false)}
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