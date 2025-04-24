import './styles.css';

export default function LogInLayout({ children }) {
    return (
        <section className="bg-gray-50 body">
            <div className="h-screen grid place-content-center">
                {children}
            </div>
        </section>
    );
  }