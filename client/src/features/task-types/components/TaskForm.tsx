import AppButton from '../../../components/AppButton'
import AppSearchInput from '../../../components/AppSearchInput'
import AppSelect from '../../../components/AppSelect'

type TaskFormProps = {
    branchOptions: string[]
    selectedBranch: string
    onBranchChange: (value: string) => void
    searchValue: string
    onSearchChange: (value: string) => void
    onSubmit?: () => void
    onAddClick?: () => void
}

function TaskForm({
    branchOptions,
    selectedBranch,
    onBranchChange,
    searchValue,
    onSearchChange,
    onSubmit,
    onAddClick
}: TaskFormProps) {
    return (
        <form
            className="space-y-2"
            onSubmit={(event) => {
                event.preventDefault()
                onSubmit?.()
            }}
        >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[290px_1fr]">
                <AppSelect
                    value={selectedBranch}
                    onChange={(event) => onBranchChange(event.target.value)}
                    className="h-10"
                    options={branchOptions.map((option) => ({
                        label: option,
                        value: option,
                    }))}
                />

                <AppSearchInput
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="ค้นหา"
                    className="w-full md:ml-auto md:w-[40%]"
                />
            </div>

            <div>
                <AppButton
                    className='cursor-pointer'
                    type="submit"
                    variant="outline"
                    onClick={onAddClick}
                >
                    + เพิ่มประเภทงาน
                </AppButton>
            </div>
        </form>
    )
}

export default TaskForm
