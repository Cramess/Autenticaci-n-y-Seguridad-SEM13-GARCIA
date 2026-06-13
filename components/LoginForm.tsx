"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiGithub } from "react-icons/fi";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const registered = !!searchParams.get("registered");

  const handleCredentialsLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email y contraseña son requeridos");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setError(result?.error || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Error al iniciar sesión");
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setLoading(true);
    try {
      await signIn("github", { redirect: false });
    } catch {
      setError("Error al iniciar sesión con GitHub");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">Bienvenido de Vuelta</h1>
      <p className="text-gray-400 text-center mb-6">Inicia sesión en tu cuenta</p>

      {registered && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-4">
          ¡Registro exitoso! Ahora inicia sesión con tus credenciales.
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Formulario de Credenciales */}
      <form onSubmit={handleCredentialsLogin} className="space-y-4 mb-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3">
            <FiMail className="text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Contraseña
          </label>
          <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Botón de Login */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? "Iniciando..." : "Iniciar Sesión"}
        </button>
      </form>

      {/* Divisor */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gray-700"></div>
        <span className="text-gray-500 text-sm">O</span>
        <div className="flex-1 h-px bg-gray-700"></div>
      </div>

      {/* GitHub Login */}
      <button
        onClick={handleGitHubLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        <FiGithub />
        Iniciar con GitHub
      </button>

      {/* Enlace a Registro */}
      <p className="text-center text-gray-400 mt-6">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-blue-500 hover:text-blue-400">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
