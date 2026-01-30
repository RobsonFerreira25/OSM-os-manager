import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wrench,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ClipboardList, label: 'Ordens de Serviço', path: '/ordens-servico' },
  { icon: Users, label: 'Funcionários', path: '/funcionarios' },
  { icon: Building2, label: 'Empresas', path: '/empresas' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
];

interface SidebarProps {
  isMobile?: boolean;
}

export function Sidebar({ isMobile = false }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActuallyCollapsed = isMobile ? false : collapsed;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isActuallyCollapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        "bg-sidebar flex flex-col z-50 transition-all duration-200",
        isMobile ? "h-full w-full" : "fixed left-0 top-0 h-screen"
      )}
    >
      {/* Logo */}
      <div className="h-20 flex items-center px-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/20">
            <span className="text-white font-black text-xl tracking-tighter">OSM</span>
          </div>
          <AnimatePresence>
            {!isActuallyCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <h1 className="font-extrabold text-xl tracking-tight text-white whitespace-nowrap">
                  OS Manager
                </h1>
                <div className="h-1 w-8 bg-blue-500 rounded-full mt-0.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'sidebar-nav-item',
                isActive && 'sidebar-nav-item-active'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!isActuallyCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Button (Only for Desktop) */}
      {!isMobile && (
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-nav-item w-full justify-center"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  Recolher menu
                </motion.span>
              </>
            )}
          </button>
        </div>
      )}
    </motion.aside>
  );
}
