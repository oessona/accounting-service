'use client'

import { useEffect, useState } from "react";

const Links = [
    { name: 'Transactions', href: '/transations' },
    { name: 'Reports', href: '/reports' },
    { name: 'User', href: '/user' },
]

export default function Sidebar() {

    const [pathName, setPathName] = useState('');
    useEffect(() => {
        setPathName(window.location.pathname);
    }, []);

    return (
        <aside className="w-xs bg-white border-r border-gray-200 p-6">
            <div className="border-gray-400 border-b pb-6 w-full">
                <h2 className="text-gray-700 font-semibold mb-6 text-2xl w-full text-center">Financial</h2>
            </div>
            <nav className="space-y-6 font-semibold mt-10 text-lg">
                {Links.map(link => (
                    <a
                        key={link.name}
                        href={link.href}
                        className={`flex items-center gap-3 text-black h-20 hover:text-gray-600 rounded-xl py-4 px-4 ${pathName === link.href ? "bg-green-100 text-green-600 hover:!text-green-500" : ''}`}
                    >
                        <Icon name={link.name} />
                        <span>{link.name}</span>
                    </a>
                ))}
                <a href="/#" className="mt-10 text-red-400 hover:text-red-600 flex font-semibold items-center gap-3 p-4 cursor-pointer"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg> Logout</a>
            </nav>
        </aside>
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