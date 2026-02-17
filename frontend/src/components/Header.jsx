import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Bell, Search, UserCircle, Shield, Globe, Zap, Info, Calendar, DollarSign, Clock, Activity, Moon, Sun } from 'lucide-react';



const Header = () => {
    const { user } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'light');

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };



    const getIcon = (type) => {
        switch (type) {
            case 'leave': return <Calendar className="w-4 h-4 text-purple-600" />;
            case 'salary': return <DollarSign className="w-4 h-4 text-emerald-600" />;
            case 'contract': return <Clock className="w-4 h-4 text-amber-600" />;
            case 'birthday': return <Zap className="w-4 h-4 text-pink-600" />;
            default: return <Info className="w-4 h-4 text-indigo-600" />;
        }
    };


    return (
        <header className="sticky top-0 right-0 left-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40 shadow-sm">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-10 bg-slate-50 border border-slate-100 rounded-lg pl-11 pr-4 text-sm text-slate-600 focus:bg-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors group"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 rounded-full text-[8px] font-bold text-white flex items-center justify-center border-2 border-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute top-full right-0 mt-4 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
                            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</h4>
                                <button onClick={markAllAsRead} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">Clear All</button>
                            </div>
                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div
                                            key={n._id}
                                            onClick={() => markAsRead(n._id)}
                                            className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer flex gap-4 ${!n.isRead ? 'bg-indigo-50/30' : 'opacity-60'}`}
                                        >
                                            <div className="p-2 bg-white rounded-lg h-fit border border-slate-100">
                                                {getIcon(n.type)}
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-bold text-slate-900">{n.title}</h5>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center opacity-30">
                                        <p className="text-xs font-medium text-slate-500">No Notifications</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="w-px h-6 bg-slate-100 mx-2" />

                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">{user?.role}</p>
                        </div>
                        <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400">
                            <UserCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};



export default Header;
