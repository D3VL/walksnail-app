


export default function ({
    children,
    bg = "bg-black",
    text = "text-white",
    p = "p-6",
    className = ""
}: React.PropsWithChildren<{
    bg?: string;
    text?: string;
    p?: string;
    className?: string;
}>) {
    return (
        <div className={`rounded-[2rem] ${bg} ${text} ${p} ${className} `}>
            {children}
        </div>
    )
}