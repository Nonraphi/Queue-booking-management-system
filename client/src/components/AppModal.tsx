import type { ReactNode } from 'react'
import { X } from 'lucide-react'

type AppModalProps = {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

function AppModal({ isOpen, onClose, title, children }: AppModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative max-w-full w-[60%] max-h-[90vh] flex flex-col rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AppModal