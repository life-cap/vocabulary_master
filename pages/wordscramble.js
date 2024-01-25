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
import Stopwatch from "@/components/stopwatch";
import Searchbar from "@/components/search";
const inter = Inter({ subsets: ['latin'] });

function Wordscramble() {
    const [start, setStart] = useState(false)
    const [number, setNumber] = useState(2)
    const [gamedata, setGamedata] =useState()
    const [gamenumber, setGamenumber] = useState()
    const [loading, setLoading] = useState(true)
    const [ImportVisibility, setImportVisibility] = useState(false)
    const [onimport, setImport] = useState();
    const [side, setSide] = useState(false)
    const [answernum, setAnswernum] = useState(0)
    const [answer, setAnswer] = useState()
    const [correct, setCorrect] = useState()
    const [time, setTime] = useState(0)
    const [inputs, setInputs] = useState([{
        name : 1,
        word : "",
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

    const getShuffledArr = arr => {
        const newArr = arr.slice()
        for (let i = newArr.length - 1; i > 0; i--) {
            const rand = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
        }
        return newArr
    };

    function startGame() {
        const data = inputs.filter(item => item.word)
        const scrambleData = data.map((i) => {
           return {
               word : i.word,
               shuffledword : getShuffledArr(i.word.split('')).join('')
           }
        })
        if (data.length === 0) {
            return 0;
        } else {
            setStart(true)
            setGamedata(scrambleData)
            setGamenumber(0);
            setSide(false)
            setAnswernum(0)
            setTime(0)
            setAnswer("")
        }
    }

    function getDatalength(data) {
        return data.length
    }
    function onAnswerchange(e) {
        setAnswer(e.target.value)
    }

    function nextWord() {
        let number = answernum
        setAnswer("")
        if (answer.toLowerCase() === gamedata[gamenumber].word.toLowerCase()) {
            number += 1
            setAnswernum(answernum + 1)
            setCorrect('Correct :)')
            setSide(true);
        } else {
            setCorrect('Incorrect :(')
            setSide(true);
        }
        setTimeout(() => {
            setCorrect("")
            if (getDatalength(gamedata) === gamenumber + 1) {
                setStart(false);
                alert(`Great Job! Your overall score is ${number}/${getDatalength(gamedata)}.\nYou right ${number} questions,\nYou Wrong ${getDatalength(gamedata)- number} questions.\nYou finished the test in ${Math.floor(time / 60)} minute and ${time%60} second.`)
            } else {
                setGamenumber(gamenumber + 1);
                setSide(false);
                setGamenumber(gamenumber+1)
            }
        }, 2000)
    }

    function skipAnswer() {
        let number = answernum
        setAnswer("");
        setCorrect("Ok... remember next time :)");
        setSide(true);
        setTimeout(() => {
            setCorrect("")
            if (getDatalength(gamedata) === gamenumber + 1) {
                setStart(false);
                alert(`Great Job! Your overall score is ${number}/${getDatalength(gamedata)}.\nYou right ${number} questions,\nYou Wrong ${getDatalength(gamedata)- number} questions.\nYou finished the test in ${Math.floor(time / 60)} minute and ${time%60} second.`)
            } else {
                setGamenumber(gamenumber + 1);
                setSide(false);
                setGamenumber(gamenumber+1)
            }
        }, 2000)
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

    function Answerpress(e) {
        if (e.key === 'Enter' && answer) {
            nextWord()
        }
    }

    return (
        <>
            { start === false ?
                (<>
                    <div className={"flex flex-col gap-4 mt-32 mb-10"}>
                        <Searchbar/>
                        <div className={"flex flex-col gap-4 items-center"}>
                            <div className={"flex flex-col items-center"}>
                                <h1 className={"text-5xl font-bold"}>Word scramble</h1>
                                <small>* Doesn't support meanings *</small>
                            </div>
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
                                                    className={"p-2 border-2 w-40% rounded-md"}
                                                    name={i.name}
                                                    placeholder="word"
                                                    onChange={onChange}
                                                    value={i.word}
                                                />
                                                <input
                                                    className={"p-2 border-2 w-40% rounded-md"}
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
                </>)
                :
                (<>
                    <div className={"flex flex-col gap-3 p-6 items-center justify-center h-screen"}>
                        <Stopwatch time = {time} setTime={setTime} />
                        {/*<h1 className={"text-2xl font-semi p-3 px-[85px] bg-green-500 text-white rounded-xl shadow-xl"}></h1>*/}
                        <div className={"p-10 rounded-2xl flex flex-col items-center bg-white border-2 shadow-md border-blue-500"}>
                            <div className={"flex flex-row items-center text-8xl gap-3"}>
                                {!side ?
                                    gamedata[gamenumber].shuffledword.split('').map((i) => (
                                        <>
                                            <div className={"p-5 border-2 rounded-xl"}>
                                                <p>{i.toUpperCase()}</p>
                                            </div>
                                        </>
                                    )) :
                                    gamedata[gamenumber].word
                                }

                            </div>
                            <div className={"flex flex-col gap-3 items-center"}>
                                <input className={"w-[500px] text-center text-3xl p-3 border-b-2 border-blue-500 disabled:cursor-not-allowed disabled:bg-white"} placeholder={"Word"} onKeyPress={Answerpress} onChange={onAnswerchange} disabled={correct} value={answer}/>
                                <div className={"flex flex-row gap-3"}>
                                    <button className={"disabled:cursor-not-allowed disabled:bg-gray-400 text-xl shadow-md rounded-xl bg-green-500 text-white px-4 p-3"} onClick={nextWord} disabled={correct || !answer}><FaCheck/></button>
                                    <button className={"disabled:cursor-not-allowed disabled:bg-gray-400 text-xl shadow-md rounded-xl bg-green-500 text-white px-4 p-3"} onClick={() => skipAnswer()} disabled={correct}><FaQuestion /></button>
                                    <button className={"flex-col items-center text-2xl shadow-md rounded-xl bg-red-500 text-white p-3"} onClick={() => setStart(false)}><IoClose /></button>
                                </div>
                            </div>
                            <h1 className={"mt-5"}>{correct}</h1>
                        </div>
                    </div>
                </>)
            }
        </>
    );
}

export default  Wordscramble