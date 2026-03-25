import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

type AppTimePickerProps = {
    value: string
    onChange: (value: string) => void
    className?: string
    disabled?: boolean
}

function normalizePart(part: string, max: number): string {
        const parsed = Number(part)
        if (!Number.isInteger(parsed) || parsed < 0 || parsed > max) {
    return '00'
    }
    return String(parsed).padStart(2, '0')
}

function AppTimePicker({
    value,
    onChange,
    className = '',
    disabled,
}: AppTimePickerProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const [hourPart, minutePart] = useMemo(() => {
        const [rawHour = '00', rawMinute = '00'] = value.split(':')
        return [normalizePart(rawHour, 23), normalizePart(rawMinute, 59)]
    }, [value])

    const hourOptions = useMemo(
        () => Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0')),
        [],
    )

    const minuteOptions = useMemo(
        () => Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0')),
        [],
    )

    const updateTime = (nextHour: string, nextMinute: string) => {
        onChange(`${nextHour}:${nextMinute}`)
    }

    useEffect(() => {
        const onPointerDown = (event: MouseEvent) => {
        if (!containerRef.current?.contains(event.target as Node)) {
            setIsOpen(false)
        }
    }

    document.addEventListener('mousedown', onPointerDown)
        return () => document.removeEventListener('mousedown', onPointerDown)
    }, [])

    return (
        <div ref={containerRef} className={`relative ${className}`.trim()}>
        <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-9 w-full items-center justify-between rounded border border-gray-300 bg-white px-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
            <span>{value || '00:00'}</span>
            <ChevronDown size={14} className="text-gray-500" />
        </button>

        {isOpen ? (
            <div className="absolute z-50 mt-1 w-48 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <p className="mb-1 text-center text-xs text-gray-500">ชั่วโมง</p>
                    <div className="max-h-40 overflow-y-auto rounded border border-gray-200 p-1">
                    {hourOptions.map((hour) => (
                    <button
                        key={hour}
                        type="button"
                        onClick={() => updateTime(hour, minutePart)}
                        className={`block w-full rounded px-2 py-1 text-center text-sm ${
                        hour === hourPart ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    > 
                        {hour}
                    </button>
                    ))}
                </div>
            </div>

            <div>
                <p className="mb-1 text-center text-xs text-gray-500">นาที</p>
                <div className="max-h-40 overflow-y-auto rounded border border-gray-200 p-1">
                    {minuteOptions.map((minute) => (
                    <button
                        key={minute}
                        type="button"
                        onClick={() => updateTime(hourPart, minute)}
                        className={`block w-full rounded px-2 py-1 text-center text-sm ${
                        minute === minutePart ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {minute}
                    </button>
                    ))}
                </div>
                </div>
            </div>

            <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-2 w-full rounded bg-green-600 px-2 py-1.5 text-sm text-white hover:bg-green-700"
            >
                ตกลง
            </button>
            </div>
        ) : null}
        </div>
    )
}

export default AppTimePicker
