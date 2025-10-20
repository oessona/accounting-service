'use client'

import { useEffect, useState } from "react";

const Links = [
    { name: 'Transactions', href: '/transactions' },
    { name: 'Reports', href: '/reports' },
    { name: 'User', href: '/user' },
]

export default function Sidebar() {
    const [pathName, setPathName] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setPathName(window.location.pathname);
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* Mobile menu button */}
            <button 
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    {isMobileMenuOpen ? (
                        <path d="M18 6 6 18M6 6l12 12"/>
                    ) : (
                        <path d="M3 12h18M3 6h18M3 18h18"/>
                    )}
                </svg>
            </button>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black bopacity-50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <aside className={`
                fixed md:static
                top-0 bottom-0
                bg-white border-r border-gray-200
                transition-all duration-300 ease-in-out
                ${isMobileMenuOpen ? 'left-0' : '-left-full'}
                md:left-0
                ${isCollapsed ? 'w-20' : 'w-64'}
                p-6 z-50
            `}>
                <div className="flex items-center justify-between border-gray-400 border-b pb-6 w-full">
                    <h2 className={`text-gray-700 font-semibold text-2xl transition-opacity duration-200
                        ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}
                    `}>
                        Financial
                    </h2>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:block p-2 rounded-full hover:bg-gray-100"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {isCollapsed ? (
                                <path d="m9 18 6-6-6-6"/>
                            ) : (
                                <path d="m15 18-6-6 6-6"/>
                            )}
                        </svg>
                    </button>
                </div>
                <nav className="space-y-6 font-semibold mt-10 text-lg">
                    {Links.map(link => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 text-black hover:text-gray-600 rounded-xl py-4 px-4
                                ${pathName === link.href ? "bg-green-100 text-green-600 hover:!text-green-500" : ''}
                                ${isCollapsed ? 'justify-center' : ''}
                            `}
                        >
                            <Icon name={link.name} />
                            <span className={`transition-opacity duration-200
                                ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}
                            `}>
                                {link.name}
                            </span>
                        </a>
                    ))}
                    <a href="/#" className={`mt-10 text-red-400 hover:text-red-600 flex font-semibold items-center gap-3 p-4 cursor-pointer
                        ${isCollapsed ? 'justify-center' : ''}
                    `}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m16 17 5-5-5-5"/>
                            <path d="M21 12H9"/>
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        </svg>
                        <span className={`transition-opacity duration-200
                            ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}
                        `}>
                            Logout
                        </span>
                    </a>
                </nav>
            </aside>
        </>
    )
}

function Icon ({ name }: { name: string }) {
    switch (name) {
        case 'Transactions': return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
        case 'Reports': return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>;
        case 'User': return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
        default: return null;
    }
}