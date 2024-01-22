import React, { useState } from "react";
export default function Flashcard({front, back, side, click, className, number}) {
    return (
        <div className={`card ${className} ${side ? "side" : ""}`} onClick={click}>
             {side ?
                 <>
                        <small>
                             <span>Word</span>
                             <span>{number+1}</span>
                        </small>
                 </> :
                 <>
                     <small>
                         <span>Definition</span>
                         <span>{number+1}</span>
                     </small>
                 </>
             }
            <div className="front">{front}</div>
            <div className="back">{back}</div>
        </div>
    );
}