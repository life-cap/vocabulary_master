
import {useCallback, useRef, useState} from 'react';

const PapagoExample = () => {
    const [textToTranslate, setTextToTranslate] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [startlanguage, setStartlanguage] = useState('ko');
    const [endlanguage, setEndlanguage] = useState('en');
    const handleTranslate = async () => {
        try {
            const response = await fetch('/api/papago', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({text: textToTranslate, start : startlanguage, end : endlanguage}),
            });
            if (response.ok) {
                const data = await response.json()
                setTranslatedText(data.message.result.translatedText);
            } else {
                console.error('Failed to translate text.');
            }
        } catch (error) {
            console.error('Error while fetching translation:', error);
        }
    };

    function changeLanguage() {
        if (startlanguage === "ko") {
            setStartlanguage("en")
            setEndlanguage("ko")
        } else {
            setStartlanguage("ko")
            setEndlanguage("en")
        }
    }

    return (
        <div className={"flex flex-col h-screen items-center justify-center gap-3"}>
            <div className={"flex-row flex gap-3"}>
                <h1 className={"text-5xl font-bold"}>Translation</h1>
                <div className={"flex flex-row gap-3"}>
                    <button className={"p-3 bg-blue-500 text-white rounded-xl"} onClick={() => handleTranslate()}>Translate</button>
                    <button className={"p-3 bg-blue-500 text-white rounded-xl"} onClick={() => changeLanguage()}>Change</button>
                </div>
            </div>
            <div className={"flex flex-col gap-6"}>
                <div className={"flex-row flex gap-3 p-6 bg-blue-500 rounded-xl"}>
                    <div className={"flex-col flex gap-3 items-center"}>
                        <h1 className={"text-white text-xl font-bold"}>{startlanguage === "en" ? "English" : "Korean"}</h1>
                        <textarea
                            value={textToTranslate}
                            className={"rounded-xl p-6 w-[400px] h-[300px] resize-none"}
                            placeholder={"Write anything!"}
                            onChange={(e) => setTextToTranslate(e.target.value)}
                        />
                    </div>
                    <div className={"flex-col flex gap-3 items-center"}>
                        <h1 className={"text-white text-xl font-bold"}>{endlanguage === "en" ? "English" : "Korean"}</h1>
                        <div className={"w-[400px] h-[300px] rounded-xl p-6 bg-white"}>
                            {translatedText ?
                                <>
                                    <p>{translatedText}</p>
                                </>
                                 : (
                                    <h2 className={"text-gray-400"}>Translated Text</h2>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PapagoExample;