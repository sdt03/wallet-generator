import React, { Children, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordianProps{
    title: string;
    isOpen: boolean;
    toggleOpen: () => void
    children?: React.ReactNode;
}

export function Accordian({title, isOpen, toggleOpen, children}: AccordianProps){

    return (
        <div className="p-4">
            <div className=" w-250 border border-gray-500 rounded-md mt-5 ml-45 mr-45">
                <div className="flex justify-between font-bold p-3 text-2xl">
                    {title}
                    <div
                        onClick={toggleOpen} className="flex cursor-pointer hover:bg-slate-600 max-w-10 p-2 rounded-sm " >
                            {!isOpen ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
                    </div>
                </div>
            {isOpen && <div className="p-3 bg-black font-xl flex flex-wrap">{children}</div>}
        </div>
    </div>
)
}