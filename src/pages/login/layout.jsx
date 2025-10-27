import './styles.css';
import Footer from "@/components/footer/footer";

export default function LogInLayout({ children }) {
    return (
        <section className="bg-gray-50 body">
            <div className="h-screen grid place-content-center">
                {children}
            </div>
                <footer className="bg-white border-t border-gray-200 text-center py-4 text-sm text-gray-500">
                <Footer />
            </footer>
        </section>
    );
  }