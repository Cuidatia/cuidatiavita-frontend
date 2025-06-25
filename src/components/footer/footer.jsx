export default function Footer() {
    return (
        <footer className="bg-blue-900 text-white py-3 sm:py-6">
            <div className="w-full px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                
                {/* Logo de la Unión Europea */}
                <div className="flex justify-center md:justify-start">
                    <img src="/static/RESOL IDA4-23-0005-3 RESOLUCION.jpeg" alt="logo" className='w-40 sm:w-60 h-auto' />
                </div>

                {/* Sobre nosotros */}
                <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Sobre nosotros</h3>
                    <p className="text-sm">
                        Proyecto cofinanciado por la Unión Europea para el desarrollo de soluciones tecnológicas en salud.
                    </p>
                </div>

                {/* Enlaces de interés */}
                <div className="flex justify-center md:justify-end space-x-4">
                        <a href="https://www.cuidatia.org/" className="hover:text-gray-300">Cuidatia</a>
                        <a href="https://www.instagram.com/cuidatia_/" className="hover:text-gray-300">Instagram</a>
                        <a href="https://es.linkedin.com/company/cuidatia" className="hover:text-gray-300">LinkedIn</a>
                </div>
            </div>
        </footer>
    );
}