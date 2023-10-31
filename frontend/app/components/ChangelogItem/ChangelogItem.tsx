import { Fragment } from "react"

const typeMap = {
    bug_fix: {
        name: 'Bug Fix',
        color: 'warning'
    },
    new_feature: {
        name: 'New Feature',
        color: 'success'
    },
    improvement: {
        name: 'Improvement',
        color: 'info'
    },
    other: {
        name: 'Other',
        color: 'accent'
    }
}

export default function ({
    type,
    description,
    className = ''
}: {
    type: 'bug_fix' | 'new_feature' | 'improvement' | 'other',
    description: string,
    className?: string
}) {
    return (
        <Fragment>
            <div className={`badge badge-${typeMap[type].color} me-2 w-28 rounded-lg ${className}`}>{typeMap[type].name}</div><span>{description}</span>
        </Fragment>
    )
}