import Image from 'next/image'
import {useEffect, useRef, useState} from "react";
import {Card} from "@/components/card";
import { Inter } from 'next/font/google';
import {SearchIcon} from "@/components/icon";
import axios from "axios";
import Router, { useRouter } from 'next/router'
import {AiOutlineLoading} from "react-icons/ai";
import Link from "next/link";

const inter = Inter({ subsets: ['latin'] })
export default function Home() {
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState()
  const [news, setNews] = useState()
  const [quote, setQuote] = useState([])
  const renderAfterCalled = useRef(false);
  const router = useRouter()
  useEffect(() => {
    setLoading(false);

    async function fetchData() {
      try {
        // Fetch news
        const newsResponse = await axios.get("https://api.nytimes.com/svc/topstories/v2/home.json?api-key=PXxvslvDjGGIaxe0trnbrld30UKePbTM");
        const newsData = newsResponse.data.results.map((item) => {
          if (item.multimedia[0]) {
            return {
              title: item.title,
              description: item.abstract,
              url: item.url,
              height: item.multimedia[0].height,
              width: item.multimedia[0].width,
              image: item.multimedia[0].url,
            };
          } else {
            return {
              title: item.title,
              description: item.abstract,
              url: item.url,
            };
          }
        });
        setNews(newsData.slice(0, 10));
        const quoteResponse = await axios.get("https://api.quotable.io/quotes/random?tags=famous-quotes");
        const quoteData = quoteResponse.data[0];
        setQuote([quoteData.author, quoteData.content]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(true);
      }
    }
    if (!renderAfterCalled.current) {
      fetchData()
    }
    renderAfterCalled.current = true;
  }, []);
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
      <main className={"flex flex-col gap-6 justify-center mt-32 mb-10"}>
        <div className={"flex flex-col gap-6 justify-center items-center"}>
          <h1 className={"text-6xl font-bold underline decoration-yellow-400"}>Vocab Master</h1>
        </div>
        <div className="flex items-center flex-row">
          <input className="w-full mr-2 p-2 rounded-t-xl border-b-2 border-blue-500"
                 placeholder="Search for words..." name={"search"} value={search} onKeyDown={searchPress} onChange={searchChange} type="search"/>
          <button className={"text-blue-600 hover:border-0 rounded-xl border-black"} onClick={() => searchPush()}><SearchIcon className=""/></button>
        </div>
        <div className={"grid md:grid-cols-4 sm:grid-cols-2 gap-4 text-center"}>
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
          {loading ?
              <>
                <div className={"bg-white border-2 p-6 rounded-xl"}>
                  <h1 className={"text-2xl font-bold"}>{quote[1]}</h1>
                  <p className={"font-semi"}>By {quote[0]}</p>
                </div>
                <div className={"grid grid-cols-2 gap-5"}>
                  {news?.map((item) => {
                      return (
                      // eslint-disable-next-line react/jsx-key
                        <Link className={"border-2 rounded-xl p-6 transition flex flex-col gap-3 hover:bg-blue-500 hover:text-white hover:border-blue-500"} href={item.url}>
                          <div className={"flex flex-row gap-3"}>
                            <div>
                              <h1 className={"text-2xl font-bold"}>{item.title}</h1>
                              <p>{item.description}</p>
                            </div>
                            <Image className={"rounded-xl "} src={item.image} width={250} height={250} alt={"idk"}/>
                          </div>
                        </Link>
                      )
                  })}
                </div>
              </>
              :
              <div className={"flex items-center justify-center"}>
                <AiOutlineLoading className={"animate-spin"}/>
              </div>
          }
      </main>
  );
}