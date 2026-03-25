import AppPagination from '../../../components/AppPagination'
import AppSelect from '../../../components/AppSelect'

export type TaskTypeItem = {
    id: number
    name: string
    taskType: unknown
}

type TaskTableProps = {
    items: TaskTypeItem[]
    totalItems: number
    page: number
    pageSize: number
    onPageSizeChange: (value: number) => void
    onPageChange: (value: number) => void
    onRowClick?: (item: TaskTypeItem) => void
}

function TaskTable({
    items,
    totalItems,
    page,
    pageSize,
    onPageSizeChange,
    onPageChange,
    onRowClick,
}: TaskTableProps) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
    const endItem = Math.min(page * pageSize, totalItems)

    return (
        <div className="flex min-h-87.5 flex-col rounded border border-none bg-white">
            <table className="min-w-full text-left text-sm">

                <thead className="text-lg font-medium text-gray-500">
                    <tr>
                        <th className="px-4 py-3 font-semibold">ประเภทงาน</th>
                    </tr>
                </thead>

                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td className="px-4 py-8 text-center text-gray-500" colSpan={1}>
                                ยังไม่มีข้อมูลประเภทงาน
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => (
                            <tr
                                key={item.id}
                                className="cursor-pointer border-t border-gray-200 hover:bg-gray-50"
                                onClick={() => onRowClick?.(item)}
                            >
                                <td className="px-4 py-2.5 text-[13px]">{item.name}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="mt-auto flex flex-col justify-between gap-3 border-t border-gray-200 px-4 py-3 text-xs text-gray-700 md:flex-row md:items-center">
                <div className="flex flex-wrap items-center gap-2">
                    <span>{`รายการที่ ${startItem} ถึง ${endItem} จากทั้งหมด ${totalItems} รายการ`}</span>
                    <AppSelect
                        value={pageSize}
                        onChange={(event) => onPageSizeChange(Number(event.target.value))}
                        className="h-7 px-2 text-xs"
                        options={Array.from({ length: 10 }, (_, index) => {
                            const value = index + 1
                            return { label: String(value), value }
                        })}
                    />
                    <span>รายการต่อหน้า</span>
                </div>

                <AppPagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    )
}

export default TaskTable
