import { useWallet } from "../functions/walletFunctions";
import { useWalletStore } from "../store/WalletStore";
import { Button } from "../ui/button";

export function IndexPage(){
    const { isRecovering, isVisible } = useWalletStore();
    const { handleRecoverWallet, handleWalletGen } = useWallet();

    return (
        <div>
            {!isRecovering && !isVisible && (
            <div className="w-screen min-h-screen bg-black-400 gap-4 flex flex-col justify-center p-4 items-center">
            <h1 className="text-white text-4xl font-bold  absolute top-1/5"> Welcome to a पाकीट</h1>
            <p className="text-gray-500 flex justify-center absolute top-1/4 p-6">This is an assignment from the 100xDevs Web3 Cohort</p>
                <div className="flex flex-col gap-4 justify-center items-center absolute top-1/2 bg-black-400 ">
                    <div >
                        <Button onClick={handleRecoverWallet} size='md' variant="primary" text="Recover a Wallet" loading={false} /> 
                    </div>
                    <div>
                        <Button onClick={handleWalletGen} size='md' variant="secondary" text="Generate Wallet" loading={false} />
                    </div>
                </div>
            </div>
        )} 
        </div>
    )
}