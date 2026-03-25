import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

import AppModal from '../../../components/AppModal'
import AppButton from '../../../components/AppButton'
import AppSelect from '../../../components/AppSelect'
import AppDatePicker from '../../../components/AppDatePicker'
import AppTimePicker from '../../../components/AppTimePicker'
import { TaskAPI, type Branch, type TaskGroup, type TaskName } from '../../../services/api'

type TaskTypeModalProps = {
    isOpen: boolean
    onClose: () => void
    selectedBranchName: string
    editingTaskType?: EditableTaskType | null
    onCreated?: () => void
}

type EditableTaskType = {
    id: number
    branchId: number
    taskGroupId: number
    taskNameId: number
    startDate: string
    recommendation?: string | null
    branch?: {
        id: number
        name: string
    }
    taskGroup?: {
        id: number
        name: string
    }
    taskName?: {
        id: number
        name: string
    }
    timeSlots?: Array<{
        id: number
        dayOfWeek: DayOfWeek
        startTime: string
        endTime: string
        capacity: number
    }>
}

type DayOfWeek = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT'

type SlotRow = {
    id: number
    startTime: string
    endTime: string
    capacity: number
}

const dayOptions: Array<{ value: DayOfWeek; label: string }> = [
    { value: 'SUN', label: 'อาทิตย์' },
    { value: 'MON', label: 'จันทร์' },
    { value: 'TUE', label: 'อังคาร' },
    { value: 'WED', label: 'พุธ' },
    { value: 'THU', label: 'พฤหัสบดี' },
    { value: 'FRI', label: 'ศุกร์' },
    { value: 'SAT', label: 'เสาร์' },
]

function createDefaultSlotRow(id: number): SlotRow {
    return {
        id,
        startTime: '08:00',
        endTime: '09:00',
        capacity: 10,
    }
}

function toMinutes(time: string): number {
    const [hourText = '0', minuteText = '0'] = time.split(':')
    const hour = Number(hourText)
    const minute = Number(minuteText)

    if (!Number.isInteger(hour) || !Number.isInteger(minute)) return Number.NaN
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return Number.NaN

    return hour * 60 + minute
}

function findDaySlotError(day: DayOfWeek, slots: SlotRow[]): string | null {
    const dayLabel = dayOptions.find((d) => d.value === day)?.label ?? day

    const ranges = slots.map((slot) => ({
        id: slot.id,
        start: toMinutes(slot.startTime),
        end: toMinutes(slot.endTime),
    }))

    if (ranges.some((range) => Number.isNaN(range.start) || Number.isNaN(range.end))) {
        return `ช่วงเวลาของวัน ${dayLabel} ไม่ถูกต้อง`
    }

    if (ranges.some((range) => range.start >= range.end)) {
        return `เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุดของวัน ${dayLabel}`
    }

    const sorted = [...ranges].sort((a, b) => a.start - b.start)
    for (let index = 1; index < sorted.length; index += 1) {
        const previous = sorted[index - 1]
        const current = sorted[index]

        if (current.start < previous.end) {
            return `ช่วงเวลาซ้อนกันในวัน ${dayLabel}`
        }
    }

    return null
}

