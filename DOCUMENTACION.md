# NextAuth.js - Sistema de Autenticación Completo

## 📋 Descripción General

Este proyecto implementa un sistema completo de autenticación usando **Next.js 15**, **NextAuth.js**, con múltiples proveedores de autenticación:

- ✅ **Credenciales** (Email + Contraseña)
- ✅ **GitHub OAuth 2.0**
- ✅ **Bloqueo temporal** después de intentos fallidos
- ✅ **Contraseñas cifradas** con bcrypt
- ✅ **Rutas protegidas** con sesiones
- ✅ **Diseño responsivo** con Tailwind CSS

---

## 🚀 Instalación y Configuración

### 1. Dependencias Instaladas

```bash
npm install next-auth @prisma/client bcrypt @next-auth/prisma-adapter zod
npm install -D prisma @types/bcrypt
npm install react-icons
```

### 2. Estructura del Proyecto

```
next-auth-app/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts         # Configuración de NextAuth.js
│   │       └── register/
│   │           └── route.ts         # Endpoint de registro
│   ├── dashboard/
│   │   └── page.tsx                 # Dashboard protegido
│   ├── login/
│   │   └── page.tsx                 # Página de login
│   ├── profile/
│   │   └── page.tsx                 # Perfil del usuario
│   ├── register/
│   │   └── page.tsx                 # Página de registro
│   ├── layout.tsx                   # Layout raíz
│   ├── page.tsx                     # Página de inicio
│   └── globals.css
├── components/
│   ├── LoginForm.tsx                # Formulario de login
│   ├── RegisterForm.tsx             # Formulario de registro
│   ├── LogoutButton.tsx             # Botón de cerrar sesión
│   └── SessionProvider.tsx          # Provider de sesión
├── lib/
│   └── auth.ts                      # Utilidades de autenticación
├── data/
│   ├── users.json                   # Almacenamiento de usuarios
│   └── login-attempts.json          # Registro de intentos fallidos
├── prisma/
│   └── schema.prisma                # Esquema de Prisma (no usado)
├── .env.local                       # Variables de entorno
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔐 Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-generate-a-strong-one

# GitHub OAuth (Opcional)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

### Generar NEXTAUTH_SECRET

```bash
npx auth secret
```

---

## 🔑 Configuración de GitHub OAuth

### Paso 1: Crear una OAuth App en GitHub

1. Ve a [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Haz clic en **"New OAuth App"**
3. Rellena los campos:
   - **Application name**: Mi Auth App
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Haz clic en **"Register application"**

### Paso 2: Obtener las credenciales

En la página de tu aplicación verás:
- **Client ID** → Copiar a `GITHUB_ID`
- **Client Secret** → Copiar a `GITHUB_SECRET`

### Paso 3: Actualizar .env.local

```env
GITHUB_ID=your_client_id_here
GITHUB_SECRET=your_client_secret_here
```

---

## 📝 Autenticación con Credenciales

### Cómo funciona:

1. **Registro**: El usuario crea una cuenta con email, nombre y contraseña
2. **Hash de contraseña**: Se cifra con bcrypt (salt rounds: 10)
3. **Almacenamiento**: Los usuarios se guardan en `data/users.json`
4. **Login**: Se verifica la contraseña comparándola con el hash
5. **Sesión**: Se crea una sesión segura con NextAuth.js

### Ejemplo de usuario registrado:

```json
{
  "id": "1234567890",
  "email": "usuario@example.com",
  "name": "Juan Pérez",
  "password": "$2b$10$...",  // hash de bcrypt
  "emailVerified": "2024-01-15T10:30:00.000Z",
  "image": null,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔒 Sistema de Bloqueo Temporal

### Funcionamiento:

- **Máximo de intentos**: 5 intentos fallidos
- **Tiempo de bloqueo**: 5 minutos
- **Registro**: Se guarda en `data/login-attempts.json`

### Archivo de intentos:

```json
{
  "usuario@example.com": {
    "count": 5,
    "lockedUntil": 1705318200000,
    "firstAttempt": 1705318000000
  }
}
```

### Funciones en `lib/auth.ts`:

- `recordFailedAttempt(email)` - Registra un intento fallido
- `isUserLocked(email)` - Verifica si el usuario está bloqueado
- `clearFailedAttempts(email)` - Limpia los intentos después de login exitoso

---

## 🛣️ Rutas Protegidas

### Usando `getServerSession`:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <p>Bienvenido, {session.user.name}</p>
    </div>
  );
}
```

---

## 📱 Páginas Implementadas

### 1. **Inicio** (`/`)
- Hero section con características
- Enlaces a login/registro
- Muestra info del usuario si está autenticado

### 2. **Registro** (`/register`)
- Formulario con validaciones
- Verifica contraseñas coincidan
- Mínimo 6 caracteres
- Muestra errores claros

### 3. **Login** (`/login`)
- Formulario de credenciales
- Botón de GitHub
- Mensaje de "registro exitoso"
- Bloqueo temporal si hay muchos intentos

### 4. **Dashboard** (`/dashboard`) 🔒
- Información básica del usuario
- Foto de perfil (si está disponible)
- Enlace a perfil completo
- Botón para cerrar sesión

### 5. **Perfil** (`/profile`) 🔒
- Información completa del usuario
- Foto de perfil grande
- ID de usuario
- Información de sesión

---

## 🎨 Componentes Creados

### 1. `RegisterForm.tsx`
- Validación de formulario
- Estilos con Tailwind
- Iconos con react-icons

### 2. `LoginForm.tsx`
- Dos métodos de login (credenciales y GitHub)
- Mensaje de registro exitoso
- Manejo de errores

### 3. `LogoutButton.tsx`
- Componente del cliente
- Usa `signOut()` de next-auth
- Redirecciona al login

### 4. `SessionProvider.tsx`
- Envuelve la app con SessionProvider de next-auth

---

## 🔧 Funciones de Autenticación (`lib/auth.ts`)

```typescript
// Crear usuario
createUser(email, password, name)

