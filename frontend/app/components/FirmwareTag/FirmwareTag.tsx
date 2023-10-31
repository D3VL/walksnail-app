const typeMap = {
    alpha: {
        name: 'Alpha',
        color: 'warning'
    },
    beta: {
        name: 'Beta',
        color: 'secondary'
    },
    stable: {
        name: 'Stable',
        color: 'info'
    },
    official: {
        name: 'Official',
        color: 'success'
    },
    unknown: {
        name: 'Unknown',
        color: 'accent'
    }
}

export default function ({
    type,
    className = ''
}: {
    type: string
    className?: string
}) {
    const matched = typeMap[type.toLowerCase() as keyof typeof typeMap] ?? typeMap.unknown
    return (
        <div className={`badge badge-${matched.color} rounded-lg ${className}`}>{matched.name}</div>
    )
}