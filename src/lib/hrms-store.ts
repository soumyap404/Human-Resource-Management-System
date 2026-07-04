import { useEffect, useState } from "react";

export type Role = "employee" | "admin";
export type LeaveType = "Paid Leave" | "Sick Leave" | "Unpaid Leave";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";
export type AttendanceStatus = "Present" | "Absent" | "Half-Day" | "Leave";

export interface User {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  address?: string;
  avatar?: string;
  jobTitle: string;
  department: string;
  joinDate: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // yyyy-mm-dd
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: LeaveType;
  from: string;
  to: string;
  reason: string;
  status: LeaveStatus;
  comment?: string;
  createdAt: string;
}

const K_USERS = "hrms.users";
const K_SESSION = "hrms.session";
const K_ATT = "hrms.attendance";
const K_LEAVE = "hrms.leave";

function isBrowser() {
  return typeof window !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, val: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(val));
  window.dispatchEvent(new CustomEvent("hrms:change", { detail: key }));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function seed() {
  if (!isBrowser()) return;
  const users = read<User[]>(K_USERS, []);
  if (users.length) return;
  const seedUsers: User[] = [
    {
      id: uid(),
      employeeId: "ADM001",
      fullName: "Sarah Chen",
      email: "admin@hrms.com",
      password: "admin123",
      role: "admin",
      phone: "+1 555 0101",
      address: "500 Corporate Ave, NY",
      jobTitle: "HR Director",
      department: "Human Resources",
      joinDate: "2020-03-15",
      basicSalary: 8500,
      allowances: 1500,
      deductions: 800,
    },
    {
      id: uid(),
      employeeId: "EMP001",
      fullName: "John Doe",
      email: "john@hrms.com",
      password: "employee123",
      role: "employee",
      phone: "+1 555 0102",
      address: "12 Maple Street, NY",
      jobTitle: "Senior Engineer",
      department: "Engineering",
      joinDate: "2022-06-01",
      basicSalary: 6500,
      allowances: 1200,
      deductions: 600,
    },
    {
      id: uid(),
      employeeId: "EMP002",
      fullName: "Priya Patel",
      email: "priya@hrms.com",
      password: "employee123",
      role: "employee",
      phone: "+1 555 0103",
      jobTitle: "Product Designer",
      department: "Design",
      joinDate: "2023-01-10",
      basicSalary: 5800,
      allowances: 1000,
      deductions: 500,
    },
    {
      id: uid(),
      employeeId: "EMP003",
      fullName: "Marcus Lee",
      email: "marcus@hrms.com",
      password: "employee123",
      role: "employee",
      jobTitle: "Marketing Lead",
      department: "Marketing",
      joinDate: "2021-09-20",
      basicSalary: 6200,
      allowances: 1100,
      deductions: 550,
    },
  ];
  write(K_USERS, seedUsers);

  // seed some attendance for the last 20 days for EMP001
  const attendance: AttendanceRecord[] = [];
  const emp = seedUsers[1];
  for (let i = 1; i <= 20; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.getDay();
    if (day === 0 || day === 6) continue;
    const r = Math.random();
    const status: AttendanceStatus =
      r > 0.9 ? "Absent" : r > 0.82 ? "Half-Day" : "Present";
    attendance.push({
      id: uid(),
      userId: emp.id,
      date: d.toISOString().slice(0, 10),
      checkIn: status === "Absent" ? undefined : "09:0" + Math.floor(Math.random() * 9),
      checkOut: status === "Absent" ? undefined : "18:" + (10 + Math.floor(Math.random() * 40)),
      status,
    });
  }
  write(K_ATT, attendance);

  const leaves: LeaveRequest[] = [
    {
      id: uid(),
      userId: emp.id,
      type: "Sick Leave",
      from: new Date(Date.now() - 5 * 864e5).toISOString().slice(0, 10),
      to: new Date(Date.now() - 4 * 864e5).toISOString().slice(0, 10),
      reason: "Flu, needed rest",
      status: "Approved",
      comment: "Get well soon",
      createdAt: new Date(Date.now() - 6 * 864e5).toISOString(),
    },
    {
      id: uid(),
      userId: seedUsers[2].id,
      type: "Paid Leave",
      from: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10),
      to: new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10),
      reason: "Family vacation",
      status: "Pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: uid(),
      userId: seedUsers[3].id,
      type: "Unpaid Leave",
      from: new Date(Date.now() + 10 * 864e5).toISOString().slice(0, 10),
      to: new Date(Date.now() + 12 * 864e5).toISOString().slice(0, 10),
      reason: "Personal errands",
      status: "Pending",
      createdAt: new Date().toISOString(),
    },
  ];
  write(K_LEAVE, leaves);
}

// ---------- Public API ----------
export const store = {
  seed,
  users: () => read<User[]>(K_USERS, []),
  setUsers: (u: User[]) => write(K_USERS, u),
  attendance: () => read<AttendanceRecord[]>(K_ATT, []),
  setAttendance: (a: AttendanceRecord[]) => write(K_ATT, a),
  leaves: () => read<LeaveRequest[]>(K_LEAVE, []),
  setLeaves: (l: LeaveRequest[]) => write(K_LEAVE, l),
  session: () => read<string | null>(K_SESSION, null),
  setSession: (id: string | null) => write(K_SESSION, id),
  uid,
};

export function useHrmsData<T>(selector: () => T): T {
  const [value, setValue] = useState<T>(() => selector());
  useEffect(() => {
    const update = () => setValue(selector());
    update();
    window.addEventListener("hrms:change", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("hrms:change", update);
      window.removeEventListener("storage", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}

export function useCurrentUser(): User | null {
  return useHrmsData(() => {
    const id = store.session();
    if (!id) return null;
    return store.users().find((u) => u.id === id) ?? null;
  });
}

export function signIn(email: string, password: string, role: Role): User | null {
  seed();
  const user = store.users().find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role,
  );
  if (user) {
    store.setSession(user.id);
    return user;
  }
  return null;
}

export function signUp(input: Omit<User, "id" | "jobTitle" | "department" | "joinDate" | "basicSalary" | "allowances" | "deductions">): User | { error: string } {
  seed();
  const users = store.users();
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    return { error: "Email already registered" };
  }
  if (users.some((u) => u.employeeId === input.employeeId)) {
    return { error: "Employee ID already exists" };
  }
  const user: User = {
    ...input,
    id: uid(),
    jobTitle: input.role === "admin" ? "HR Manager" : "Employee",
    department: input.role === "admin" ? "Human Resources" : "General",
    joinDate: new Date().toISOString().slice(0, 10),
    basicSalary: 5000,
    allowances: 800,
    deductions: 400,
  };
  store.setUsers([...users, user]);
  store.setSession(user.id);
  return user;
}

export function signOut() {
  store.setSession(null);
}

export function todayString() {
  return new Date().toISOString().slice(0, 10);
}
