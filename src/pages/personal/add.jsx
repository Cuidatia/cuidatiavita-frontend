import { useEffect, useState } from "react";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import '../dashboard/styles.css';
import DashboardLayout from "../dashboard/layout";
import withAuth from '@/components/withAuth';
import Alerts from "@/components/alerts/alerts";
import { useSession } from "next-auth/react";

function AddUsuario () {
    const {data: session, status} = useSession()
    const [handleEmail, setHandleEmail] = useState()
    const [handleRol, setHandleRol] = useState([])
    const [roles, setRoles] = useState()
    const [message, setMessage] = useState()
    const [error, setError] = useState()


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
            // const options = data.roles.map((rol) => ({
            //     label: rol.nombre,
            //     value: rol.id
            // }))
            setRoles(data.roles)
        }
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
                rol: handleRol,
                organizacion: session?.user?.idOrganizacion
            })
        })
        
        if(response.ok){
            const data = await response.json()
            setMessage(data.message)
        } else {
            const data = await response.json()
            setError(data.error)
        }
    }

    return(
        <DashboardLayout>
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
                        <select name="roles" id="roles" placeholder="Selecciona rol"  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-64 p-2.5" required
                            onChange={(e)=>setHandleRol(e.target.value)}
                        >
                            {
                                roles && 
                                roles.filter((rol)=> rol.nombre !== 'superadmin' && rol.nombre !== 'admin').map((rol)=> (
                                    <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                                ))
                            }
                        </select>
                        {/* {
                            roles && roles.length > 0 &&
                            <MultipleSelector
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-64 p-2.5"
                                commandProps={{
                                label: "Selecciona un rol",
                                }}
                                value={handleRol}
                                defaultOptions={roles}
                                placeholder="Selecciona un rol"
                                hideClearAllButton
                                hidePlaceholderWhenSelected
                                emptyIndicator={<p className="text-center text-sm">No results found</p>}
                            />
                        } */}
                    </div>
                    <button className="cursor-pointer bg-zinc-100 hover:text-white border-1 border-zinc-200 hover:bg-blue-500 rounded-lg text-sm px-3 py-2 text-center">Enviar invitación</button>
                </form>
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
        </DashboardLayout>
    )
}

export default withAuth(AddUsuario, ['administrador'])