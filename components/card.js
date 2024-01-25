export function Card({children}) {
    return (
        <div className={"p-5 rounded-xl border-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white transition"}>
            {children}
        </div>
    )
}