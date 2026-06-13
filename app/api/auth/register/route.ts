import { createUser, getUserByEmail } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validaciones
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Email, contraseña y nombre son requeridos" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "El email ya está registrado" },
        { status: 409 }
      );
    }

    // Crear usuario
    const newUser = await createUser(email, password, name);

    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al registrar usuario";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
