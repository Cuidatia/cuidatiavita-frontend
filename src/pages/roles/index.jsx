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
            <div className="flex items-center justify-between py-4 px-6">
                <h2 className="text-2xl font-semibold">Roles</h2>
            </div>
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t mt-2 border-gray-300"></div>
            </div>
            <div className="px-6 bg-white text-gray-800">
                {roles && (
                    <div className="divide-y divide-gray-300">
                    {roles
                        .filter((rol) => rol.nombre !== "superadmin")
                        .map((rol, index) => (
                        <section
                            key={index}
                            aria-labelledby={`role-title-${index}`}
                            className="py-4"
                        >
                            <h2
                            id={`role-title-${index}`}
                            className="text-lg font-semibold text-blue-400 mb-2"
                            >
                            {rol.nombre}
                            </h2>
                            <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed pl-2">
                            {rol.description
                                .split(";")
                                .filter((line) => line.trim())
                                .map((line, i) => (
                                <li key={i}>{line.trim()}</li>
                                ))}
                            </ul>
                        </section>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default withAuth(Roles, ['administrador']);