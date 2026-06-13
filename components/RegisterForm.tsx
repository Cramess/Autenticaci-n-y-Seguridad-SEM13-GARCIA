"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validaciones
    if (!formData.name.trim()) {
      setError("El nombre es requerido");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("El email es requerido");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al registrar usuario");
        setLoading(false);
        return;
      }

      // Registro exitoso, redirigir a login
      router.push("/login?registered=true");
    } catch {
      setError("Error al registrar usuario");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">Crear Cuenta</h1>
      <p className="text-gray-400 text-center mb-6">Regístrate para comenzar</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Nombre Completo
          </label>
          <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3">
            <FiUser className="text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

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
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-2"
          >
            Confirmar Contraseña
          </label>
          <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Botón de Registro */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? "Registrando..." : "Crear Cuenta"}
        </button>
      </form>

      <p className="text-center text-gray-400 mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-blue-500 hover:text-blue-400">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}
