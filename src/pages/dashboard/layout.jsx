import Header from "@/components/header/header";
import Menu from "@/components/menu/menu";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import Script from "next/script";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
            {/* Script de Jitsi Meet */}
            <Script
                src="https://meet.jit.si/external_api.js"
                strategy="beforeInteractive"
            />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="hidden sm:block w-48 bg-white border-r border-gray-200 shadow-inner overflow-y-auto">
                    <div className="p-4 h-full">
                        <Menu />
                    </div>
                </aside>

                {/* Content Area */}
                <main className="flex-1 flex flex-col overflow-y-auto">
                {/* Navigation Bar */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <Nav />
                </div>

                {/* Main Page Content */}
                <div className="flex-1 bg-white min-h-[90vh]">
                    {children}
                </div>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 text-center py-4 text-sm text-gray-500">
                    <Footer />
                </footer>
                </main>
            </div>
            </div>
    );
  }