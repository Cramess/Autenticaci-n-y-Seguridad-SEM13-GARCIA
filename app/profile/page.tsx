import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiMail, FiUser } from "react-icons/fi";
import LogoutButton from "@/components/LogoutButton";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <FiArrowLeft className="text-xl" />
            Volver
          </Link>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <div className="w-10"></div>
        </div>

        {/* Tarjeta de Perfil Principal */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-8">
          <div className="flex flex-col items-center text-center mb-8">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "Profile"}
                width={200}
                height={200}
                className="rounded-full mb-4 border-4 border-blue-500"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4 flex items-center justify-center border-4 border-blue-500">
                <FiUser className="text-6xl text-white" />
              </div>
            )}
            <h2 className="text-2xl font-semibold">{session.user.name}</h2>
          </div>

          {/* Información Detallada */}
          <div className="space-y-6">
            {/* Email */}
            <div className="bg-gray-900/50 rounded-lg p-4 flex items-center gap-4">
              <FiMail className="text-blue-400 text-2xl" />
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white font-medium">{session.user.email}</p>
              </div>
            </div>

            {/* User ID */}
            <div className="bg-gray-900/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">ID de Usuario</p>
              <p className="text-white font-mono text-sm">{session.user.id}</p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
          >
            Volver al Dashboard
          </Link>
          <LogoutButton />
        </div>

        {/* Información Adicional */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Información de la Sesión</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Tu sesión está activa y segura.</p>
            <p>
              Puedes cerrar sesión en cualquier momento usando el botón de abajo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
