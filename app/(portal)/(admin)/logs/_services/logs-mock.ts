import { AuditLog } from "../_types/log";
import { getStoredData, saveStoredData } from "../../_shared";

const STORAGE_KEY_LOGS = "sakode_audit_logs_v1";

export const DEFAULT_LOGS: AuditLog[] = [
  {
    id: "LOG-1001",
    timestamp: "2026-07-08 15:47:00",
    actorName: "Super Admin Sakode",
    actorRole: "admin",
    category: "system",
    action: "Menghapus menu Keanggotaan Kepsek dari sidebar aplikasi",
    status: "success",
    ipAddress: "192.168.1.104"
  },
  {
    id: "LOG-1002",
    timestamp: "2026-07-08 15:45:12",
    actorName: "Super Admin Sakode",
    actorRole: "admin",
    category: "extracurricular",
    action: "Menambahkan dokumen MoU 'MoU_SMA_Labschool_Draft.pdf' ke SMA Labschool Jakarta",
    status: "success",
    ipAddress: "192.168.1.104"
  },
  {
    id: "LOG-1003",
    timestamp: "2026-07-08 14:22:05",
    actorName: "Hamzah Mentor Lead",
    actorRole: "mentor_lead",
    category: "mentor",
    action: "Melakukan plotting mentor Citra Kirana untuk siswa Dzulkifli Putra",
    status: "success",
    ipAddress: "192.168.1.55"
  },
  {
    id: "LOG-1004",
    timestamp: "2026-07-08 13:10:44",
    actorName: "Calon Murid Dzulkifli",
    actorRole: "murid",
    category: "registration",
    action: "Mendaftar program 'Coding Club Next.js' menggunakan kode promo 'SAKODEJAYA'",
    status: "success",
    ipAddress: "114.79.12.89"
  },
  {
    id: "LOG-1005",
    timestamp: "2026-07-08 11:05:12",
    actorName: "Udin Mentor React",
    actorRole: "mentor",
    category: "auth",
    action: "Gagal login ke sistem (salah memasukkan kata sandi 3 kali)",
    status: "warning",
    ipAddress: "182.253.4.12"
  },
  {
    id: "LOG-1006",
    timestamp: "2026-07-08 10:15:30",
    actorName: "Sistem Sakode",
    actorRole: "system",
    category: "system",
    action: "Gagal memproses sinkronisasi API emsifa.github.io (Koneksi diblokir oleh CORS policy)",
    status: "error",
    ipAddress: "127.0.0.1"
  },
  {
    id: "LOG-1007",
    timestamp: "2026-07-08 09:30:15",
    actorName: "Super Admin Sakode",
    actorRole: "admin",
    category: "auth",
    action: "Berhasil melakukan login administrasi pusat",
    status: "success",
    ipAddress: "192.168.1.104"
  }
];

export const getStoredLogs = (): AuditLog[] =>
  getStoredData(STORAGE_KEY_LOGS, DEFAULT_LOGS);

export const saveStoredLogs = (logs: AuditLog[]) =>
  saveStoredData(STORAGE_KEY_LOGS, logs);

// Log simulation helper
const SIMULATION_ACTIONS = [
  { action: "Mengubah status program 'Robotics Arduino' menjadi nonaktif", category: "registration", status: "warning" },
  { action: "Melakukan ekspor laporan data roster ekskul kuartal 2", category: "extracurricular", status: "success" },
  { action: "Menambahkan slot jadwal bimbingan baru di hari Sabtu", category: "mentor", status: "success" },
  { action: "Mendeteksi login dari lokasi baru (IP: 103.111.4.15)", category: "auth", status: "warning" },
  { action: "Menghubungkan akun Kepala Sekolah Bambang Mulyono ke SMK Telkom", category: "system", status: "success" },
  { action: "Gagal mengunduh berkas MoU karena ukuran melebihi limit 10MB", category: "extracurricular", status: "error" }
];

const ACTORS = [
  { name: "Super Admin Sakode", role: "admin" },
  { name: "Hamzah Mentor Lead", role: "mentor_lead" },
  { name: "Citra Kirana", role: "mentor" },
  { name: "Kepsek Sudarsono", role: "school_principal" }
];

export const simulateNewLog = (_existingLogs: AuditLog[]): AuditLog => {
  const randomAction = SIMULATION_ACTIONS[Math.floor(Math.random() * SIMULATION_ACTIONS.length)];
  const randomActor = ACTORS[Math.floor(Math.random() * ACTORS.length)];
  
  const newLog: AuditLog = {
    id: `LOG-${Math.floor(1008 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    actorName: randomActor.name,
    actorRole: randomActor.role,
    category: randomAction.category as AuditLog["category"],
    action: randomAction.action,
    status: randomAction.status as AuditLog["status"],
    ipAddress: `192.168.1.${Math.floor(10 + Math.random() * 200)}`
  };

  return newLog;
};
