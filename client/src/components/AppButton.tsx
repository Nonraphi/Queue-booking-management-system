import type { ButtonHTMLAttributes, ReactNode } from 'react'

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'outline'
}

function AppButton({ children, className = '', variant = 'primary', ...props }: AppButtonProps) {
  const baseClass = 'inline-flex h-10 items-center rounded px-4 text-sm transition-colors'
  const variantClass =
    variant === 'outline'
      ? 'border border-green-500 text-green-600 hover:bg-green-50'
      : 'bg-green-700 text-white hover:bg-green-800'

  return (
    <button
      {...props}
      className={`${baseClass} ${variantClass} ${className}`.trim()}
    >
      {children}
    </button>
  )
}

export default AppButton