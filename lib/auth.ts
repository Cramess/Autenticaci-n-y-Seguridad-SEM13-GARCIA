import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  emailVerified: Date;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface LoginAttempts {
  [email: string]: {
    count: number;
    lockedUntil: number | null;
    firstAttempt: number;
  };
}

interface LockStatus {
  locked: boolean;
  remainingTime?: number;
}

const isVercel = process.env.VERCEL === "1";
const DATA_DIR = isVercel ? "/tmp" : path.join(process.cwd(), "data");

const USERS_FILE = path.join(DATA_DIR, "users.json");
const ATTEMPTS_FILE = path.join(DATA_DIR, "login-attempts.json");

// Asegurar que el directorio exista
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// Leer usuarios del archivo JSON
export const getUsers = (): User[] => {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Guardar usuarios en archivo JSON
export const saveUsers = (users: User[]): void => {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Obtener intentos fallidos
export const getLoginAttempts = (): LoginAttempts => {
  ensureDataDir();
  if (!fs.existsSync(ATTEMPTS_FILE)) {
    return {};
  }
  try {
    const data = fs.readFileSync(ATTEMPTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
};

// Guardar intentos fallidos
export const saveLoginAttempts = (attempts: LoginAttempts): void => {
  ensureDataDir();
  fs.writeFileSync(ATTEMPTS_FILE, JSON.stringify(attempts, null, 2));
};

// Crear usuario
export const createUser = async (email: string, password: string, name: string): Promise<User> => {
  const users = getUsers();
  
  // Verificar si el usuario ya existe
  if (users.find((u: User) => u.email === email)) {
    throw new Error('El usuario ya existe');
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    password: hashedPassword,
    emailVerified: new Date(),
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return newUser;
};

// Obtener usuario por email
export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find((u: User) => u.email === email);
};

// Verificar contraseña
export const verifyPassword = async (email: string, password: string): Promise<User | null> => {
  const user = getUserByEmail(email);
  
  if (!user || !user.password) {
    return null;
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    return null;
  }
  
  return user;
};

// Registrar intento fallido
export const recordFailedAttempt = (email: string) => {
  const attempts = getLoginAttempts();
  const now = Date.now();
  const LOCK_TIME = 5 * 60 * 1000; // 5 minutos
  const MAX_ATTEMPTS = 5;
  
  if (!attempts[email]) {
    attempts[email] = {
      count: 0,
      lockedUntil: null,
      firstAttempt: now,
    };
  }
  
  const userAttempts = attempts[email];
  
  // Limpiar si pasó el tiempo de bloqueo
  if (userAttempts.lockedUntil && now > userAttempts.lockedUntil) {
    userAttempts.count = 0;
    userAttempts.lockedUntil = null;
    userAttempts.firstAttempt = now;
  }
  
  userAttempts.count += 1;
  
  if (userAttempts.count >= MAX_ATTEMPTS) {
    userAttempts.lockedUntil = now + LOCK_TIME;
  }
  
  saveLoginAttempts(attempts);
  
  return userAttempts;
};

// Limpiar intentos fallidos después de login exitoso
export const clearFailedAttempts = (email: string): void => {
  const attempts = getLoginAttempts();
  delete attempts[email];
  saveLoginAttempts(attempts);
};

// Verificar si el usuario está bloqueado
export const isUserLocked = (email: string): LockStatus | false => {
  const attempts = getLoginAttempts();
  const userAttempts = attempts[email];
  
  if (!userAttempts) {
    return false;
  }
  
  const now = Date.now();
  
  if (userAttempts.lockedUntil && now < userAttempts.lockedUntil) {
    const remainingTime = Math.ceil((userAttempts.lockedUntil - now) / 1000);
    return {
      locked: true,
      remainingTime,
    };
  }
  
  return false;
};
