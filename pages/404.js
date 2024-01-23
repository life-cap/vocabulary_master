import Link from "next/link";

export default function PageNotFound() {
    return (
        <div className={"flex flex-col p-6 h-screen justify-center items-center"}>
            <h1 className={"text-9xl font-black"}>404</h1>
            <small className={"text-sm"}>* Page not found *</small>
            <Link href="/" className="underline decoration-blue-500 text-blue-600">Main page</Link>
        </div>
    )
}