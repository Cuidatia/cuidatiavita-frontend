import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { Home, User, UserPen, Users, Shield, LogOut } from "lucide-react";

export default function Menu() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = router.pathname;

  const cerrarSesion = async () => {
    signOut({ redirect: false }).then(() => router.push("/login"));
  };

  const isActive = (route) =>
    pathname === route || pathname.startsWith(route + "/");

  const links = [
    { href: "/dashboard", label: "Inicio", roles: ["*"], icon: HomeIcon },
    { href: "/perfil", label: "Perfil", roles: ["*"], icon: UserIcon },
    { href: "/usuarios", label: "Usuarios", roles: ["administrador", "superadmin", "trabajador social", "medico/enfermero", "educador social/terapeuta ocupacional", "auxiliar" ], icon: UsersIcon },
    { href: "/personal", label: "Personal", roles: ["administrador", "superadmin"], icon: StaffIcon },
    { href: "/roles", label: "Roles", roles: ["administrador", "superadmin"], icon: RoleIcon },
    { href: "/organizaciones", label: "Organizaciones", roles: ["superadmin", "superadmin"], icon: OrgIcon },
  ];

  function HomeIcon() {
    return (
      <Home className="w-5 h-5" stroke="currentColor" strokeWidth={1.5} fill="none" />
    );
  }

  function UserIcon() {
    return (
      <UserPen className="w-5 h-5" stroke="currentColor" strokeWidth={1.5} fill="none" />
    );
  }

  function UsersIcon() {
    return (
      <Users className="w-5 h-5" stroke="currentColor" strokeWidth={1.5} fill="none" />
    );
  }

  function StaffIcon() {
    return (
      <User className="w-5 h-5" stroke="currentColor" strokeWidth={1.5} fill="none" />
    );
  }

  function RoleIcon() {
    return (
      <Shield className="w-5 h-5" stroke="currentColor" strokeWidth={1.5} fill="none" />
    );
  }

  function OrgIcon() {
    return (
      <path d="M3 20h18M9 4h6M4 10h16M10 10v10M14 10v10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    );
  }

  const userRole = session?.user?.roles;

  return (
    <div className="h-full bg-white">
      <ul className="space-y-1.5 text-sm font-medium text-gray-700">
        {links
          .filter((link) => link.roles.includes("*") || link.roles.includes(userRole))
          .map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? "bg-blue-200 text-gray-900 font-semibold"
                    : "hover:bg-blue-100 text-gray-600"
                }`}
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  {link.icon()}
                </svg>
                <span className="truncate">{link.label}</span>
              </a>
            </li>
          ))}
      </ul>

      <div className="pt-6 mt-6 border-t border-gray-100">
        <button
          onClick={cerrarSesion}
          className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
