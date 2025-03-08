import { useEffect, useState } from "react";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { Accordian } from "./ui/Accordian";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";
import HDKey from "hdkey";
import { derivePath } from "ed25519-hd-key";
import bs58 from "bs58";

interface Wallet{
    publicKey: string;
    privateKey: string;
    mnemonic: string;
    path: string;
};

interface DerivationPaths{
    ethereum: string;
    solana: string;
}

const DERIVATION_PATHS: DerivationPaths = {
    ethereum: "m/44'/60'/0'/0/0",
    solana: "m/44'/501'/0'/0'/0'"
} 

export function Wallet(){
    const [mnemonics, setMnemonics] = useState<string[]>(Array(12).fill(""));
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [inputPhrase, setInputPhrase] = useState<string>("");
    const [error, setError] = useState("");
    const [seed, setSeed] = useState("");
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [visiblePrivKeys, setVisiblePrivKeys] = useState<boolean[]>([]);
    const [isRecovering, setIsRecovering] = useState<boolean>(false);


    useEffect(()=> {
        const storedMnemonic = localStorage.getItem("Mnemonic");
        const storedSeed = localStorage.getItem("Seed");
        const storedWallets = localStorage.getItem("Wallets");
        if(storedMnemonic && storedSeed && storedWallets){
            setMnemonics(storedMnemonic.split(" "));
            setSeed(storedSeed);
            setWallets(JSON.parse(storedWallets));
            setIsVisible(true);
        }
    }, []);
    

    const WalletGen = (mnemonic:string): Wallet[] => {
        try {    
            const seedBuffer = mnemonicToSeedSync(mnemonics.join(" "));
            const seedHex = seedBuffer.toString('hex');
            localStorage.setItem("Seed", seedHex);

            const ethHdKey = HDKey.fromMasterSeed(seedBuffer);
            const ethDerived = ethHdKey.derive(DERIVATION_PATHS.ethereum);
            const ethPrivateKey = "0x" + ethDerived.privateKey?.toString('hex');
            
            const ethWallet: Wallet = {
                publicKey: ethDerived.publicKey?.toString('hex') || "",
                privateKey: ethPrivateKey,
                mnemonic: mnemonics.join(" "),
                path: DERIVATION_PATHS.ethereum
            };

            const solDerived = derivePath(DERIVATION_PATHS.solana, seedHex);
            const keyPair = Keypair.fromSeed(solDerived.key);
            const solPrivateKey = bs58.encode(keyPair.secretKey);
            const solPublicKey = keyPair.publicKey.toBase58();

            const solWallet: Wallet = {
                publicKey: solPublicKey,
                privateKey: solPrivateKey,
                mnemonic: mnemonics.join(" "),              
                path: DERIVATION_PATHS.solana
            }
            return [ethWallet, solWallet];
            
            
        } catch (error) {
            console.error("Error generating keys:", error);
            return [];
        } 

    }

    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content);
    }

    const deleteWallet = () => {
        localStorage.removeItem("Mnemonic");
        localStorage.removeItem("Seed");
        localStorage.removeItem("Wallets");
        setMnemonics([]);
        setSeed("");
        setWallets([]);
        setIsVisible(false);
        setIsOpen(false);
        setIsRecovering(false);
    }

    const handleWalletGen = () => {
        setIsRecovering(false);
        let mnemonics = inputPhrase.trim();
        if(mnemonics){
            if(!validateMnemonic(mnemonics)){
                setError("Invalid mnemonics");
                return;
            }
        } else {
            mnemonics = generateMnemonic();
        }

        const words = mnemonics.split(" ");
        setMnemonics(words);
        localStorage.setItem("Mnemonic", (mnemonics));

        const wallet = WalletGen(mnemonics);

        if(wallet){
            const updatedWallets = [...wallets, ...wallet];
            setWallets(updatedWallets);
            localStorage.setItem("Wallets", JSON.stringify(updatedWallets));
            setIsVisible(true);
            setVisiblePrivKeys([...visiblePrivKeys, false]);
            
        }
    
    }

    const handleRecoverWallet = () => {
        setIsRecovering(true);
        setIsVisible(false);
    }

    const handleValidateRecovery = () => {
        setIsRecovering(false);
        if(!validateMnemonic(inputPhrase.trim())){
            setError("Invalid Mnemonic Phrase!");
            return;
        } 
        setMnemonics(inputPhrase.trim().split(" "));
        handleWalletGen();
        setIsVisible(true);
    }

    const handleaddWallet = () => {
        if(!mnemonics){
            setError("Mnemonics doesnt exits! Please generate a wallet first.")
        }
        const newWallets = WalletGen(mnemonics.join(" "));

        if(newWallets){
            const updatedWallets = [...wallets, ...newWallets];
            setWallets(updatedWallets);
            localStorage.setItem("Wallets", JSON.stringify(updatedWallets));
            localStorage.setItem("Mnemonic", (mnemonics.join(" ")));
            setIsVisible(true);
            setVisiblePrivKeys([...visiblePrivKeys, false]);
        }
    }


    // UI: Create an accordian which can let you hide and unhide Mnemonic phrase

    return (
    <div className='text-white flex flex-col items-center justify-center'>
        {!isRecovering && !isVisible && (
            <div className="w-screen h-screen bg-black-500 gap-4 flex flex-col justify-center p-4 items-center">
            <h1 className="text-white text-4xl font-bold  absolute top-1/5">Welcome to a CoinSafe</h1>
            <p className="text-gray-500 flex justify-center absolute top-1/4 p-6">This is an assignment from the 100xDevs Web3 Cohort</p>
                <div className="flex flex-col gap-4 justify-center items-center bg-black-500 absolute top-1/2 ">
                    <div className="text-white">
                        <Button onClick={handleRecoverWallet} size='md' variant="primary" text="Recover a Wallet" loading={false} />
                    </div>
                    <div>
                        <Button onClick={handleaddWallet} size='md' variant="secondary" text="Generate Wallet" loading={false} />
                    </div>
                </div>
            </div>
        )}  
        <div>
        {isRecovering && !isVisible && (
            <div className="bg-black w-screen h-screen p-2">
                <h1 className="flex flex-col items-center text-2xl font-bold relative top-1/4">Enter your 12 Words Mnemonics Phrase below</h1>
                <div className='flex flex-col gap-8 items-center relative top-1/3'>
                <Input value={inputPhrase.split(" ")} 
                    size="md"
                    onChange={(index, e)=> {
                        const words = inputPhrase.split(" ");
                        words[index] = e.target.value;
                        setInputPhrase(words.join(" "));
                }} />
                <Button onClick={handleValidateRecovery} size='md' variant="secondary" text="Validate Wallet" loading={false} />
                </div>
            </div>
        )} 
        </div>

        <div className='bg-black text-white'>
          {isVisible && (
            <div className="w-screen h-screen ">
                <Accordian title="Your Secret Key" isOpen={isOpen} toggleOpen={()=>setIsOpen(!isOpen)}>
                    <div className=" grid grid-cols-3 gap-2 w-screen text-white ">
                        {mnemonics.map((word, index) => (
                            <span key={index} className="px-5 py-5 text-lg rounded-md bg-black-500">
                                {word}
                            </span>
                        ))}
                    </div>
            </Accordian>
            <div className="flex justify-end gap-4 m-5 mr-50">
                <Button onClick={handleaddWallet} variant="secondary" size="sm" text="Add Wallet" />
                <Button onClick={deleteWallet}variant="destructive" size="sm" text="Delete Wallet" />
            </div>
            
          </div> )}
      </div> 
      </div>

    )
}
