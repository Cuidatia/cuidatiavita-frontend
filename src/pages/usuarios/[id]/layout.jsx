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

    const [showPopUpExportar, setShowPopUpExportar] = useState(false)

    const exportarDatos = async () => {
        const dataRecolectada = {};

            for (const option of selectedOptions) {
                let result;

                switch (option) {
                    case '1':
                        result = await getPersonalData(id, session.user.token);
                        dataRecolectada["Datos personales"] = result;
                        break;
                    case '2':
                        result = await getPersonality(id, session.user.token);
                        dataRecolectada["Personalidad"] = result;
                        break;
                    case '3':
                        result = await getInfancia(id, session.user.token);
                        dataRecolectada["Infancia"] = result;
                        break;
                    case '4':
                        result = await getJuventud(id, session.user.token);
                        dataRecolectada["Juventud"] = result;
                        break;
                    case '5':
                        result = await getAdultez(id, session.user.token);
                        dataRecolectada["Edad adulta"] = result;
                        break;
                    case '6':
                        result = await getMadurez(id, session.user.token);
                        dataRecolectada["Madurez"] = result;
                        break;
                    case '7':
                        result = await getSanitaryData(id, session.user.token);
                        dataRecolectada["Datos sanitarios"] = result;
                        break;
                    case '8':
                        result = await getPharmacy(id, session.user.token);
                        dataRecolectada["Farmacia"] = result;
                        break;
                    case '9':
                        result = await getNursingMedicine(id, session.user.token);
                        dataRecolectada["Medicina/enfermería"] = result;
                        break;
                    case '10':
                        result = await getSocialEdu(id, session.user.token);
                        dataRecolectada["Educación social/terapia ocupacional"] = result;
                        break;
                    case '11':
                        result = await getSocialWork(id, session.user.token);
                        dataRecolectada["Trabajo social"] = result;
                        break;
                    case '12':
                        result = await getKitchenHygiene(id, session.user.token);
                        dataRecolectada["Cocina/higiene"] = result;
                        break;
                    case '13':
                        // Si hay una función específica para "Otros", llámala aquí
                        dataRecolectada["Otros"] = "No implementado"; // Ajusta si tienes función real
                        break;
                    case '14':
                        result = await getContactData(id, session.user.token);
                        dataRecolectada["Datos de contacto"] = result;
                        break;
                    default:
                        console.warn('Valor no reconocido en selectedOptions:', option);
                }
            }

            if (Object.keys(dataRecolectada).length === 0) {
                console.warn("No se seleccionaron datos válidos.");
                return;
            }

        const res = await ai.models.generateContent({
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
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-semibold cursor-pointer hover:text-blue-400' onClick={()=>router.push("/usuarios/"+mostrarPaciente.id)}>{mostrarPaciente.name} {mostrarPaciente.firstSurname} {mostrarPaciente.secondSurname}</h2>            
                <div>
                    <button className="cursor-pointer text-red-700 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-1 focus:outline-none focus:ring-red-300 me-1 rounded-lg text-sm px-3 py-2 text-center"
                        onClick={()=>{setOpenPopUp(!openPopUp);}}>
                        Eliminar usuario
                    </button>
                    
                    <button className="cursor-pointer text-green-700 hover:text-white border border-green-500 hover:bg-green-500 focus:ring-1 focus:outline-none focus:ring-green-300 me-1 rounded-lg text-sm px-3 py-2 text-center"
                        onClick={()=>setShowPopUpExportar(!showPopUpExportar)}
                    >
                        Exportar
                    </button>
                </div>
            </div>
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t mt-2 border-gray-300"></div>
            </div>
            {children}

            <PopUp
                open={openPopUp} 
                popTitle="Eliminar usuario"
                popContent={`¿Está seguro de que desea eliminar al usuario ${mostrarPaciente.name} ${mostrarPaciente.firstSurname} ${mostrarPaciente.secondSurname}?`}
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
            />
        </DashboardLayout>
    )
}