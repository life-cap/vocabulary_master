export default function Login() {
    return (
        <>
            <div className={"flex flex-col justify-center gap-4 items-center h-screen"}>
                <h1 className={"text-4xl font-bold text-black"}>Login</h1>
                <div className={"flex flex-col rounded-xl"}>
                    <input className={"p-3 rounded-t-xl border-2"} placeholder={"Username"}/>
                    <input className={"p-3 rounded-b-xl border-x-2 border-b-2"} placeholder={"Password"}/>
                </div>
                <button className={"p-3 px-16 rounded-xl shadow-md bg-blue-500 text-white"}>Login</button>
                <span>* Not working *</span>
            </div>
        </>
    )
}