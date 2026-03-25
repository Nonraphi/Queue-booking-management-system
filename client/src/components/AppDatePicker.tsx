import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

type AppDatePickerProps = {
    value: string
    onChange: (value: string) => void
    className?: string
    placeholder?: string
    disabled?: boolean
}

const weekdayLabels = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.']

function parseDate(value: string): Date | null {
    if (!value) return null
    const [yearText, monthText, dayText] = value.split('-')
    const year = Number(yearText)
    const month = Number(monthText)
    const day = Number(dayText)

    if (!year || !month || !day) return null
    return new Date(year, month - 1, day)
}

function toDateValue(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function formatThaiDate(value: string): string {
    const date = parseDate(value)
    if (!date) return ''

    return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date)
}

function getCalendarDays(cursor: Date): Date[] {
    const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const start = new Date(firstDay)
    start.setDate(start.getDate() - start.getDay())

    return Array.from({ length: 42 }, (_, index) => {
        const day = new Date(start)
        day.setDate(start.getDate() + index)
        return day
    })
}

function AppDatePicker({
    value,
    onChange,
    className = '',
    placeholder = 'เลือกวันที่',
    disabled,
}: AppDatePickerProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const selectedDate = useMemo(() => parseDate(value), [value])
    const [cursorDate, setCursorDate] = useState<Date>(() => selectedDate ?? new Date())

    useEffect(() => {
        const onPointerDown = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
            setIsOpen(false)
        }
    }

    document.addEventListener('mousedown', onPointerDown)
        return () => document.removeEventListener('mousedown', onPointerDown)
    }, [])

    const days = useMemo(() => getCalendarDays(cursorDate), [cursorDate])
    const currentMonth = cursorDate.getMonth()

    return (
        <div ref={containerRef} className={`relative ${className}`.trim()}>
        <button
            type="button"
            disabled={disabled}
            onClick={() => {
                if (!isOpen && selectedDate) {
                    setCursorDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
                }
                setIsOpen((prev) => !prev)
            }}
            className="flex h-10 w-full items-center justify-between rounded border border-gray-300 bg-white px-3 text-sm text-gray-700 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
            <span>{formatThaiDate(value) || placeholder}</span>
            <CalendarDays size={16} className="text-gray-500" />
        </button>

        {isOpen ? (
            <div className="absolute z-50 mt-2 w-72 rounded-md border border-gray-200 bg-white p-3 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
                <button
                type="button"
                onClick={() =>
                    setCursorDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
                }
                    className="rounded p-1 text-gray-600 hover:bg-gray-100"
                >
                    <ChevronLeft size={16} />
                </button>
                <p className="text-sm font-semibold text-gray-800">
                {new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
                    month: 'long',
                    year: 'numeric',
                }).format(cursorDate)}
                </p>
                <button
                type="button"
                onClick={() =>
                    setCursorDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
                }
                className="rounded p-1 text-gray-600 hover:bg-gray-100"
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {weekdayLabels.map((weekday) => (
                <span key={weekday} className="py-1 text-center text-xs text-gray-500">
                    {weekday}
                </span>
            ))}

            {days.map((day) => {
                const isOutsideMonth = day.getMonth() !== currentMonth
                const isSelected =
                    selectedDate?.getFullYear() === day.getFullYear() &&
                    selectedDate?.getMonth() === day.getMonth() &&
                    selectedDate?.getDate() === day.getDate()

                return (
                    <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => {
                        onChange(toDateValue(day))
                        setIsOpen(false)
                        }}
                        className={`rounded py-1 text-sm ${
                            isSelected
                            ? 'bg-green-600 text-white'
                            : isOutsideMonth
                                ? 'text-gray-300'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        >
                        {day.getDate()}
                    </button>
                )
            })}
            </div>
        </div>
        ) : null}
        </div>
    )
}

export default AppDatePicker
