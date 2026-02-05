
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Database, 
  ShieldCheck, 
  ClipboardList, 
  Wrench, 
  BadgeDollarSign,
  ChevronLeft, 
  ChevronRight, 
  DatabaseZap,
  Settings,
  ChevronDown,
  LogOut,
  User,
  HelpCircle
} from 'lucide-react';

interface NavItem {
  label: string;
  path?: string;
  icon: any;
  children?: { label: string; path: string }[];
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems: NavItem[] = [
    { label: '首页', path: '/dashboard', icon: LayoutDashboard },
    { 
      label: '资源管理', 
      icon: Database,
      children: [
        { label: '数据资源', path: '/resource/data' },
        { label: '工具资源', path: '/resource/service' },
        { label: '应用资源', path: '/resource/app' },
        { label: '地图资源', path: '/resource/map' },
      ]
    },
    { 
      label: '资源审核', 
      icon: ShieldCheck,
      children: [
        { label: '数据审核', path: '/review/data' },
        { label: '工具审核', path: '/review/service' },
        { label: '应用审核', path: '/review/app' },
        { label: '地图审核', path: '/review/map' },
      ]
    },
    { 
      label: '产品管理', 
      icon: Package,
      children: [
        { label: '数据产品', path: '/product/data' },
        { label: '工具产品', path: '/product/service' },
        { label: '应用产品', path: '/product/app' },
        { label: '地图产品', path: '/product/map' },
      ]
    },
    { 
      label: '订单管理', 
      icon: ClipboardList,
      children: [
        { label: '订单审核', path: '/order/review' },
      ]
    },
    { label: '定制管理', path: '/custom', icon: Wrench },
    { 
      label: '价格管理', 
      icon: BadgeDollarSign,
      children: [
        { label: '卫星影像价格', path: '/price/satellite' },
        { label: '算子服务价格', path: '/price/service' },
      ]
    },
  ];

  // 默认展开包含当前路径的父菜单
  useEffect(() => {
    navItems.forEach(item => {
      if (item.children?.some(child => child.path === currentPath)) {
        setOpenMenus(prev => ({ ...prev, [item.label]: true }));
      }
    });
  }, []);

  const toggleSubMenu = (label: string) => {
    if (isCollapsed) return;
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path?: string) => path ? currentPath === path : false;
  const isParentActive = (item: NavItem) => {
    if (item.path) return isActive(item.path);
    return item.children?.some(child => child.path === currentPath);
  };

  return (
    <div className="min-h-screen flex bg-[#f4f7fe]">
      {/* Sidebar */}
      <aside 
        className={`${
          isCollapsed ? 'w-20' : 'w-72'
        } flex-shrink-0 bg-gradient-to-b from-[#1a237e] to-[#121858] text-white flex flex-col fixed h-full z-50 transition-all duration-300 ease-in-out shadow-2xl`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 overflow-hidden border-b border-white/10">
          <div className="flex items-center space-x-3 min-w-max">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md shadow-inner text-blue-300">
              <DatabaseZap className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold tracking-tight whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                运营管理中心
              </span>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 bg-white text-[#1a237e] p-1 rounded-full shadow-lg hover:scale-110 transition-transform z-50 border border-blue-100"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {navItems.map((item) => (
            <div key={item.label}>
              {/* Main Menu Item */}
              <div
                onClick={() => item.path ? navigate(item.path) : toggleSubMenu(item.label)}
                className={`flex items-center px-4 py-3.5 rounded-2xl transition-all relative group cursor-pointer ${
                  isParentActive(item) 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-900/40' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isParentActive(item) ? 'opacity-100' : 'opacity-80'}`} />
                {!isCollapsed && (
                  <>
                    <span className="ml-4 text-sm font-semibold tracking-wide whitespace-nowrap">
                      {item.label}
                    </span>
                    {item.children && (
                      <ChevronDown className={`ml-auto w-4 h-4 transition-transform duration-300 ${openMenus[item.label] ? 'rotate-180' : ''}`} />
                    )}
                  </>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl border border-white/10">
                    {item.label}
                  </div>
                )}
              </div>

              {/* Sub Menu Items */}
              {!isCollapsed && item.children && openMenus[item.label] && (
                <div className="mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-300">
                  <div className="border-l border-white/10 ml-6 pl-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
                          isActive(child.path)
                            ? 'text-blue-300 bg-white/5'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 mt-auto space-y-2 border-t border-white/10 relative">
          {/* User Menu Popup */}
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
              <div className={`absolute bottom-full ${isCollapsed ? 'left-full ml-3 bottom-0 w-56' : 'left-0 mx-4 mb-3 w-[calc(100%-2rem)]'} bg-white rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-40 origin-bottom-left border border-white/10`}>
                <div className="p-2 space-y-1">
                  <div className="px-4 py-3 bg-gray-50/80 rounded-xl mb-2 border border-gray-100">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">当前账号</p>
                     <p className="text-sm font-black text-gray-900">光谷信息</p>
                  </div>
                  <button className="w-full flex items-center px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                    <User className="w-4 h-4 mr-3" />
                    个人中心
                  </button>
                </div>
                <div className="h-px bg-gray-100 mx-2" />
                <div className="p-2">
                  <button className="w-full flex items-center px-4 py-3 text-sm font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                    <LogOut className="w-4 h-4 mr-3" />
                    退出登录
                  </button>
                </div>
              </div>
            </>
          )}

          {!isCollapsed && (
            <div 
              className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group select-none relative"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="User" 
                className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white/20"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-bold truncate">光谷信息</span>
                <span className="text-[10px] opacity-60 font-medium tracking-widest uppercase">超级管理员</span>
              </div>
              
              {/* Exit Button */}
              <div 
                className="ml-auto p-2 rounded-xl text-white/30 hover:text-rose-400 hover:bg-white/10 transition-all z-10"
                title="退出登录"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add logout logic here if needed
                  console.log('User logged out');
                }}
              >
                <LogOut className="w-4 h-4" />
              </div>
            </div>
          )}
          {isCollapsed && (
             <div 
                className="flex justify-center p-3 relative"
                onClick={() => setShowUserMenu(!showUserMenu)}
             >
               <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="User" 
                  className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white/20 cursor-pointer"
                />
             </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-72'} min-h-screen`}>
        {/* Content Area */}
        <main className="flex-1 p-10">
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};
