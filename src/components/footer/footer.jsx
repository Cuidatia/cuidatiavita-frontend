export default function Footer() {
    return (
        <footer className="bg-white text-gray-700 py-6">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                
                {/* Logo Unión Europea */}
                <div className="flex justify-center md:justify-start">
                <img
                    src="/static/RESOL IDA4-23-0005-3 RESOLUCION.jpeg"
                    alt="Logo Unión Europea"
                    className="w-40 sm:w-52 h-auto"
                />
                </div>

                {/* Sobre nosotros */}
                <div className="text-center">
                <h3 className="text-base font-semibold mb-2 text-gray-800">Sobre nosotros</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    Proyecto cofinanciado por la Unión Europea para el desarrollo de soluciones tecnológicas en salud.
                </p>
                </div>

                {/* Enlaces de interés */}
                <div className="flex justify-center md:justify-end space-x-6 text-sm">
                <a href="https://www.cuidatia.org/" className="text-gray-600 hover:text-gray-900 transition-colors">Cuidatia</a>
                <a href="https://www.instagram.com/cuidatia_/" className="text-gray-600 hover:text-gray-900 transition-colors">Instagram</a>
                <a href="https://es.linkedin.com/company/cuidatia" className="text-gray-600 hover:text-gray-900 transition-colors">LinkedIn</a>
                </div>

            </div>
        </footer>
    );
}