// Obtener usuario por email
getUserByEmail(email)

// Verificar contraseña
verifyPassword(email, password)

// Registrar intento fallido
recordFailedAttempt(email)

// Limpiar intentos fallidos
clearFailedAttempts(email)

// Verificar si está bloqueado
isUserLocked(email)

// Leer/guardar usuarios
getUsers() / saveUsers(users)

// Leer/guardar intentos
getLoginAttempts() / saveLoginAttempts(attempts)
```

---

## 🚀 Ejecutar el Proyecto

### 1. Instalar dependencias:
```bash
npm install
```

### 2. Configurar variables de entorno:
```bash
cp .env.example .env.local
# Editar .env.local con tus valores
```

### 3. Ejecutar en desarrollo:
```bash
npm run dev
```

### 4. Abrir en el navegador:
```
http://localhost:3000
```

---

## 📊 Flujo de Autenticación

```
┌─────────────────┐
│   Inicio (/)    │
└────────┬────────┘
         │
    ¿Autenticado?
    ↙           ↘
  SÍ             NO
   │              │
   ├─→ Dashboard  └─→ Login
   │   (/dashboard)    (/login)
   │        ↑              │
   │        │         ┌────┴────┐
   │        │      Credenciales GitHub
   │        │         │         │
   │        │         └────┬────┘
   │        │              │
   └────────┼──────────────┘
            │
        Sesión
        Activa
```

---

## 🔐 Seguridad

### Medidas implementadas:

1. **Cifrado de contraseñas**: bcrypt con 10 salt rounds
2. **Bloqueo temporal**: 5 minutos después de 5 intentos fallidos
3. **Validación de formularios**: Cliente y servidor
4. **Sesiones seguras**: NextAuth.js maneja cookies seguras
5. **Variables de entorno**: Secretos nunca en el código
6. **Rutas protegidas**: `getServerSession` valida acceso

---

## 🐛 Resolución de Problemas

### Problema: "El usuario ya existe"
- Significa que el email ya está registrado
- Intenta con otro email

### Problema: "Contraseña incorrecta"
- Verifica que escribas correctamente
- Después de 5 intentos, espera 5 minutos

### Problema: GitHub OAuth no funciona
- Verifica GITHUB_ID y GITHUB_SECRET en .env.local
- Confirma que la URL de callback en GitHub sea correcta
- La callback URL debe ser: `http://localhost:3000/api/auth/callback/github`

### Problema: "Sesión no disponible"
- Limpia las cookies del navegador
- Reinicia el servidor
- Verifica NEXTAUTH_SECRET

---

## 📚 Referencias

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

## 🎯 Próximas Mejoras

- [ ] Conectar Prisma para persistencia en BD
- [ ] Email de confirmación
- [ ] Recuperación de contraseña
- [ ] Autenticación de dos factores (2FA)
- [ ] Más proveedores OAuth (Google, Discord, etc.)
- [ ] Panel de administración
- [ ] Auditoría de login
- [ ] Rate limiting en API

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
