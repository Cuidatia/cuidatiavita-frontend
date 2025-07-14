import PacienteLayout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";
import PopUp from "@/components/popUps/popUp";
import Alerts from "@/components/alerts/alerts";

function Pharmacy () {
    const {data: session, status} = useSession()
    const [mostrarPaciente, setMostrarPaciente] = useState([])
    const [modificar, setModificar] = useState(false)
    const [saveData, setSaveData] = useState(false)
    const [message, setMessage] = useState()
    const [error, setError] = useState('')

    const [pacienteFarmacia, setPacienteFarmacia] = useState({
        treatment: '',
        regularPharmacy: '',
        visitFrequency: '',
        paymentMethod: ''
    })

    const router = useRouter()
    const {id} = router.query

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

    const getPacienteFarmacia = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteFarmacia?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            }
        })

        if (response.ok){
            const data = await response.json()
            setPacienteFarmacia(data.pharmacy)
        }
    }

    useEffect(()=>{
        if(status === 'authenticated'){
            getPaciente()
            getPacienteFarmacia()
        }
    },[status,session])

    const enviarDatos = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteFarmacia', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({
                id: id,
                pharmacy: pacienteFarmacia
            })
        })

        if (response.ok){
            const data = await response.json()
            setMessage(data.message)
            setModificar(false)
            setSaveData(false)
        }else{
            const data = await response.json()
            setError(data.error)
        }
    }

    const [medicamentos, setMedicamentos] = useState([
        { nombre: "", dosis: "", frecuencia: "" },
    ]);

    const actualizarMedicamentos = (nuevosMedicamentos) => {
        setMedicamentos(nuevosMedicamentos);

        // Convertir a string: "nombre;dosis;frecuencia\n..."
        const tratamientoFormateado = nuevosMedicamentos
            //.filter(med => med.nombre || med.dosis || med.frecuencia) // opcional: evita líneas vacías
            .map(med => `${med.nombre};${med.dosis};${med.frecuencia}`)
            .join('\n');

        setPacienteFarmacia(prev => ({
            ...prev,
            treatment: tratamientoFormateado
        }));
    };

    const handleChangeTreatment = (index, field, value) => {
        const nuevos = [...medicamentos];
        nuevos[index][field] = value;
        actualizarMedicamentos(nuevos);
    };

    const agregarFila = () => {
        const nuevaFila = { nombre: '', dosis: '', frecuencia: '' };
        actualizarMedicamentos([...medicamentos, nuevaFila]);
    };

    const eliminarFila = (index) => {
        const nuevos = medicamentos.filter((_, i) => i !== index);
        actualizarMedicamentos(nuevos);
    };

    useEffect(()=>{
        if (pacienteFarmacia?.treatment) {
            const lineas = pacienteFarmacia.treatment.split('\n').filter(linea => linea.trim() !== '');
            const medicamentosParseados = lineas.map(linea => {
                const [nombre = '', dosis = '', frecuencia = ''] = linea.split(';');
                return { nombre, dosis, frecuencia };
            });
            setMedicamentos(medicamentosParseados);
        }else {
            // Si no hay datos cargados, dejar al menos una fila vacía
            setMedicamentos([{ nombre: '', dosis: '', frecuencia: '' }]);
        }
    },[pacienteFarmacia])

    return(
        mostrarPaciente &&
        <PacienteLayout mostrarPaciente={mostrarPaciente} page={"8"}>
            <div className="py-4 space-y-4 overflow-y-scroll h-[calc(100vh-260px)]">
                <div className="space-y-4">
                    <label className="block text-base font-semibold text-gray-800">
                        ¿Toma alguna medicación de forma habitual?
                    </label>

                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
                        <thead className="bg-blue-100 text-center text-sm font-medium text-blue-500">
                            <tr>
                                <th className="px-4 py-3">Medicamento</th>
                                <th className="px-4 py-3">Dosis</th>
                                <th className="px-4 py-3">Frecuencia</th>
                                {modificar && <th className="px-4 py-3"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {medicamentos.map((med, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">
                                <input
                                    type="text"
                                    placeholder="Ej: Enalapril"
                                    className="w-full text-center rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={med.nombre}
                                    onChange={(e) =>
                                    handleChangeTreatment(index, "nombre", e.target.value)
                                    }
                                    disabled={!modificar}
                                />
                                </td>
                                <td className="px-4 py-2">
                                <input
                                    type="text"
                                    placeholder="Ej: 10mg"
                                    className="w-full text-center rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={med.dosis}
                                    onChange={(e) =>
                                    handleChangeTreatment(index, "dosis", e.target.value)
                                    }
                                    disabled={!modificar}
                                />
                                </td>
                                <td className="px-4 py-2">
                                <input
                                    type="text"
                                    placeholder="Ej: Diario"
                                    className="w-full text-center rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={med.frecuencia}
                                    onChange={(e) =>
                                    handleChangeTreatment(index, "frecuencia", e.target.value)
                                    }
                                    disabled={!modificar}
                                />
                                </td>
                                {modificar && (
                                <td className="px-4 py-2 text-center">
                                    <button
                                    type="button"
                                    onClick={() => eliminarFila(index)}
                                    className="cursor-pointer text-sm text-gray-500  hover:text-red-500"
                                    >
                                    Eliminar
                                    </button>
                                </td>
                                )}
                            </tr>
                            ))}
                        </tbody>
                        </table>
                            {modificar && (
                            <div className="bg-white px-4 py-2">
                                <button
                                    type="button"
                                    onClick={agregarFila}
                                    className="cursor-pointer text-sm text-gray-500  hover:text-green-400"
                                >
                                    + Añadir otro
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label htmlFor="regularPharmacy" className="block mb-2 text-sm font-medium text-gray-900">¿Qué farmacia suele frecuentar para adquirir sus medicamentos?</label>
                    <input type="text" name="regularPharmacy" id="regularPharmacy" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteFarmacia?.regularPharmacy}
                         onChange={(e)=>setPacienteFarmacia({...pacienteFarmacia, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="visitFrequency" className="block mb-2 text-sm font-medium text-gray-900">¿Con qué frecuencia visita la farmacia?</label>
                    <input type="text" name="visitFrequency" id="visitFrequency" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                         disabled={!modificar}
                         value={pacienteFarmacia?.visitFrequency}
                         onChange={(e)=>setPacienteFarmacia({...pacienteFarmacia, [e.target.name]:e.target.value})}
                    />
                </div>
                <div>
                    <fieldset disabled={!modificar}>
                            <legend className="block mb-4 text-sm font-medium text-gray-900">¿Qué método de pago suele utilizar para adquirir sus medicamentos?</legend>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="paymentMethod" id="Seguros" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={pacienteFarmacia?.paymentMethod === 'S'} value='S' onClick={(e)=>setPacienteFarmacia({...pacienteFarmacia, [e.target.name]:e.target.value})}
                                />
                                <label htmlFor="Seguros" className="block ms-2  text-sm font-medium text-gray-900">Seguros de salud</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="paymentMethod" id="Particulares" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={pacienteFarmacia?.paymentMethod === 'P'} value='P' onClick={(e)=>setPacienteFarmacia({...pacienteFarmacia, [e.target.name]:e.target.value})}
                                />
                                <label htmlFor="Particulares" className="block ms-2  text-sm font-medium text-gray-900">Pagos particulares</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input type="radio" name="paymentMethod" id="Descuentos" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={pacienteFarmacia?.paymentMethod === 'D'} value='D' onClick={(e)=>setPacienteFarmacia({...pacienteFarmacia, [e.target.name]:e.target.value})}
                                />
                                <label htmlFor="Descuentos" className="block ms-2  text-sm font-medium text-gray-900">Programas de descuentos</label>
                            </div>
                    </fieldset>
                </div>
            </div>
            <div className="border-t-1 border-gray-300">
                <button className="cursor-pointer bg-zinc-100 border-1 border-zinc-200 hover:bg-zinc-300 me-1 rounded-lg text-sm px-3 py-2 text-center"
                    onClick={() => setModificar(!modificar)}
                >
                    {!modificar ? 'Modificar': 'Cancelar'}
                </button>
            {
                modificar &&
                    <button className="cursor-pointer mx-2 bg-zinc-100 hover:text-white border-1 border-zinc-200 hover:bg-blue-500 rounded-lg text-sm px-3 py-2 text-center"
                        onClick={() => setSaveData(true)}
                    >
                        Guardar
                    </button>
            }
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
            </div>
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

export default withAuth(Pharmacy, ['administrador'])