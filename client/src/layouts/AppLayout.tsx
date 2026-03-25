import type { ReactNode } from 'react'
import { ClipboardCheck, Files, LogOut, Settings, UsersRound } from 'lucide-react'
import logoImage from '../assets/logo.png'

interface Props {
    children: ReactNode
}

function AppLayout({ children }: Props) {
    return (
        <div className="flex min-h-screen bg-[#f3f3f3] text-gray-800">
            <aside className="flex w-[250px] flex-col border-r border-gray-200 bg-[#f6f6f6]">
                <div className="flex h-[58px] justify-center items-center gap-2 bg-gradient-to-r from-green-700 to-green-500 px-3 text-white">
                    <img src={logoImage} alt="Logo" className="h-10 w-10 rounded-full border border-yellow-300 object-cover" />
                    <p className="text-lg font-medium tracking-tight">ระบบจัดการจอง</p>
                </div>

                <nav className="flex-1 space-y-1 px-2 py-3 text-[14px]">
                    <a
                        href="#"
                        className="flex items-center gap-2 rounded-md bg-emerald-100 px-3 py-2 text-emerald-700"
                    >
                        <ClipboardCheck size={14} />
                        จัดการประเภทงาน
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-500 hover:bg-gray-100"
                    >
                        <Files size={14} />
                        ป้อนรายการงานประจำ
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-500 hover:bg-gray-100"
                    >
                        <UsersRound size={14} />
                        รายงานการจองคิว
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-500 hover:bg-gray-100"
                    >
                        <Settings size={14} />
                        อัปโหลดประชาสัมพันธ์
                    </a>
                </nav>

                <div className="p-3">
                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-green-700 px-3 py-2 text-sm text-white"
                    >
                        <LogOut size={14} /> ออกจากระบบ
                    </button>
                </div>
            </aside>

            <main className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-10 items-center justify-end border-b border-none bg-[#f3f3f3] px-4 text-sm text-gray-700">
                    user : 77777777777777
                </header>

                <div className="flex-1 overflow-auto p-5">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default AppLayout
