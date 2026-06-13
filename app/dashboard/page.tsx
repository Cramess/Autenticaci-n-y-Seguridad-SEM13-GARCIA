import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiUser } from "react-icons/fi";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FiUser className="text-xl" />
              Perfil
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Bienvenida */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-2">¡Bienvenido, {session.user.name}!</h2>
          <p className="text-gray-400">
            Estás logueado correctamente. Aquí puedes ver tu información de perfil y gestionar tu cuenta.
          </p>
        </div>

        {/* Información del Usuario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card de Información */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Información del Perfil</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Nombre</p>
                <p className="text-white font-medium">{session.user.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white font-medium">{session.user.email}</p>
              </div>
            </div>
          </div>

          {/* Card de Imagen de Perfil */}
          {session.user.image && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center">
              <p className="text-gray-400 text-sm mb-4">Foto de Perfil</p>
              <Image
                src={session.user.image}
                alt={session.user.name || "Profile"}
                width={150}
                height={150}
                className="rounded-full"
              />
            </div>
          )}
        </div>

        {/* Estadísticas */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Acciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/profile"
              className="bg-gray-800/50 border border-gray-700 hover:border-blue-500 rounded-xl p-6 text-center transition-colors"
            >
              <p className="text-blue-400 font-semibold">Ver Perfil Completo</p>
            </Link>
            <Link
              href="/"
              className="bg-gray-800/50 border border-gray-700 hover:border-blue-500 rounded-xl p-6 text-center transition-colors"
            >
              <p className="text-blue-400 font-semibold">Ir al Inicio</p>
            </Link>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
