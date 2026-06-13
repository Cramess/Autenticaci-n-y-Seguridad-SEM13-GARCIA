# NextAuth.js App - Autenticación y Seguridad (SEM13)

Este es un proyecto completo de autenticación y seguridad desarrollado con **Next.js 15** y **NextAuth.js (v4)**. Implementa múltiples proveedores de inicio de sesión, encriptación de contraseñas, control de intentos fallidos con bloqueo de cuenta temporal, y protección de rutas con middleware.

---

## Características Implementadas

### 1. Proveedor de Credenciales (`CredentialsProvider`)
- **Formulario de Registro (`/register`)**: Permite la creación de nuevas cuentas de usuario (nombre completo, correo electrónico y contraseña). Cuenta con validaciones básicas de campos y longitud de contraseñas.
- **Cifrado con bcrypt**: Las contraseñas se encriptan de forma segura antes de ser almacenadas usando `bcrypt`. En el inicio de sesión se realiza la comparación de hashes.
- **Lógica de Bloqueo de Cuenta**:
  - Tras **5 intentos fallidos** de inicio de sesión consecutivos con una misma cuenta de correo, el acceso se bloquea temporalmente.
  - El tiempo de bloqueo es de **5 minutos (300 segundos)**.
  - Si el usuario intenta loguearse mientras la cuenta está bloqueada, se le muestra un mensaje indicando el tiempo restante.
  - Tras un inicio de sesión exitoso, el contador de intentos fallidos se reinicia a cero.

### 2. Proveedor de GitHub (`GitHubProvider`)
- Permite a los usuarios registrarse e iniciar sesión de forma segura utilizando su cuenta de GitHub a través del protocolo OAuth 2.0.
- Se configuraron los patrones remotos de imágenes en Next.js para renderizar la foto de perfil del usuario de GitHub (`avatars.githubusercontent.com`).

### 3. Rutas Protegidas y Middleware
- Se protegen las rutas `/dashboard` y `/profile` por medio del middleware de NextAuth, asegurando que solo los usuarios autenticados puedan acceder.
- Redirección automática desde la raíz del sitio `/` hacia `/dashboard` (si hay una sesión activa) o hacia `/login` (si no está autenticado).

---

## Tecnologías Utilizadas
- **Framework**: Next.js 15.2.9 (App Router)
- **Autenticación**: NextAuth.js v4.24.14
- **Estilos**: Tailwind CSS v4, postcss
- **Iconos**: React Icons (`react-icons`)
- **Seguridad / Cifrado**: `bcrypt` (con tipados de desarrollo `@types/bcrypt`)
- **Persistencia**: Sistema de base de datos basado en archivos JSON en desarrollo (`data/users.json` y `data/login-attempts.json`) para facilitar el testing.

---

## Configuración y Requisitos Previos

### Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto y configura las siguientes variables:

```env
# URL de NextAuth y Clave Secreta
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu_clave_secreta_para_nextauth"

# Credenciales de GitHub OAuth
GITHUB_ID="tu_github_client_id"
GITHUB_SECRET="tu_github_client_secret"
```

> [!NOTE]
> Para obtener las credenciales de GitHub, debes crear una **OAuth App** en la sección **Developer Settings** de tu cuenta de GitHub y usar `http://localhost:3000/api/auth/callback/github` como URL de redirección (Authorization Callback URL).

---

## Cómo Iniciar el Proyecto

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar en modo desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

### 3. Compilar para producción
```bash
npm run build
```
Este comando compila la aplicación para producción validando todos los tipos de TypeScript y verificando las reglas del linter.
