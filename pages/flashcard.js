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

function Card() {
    const [start, setStart] = useState(false)
    const [number, setNumber] = useState(2)
    const [gamedata, setGamedata] =useState()
    const [gamenumber, setGamenumber] = useState()
    const [loading, setLoading] = useState(true)
    const [side, setSide] = useState(false);
    const [ImportVisibility, setImportVisibility] = useState(false)
    const [onimport, setImport] = useState();
    const [inputs, setInputs] = useState([{
        name : 1,
        word : "",
        meaning : ""
    }, ]);

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

    function gameUp() {
        setGamenumber(gamenumber + 1)
        setSide(false)
    }

    function gameDown() {
        setGamenumber(gamenumber - 1)
        setSide(false)
    }
    function flashcardClick() {
        setSide(!side);
    }
    function getDatalength(data) {
        return data.length
    }
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

    function startGame() {
        const data = inputs.filter(item => item.word && item.meaning)
        if (data.length === 0) {
            return 0;
        } else {
            setStart(true)
            setGamedata(data)
            setGamenumber(0);
        }
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
            { start === false ?
                    (<>
                        <div className={"flex flex-col gap-4 items-center mt-32 mb-10"}>
                            <h1 className={"text-5xl font-bold"}>Flashcard</h1>
                            <div className={`${ImportVisibility ? "visible" : "invisible"} modal justify-center w-screen h-screen flex flex-col gap-2 p-20  bg-white text-black bg-opacity-50`}>
                                <h1 className={"text-3xl font-bold"}>Import</h1>
                                <textarea className={"opacity-100 p-2 rounded-md text-black "} onChange={OnImportChange} name ="import" value={onimport} placeholder={"Write word definition"} />
                                <div className={"flex flex-row gap-3"}>
                                    <button className={"p-3 bg-blue-500 text-white rounded-xl shadow-md"} onClick={() => Imported()}>Import</button>
                                    <button className={"p-3 bg-blue-500 text-white rounded-xl shadow-md"} onClick={() => offImportVisible()}>Close</button>
                                </div>
                            </div>
                            <div className={"flex flex-row gap-3 p-3"}>
                                <button className={"p-3 bg-blue-500 text-white text-2xl rounded-xl shadow-md font-bold"} onClick={() => startGame()}><FaPlay /></button>
                                <button className={"p-3 bg-blue-500 text-white text-2xl rounded-xl shadow-md font-bold"} onClick={() => insertInput()}><FaPlus/></button>
                                <button className={"p-3 bg-blue-500 text-white text-2xl rounded-xl shadow-md font-bold"} onClick={() => saveCookies()}><FaSave /></button>
                                <button className={"p-3 bg-blue-500 text-white text-2xl rounded-xl shadow-md font-bold"} onClick={() => onImportVisible()}><HiOutlineSave /></button>
                                <button className={"p-3 bg-blue-500 text-white text-2xl rounded-xl shadow-md font-bold"} onClick={() => Exported()}><PiExportBold /></button>
                            </div>
                            {!loading ?
                                <>
                                    {inputs.map((i) => {
                                        return (
                                            // eslint-disable-next-line react/jsx-key
                                            <div className={"flex flex-row items-center gap-4"}>
                                                <input
                                                    className={"p-2 shadow-md w-40% rounded-md"}
                                                    id = {i.name}
                                                    name={i.name}
                                                    placeholder="word"
                                                    onChange={onChange}
                                                    value={i.word}
                                                />
                                                <input
                                                        className={"p-2 shadow-md w-40% rounded-md"}
                                                        id = {i.name}
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
                    </>)
                    :
                    (<>
                        <div className={"flex flex-col gap-6 p-6 items-center justify-center h-screen"}>
                            <div className={"flex flex-row items-center gap-3"}>
                                <Flashcard number={gamenumber} className={"transition"} front={gamedata[gamenumber].word} back={gamedata[gamenumber].meaning} side={side} click={() => flashcardClick()}/>
                                <div className={"flex-col flex gap-3"}>
                                    <div className={`flex-col bg-gradient-to-t from-50% to-50% flex gap-5 p-6 rounded-xl shadow-md text-white ${gamenumber === 0 ? "from-slate-500" : "from-red-500"} ${gamenumber === getDatalength(gamedata) - 1 ? "to-slate-500" : "to-blue-500"}`}>
                                        <button className={"disabled:cursor-not-allowed"} onClick={()=> gameUp()} disabled={gamenumber === getDatalength(gamedata) - 1}><FaArrowUp/></button>
                                        <button className={"disabled:cursor-not-allowed"} onClick={() => gameDown()} disabled={gamenumber === 0}><FaArrowDown/></button>
                                    </div>
                                    <button className={"flex-col items-center text-2xl shadow-md rounded-xl bg-red-500 text-white p-3"} onClick={() => setStart(false)}><IoClose /></button>
                                </div>
                            </div>
                        </div>
                    </>)
            }
        </>
    );
}

export default Card;