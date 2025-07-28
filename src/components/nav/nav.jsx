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
    <nav className="px-6 py-2" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-2 text-sm text-gray-500">
        <li>
          <Link href="/dashboard" className="hover:text-blue-400 transition-colors font-medium">
            Inicio
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const href = '/' + pathSegments.slice(0, index + 1).join('/')
          const displaySegment =
            /^\d+$/.test(segment) && nameMap[segment]
              ? nameMap[segment]
              : segment

          return (
            <li key={index} className="flex items-center">
              <svg
                className="w-3 h-3 text-gray-400 mx-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M1 9l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Link
                href={href}
                className="capitalize hover:text-blue-400 transition-colors font-medium"
              >
                {customNames[displaySegment] || displaySegment}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
