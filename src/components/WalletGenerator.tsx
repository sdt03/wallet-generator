import { useEffect, useState } from "react";
import { generateMnemonic, mnemonicToSeed, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { Accordian } from "./ui/Accordian";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";
import HDKey from "hdkey";
import { derivePath } from "ed25519-hd-key";
import bs58 from "bs58";


// Default step for a new user: Create a Mnemonic
// Validate a phrase if already exists (user input)
// store the mnemonic in localstorage
// generate a seed and save to localstorage
// Create a wallet => step 1. create a wallet interface 
// step 2. set derivation paths for SOL and ETH
// step 3. generate priv, pubkeys
// step 4. display both wallets
// fn to add wallets 

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
    const [inputPhrase, setInputPhrase] = useState("");
    const [error, setError] = useState("");
    const [seed, setSeed] = useState("");
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [visiblePrivKeys, setVisiblePrivKeys] = useState<boolean[]>([]);


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
    }

    const handleWalletGen = () => {
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

        const wallet = WalletGen(mnemonics);

        if(wallet){
            const updatedWallets = [...wallets, ...wallet];
            setWallets(updatedWallets);
            localStorage.setItem("Wallets", JSON.stringify(updatedWallets));
            localStorage.setItem("Mnemonic", (mnemonics));
            setIsVisible(true);
            setVisiblePrivKeys([...visiblePrivKeys, false]);
            
        }
    
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
                <Button onClick={handleaddWallet} variant="secondary" size="sm" text="Add Wallet" />
                <Button onClick={deleteWallet}variant="destructive" size="sm" text="Delete Wallet" />
            </div>
            <div>
            
            </div>
          </div>

          ): <div className='flex justify-center p-5 gap-4 items-center '>
          <Input placeholder='Enter your public key (if exists or create new)' value={inputPhrase} onChange={(e)=>setInputPhrase(e.target.value)} />
          <Button onClick={handleWalletGen} size='md' variant="secondary" text="Generate Wallet" loading={false} />
        </div>  }  
      </div>
    )
}

