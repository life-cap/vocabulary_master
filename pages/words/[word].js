import Router, { useRouter } from 'next/router'
import {SearchIcon} from "@/components/icon";
import {Card, CardContent} from "@/components/card";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { HiOutlinePlus } from "react-icons/hi2";
import {AiOutlineLoading} from "react-icons/ai";
import Cookies from "js-cookie";
function Word(props) {
    const Router = useRouter();
    const [search, setSearch] = useState()
    const [wordData, setWordData] = useState(null);
    const router = useRouter();
    const { word } = router.query;
    const [loading, setLoading] = useState(false)
    const refreshData = () => router.replace(router.asPath);
    function searchChange(e) {
        setSearch(e.target.value)
    }

    function searchPush() {
        Router.push(`/words/${search}`);
    }

    function searchPress(e) {
        if (e.key === 'Enter') {
            searchPush()
        }
    }

    useEffect(() => {
        setWordData(null)
    }, [Router.isReady, word]);

    function addClick(add) {
        const inputs = Cookies.get('inputs');
        let data = JSON.parse(inputs)
        data = [
            {
                name : data.length,
                word : word,
                meaning: add
            },
            ...JSON.parse(inputs)
        ]
        Cookies.set('inputs',JSON.stringify(data))
    }

    useEffect(() => {
        if (Router.isReady) {
            async function fetchData() {
                try {
                    setLoading(false);

                    if (word === "Jacob") {
                        setWordData([
                            {
                                definitions: [{
                                    definition: "Sadie's great 남친",
                                    example: "Best 매너남",
                                    id: "0-0",
                                    synonyms: ['Sadie', '김효원']
                                }],
                                partOfSpeech: "noun",
                            }
                        ]);
                    } else if (word === "James") {
                        setWordData([
                            {
                                definitions: [{
                                    definition: "The best Lebron James",
                                    example: "\"James\" is the kindest person",
                                    id: "0-0",
                                    synonyms: ['23', 'Baseball player', 'Lebron James', 'Stephan Curry', "GOAT"]
                                }],
                                partOfSpeech: "noun",
                            }
                        ]);
                    } else if (word === "June") {
                        setWordData([
                            {
                                definitions: [{
                                    definition: "The best human ever",
                                    example: "\"JUNE\" is the GOAT",
                                    id: "0-0",
                                    synonyms: ['그는 유일한 김준형 그자체']
                                }],
                                partOfSpeech: "noun",
                            }
                        ]);
                    } else {
                        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                        const responseData = response.data;

                        if (Array.isArray(responseData) && responseData.length > 0) {
                            const meanings = responseData[0].meanings;

                            if (meanings && meanings.length > 0) {
                                const wordDefinitions = meanings.map((meaning, index) => {
                                    const partOfSpeech = meaning.partOfSpeech || 'N/A';

                                    const definitions = meaning.definitions.map((def, defIndex) => {
                                        return {
                                            id: `${index}-${defIndex}`,
                                            definition: def.definition,
                                            synonyms: def.synonyms || [],
                                            example: def.example || '',
                                        };
                                    });

                                    return {
                                        partOfSpeech,
                                        definitions,
                                    };
                                });

                                setWordData(wordDefinitions);
                            } else {
                                setWordData(null);
                            }
                        } else {
                            setWordData(null);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(true);
                }
            }

            fetchData();
        }
    }, [Router.isReady, word]);
    return (
            <div className={"flex flex-col justify-center mt-32 mb-10 gap-3"}>
                <div className="flex items-center flex-row">
                    <input className="w-full mr-2 p-2 rounded-t-xl border-b-2 border-blue-500"
                           placeholder="Search for words..." name={"search"} value={search} onKeyDown={searchPress} onChange={searchChange} type="search"/>
                    <button className={"text-blue-600 hover:border-0 rounded-xl border-black"} onClick={() => searchPush()}><SearchIcon className=""/></button>
                </div>
                <h1 className={"text-4xl font-bold"}>{word}</h1>
                <div className={"flex flex-col gap-3"}>
                    {loading ?
                        <>
                            <h2 className={"text-sm font-bold"}>Definitions:</h2>
                            {wordData ? (
                                wordData.map((meaning, index) => (
                                    <div key={index} className="flex flex-col gap-3 bg-blue-500 p-3 rounded-xl text-white shadow-md">
                                        <h3 className={"text-2xl"}>{`(${meaning.partOfSpeech})`}</h3>
                                        {meaning.definitions.map((def) => (
                                            <div className = {"flex justify-between items-center bg-white p-5 shadow-md rounded-xl text-black"} key={def.id}>
                                                <div className={"flex-col"}>
                                                    <p>{`${def.definition}`}</p>
                                                    {def.synonyms.length > 0 && (
                                                        <p className="synonyms">Synonyms: {def.synonyms.join(', ')}</p>
                                                    )}
                                                    {def.example && (
                                                        <p className="example">Example: {def.example}</p>
                                                    )}
                                                </div>
                                                <button className={"bg-blue-500 p-3 rounded-xl text-white text-xl"} onClick={() => addClick(def.definition)}><HiOutlinePlus /></button>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <p>No definitions found.</p>
                            )}
                        </> :
                        <div className={"w-10 animate-spin p-3"}>
                            <AiOutlineLoading />
                        </div>
                    }
                </div>
            </div>
    )
}
export default  Word;