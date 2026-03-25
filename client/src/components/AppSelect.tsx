import { useEffect, useMemo, useRef, useState, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

type SelectOption = {
  label: string
  value: string | number
}

type AppSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  options: SelectOption[]
}

function AppSelect({ options, className = '', value, defaultValue, onChange, disabled, ...props }: AppSelectProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue !== undefined ? String(defaultValue) : String(options[0]?.value ?? ''),
  )

  const selectedValue = value !== undefined ? String(value) : internalValue
  const selectedOption = useMemo(
    () => options.find((option) => String(option.value) === selectedValue),
    [options, selectedValue],
  )

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const emitChange = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue)
    }

    onChange?.({ target: { value: nextValue } } as React.ChangeEvent<HTMLSelectElement>)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-10 w-full rounded border border-gray-300 bg-white px-3 pr-9 text-left text-sm text-gray-700 outline-none transition-colors hover:border-gray-400 focus:border-green-500 disabled:cursor-not-allowed disabled:bg-gray-100 ${className}`.trim()}
      >
        {selectedOption?.label ?? options[0]?.label ?? ''}
      </button>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      />

      {isOpen ? (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((option) => {
            const optionValue = String(option.value)
            const isSelected = optionValue === selectedValue

            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => {
                  emitChange(optionValue)
                  setIsOpen(false)
                }}
                className={`block w-full px-3 py-2 text-left text-sm ${
                  isSelected ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      ) : null}

      <select
        {...props}
        value={selectedValue}
        onChange={(event) => emitChange(event.target.value)}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      >
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default AppSelect