"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { useAuth } from "@/app/_components/AuthContext";
import * as UIStyles from "@/UI";
import { UserRole } from "@/app/_types/auth";
import { Icons } from "@/UI/shared/Icons";

interface SidebarProps {
  role: UserRole;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

interface MenuGroup {
  groupName: string;
  items: MenuItem[];
}

export function Sidebar({ role, isCollapsed, setIsCollapsed, isMobile = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedStyle, selectedColor } = useUIStyle();
  const { logout } = useAuth();

  // Local hover state for temporary uncollapse
  const [isHovered, setIsHovered] = useState(false);

  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  // Render as expanded if hovered (temporary uncollapse)
  const currentCollapsed = isCollapsed && !isHovered && !isMobile;

  // Uncollapse permanently on click inside the sidebar
  const handleSidebarClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setIsHovered(false);
    }
  };

  // Grouped menu items by role
  const getNavigationMatrix = (userRole: UserRole): MenuGroup[] => {
    switch (userRole) {
      case "admin":
        return [
          {
            groupName: "Dasbor Utama",
            items: [{ label: "Ringkasan", href: "/dashboard", icon: "Home" }]
          },
          {
            groupName: "Manajemen Pendaftaran",
            items: [
              { label: "Review Pendaftaran", href: "/registration-review", icon: "ClipboardCheck" },
              { label: "Repositori Murid", href: "/students", icon: "Users" },
              { label: "Program & Paket", href: "/programs", icon: "BookOpen" },
              { label: "Manajemen Trial", href: "/trials", icon: "Sparkles" }
            ]
          },
          {
            groupName: "Sumber Daya & Jadwal",
            items: [
              { label: "Direktori Pengguna", href: "/users", icon: "Users" },
              { label: "Direktori Mentor", href: "/mentors", icon: "UserCheck" },
              { label: "Plotting Mentor", href: "/plotting", icon: "Compass" },
              { label: "Jadwal Mentoring", href: "/schedules-admin", icon: "Calendar" }
            ]
          },
          {
            groupName: "Program Akuisisi",
            items: [
              { label: "Program Referral", href: "/referrals", icon: "Gift" },
              { label: "Akun Referral", href: "/referrals/accounts", icon: "Users" }
            ]
          },
          {
            groupName: "Ekstrakurikuler",
            items: [
              { label: "Organisasi Ekskul", href: "/extracurriculars-admin", icon: "AcademicCap" },
              { label: "Keanggotaan Kepsek", href: "/principal-membership", icon: "ShieldCheck" }
            ]
          },
          {
            groupName: "Sistem & Keamanan",
            items: [{ label: "Sistem Log", href: "/logs", icon: "Terminal" }]
          }
        ];
      case "mentor_lead":
        return [
          {
            groupName: "Dasbor Utama",
            items: [{ label: "Ringkasan", href: "/dashboard", icon: "Home" }]
          },
          {
            groupName: "Plotting & Penjadwalan",
            items: [
              { label: "Antrean Plotting", href: "/plotting-queue", icon: "Compass" },
              { label: "Kelola Jadwal Sesi", href: "/schedules-lead", icon: "Calendar" }
            ]
          },
          {
            groupName: "Evaluasi Akademik",
            items: [{ label: "Penilaian Bimbingan", href: "/grading", icon: "Award" }]
          }
        ];
      case "mentor":
        return [
          {
            groupName: "Dasbor Utama",
            items: [{ label: "Ringkasan", href: "/dashboard", icon: "Home" }]
          },
          {
            groupName: "Bimbingan Aktif",
            items: [
              { label: "Siswa Bimbingan", href: "/my-students", icon: "Users" },
              { label: "Jadwal Mengajar", href: "/schedules", icon: "Calendar" }
            ]
          },
          {
            groupName: "Evaluasi",
            items: [{ label: "Penilaian Bimbingan", href: "/grading", icon: "Award" }]
          }
        ];
      case "school_principal":
        return [
          {
            groupName: "Dasbor Utama",
            items: [{ label: "Ringkasan", href: "/dashboard", icon: "Home" }]
          },
          {
            groupName: "Laporan Sekolah",
            items: [
              { label: "Organisasi Terkait", href: "/principal-org", icon: "Users" },
              { label: "Laporan & Roster Ekskul", href: "/principal-reports", icon: "DocumentReport" }
            ]
          }
        ];
      case "murid":
      default:
        return [
          {
            groupName: "Dasbor Utama",
            items: [{ label: "Ringkasan", href: "/dashboard", icon: "Home" }]
          },
          {
            groupName: "Akademik & Kelas",
            items: [
              { label: "Kelas Aktif Saya", href: "/my-classes", icon: "BookOpen" },
              { label: "Modul Belajar IT", href: "/modules", icon: "Clipboard" },
              { label: "Mentor & Jadwal Sesi", href: "/my-mentor-schedule", icon: "Calendar" }
            ]
          },
          {
            groupName: "Pendaftaran & Minat",
            items: [
              { label: "Booking Trial Gratis", href: "/trial-registration", icon: "Sparkles" },
              { label: "Pendaftaran Ekskul", href: "/extracurricular-registration", icon: "AcademicCap" },
              { label: "Status Pendaftaran", href: "/enrollment-status", icon: "DocumentText" }
            ]
          },
          {
            groupName: "Portofolio Saya",
            items: [{ label: "Portofolio & Sertifikat", href: "/portfolio", icon: "Briefcase" }]
          }
        ];
    }
  };

  const menuGroups = getNavigationMatrix(role);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Determine container styling based on style
  const getSidebarContainerClass = () => {
    const baseWidth = isMobile ? "w-64" : currentCollapsed ? "w-20" : "w-64";
    const transitionClass = "transition-all duration-300 flex flex-col justify-between h-full";
    switch (selectedStyle) {
      case "claymorphism":
        return `${baseWidth} bg-slate-50 dark:bg-zinc-900 border-r border-slate-200/20 dark:border-zinc-800/20 shadow-[5px_0_15px_rgba(0,0,0,0.03)] p-4 rounded-br-3xl ${transitionClass}`;
      case "neobrutalism":
        return `${baseWidth} bg-white dark:bg-zinc-900 border-r-3 border-zinc-900 dark:border-white p-4 font-mono ${transitionClass}`;
      case "glassmorphism":
      case "liquid-glass":
        return `${baseWidth} bg-white/10 dark:bg-zinc-950/20 border-r border-white/10 backdrop-blur-md p-4 ${transitionClass}`;
      case "bento-grid":
        return `${baseWidth} bg-white dark:bg-zinc-900 border-r border-zinc-200/80 dark:border-zinc-800/80 p-4 shadow-3xs ${transitionClass}`;
      case "minimalism":
        return `${baseWidth} bg-zinc-50/50 dark:bg-zinc-900/30 border-r border-zinc-250/20 p-4 ${transitionClass}`;
      case "sakode-modern":
      default:
        return `${baseWidth} bg-zinc-50 dark:bg-zinc-900/60 border-r border-zinc-200/50 dark:border-zinc-850/50 p-4 shadow-3xs ${transitionClass}`;
    }
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons];
    if (IconComponent) {
      return <IconComponent className="w-4.5 h-4.5 shrink-0" />;
    }
    return <Icons.Home className="w-4.5 h-4.5 shrink-0" />;
  };

  const showRoleLabel = (userRole: UserRole) => {
    switch (userRole) {
      case "admin": return "Super Admin";
      case "mentor_lead": return "Mentor Lead";
      case "mentor": return "Mentor Mode";
      case "school_principal": return "Kepala Sekolah";
      case "murid": default: return "Siswa Baru";
    }
  };

  return (
    <aside 
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={handleSidebarClick}
      className={getSidebarContainerClass()}
    >
      <div className="flex flex-col gap-5 overflow-y-auto overflow-x-hidden flex-1 pr-1 scrollbar-thin">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sakode-blue flex items-center justify-center font-black text-white text-base shrink-0 select-none">
              S
            </div>
            {(!currentCollapsed || isMobile) && (
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-zinc-800 dark:text-zinc-100 tracking-tight leading-none">
                  SAKODE SYSTEM
                </span>
                <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest mt-1">
                  {showRoleLabel(role)}
                </span>
              </div>
            )}
          </div>

          {/* Close button for Mobile Drawer */}
          {isMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
              aria-label="Tutup Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation Groups */}
        <nav className="flex flex-col gap-4 text-left">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-1">
              {/* Group Name Header */}
              {(!currentCollapsed || isMobile) ? (
                <span className={`text-[9px] text-zinc-400 dark:text-zinc-550 uppercase tracking-widest px-3 mb-1 mt-2 block select-none ${selectedStyle === "neobrutalism" ? "font-bold" : "font-semibold"}`}>
                  {group.groupName}
                </span>
              ) : (
                <div className="h-px bg-zinc-200/50 dark:bg-zinc-800/50 my-1 mx-2" />
              )}

              {/* Group Items */}
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (
                    item.href !== "/dashboard" && 
                    item.href !== "/referrals" && 
                    pathname?.startsWith(item.href)
                  );
                  
                  // Dynamic item styling
                  let itemClass = "relative flex items-center rounded-xl text-xs transition-all cursor-pointer ";
                  if (currentCollapsed && !isMobile) {
                    itemClass += "justify-center p-2.5 ";
                  } else {
                    itemClass += "gap-3 px-3 py-2.5 ";
                  }

                  if (isActive) {
                    itemClass += "font-bold ";
                    if (selectedStyle === "neobrutalism") {
                      itemClass += "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none";
                    } else if (selectedStyle === "claymorphism") {
                      itemClass += "bg-white dark:bg-zinc-800 text-sakode-blue shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.3),_1px_2px_4px_rgba(0,0,0,0.05)] border border-slate-100/50 dark:border-zinc-700/50";
                    } else if (selectedStyle === "glassmorphism" || selectedStyle === "liquid-glass") {
                      itemClass += "bg-white/20 dark:bg-white/10 text-zinc-900 dark:text-white border border-white/20 dark:border-white/15 backdrop-blur-xs";
                    } else {
                      itemClass += "bg-zinc-200/50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white";
                    }
                  } else {
                    itemClass += "font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40";
                    if (selectedStyle === "neobrutalism") {
                      itemClass += " border-2 border-transparent rounded-none";
                    }
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={itemClass}
                      title={item.label}
                      onClick={() => {
                        if (isMobile && onCloseMobile) {
                          onCloseMobile();
                        }
                      }}
                    >
                      {renderIcon(item.icon)}
                      {(!currentCollapsed || isMobile) && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer controls: Logout */}
      <div className="flex flex-col gap-2 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 mt-auto">
        {/* Logout button */}
        {(!currentCollapsed || isMobile) ? (
          <UI.Button
            variant="secondary"
            accentColor={selectedColor}
            className="w-full text-xs! font-semibold! py-2! cursor-pointer"
            onClick={handleLogout}
          >
            Keluar Akun
          </UI.Button>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-red-900/30 transition-all"
            title="Keluar Akun"
            aria-label="Keluar Akun"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4.5 h-4.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
}
