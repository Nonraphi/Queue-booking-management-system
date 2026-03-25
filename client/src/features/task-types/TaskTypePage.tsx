import { useEffect, useMemo, useState } from 'react'

import { TaskAPI, type Branch } from '../../services/api'
import TaskForm from './components/TaskForm'
import TaskTable, { type TaskTypeItem } from './components/TaskTable'
import TaskTypeModal from './components/TaskTypeModal'

type ApiTaskType = {
    id: number
    branchId: number
    taskGroupId: number
    taskNameId: number
    startDate: string
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
    recommendation?: string | null
    timeSlots?: Array<{
        id: number
        dayOfWeek: 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT'
        startTime: string
        endTime: string
        capacity: number
    }>
}

function TaskTypePage() {
    const [taskTypes, setTaskTypes] = useState<ApiTaskType[]>([])
    const [branches, setBranches] = useState<Branch[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedBranch, setSelectedBranch] = useState('all')
    const [searchValue, setSearchValue] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTaskType, setEditingTaskType] = useState<ApiTaskType | null>(null)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const loadTaskTypes = async () => {
        try {
            setLoading(true)
            const response = await TaskAPI.getTaskTypes()
            setTaskTypes(Array.isArray(response) ? response : [])
            setError('')
        } catch {
            setTaskTypes([])
            setError('ไม่สามารถโหลดข้อมูลประเภทงานได้')
        } finally {
            setLoading(false)
        }
    }

    const loadBranches = async () => {
        try {
            const response = await TaskAPI.getBranches()
            setBranches(Array.isArray(response) ? response : [])
        } catch {
            setBranches([])
        }
    }

    useEffect(() => {
        void loadTaskTypes()
        void loadBranches()
    }, [])

    const branchOptions = useMemo(() => {
        const uniqueBranches = Array.from(new Set(branches.map((branch) => branch.name).filter(Boolean)))
        return ['all', ...uniqueBranches]
    }, [branches])

    const filteredItems = useMemo<TaskTypeItem[]>(() => {
        return taskTypes
            .filter((item) => {
                if (selectedBranch === 'all') {
                    return true
                }
                return item.branch?.name === selectedBranch
            })
            .map((item) => {
                const taskName = item.taskName?.name?.trim()

                return {
                    id: item.id,
                    name: taskName || '-',
                    taskType: item,
                }
            })
            .filter((item) => {
                if (!searchValue.trim()) {
                    return true
                }
                return item.name.toLowerCase().includes(searchValue.trim().toLowerCase())
            })
    }, [taskTypes, selectedBranch, searchValue])

    useEffect(() => {
        setPage(1)
    }, [selectedBranch, searchValue, pageSize])

    const pagedItems = useMemo(() => {
        const startIndex = (page - 1) * pageSize
        return filteredItems.slice(startIndex, startIndex + pageSize)
    }, [filteredItems, page, pageSize])

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages)
        }
    }, [page, totalPages])

    const displayBranchOptions = useMemo(
        () => branchOptions.map((branch) => (branch === 'all' ? 'ทุกสาขา' : branch)),
        [branchOptions],
    )

        return (
            <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-10">
                <h2 className="text-[28px] font-semibold leading-none text-gray-900">
                    ประเภทงานที่สามารถจองผ่านเว็บไซต์
                </h2>

                <TaskForm
                    branchOptions={displayBranchOptions}
                    selectedBranch={selectedBranch === 'all' ? 'ทุกสาขา' : selectedBranch}
                    onBranchChange={(value) => {
                        if (value === 'ทุกสาขา') {
                            setSelectedBranch('all')
                            return
                        }
                        setSelectedBranch(value)
                    }}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onAddClick={() => {
                        setEditingTaskType(null)
                        setIsModalOpen(true)
                    }}
                />

                {error ? (
                    <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                ) : null}

                <TaskTable
                    items={loading ? [] : pagedItems}
                    totalItems={filteredItems.length}
                    page={page}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    onPageChange={(nextPage) => {
                        const safePage = Math.min(Math.max(nextPage, 1), totalPages)
                        setPage(safePage)
                    }}
                    onRowClick={(item) => {
                        setEditingTaskType(item.taskType as ApiTaskType)
                        setIsModalOpen(true)
                    }}
                />

                <TaskTypeModal 
                    isOpen={isModalOpen} 
                    onClose={() => {
                        setIsModalOpen(false)
                        setEditingTaskType(null)
                    }}
                    selectedBranchName={selectedBranch}
                    editingTaskType={editingTaskType}
                    onCreated={() => {
                        void loadTaskTypes()
                    }}
                />
            </div>
        )
    }   

export default TaskTypePage
