import Link from "next/link"
import { useRouter } from "next/router"
import customNames from "./breadcrumb.json"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export default function Nav() {
  const {data: session, status} = useSession()
  const router = useRouter()
  const pathSegments = router.asPath.split('/').filter(s => s !== '' && s !== 'dashboard')
  const [nameMap, setNameMap] = useState({})

useEffect(() => {
  if (status === 'authenticated') {pathSegments.forEach((segment, index) => {
      const isUserId = pathSegments[index - 1] === 'usuarios'
      const isPersonalId = pathSegments[index - 1] === 'personal'

      if (/^\d+$/.test(segment) && !nameMap[segment] && (isUserId || isPersonalId)) {
        const url = isUserId
          ? process.env.NEXT_PUBLIC_API_URL+'getPacienteName?id='+segment
          : process.env.NEXT_PUBLIC_API_URL+'getPersonalName?id='+segment

        fetch(url, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session.user.token}`
          }
        })
          .then(res => res.json())
          .then(data => {
            const nombre = isUserId
              ? data.pacienteNombreCompleto?.name || data.pacienteNombreCompleto
              : data.personalNombreCompleto?.nombre || data.personalNombreCompleto

            if (nombre) {
              setNameMap(prev => ({ ...prev, [segment]: nombre }))
            }
          })
          .catch(console.error)
      }
    })
  }
}, [pathSegments, nameMap, session, status])

  return (
    pathSegments.length > 0 && 
    <nav className="flex px-10" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-2 md:space-x-4 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <Link href="/dashboard" className="inline-flex items-center text-base font-semibold text-gray-400 hover:text-blue-400">
            Inicio
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = '/' + pathSegments.slice(0, index + 1).join('/')
          // Si el segmento es un número y tenemos el nombre, mostrar el nombre
          const displaySegment = (/^\d+$/.test(segment) && nameMap[segment]) ? nameMap[segment] : segment

          return (
            <li key={index}>
              <div className="flex items-center">
                <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
                <Link href={href} className="capitalize ms-1 text-base font-semibold text-gray-400 hover:text-blue-400 md:ms-2">
                  {customNames[displaySegment] || displaySegment}
                </Link>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
