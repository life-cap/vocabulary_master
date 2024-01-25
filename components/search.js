import {SearchIcon} from "@/components/icon";
import Router from "next/router";
import {useState} from "react";

export default function Searchbar() {
    const [search, setSearch] = useState()
    function searchChange(e) {
        setSearch(e.target.value)
    }
    function searchPush() {
        Router.push(`/words/${search}`)
    }

    function searchPress(e) {
        if (e.key === 'Enter') {
            searchPush()
        }
    };

    return (
        <div className="flex items-center flex-row">
            <input className="w-full mr-2 p-2 rounded-t-xl border-b-2 border-blue-500"
                   placeholder="Search for words..." name={"search"} value={search} onKeyDown={searchPress} onChange={searchChange} type="search"/>
            <button className={"text-blue-600 hover:border-0 rounded-xl border-black"} onClick={() => searchPush()}><SearchIcon className=""/></button>
        </div>
    )
}