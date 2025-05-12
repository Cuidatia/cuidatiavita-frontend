import Header from "@/components/header/header";
import Menu from "@/components/menu/menu";
import Nav from "@/components/nav/nav";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Header/>
            <div className="flex flex-grow">
                <div className="w-fit flex-none bg-stone-100 rounded-2xl sm:block hidden">
                    <Menu/>
                </div>
                <div className="flex-1">
                    <Nav/>
                    <div className="p-8">   
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
  }