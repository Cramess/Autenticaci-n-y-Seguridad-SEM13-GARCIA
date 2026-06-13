import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import {
  verifyPassword,
  recordFailedAttempt,
  clearFailedAttempts,
  isUserLocked,
} from "@/lib/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // Proveedor de Credenciales (Email + Contraseña)
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@email.com" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos");
        }

        // Verificar si el usuario está bloqueado
        const lockStatus = isUserLocked(credentials.email);
        if (lockStatus && lockStatus.locked) {
          throw new Error(
            `Cuenta bloqueada. Intenta de nuevo en ${lockStatus.remainingTime} segundos`
          );
        }

        // Verificar credenciales
        const user = await verifyPassword(credentials.email, credentials.password);

        if (!user) {
          recordFailedAttempt(credentials.email);
          const attempts = isUserLocked(credentials.email);
          if (attempts && attempts.locked) {
            throw new Error(
              `Contraseña incorrecta. Tu cuenta será bloqueada después de 5 intentos fallidos`
            );
          }
          throw new Error("Email o contraseña incorrectos");
        }

        // Limpiar intentos fallidos si el login es exitoso
        clearFailedAttempts(credentials.email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),

    // Proveedor de GitHub
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
