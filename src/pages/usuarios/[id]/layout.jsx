import DashboardLayout from "@/pages/dashboard/layout"

export default function PacienteLayout({ children, mostrarPaciente }) {
    
    return(
        <DashboardLayout>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>{mostrarPaciente.name} {mostrarPaciente.firstSurname} {mostrarPaciente.secondSurname}</h2>
            </div>
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t mt-2 border-gray-300"></div>
            </div>
            {children}
        </DashboardLayout>
    )
}