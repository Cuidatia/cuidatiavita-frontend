import '../dashboard/styles.css';
import DashboardLayout from "../dashboard/layout";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import PopUp from '@/components/popUps/popUp';
import Alerts from '@/components/alerts/alerts';
import { useSession } from 'next-auth/react';
import { Trash, FilePenLine } from 'lucide-react';

function Organizaciones () {
  const {data: session, status} = useSession()
  const [organizaciones, setOrganizaciones] = useState([])
  const [buscarOrganizacion, setBuscarOrganizacion] = useState('')

  const [organizacionSeleccionada, setOrganizacionSeleccionada] = useState()
  const [openPopUp, setOpenPopUp] = useState(false)
  const [error, setError] = useState()
  const [message, setMessage] = useState()
  const router = useRouter()

  const [paginaActual, setPaginaActual] = useState(1)
  const [totalOrganizaciones, setTotalOrganizaciones] = useState(0)
  const organizacionesPorPagina = 20

  const getOrganizaciones = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'getAllOrganizaciones?page=' + paginaActual + '&limit=' + organizacionesPorPagina,{
        method:'GET',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session.user.token}`
        },
    })

    if(response.ok) {
        const data = await response.json()
        setOrganizaciones(data.organizaciones)
        setTotalOrganizaciones(data.totalOrganizaciones)
    }
  }

  useEffect(()=>{
    if (status === 'authenticated') {
        getOrganizaciones();
    }
  },[session, status, paginaActual])

  const getOrganizacion = async (nombre) => {
    if (!nombre) {getOrganizaciones()
        return
    }

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'searchOrganizacion?nombre=' + nombre, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session.user.token}`
        }
    })

    if (response.ok) {
        const data = await response.json()
        setOrganizaciones(data.organizaciones)
    } else {
        setOrganizaciones([])
    }
  }

  const eliminarOrganizacion = async (organizacionId) => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'eliminarOrganizacion', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session.user.token}`
        },
        body: JSON.stringify({organizacionId})
    })

    if(response.ok){
        const data = await response.json()
        getOrganizaciones()
        setMessage(data.message)
    }else{
        const data = await response.json()
        setError(data.error)
    }
  }

  return(
    <DashboardLayout>
      <div className="flex items-center justify-between px-8 pt-6">
          <input
              type="text"
              placeholder="Buscar organizacion..."
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm w-64 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={buscarOrganizacion}
              onChange={(e) => {
              setBuscarOrganizacion(e.target.value);
              getOrganizacion(e.target.value);
              }}
          />
          </div>

          <div className="border-t border-gray-200 my-4 mx-8" />

          <div className="px-8">
              <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Organizaciones</h2>
                  <button
                      className="cursor-pointer flex items-center gap-1 text-sm text-gray-600 hover:text-green-500 transition"
                      onClick={() => router.push("organizaciones/create")}
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
              </div>

              {organizaciones.length > 0 ? (
                  organizaciones
                  .filter(
                      (organizacion) =>
                      organizacion.nombre.toLowerCase().includes(buscarOrganizacion.toLowerCase())
                  )
                  .map(
                      (organizacion, index) =>
                      <div
                          key={index}
                          className="border-b border-gray-200 transition-transform hover:scale-[1.005]"
                          onClick={() => router.push(`organizaciones/${organizacion.id}`)}
                      >
                          <div className="bg-white hover:bg-blue-100 transition-colors duration-200 p-4 flex items-center justify-between rounded-md cursor-pointer">
                              <div className="text-base font-medium text-gray-800">
                              {organizacion.nombre}
                              </div>
                              <div className="flex items-center gap-6">
                                <span
                                    title={organizacion.direccion}
                                    className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 max-w-[150px] truncate"
                                >
                                    {organizacion.direccion}
                                </span>
                                <span
                                    title={organizacion.localidad}
                                    className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 max-w-[150px] truncate"
                                >
                                    {organizacion.localidad}
                                </span>
                                  <div className="flex gap-3 items-center">
                                      <button
                                          title="Editar"
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              router.push(`organizaciones/${organizacion.id}`);
                                          }}
                                          className="text-gray-500 hover:text-yellow-500 transition cursor-pointer"
                                      >
                                          <svg
                                              className="w-5 h-5"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                          >
                                              <FilePenLine className="w-5 h-5" />
                                          </svg>
                                      </button>
                                      <button
                                          title="Eliminar"
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              setOpenPopUp(!openPopUp);
                                              setOrganizacionSeleccionada(organizacion);
                                          }}
                                          className="text-gray-500 hover:text-red-500 transition cursor-pointer"
                                      >
                                          <svg
                                              className="w-5 h-5"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                          >
                                              <Trash className="w-5 h-5" />
                                          </svg>
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                  )
              ) : (
                  <div className="animate-pulse bg-white p-4 rounded-xl border border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                  </div>
              )}

              {buscarOrganizacion === "" && (
                  <div className="flex justify-center mt-6">
                  <button
                      className="px-4 py-2 mx-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
                      onClick={() => {
                      const nuevaPagina = paginaActual - 1;
                      setPaginaActual(nuevaPagina);
                      getOrganizaciones(nuevaPagina);
                      }}
                      disabled={paginaActual === 1}
                  >
                      Anterior
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                      Página {paginaActual} de{" "}
                      {Math.ceil(totalOrganizaciones / organizacionesPorPagina)}
                  </span>
                  <button
                      className="px-4 py-2 mx-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
                      onClick={() => {
                      const nuevaPagina = paginaActual + 1;
                      setPaginaActual(nuevaPagina);
                      getOrganizaciones(nuevaPagina);
                      }}
                      disabled={paginaActual >= Math.ceil(totalOrganizaciones / organizacionesPorPagina)}
                  >
                      Siguiente
                  </button>
                  </div>
              )}
      </div>

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

      <PopUp
          open={openPopUp} 
          popTitle="Eliminar organizacion"
          popContent={`¿Está seguro de que desea eliminar a la organizacion ${organizacionSeleccionada?.nombre}?`}
          popType="option"
          confirmFunction={() => {
              eliminarOrganizacion(organizacionSeleccionada?.id);
              setOpenPopUp(false);
          }}
          cancelFunction={() => setOpenPopUp(false)}
      />
    </DashboardLayout>
  )
}

export default withAuth(Organizaciones, ['superadmin'])
