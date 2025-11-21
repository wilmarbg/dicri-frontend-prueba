import { LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo y menú móvil */}
                    <div className="flex items-center">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
                            <img 
                                src="/logo-mp.png" 
                                alt="Ministerio Público" 
                                className="h-10 w-auto"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <div style={{ display: 'none' }} className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                                MP
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900">
                                DICRI
                            </span>
                        </div>
                    </div>

                    {/* Información del usuario */}
                    <div className="flex items-center">
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.nombre_completo}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user?.nombre_rol}
                                    </p>
                                </div>
                                <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {user?.nombre_completo?.charAt(0).toUpperCase()}
                                </div>
                            </button>

                            {/* Dropdown menu */}
                            {showUserMenu && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                                        <div className="px-4 py-3 border-b border-gray-200 sm:hidden">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user?.nombre_completo}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {user?.email}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {user?.nombre_rol}
                                            </p>
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <LogOut size={16} />
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;