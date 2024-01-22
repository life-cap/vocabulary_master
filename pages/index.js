import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

import Link from "next/link"
import {useEffect, useState} from "react";
import Flashcard from "@/components/flashcard";
import {BookIcon, SearchIcon} from "@/components/icon";
import {Card, CardContent} from "@/components/card";
import Router from 'next/router';

export default function Home() {
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
      <main className={"flex flex-col gap-6 h-screen justify-center"}>
        <div className={"flex flex-col gap-6 justify-center items-center"}>
          <h1 className={"text-6xl font-bold underline decoration-yellow-400"}>Vocab Master</h1>
        </div>
        <div className="flex items-center flex-row">
          <input className="w-full mr-2 p-2 rounded-t-xl border-b-2 border-blue-500"
                 placeholder="Search for words..." name={"search"} value={search} onKeyDown={searchPress} onChange={searchChange} type="search"/>
          <button className={"text-blue-600 hover:border-0 rounded-xl border-black"} onClick={() => searchPush()}><SearchIcon className=""/></button>
        </div>
        <div className={"grid grid-cols-4 gap-4 text-center"}>
          <Card>
            <h1 className={"text-2xl font-bold"}>Search Vocab</h1>
          </Card>
          <Card>
            <h1 className={"text-2xl font-bold"}>Memorize vocab</h1>
          </Card>
          <Card>
            <h1 className={"text-2xl font-bold"}>Great Flashcard</h1>
          </Card>
          <Card>
            <h1 className={"text-2xl font-bold"}>Great Word test</h1>
          </Card>
        </div>
      </main>
  );
}