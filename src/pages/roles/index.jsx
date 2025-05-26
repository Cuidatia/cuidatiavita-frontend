import withAuth from "@/components/withAuth";
import DashboardLayout from "../dashboard/layout";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

function Roles () {
    const [roles, setRoles] = useState();
    const {data: session, status} = useSession()

    const getRoles = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getRoles', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.user?.token}`
            }
        })
        if(response.ok){
            const data = await response.json()
            setRoles(data.roles)
        }
    }

    useEffect(()=>{
        if (status === 'authenticated'){ 
            getRoles()
        }
    }, [session, status])

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Roles</h2>
            </div>
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t mt-2 border-gray-300"></div>
            </div>
            <div className="py-4 px-4">
                {
                    roles &&
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {
                            roles.filter((rol)=> rol.nombre !== 'superadmin').map((rol, index) => (
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-4 sm:p-6 bg-gray-400">
                                        <h3 className="text-lg leading-6 font-medium text-white">{rol.nombre}</h3>
                                    </div>
                                    <div className="p-4 sm:p-6">
                                        <p className="text-gray-700 text-sm">
                                            {
                                                rol.description.split(';').filter(line => line.trim() !== '').map((line, index) => (
                                                    <li key={index}>{line}</li>
                                                ))
                                            }
                                        </p>
                                    </div>
                                </div>
                            ))
                        }  
                    </div>
                }
            </div>
        </DashboardLayout>
    );
}

export default withAuth(Roles, ['administrador']);