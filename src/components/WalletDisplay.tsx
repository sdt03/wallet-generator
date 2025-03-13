import { useState, useEffect } from "react";
import { useWalletStore } from "./store/WalletStore"; 
import axios from "axios";
import { EthereumIcon } from "./icons/EthIcon";
import { SolanaIcon } from "./icons/SolanaIcon";
import { Send, QrCode, ArrowRightLeft, DollarSign } from "lucide-react";

interface BalanceResponse {
  jsonrpc: string;
  id: number;
  result: string;
}

export function Display() {
  const {
    wallets,
  } = useWalletStore();

  const ethWallets = wallets.filter(wallet => wallet.path.includes("60"));
  const solWallets = wallets.filter(wallet => wallet.path.includes("501"));

  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const [prices, setPrices] = useState<{ eth?: number; sol?: number }>({});
  const [total, setTotal] = useState<number>(0.00);

  useEffect(() => {
    const fetchBalancesAndPrices = async () => {
      let totalEth = 0;
      let totalSol = 0;

      try {
        const ethBalancePromises = ethWallets.map(async (wallet, index) => {
          const response = await axios.post<BalanceResponse>("https://eth-mainnet.g.alchemy.com/v2/mky5zGxdo0X_AyQYBcwfygXClc6YRVoh", {
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [wallet.publicKey, "latest"],
            id: 1,
          });

          const balanceInEth = parseInt(response.data.result, 16) / 10 ** 18;
          totalEth += balanceInEth;

          setBalances(prev => ({ ...prev, [`ethereum-${index}`]: balanceInEth }));
        });

        const solBalancePromises = solWallets.map(async (wallet, index) => {
          const response = await axios.post<BalanceResponse>("https://solana-mainnet.g.alchemy.com/v2/mky5zGxdo0X_AyQYBcwfygXClc6YRVoh", {
            jsonrpc: "2.0",
            method: "getBalance",
            params: [wallet.publicKey],
            id: 1,
          });

          const balanceInSol = Number(response.data.result) / 10 ** 9;
          totalSol += balanceInSol;

          setBalances(prev => ({ ...prev, [`solana-${index}`]: balanceInSol }));
        });

        await Promise.all([...ethBalancePromises, ...solBalancePromises]);

        if (totalEth > 0 || totalSol > 0) {
          const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${totalEth > 0 ? "ethereum" : ""}${totalSol > 0 ? "solana" : ""}&vs_currencies=usd`
          );
        
          const priceData = response.data as { ethereum?: { usd: number }; solana?: { usd: number } };
          const totalPrice = (totalEth * (priceData.ethereum?.usd || 0)) + 
          (totalSol * (priceData.solana?.usd || 0));

          setTotal(totalPrice); 
  
          setPrices({
            eth: totalEth > 0 && priceData.ethereum ? priceData.ethereum.usd : undefined,
            sol: totalSol > 0 && priceData.solana ? priceData.solana.usd : undefined,
          });
        }
        
      } catch (error) {
        console.error("Error fetching balances/prices:", error);
      }
    };

    fetchBalancesAndPrices();
    // const interval = setInterval(fetchBalancesAndPrices, 30000);
    
    // return () => clearInterval(interval);
  }, [ethWallets, solWallets]);

  // Copy function
  const copyToClipboard = (content: string, walletType: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopyStatus(prev => ({ ...prev, [walletType]: true }));
      setTimeout(() => setCopyStatus(prev => ({ ...prev, [walletType]: false })), 3000);
    });
  };

  return (
    <div className="flex flex-col relative top-1/7 transition-tranform duration-300">
      <h1 className="flex justify-center text-5xl font-semibold">{total ? (`$ ${total}`) : "$0.00"}</h1>
      <div className=" flex justify-center relative top-1/5 items-center gap-10 "> 
        <div className="border border-black-500 p-3 cursor-pointer rounded-3xl bg-black-500 hover:bg-black flex flex-col items-center"><QrCode size={"40"}/><p className="p-1 text-gray-500">Receive</p></div>
        <div className="border border-black-500 p-3 pr-6 pl-6 cursor-pointer rounded-3xl bg-black-500 hover:bg-black flex flex-col items-center"><Send size={"40"}/><p className="p-1 text-gray-500">Send</p></div>
        <div className="border border-black-500 p-3 pr-6 pl-6 cursor-pointer rounded-3xl bg-black-500 hover:bg-black flex flex-col items-center"><ArrowRightLeft size={"40"}/><p className="p-1 text-gray-500">Swap</p></div>
        <div className="border border-black-500 p-3 pr-6 pl-6 cursor-pointer rounded-3xl bg-black-500 hover:bg-black flex flex-col items-center"><DollarSign size={"40"}/><p className="p-1 text-gray-500">Buy</p></div>
      </div>
      <div className="flex flex-col relative top-1/3 p-4">
        <p className="text-center text-md font-semibold pb-2">Click on Wallet Name to Copy Public Key</p>
        <div className="bg-black-400 flex flex-col items-center gap-3">
        {solWallets.map((wallet, index) => (
            <div key={index} className="w-full max-w-sm p-3 border border-black-500 rounded-3xl flex items-center justify-between bg-black-500">
              <div className="flex items-center space-x-3">
                <EthereumIcon />
                <div>
                  <p 
                    className="text-lg font-bold cursor-pointer hover:text-blue-500"
                    data-publickey={wallet.publicKey}
                    onClick={() => copyToClipboard(wallet.publicKey, `ethereum-${index}`)}
                  >
                    Ethereum {copyStatus[`ethereum-${index}`] && <span className="text-blue-500 text-sm ml-2">(Copied!)</span>}
                  </p>
                  <p className="text-gray-500 text-md ">
                    {balances[`ethereum-${index}`] && prices.sol
                      ? `${balances[`ethereum-${index}`].toFixed(5)} SOL ($${(balances[`ethereum-${index}`] * prices.sol).toFixed(2)})`
                      : "0 ETH"}
                  </p>
                </div>
              </div>
              
              <p className="text-white text-md font-bold">
                {balances[`ethereum-${index}`] && prices.sol
                  ? `$${(balances[`ethereum-${index}`] * prices.sol).toFixed(2)}`
                  : "$0.00"}
              </p>
            </div>
          ))}

          {solWallets.map((wallet, index) => (
            <div key={index} className="w-full max-w-sm p-3 border border-black-500 rounded-3xl flex items-center justify-between bg-black-500">
              <div className="flex items-center space-x-3">
                <SolanaIcon />
                <div>
                  <p 
                    className="text-lg font-bold cursor-pointer hover:text-blue-500"
                    data-publickey={wallet.publicKey}
                    onClick={() => copyToClipboard(wallet.publicKey, `solana-${index}`)}
                  >
                    Solana {copyStatus[`solana-${index}`] && <span className="text-blue-500 text-sm ml-2">(Copied!)</span>}
                  </p>
                  <p className="text-gray-500 text-md ">
                    {balances[`solana-${index}`] && prices.sol
                      ? `${balances[`solana-${index}`].toFixed(5)} SOL ($${(balances[`solana-${index}`] * prices.sol).toFixed(2)})`
                      : "0 SOL"}
                  </p>
                </div>
              </div>
              
              <p className="text-white text-md font-bold">
                {balances[`solana-${index}`] && prices.sol
                  ? `$${(balances[`solana-${index}`] * prices.sol).toFixed(2)}`
                  : "$0.00"}
              </p>
            </div>
          ))}


        </div>
      </div>
    </div>
  );
}
