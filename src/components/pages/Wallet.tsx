import { useState } from "react";
import { WalletIcon } from "../icons/walletIcon";
import { useWalletStore } from "../store/WalletStore";
import { Accordian } from "../ui/Accordian";
import { Button } from "../ui/button";
import { Display } from "../WalletDisplay";


export function Wallet() {
    const {
        mnemonics, isVisible, setIsVisible, setCurrentScreen, wallets
    } = useWalletStore();

    const [isOpen, setIsOpen] = useState(false);

    return(
        <div className="flex flex-col">
            <WalletIcon />
        <div className='bg-black-400 text-white h-screen flex flex-col'>
            {isVisible && (
            <div className="w-screen flex h-screen flex-col">
                <h1 className="flex justify-center relative top-1/7 text-lg text-gray-500 font-semibold">Save this phrase safely</h1>
                <Accordian title="Your Secret Key" isOpen={isOpen} toggleOpen={()=>setIsOpen(!isOpen)}>
                    <div className=" grid grid-cols-3 gap-2 w-screen text-white ">
                        {mnemonics.map((word, index) => (
                            <span key={index} className="px-3 py-3 text-lg rounded-md bg-black-500">
                                {word}
                            </span>
                        ))}
                    </div>
            </Accordian>
            <div className="flex justify-center relative top-1/4">
                <Button size="md" variant="secondary" text="Next" onClick={()=>setIsVisible(!isVisible)}/>
            </div>
            </div> )}
            {!isVisible && mnemonics && (
                <Display />
            )} 
        </div>
        </div>
    )

}