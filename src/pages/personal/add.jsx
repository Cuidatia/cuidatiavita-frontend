import { useEffect, useState } from "react";
import Select from "react-select"
import '../dashboard/styles.css';
import DashboardLayout from "../dashboard/layout";
import withAuth from '@/components/withAuth';
import Alerts from "@/components/alerts/alerts";
import { useSession } from "next-auth/react";

function AddUsuario () {
    const {data: session, status} = useSession()
    const [handleEmail, setHandleEmail] = useState()
    const [roles, setRoles] = useState()
    const [rolesOpciones, setRolesOpciones] = useState()
    const [message, setMessage] = useState()
    const [error, setError] = useState()

    const [link, setLink] = useState()

    const rolesSeleccionados = new Set();

    const [showEmailSubstitute, setShowEmailSubstitute] = useState(false)


    const getRoles = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getRoles', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            }
        })
        if(response.ok){
            const data = await response.json()
            const options = data.roles.map((rol) => ({
                label: rol.nombre,
                value: rol.id
            }))
            setRolesOpciones(options)
            setRoles(data.roles)
        }
    }

    const handleRoles = (options) =>{
        options.forEach((option) => {
            const rol = roles.find((rol) => rol.id === option.value);
            if (rol) {
                rolesSeleccionados.add(rol.id);
            }
        });
    }

    useEffect(()=>{
        if (status === 'authenticated' && session?.user?.idOrganizacion) {
            getRoles()
        }
    }, [session, status])

    const enviarInvitacion = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'sendMailInvitacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({
                email: handleEmail,
                rol: Array.from(rolesSeleccionados).join(','),
                organizacion: session?.user?.idOrganizacion
            })
        })
        
        if(response.ok){
            const data = await response.json()
            setLink(data.url)
            setMessage(data.message)
            setShowEmailSubstitute(true)
        } else {
            const data = await response.json()
            setError(data.error)
        }
        
        setMessage('Invitación enviada correctamente')
        setShowEmailSubstitute(true)
    }

    return(
        <DashboardLayout>
        <div className="px-8 py-6">
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>Añadir personal</h2>
            </div>
            <div className="py-4">
                <form className="space-y-4 md:space-y-6" action={enviarInvitacion}>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Correo</label>
                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-64 block p-2.5" placeholder="ejemplo@ejemplo.com" required
                                onChange={(e)=>setHandleEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="roles">Rol</label>
                        {/* <select name="roles" id="roles" placeholder="Selecciona rol"  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-64 p-2.5" required
                            onChange={(e)=>setHandleRol(e.target.value)}
                        >
                            {
                                roles && 
                                roles.filter((rol)=> rol.nombre !== 'superadmin' && rol.nombre !== 'admin').map((rol)=> (
                                    <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                                ))
                            }
                        </select> */}
                        <Select className="w-64 block"
                            options={rolesOpciones}
                            isMulti
                            isClearable={false}
                            placeholder={'Selecciona un rol'}
                            onChange={handleRoles}
                        />
                    </div>
                    <button className="cursor-pointer bg-zinc-100 hover:text-white border-1 border-zinc-200 hover:bg-blue-500 rounded-lg text-sm px-3 py-2 text-center">Enviar invitación</button>
                </form>
                {/*{
                    showEmailSubstitute && (
                        <div className="mt-6 border border-yellow-300 bg-yellow-100 text-yellow-800 p-4 rounded-lg space-y-2">
                            <h3 className="text-lg font-bold text-red-600">¡IMPORTANTE!</h3>
                            <p>Este sistema aún no cuenta con servidor de correo, por lo tanto no se ha enviado ningún email.</p>
                            <p>
                            A continuación se muestra el enlace de invitación que deberías acceder para completar el registro del nuevo usuario:
                            </p>
                            <div className="bg-white border border-yellow-400 p-3 rounded-md break-words">
                            <p className="mb-2 font-medium">Enlace de invitación:</p>
                            <a
                                href={link}
                                className="text-blue-700 underline break-words"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Aceptar invitación
                            </a>
                            </div>
                            <p className="text-sm italic text-yellow-700">Comparte este enlace directamente con la persona que deseas invitar.</p>
                        </div>
                    )
                }*/}
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
        </div>
        </DashboardLayout>
    )
}

export default withAuth(AddUsuario, ['administrador'])