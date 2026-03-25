import type { InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'

type AppSearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

function AppSearchInput({ className = '', ...props }: AppSearchInputProps) {
  return (
    <label className={`flex h-10 items-center gap-2 rounded border border-gray-300 bg-white px-3 text-sm text-gray-500 ${className}`.trim()}>
      <Search size={14} />
      <input
        {...props}
        type="text"
        className="w-full border-none bg-transparent text-sm text-gray-700 outline-none"
      />
    </label>
  )
}

export default AppSearchInput