function TaskTypeModal({ isOpen, onClose, selectedBranchName, editingTaskType, onCreated }: TaskTypeModalProps) {
    const [branches, setBranches] = useState<Branch[]>([])
    const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([])
    const [taskNames, setTaskNames] = useState<TaskName[]>([])
    const [selectedTaskGroupId, setSelectedTaskGroupId] = useState('')
    const [selectedTaskNameId, setSelectedTaskNameId] = useState('')
    const [startDate, setStartDate] = useState('')
    const [recommendation, setRecommendation] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(['SUN'])
    const [daySlots, setDaySlots] = useState<Record<DayOfWeek, SlotRow[]>>({
        SUN: [createDefaultSlotRow(1)],
        MON: [createDefaultSlotRow(1)],
        TUE: [createDefaultSlotRow(1)],
        WED: [createDefaultSlotRow(1)],
        THU: [createDefaultSlotRow(1)],
        FRI: [createDefaultSlotRow(1)],
        SAT: [createDefaultSlotRow(1)],
    })

    useEffect(() => {
        if (!isOpen) return

        const loadInitialData = async () => {
            try {
                const [branchData, groupData] = await Promise.all([
                    TaskAPI.getBranches(),
                    TaskAPI.getTaskGroups(),
                ])
                setBranches(Array.isArray(branchData) ? branchData : [])
                setTaskGroups(Array.isArray(groupData) ? groupData : [])
                setError('')
            } catch {
                setError('ไม่สามารถโหลดข้อมูลสำหรับสร้างประเภทงานได้')
            }
        }

        void loadInitialData()
    }, [isOpen])

    useEffect(() => {
        if (!selectedTaskGroupId) {
            setTaskNames([])
            setSelectedTaskNameId('')
            return
        }

        const loadTaskNames = async () => {
            try {
                const names = await TaskAPI.getTaskNames(Number(selectedTaskGroupId))
                setTaskNames(Array.isArray(names) ? names : [])
            } catch {
                setTaskNames([])
            }
        }

        void loadTaskNames()
    }, [selectedTaskGroupId])

    const selectedDayOptions = useMemo(
        () => dayOptions.filter((day) => selectedDays.includes(day.value)),
        [selectedDays],
    )

    const isEditMode = Boolean(editingTaskType)

    const selectedBranch = useMemo(() => {
        if (editingTaskType?.branch) {
            return editingTaskType.branch
        }

        if (selectedBranchName === 'all') {
            return null
        }
        return branches.find((branch) => branch.name === selectedBranchName) ?? null
    }, [branches, selectedBranchName, editingTaskType])

    useEffect(() => {
        if (!isOpen) return

        if (!editingTaskType) {
            setSelectedTaskGroupId('')
            setSelectedTaskNameId('')
            setStartDate('')
            setRecommendation('')
            setSelectedDays(['SUN'])
            setDaySlots({
                SUN: [createDefaultSlotRow(1)],
                MON: [createDefaultSlotRow(1)],
                TUE: [createDefaultSlotRow(1)],
                WED: [createDefaultSlotRow(1)],
                THU: [createDefaultSlotRow(1)],
                FRI: [createDefaultSlotRow(1)],
                SAT: [createDefaultSlotRow(1)],
            })
            return
        }

        setSelectedTaskGroupId(String(editingTaskType.taskGroupId))
        setSelectedTaskNameId(String(editingTaskType.taskNameId))
        setStartDate(editingTaskType.startDate?.slice(0, 10) ?? '')
        setRecommendation(editingTaskType.recommendation ?? '')

        const groupedSlots = dayOptions.reduce<Record<DayOfWeek, SlotRow[]>>((acc, day) => {
            const rows =
                editingTaskType.timeSlots
                    ?.filter((slot) => slot.dayOfWeek === day.value)
                    .map((slot) => ({
                        id: slot.id,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        capacity: slot.capacity,
                    })) ?? []

            acc[day.value] = rows.length > 0 ? rows : [createDefaultSlotRow(1)]
            return acc
        }, {} as Record<DayOfWeek, SlotRow[]>)

        const pickedDays = dayOptions
            .filter((day) => (editingTaskType.timeSlots ?? []).some((slot) => slot.dayOfWeek === day.value))
            .map((day) => day.value)

        setSelectedDays(pickedDays.length > 0 ? pickedDays : ['SUN'])
        setDaySlots(groupedSlots)
    }, [isOpen, editingTaskType])

    const toggleDay = (day: DayOfWeek, checked: boolean) => {
        if (checked) {
            setSelectedDays((prev) => {
                if (prev.includes(day)) return prev
                return [...prev, day]
            })
            return
        }

        setSelectedDays((prev) => prev.filter((value) => value !== day))
    }

    const updateSlot = (
        day: DayOfWeek,
        slotId: number,
        field: keyof Omit<SlotRow, 'id'>,
        value: string | number,
    ) => {
        setDaySlots((prev) => ({
            ...prev,
            [day]: prev[day].map((slot) =>
                slot.id === slotId
                    ? {
                            ...slot,
                            [field]: value,
                        }
                    : slot,
            ),
        }))
    }

    const addSlot = (day: DayOfWeek) => {
        setDaySlots((prev) => {
            const nextId = Math.max(0, ...prev[day].map((slot) => slot.id)) + 1
            return {
                ...prev,
                [day]: [...prev[day], createDefaultSlotRow(nextId)],
            }
        })
    }

    const removeSlot = (day: DayOfWeek, slotId: number) => {
        setDaySlots((prev) => {
            const rows = prev[day].filter((slot) => slot.id !== slotId)
            return {
                ...prev,
                [day]: rows.length > 0 ? rows : [createDefaultSlotRow(1)],
            }
        })
    }

    const resetForm = () => {
        setSelectedTaskGroupId('')
        setSelectedTaskNameId('')
        setStartDate('')
        setRecommendation('')
        setSelectedDays(['SUN'])
        setDaySlots({
            SUN: [createDefaultSlotRow(1)],
            MON: [createDefaultSlotRow(1)],
            TUE: [createDefaultSlotRow(1)],
            WED: [createDefaultSlotRow(1)],
            THU: [createDefaultSlotRow(1)],
            FRI: [createDefaultSlotRow(1)],
            SAT: [createDefaultSlotRow(1)],
        })
        setError('')
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!selectedBranch) {
            setError('กรุณาเลือกสาขาที่ต้องการก่อนกดเพิ่มประเภทงาน')
            return
        }

        if (!selectedTaskGroupId || !selectedTaskNameId || !startDate) {
            setError('กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน')
            return
        }

        if (selectedDays.length === 0) {
            setError('กรุณาเลือกอย่างน้อย 1 วัน')
            return
        }

        for (const day of selectedDays) {
            const dayError = findDaySlotError(day, daySlots[day])
            if (dayError) {
                setError(dayError)
                return
            }
        }

        const timeSlots = selectedDays.flatMap((day) =>
            daySlots[day].map((slot) => ({
                dayOfWeek: day,
                startTime: slot.startTime,
                endTime: slot.endTime,
                capacity: Math.max(1, slot.capacity),
            })),
        )

        try {
            setSaving(true)
            if (isEditMode && editingTaskType) {
                await TaskAPI.updateTaskType(editingTaskType.id, {
                    startDate,
                    recommendation: recommendation.trim() || undefined,
                    timeSlots,
                })
            } else {
                await TaskAPI.createTaskType({
                    branchId: selectedBranch.id,
                    taskGroupId: Number(selectedTaskGroupId),
                    taskNameId: Number(selectedTaskNameId),
                    startDate,
                    recommendation: recommendation.trim() || undefined,
                    timeSlots,
                })
            }

            resetForm()
            onCreated?.()
            onClose()
        } catch {
            setError('บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!editingTaskType) return

        const confirmed = window.confirm('ยืนยันการลบประเภทงานนี้ใช่หรือไม่')
        if (!confirmed) return

        try {
            setSaving(true)
            await TaskAPI.deleteTaskType(editingTaskType.id)
            onCreated?.()
            onClose()
        } catch {
            setError('ลบข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
        } finally {
            setSaving(false)
        }
    }

    const taskGroupSelectOptions = [
        { label: '--กรุณาเลือกกลุ่มงาน--', value: '' },
        ...taskGroups.map((group) => ({ label: group.name, value: String(group.id) })),
    ]

    const taskNameSelectOptions = [
        { label: '--กรุณาเลือกประเภทงาน--', value: '' },
        ...taskNames.map((name) => ({ label: name.name, value: String(name.id) })),
    ]

    return (
        <AppModal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'แก้ไขประเภทงาน' : 'เพิ่มประเภทงาน'}>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-3 rounded border border-gray-200 bg-gray-50 p-4">

                    <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[170px_minmax(0,1fr)] md:gap-3">
                        <label className="text-sm font-medium text-gray-700">กลุ่มงาน <span className="text-red-500">*</span></label>
                        {isEditMode ? (
                            <p className="h-10 rounded border border-gray-300 bg-gray-100 px-3 text-sm leading-10 text-gray-700">
                                {editingTaskType?.taskGroup?.name ?? '-'}
                            </p>
                        ) : (
                            <AppSelect
                                className="h-10 w-full"
                                value={selectedTaskGroupId}
                                onChange={(event) => {
                                    setSelectedTaskGroupId(event.target.value)
                                    setSelectedTaskNameId('')
                                }}
                                options={taskGroupSelectOptions}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[170px_minmax(0,1fr)] md:gap-3">
                        <label className="text-sm font-medium text-gray-700">ชื่อประเภทงาน <span className="text-red-500">*</span></label>
                        {isEditMode ? (
                            <p className="h-10 rounded border border-gray-300 bg-gray-100 px-3 text-sm leading-10 text-gray-700">
                                {editingTaskType?.taskName?.name ?? '-'}
                            </p>
                        ) : (
                            <AppSelect
                                className="h-10 w-full"
                                value={selectedTaskNameId}
                                onChange={(event) => setSelectedTaskNameId(event.target.value)}
                                options={taskNameSelectOptions}
                                disabled={!selectedTaskGroupId}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[170px_minmax(0,1fr)] md:gap-3">
                        <label className="text-sm font-medium text-gray-700">เริ่มจองได้ตั้งแต่วันที่ <span className="text-red-500">*</span></label>
                        <AppDatePicker
                            value={startDate}
                            onChange={setStartDate}
                            className="w-full max-w-60"
                            placeholder="เลือกวันที่"
                        />
                    </div>
                </div>

                <div className="rounded border border-gray-200 p-4">
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-[170px_minmax(0,1fr)] md:gap-3">
                        <p className="pt-2 text-sm font-medium text-gray-700">วันที่เปิดทำงาน <span className="text-red-500">*</span></p>

                        <div className="space-y-2">
                            {dayOptions.map((day) => {
                                const checked = selectedDays.includes(day.value)
                                const slots = daySlots[day.value]

                                return (
                                    <div key={day.value} className="space-y-2">
                                        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={(event) => toggleDay(day.value, event.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 accent-green-600"
                                            />
                                            {day.label}
                                        </label>

                                        {checked ? (
                                            <div className="ml-6 rounded border border-gray-200 bg-gray-50 p-3">
                                                <div className="space-y-2">
                                                    {slots.map((slot, index) => (
                                                        <div
                                                            key={slot.id}
                                                            className="grid grid-cols-1 gap-2 md:grid-cols-[66px_110px_30px_110px_54px_72px_50px_auto] md:items-center"
                                                        >
                                                            <span className="text-sm text-gray-600">{index === 0 ? 'ช่วงเวลา' : ''}</span>
                                                            <AppTimePicker
                                                                value={slot.startTime}
                                                                onChange={(nextValue) =>
                                                                    updateSlot(day.value, slot.id, 'startTime', nextValue)
                                                                }
                                                            />
                                                            <span className="text-center text-sm text-gray-600">ถึง</span>
                                                            <AppTimePicker
                                                                value={slot.endTime}
                                                                onChange={(nextValue) =>
                                                                    updateSlot(day.value, slot.id, 'endTime', nextValue)
                                                                }
                                                            />
                                                            <span className="text-sm text-gray-600">จำนวน</span>
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                value={slot.capacity}
                                                                onChange={(event) =>
                                                                    updateSlot(
                                                                        day.value,
                                                                        slot.id,
                                                                        'capacity',
                                                                        Number(event.target.value) || 1,
                                                                    )
                                                                }
                                                                className="h-9 rounded border border-gray-300 bg-white px-2 text-sm outline-none"
                                                            />
                                                            <span className="text-sm text-gray-600">คน</span>
                                                            {index === 0 ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addSlot(day.value)}
                                                                    className="inline-flex h-9 w-12 items-center justify-center rounded border border-green-500 text-green-600 hover:bg-green-50"
                                                                >
                                                                    <Plus size={14} />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeSlot(day.value, slot.id)}
                                                                    className="inline-flex h-9 w-12 items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                )
                            })}

                            {selectedDayOptions.length === 0 ? (
                                <p className="text-sm text-red-500">กรุณาเลือกอย่างน้อย 1 วัน</p>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-[170px_minmax(0,1fr)] md:gap-3">
                    <label className="pt-2 text-sm font-medium text-gray-700">คำแนะนำ</label>
                    <textarea
                        rows={3}
                        value={recommendation}
                        onChange={(event) => setRecommendation(event.target.value)}
                        className="w-full rounded border border-gray-300 p-3 text-sm outline-none"
                        placeholder="เช่น กรุณาเตรียมสมุดคู่มือจดทะเบียนรถ..."
                    />
                </div>

                {error ? (
                    <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                        {error}
                    </div>
                ) : null}

                <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                    {isEditMode ? (
                        <AppButton
                            type="button"
                            variant="outline"
                            disabled={saving}
                            onClick={handleDelete}
                            className="border-red-500 text-red-600 hover:bg-red-50"
                        >
                            ลบ
                        </AppButton>
                    ) : null}
                    <AppButton type="submit" disabled={saving}>
                        บันทึก
                    </AppButton>
                </div>
            </form>
        </AppModal>
    )
}

export default TaskTypeModal