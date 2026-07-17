const USERS_KEY = "lc_users";
const SESSION_KEY = "lc_session";

async function hashPassword(password) {
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest("SHA-256", enc);

  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function findUserByEmail(email) {
  return getUsers().find(
    (u) => u.email === email.trim().toLowerCase()
  );
}

export async function createUser({
  name,
  email,
  phone,
  password,
}) {
  const users = getUsers();

  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error("Email already registered.");
  }

  const passwordHash = await hashPassword(password);

  const user = {
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );

  return user;
}

export async function verifyUser(email, password) {
  const user = findUserByEmail(email);

  if (!user) return null;

  const hash = await hashPassword(password);

  return hash === user.passwordHash ? user : null;
}

export function createSession(user, remember = true) {
  const session = {
    name: user.name,
    email: user.email,
    loginAt: new Date().toISOString(),
  };

  const storage = remember
    ? localStorage
    : sessionStorage;

  const otherStorage = remember
    ? sessionStorage
    : localStorage;

  otherStorage.removeItem(SESSION_KEY);

  storage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );
}

export function getSession() {
  const session =
    localStorage.getItem(SESSION_KEY) ||
    sessionStorage.getItem(SESSION_KEY);

  return session ? JSON.parse(session) : null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim()
  );
}

export function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password)
  );
}