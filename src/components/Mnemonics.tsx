import { useEffect, useState } from "react";
import { generateMnemonic, mnemonicToSeed, validateMnemonic } from "bip39";
import { Accordian } from "./ui/Accordian";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

// Default step for a new user: Create a Mnemonic
// Validate a phrase if already exists (user input)
// store the mnemonic in localstorage
//generate a seed

export function MnemonicsGeneration(){
    const [mnemonics, setMnemonics] = useState<string[]>(Array(12).fill(""));
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [inputPhrase, setInputPhrase] = useState("");
    const [error, setError] = useState("");
    const [seed, setSeed] = useState("");

    useEffect(()=> {
        const storedMnemonic = localStorage.getItem("Wallet Mnemonic");
        if(storedMnemonic){
            setMnemonics(storedMnemonic.split(" "));
            setIsVisible(true);
        }
    }, []);

    const handleGenerateMnemonics = async () => {
        if(inputPhrase.trim()){
            if(validateMnemonic(inputPhrase)){
                setMnemonics(inputPhrase.split(" "));
                setError("");
                localStorage.setItem("Wallet Mnemonic", inputPhrase);
                const Seed = await mnemonicToSeed(inputPhrase);
                const seedHex = Seed.toString('hex'); 
                setSeed(seedHex);
                localStorage.setItem("Seed", seedHex);
            } else {
                setError("Incorrect Mnemonic! Please input correct Mnemoinc");
                return;
            }
        } else {
            const newMnemonics = generateMnemonic()
            setMnemonics(newMnemonics.split(" "));
            localStorage.setItem("Wallet Mnemonic", newMnemonics);
            const Seed = await mnemonicToSeed(newMnemonics);
            const seedHex = Seed.toString('hex'); 
            setSeed(seedHex);
            localStorage.setItem("Seed", seedHex);
        }
        setIsVisible(true);
    }

    const deleteWallet = () => {
        localStorage.removeItem("Wallet Mnemonic");
        localStorage.removeItem("Seed");
        setIsVisible(false);
    }

    // UI: Create an accordian which can let you hide and unhide Mnemonic phrase

    return (
    <div className='bg-black h-screen w-screen text-white'>
          {isVisible ? (
            <div>
                <Accordian title="Your Secret Key" isOpen={isOpen} toggleOpen={()=>setIsOpen(!isOpen)}>
                    <div className=" grid grid-cols-3 gap-2 w-screen">
                        {mnemonics.map((word, index) => (
                            <span key={index} className="px-3 py-2 text-lg rounded-md bg-black-500">
                                {word}
                            </span>
                        ))}
                    </div>
            </Accordian>
            <div className="flex justify-end gap-3 m-5 mr-50">
                <Button variant="secondary" size="sm" text="Add Wallet" />
                <Button onClick={deleteWallet}variant="destructive" size="sm" text="Delete Wallet" />
            </div>
          </div>
          ): <div className='flex justify-center p-5 gap-4 items-center '>
          <Input placeholder='Enter your public key (if exists or create new)' value={inputPhrase} onChange={(e)=>setInputPhrase(e.target.value)} />
          <Button onClick={handleGenerateMnemonics} size='md' variant="secondary" text="Generate Wallet" loading={false} />
        </div>  }  
      </div>
    )
}

