import { useEffect } from "react";
import { IndexPage } from "./components/pages/IndexPage";
import { RecoverWallet } from "./components/pages/recoverPage";
import { useWalletStore } from "./components/store/WalletStore";
import { Wallet } from "./components/pages/Wallet";

function App() {
  const { currentScreen, setIsRecovering, setCurrentScreen, mnemonics } = useWalletStore();

  return (
  <div className="h-screen">
    {currentScreen === "index" && <IndexPage />}
    {currentScreen === "recover" && <RecoverWallet />}
    {currentScreen === "wallet" && <Wallet />}
  </div> 
  )
}

export default App;