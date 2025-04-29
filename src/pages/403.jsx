import './login/styles.css'
export default function Page403() {
    return (
        <div className="flex items-center justify-center h-screen body">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h1 className="text-4xl font-bold text-red-600">403</h1>
                <p className="mt-4 text-gray-700">Acceso denegado. No tienes permiso para ver esta página.</p>
            </div>
        </div>
    );
}