import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

type AppPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (nextPage: number) => void
}

function AppPagination({ page, totalPages, onPageChange }: AppPaginationProps) {
  return (
    <div className="flex items-center gap-2">
      <span>{`หน้าที่ ${page} จากทั้งหมด ${totalPages} หน้า`}</span>
      <button
        type="button"
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        className="rounded border border-gray-300 p-1 text-gray-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronsLeft size={14} />
      </button>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded border border-gray-300 p-1 text-gray-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={14} />
      </button>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded border border-gray-300 p-1 text-gray-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={14} />
      </button>
      <button
        type="button"
        onClick={() => onPageChange(totalPages)}
        disabled={page >= totalPages}
        className="rounded border border-gray-300 p-1 text-gray-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronsRight size={14} />
      </button>
    </div>
  )
}

export default AppPagination