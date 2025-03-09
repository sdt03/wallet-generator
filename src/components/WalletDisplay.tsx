import { useState } from "react";
import { EthereumIcon } from "./icons/EthIcon";
import { SolanaIcon } from "./icons/SolanaIcon";
import { Wallet } from "./WalletGenerator";

interface WalletDisplayProps {
  wallets: Wallet[];
}

export function Display({ wallets }: WalletDisplayProps) {
  const ethWallet = wallets.find(wallet => wallet.path.includes("60"));
  const solWallet = wallets.find(wallet => wallet.path.includes("501"));
  const [copyStatus, setCopyStatus] = useState<{[key: string]: boolean}>({});

  const copyToClipboard = (content: string, walletType: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopyStatus(prev => ({ ...prev, [walletType]: true }));

      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [walletType]: false }));
      }, 3000);
    });
  };
  
  const formatPublicKey = (key: string, isEth: boolean) => {
    if(isEth) {
      key = "0x" + key;
    }
    return `${key.substring(0,6)}...${key.substring(key.length-4)}`;
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-3">
        {ethWallet && (
          <div className="w-180 h-25 p-3 border border-gray-500 rounded-lg flex items-center">
            <div className="flex">
              <div className="flex items-center pb-3 relative group">
                <EthereumIcon />
                <p 
                  className="p-4 text-lg font-bold pt-0 relative cursor-pointer hover:text-blue-500 " 
                  data-publickey={ethWallet.publicKey}
                  onClick={() => copyToClipboard(ethWallet.publicKey, 'ethereum')}
                >
                  Ethereum {copyStatus['ethereum'] && <span className="text-green-500 text-sm ml-2">(Copied!)</span>}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {solWallet && (
          <div className="w-180 h-25 p-3 border border-gray-500 rounded-lg flex items-center">
            <div className="flex">
              <div className="flex items-center pb-3 relative group">
                <SolanaIcon />
                <p 
                  className="p-4 text-lg font-bold pt-0 relative cursor-pointer hover:text-blue-500 " 
                  data-publickey={solWallet.publicKey}
                  onClick={() => copyToClipboard(solWallet.publicKey, 'solana')}
                >
                  Solana {copyStatus['solana'] && <span className="text-green-500 text-sm ml-2">(Copied!)</span>}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}