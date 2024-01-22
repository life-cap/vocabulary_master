import { Html, Head, Main, NextScript } from 'next/document'
import Link from "next/link";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
          <nav className="bg-blue-500 shadow-md fixed w-full z-20 top-0 start-0">
              <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                  <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                      <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white underline decoration-yellow-400">Vocab Master</span>
                  </Link>
                  <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                      <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-blue-500 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                          <li>
                              <Link href="/" className="block py-2 px-3 text-white" aria-current="page">Home</Link>
                          </li>
                          <li>
                              <Link href="/flashcard" className="block py-2 px-3 text-white">Flashcard</Link>
                          </li>
                          <li>
                              <Link href="/wordtest" className="block py-2 px-3 text-white">Wordtest</Link>
                          </li>
                          <li>
                              <Link href="/login" className="block py-2 px-3 text-white">Login</Link>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>
        <body className={"flex flex-col px-20 bg-white"}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
