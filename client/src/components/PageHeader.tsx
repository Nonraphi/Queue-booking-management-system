type PageHeaderProps = {
    title: string
}

function PageHeader({ title }: PageHeaderProps) {
    return (
        <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        </div>
    )
}

export default PageHeader
