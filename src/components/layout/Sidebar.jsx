import { 
    LayoutDashboard, 
    FolderOpen, 
    BarChart3,
    X
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    const menuItems = [
        {
            name: 'Dashboard',
            icon: LayoutDashboard,
            path: '/dashboard',
            roles: ['Tecnico', 'Coordinador', 'Administrador']
        },
        {
            name: 'Expedientes',
            icon: FolderOpen,
            path: '/expedientes',
            roles: ['Tecnico', 'Coordinador', 'Administrador']
        },
        {
            name: 'Reportes',
            icon: BarChart3,
            path: '/reportes',
            roles: ['Coordinador', 'Administrador']
        }
    ];

    const filteredMenuItems = menuItems.filter(item => 
        item.roles.includes(user?.nombre_rol)
    );

    return (
        <>
            {}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {}
                <div className="lg:hidden flex items-center justify-between p-4 border-b">
                    <span className="text-lg font-bold text-gray-900">Menú</span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {}
                <nav className="p-4 space-y-2">
                    {filteredMenuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose()}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-primary-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                {}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <div className="text-xs text-gray-500">
                        <p className="font-semibold text-gray-700">Sistema DICRI</p>
                        <p className="mt-1">Versión 1.0.0</p>
                        <p className="mt-1">Ministerio Público</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;