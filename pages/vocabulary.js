import Cookies from 'js-cookie';
import { Inter } from 'next/font/google';
import { IoClose } from "react-icons/io5";
import Flashcard from "@/components/flashcard";
import { AiOutlineLoading } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { FaCheck, FaQuestion, FaPlus } from "react-icons/fa6";
import { HiOutlineSave } from "react-icons/hi";
import { PiExportBold } from "react-icons/pi";
import {FaSave, FaPlay} from "react-icons/fa";
const inter = Inter({ subsets: ['latin'] });
import { PDFDownloadLink, PDFViewer, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { IoPrint } from "react-icons/io5";
import Searchbar from "@/components/search";

function MyDocument() {
    return null;
}

function Vocabulary() {
    const [number, setNumber] = useState(2)
    const [loading, setLoading] = useState(true)
    const [ImportVisibility, setImportVisibility] = useState(false)
    const [onimport, setImport] = useState();
    const [inputs, setInputs] = useState([{
        name : 1,
        word : "",
        meaning : ""
    }, ]);
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            padding: 50,
        },
        section: {

        },
        title: {
            fontSize: 40,
            fontWeight : "ultrabold",
            marginBottom : 10
        },
        vocab : {
            marginTop : 5,
            marginBottom : 5,
            fontWeight : "ultrabold",
        }
    });
    const MyDoc = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Vocabulary List</Text>
                    <Text>- {"{"}Word{"}"} : {"{"}Meaning{"}"}</Text>
                    {inputs.filter(item => item.word && item.meaning).map(items=> {
                        return (
                            // eslint-disable-next-line react/jsx-key
                            <Text>- {items.word} : {items.meaning}</Text>
                        )
                    })}
            </Page>
        </Document>
    );

    useEffect(() => {
        const savedInputs = Cookies.get('inputs');

        if (savedInputs) {
            // Parse the string back to a list
            const savedList = JSON.parse(savedInputs);
            let number = 0
            const relist = savedList.map((i) => {
                number += 1
                return {
                    ...i,
                    name: number,
                }
            })
            setInputs(relist)
            setNumber(savedList.length + 1)
            Cookies.set('inputs', JSON.stringify(relist))
        }
        setLoading(false)
    }, []);

    function onImportVisible() {
        setImportVisibility(true);
    }
    function offImportVisible() {
        setImportVisibility(false);
    }

    function OnImportChange(e) {
        setImport(e.target.value)
    }
    function onChange(e) {
        const data= inputs.map(i => {
            if ( parseInt(e.target.name) === i.name ) {
                if (e.target.placeholder === "word") {
                    return {
                        ...i,
                        name: parseInt(e.target.name),
                        word: e.target.value
                    }
                } else {
                    return {
                        ...i,
                        name: parseInt(e.target.name),
                        meaning: e.target.value
                    }
                }
            } else {
                return i;
            }
        });
        setInputs(data);
    }
    function insertInput() {
        setNumber(number+1)
        setInputs([
            {
                name : number+1,
                word : "",
                meaning: ""
            },
            ...inputs
        ])
    }

    function removeInput(id) {
        setInputs(inputs.filter(item => item.name !== id));
    }

    function saveCookies() {
        const list = JSON.stringify(inputs);
        Cookies.set('inputs', list);
        alert("Saved!")
    }
    function Imported() {
        if (!onimport) {
            return;
        }
        const data = onimport.split('\n')
        let alldata = []
        let newNumber = number
        let reNumber = 0
        for (let i = 0; i<=data.length-1; i++) {
            newNumber += 1
            const value = data[i].split(" ")
            if (!value[0] || !value.slice(1)) {
                return
            }
            alldata.unshift({
                name : newNumber+1,
                word : value[0],
                meaning: value.slice(1).join(' ')
            })
        }
        const relist = [...alldata, ...inputs].map((i) => {
            reNumber += 1
            return {
                ...i,
                name: reNumber,
            }
        })
        setInputs(relist)
        setNumber(relist.length + 1)
        setImport('');
        setImportVisibility(false);
    }

    const Exported = async () => {
        let text = ""
        inputs.filter(item => item.word && item.meaning).map(i => {
            text += `${i.word} ${i.meaning}\n`
        })
        try {
            await navigator.clipboard.writeText(text);
            alert('Copied!');
        } catch (e) {
            alert('Failed to Copy :(');
        }
    }

    return (
        <>
            <div className={"flex flex-col gap-4 mt-32 mb-10"}>
                <Searchbar/>
                <div className={"flex flex-col gap-4 items-center"}>
                <h1 className={"text-5xl font-bold"}>Vocabulary</h1>
                <div className={`${ImportVisibility ? "visible" : "invisible"} modal justify-center w-screen h-screen flex flex-col gap-2 p-20  bg-white text-black bg-opacity-50`}>
                    <h1 className={"text-3xl font-bold"}>Import</h1>
                    <textarea className={"opacity-100 p-2 rounded-md text-black "} onChange={OnImportChange} name ="import" value={onimport} placeholder={"Write word definition"} />
                    <div className={"flex flex-row gap-3"}>
                        <button className={"p-3 bg-blue-500 text-white rounded-xl shadow-md"} onClick={() => Imported()}>Import</button>
                        <button className={"p-3 bg-blue-500 text-white rounded-xl shadow-md"} onClick={() => offImportVisible()}>Close</button>
                    </div>
                </div>
                <div className={"flex flex-row gap-3 p-3"}>
                    <button className={"p-3 bg-blue-500 text-white text-2xl rounded-xl shadow-md font-bold"} onClick={() => insertInput()}><FaPlus/></button>
                    <button className={"p-3 bg-blue-500 text-white text-2xl rounded-xl shadow-md font-bold"} onClick={() => saveCookies()}><FaSave /></button>
                    <button className={"p-3 bg-blue-500 text-white text-2xl rounded-xl shadow-md font-bold"} onClick={() => onImportVisible()}><HiOutlineSave /></button>
                    <button className={"p-3 bg-blue-500 text-white text-2xl rounded-xl shadow-md font-bold"} onClick={() => Exported()}><PiExportBold /></button>
                    {isClient ?
                        <button className={"p-3 text-2xl rounded-xl shadow-2xl bg-blue-500 text-white"}>
                            <PDFDownloadLink document={<MyDoc />} fileName="vocabulary_list.pdf">
                                <IoPrint/>
                            </PDFDownloadLink>
                        </button>
                            : null
                    }
                </div>
                {!loading ?
                    <>
                        {inputs.map((i) => {
                            return (
                                // eslint-disable-next-line react/jsx-key
                                <div className={"flex flex-row items-center gap-4"}>
                                    <input
                                        className={"p-2 w-40% rounded-md border-2"}
                                        name={i.name}
                                        placeholder="word"
                                        onChange={onChange}
                                        value={i.word}
                                    />
                                    <input
                                        className={"p-2 w-40% rounded-md border-2"}
                                        name={i.name}
                                        placeholder="meaning"
                                        onChange={onChange}
                                        value={i.meaning}
                                    />
                                    <button onClick={() => removeInput(i.name)} className={"p-2.5 bg-red-500 rounded-xl shadow-md text-white text-xl"}><FaTrash/></button>
                                </div>
                            )
                        })}
                    </> :
                    <div className={"animate-spin"}>
                        <AiOutlineLoading />
                    </div>
                }
                </div>
            </div>
        </>
    );
}

export default Vocabulary;