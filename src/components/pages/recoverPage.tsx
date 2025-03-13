import { WalletIcon } from "../icons/walletIcon";
import { useWallet } from "../functions/walletFunctions";
import { useWalletStore } from "../store/WalletStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function RecoverWallet(){
    const { isRecovering, isVisible, inputPhrase, setInputPhrase} = useWalletStore();
    const { handleValidateRecovery } =  useWallet();

    const wordsArray = inputPhrase.trim().split(/\s+/);
    const isValidInput = wordsArray.length === 12 && wordsArray.every(word => word.length > 0);

    return(
        <div>
            {isRecovering && !isVisible && (
                <div className="bg-black-400 w-screen h-screen p-2">
                    <WalletIcon />
                    <h1 className="text-white flex flex-col items-center text-2xl font-bold relative top-1/4">Enter your 12 Words Mnemonics Phrase below</h1>
                    <div className='flex flex-col gap-8 items-center relative top-1/3 '>
                    <Input value={inputPhrase.split(" ")} 
                        size="md"
                        onChange={(index, e)=> {
                            const words = inputPhrase.split(" ");
                            words[index] = e.target.value;
                            setInputPhrase(words.join(" "));
                    }} />
                    <Button onClick={handleValidateRecovery} size='md' variant="secondary" text="Validate Wallet" loading={false} disabled={!isValidInput} />
                    </div>
                </div>
            )} 
        </div>
    )
}