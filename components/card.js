export function Card({children}) {
    return (
        <div className={"p-5 rounded-xl shadow-md hover:bg-blue-500 hover:text-white transition"}>
            {children}
        </div>
    )
}
export function CardContent({children}) {
    return (
        <div className={""}>
            {children}
        </div>
    )
}