// import { useEffect, useState } from "react";
// import { EthereumIcon } from "./icons/EthIcon";
// import { SolanaIcon } from "./icons/SolanaIcon";
// import { Wallet } from "./random/walletFunctions";
// import axios from "axios";
// import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

// interface WalletDisplayProps {
//   wallets: {
//     publicKey: string;
//     privateKey: string;
//     mnemonics: string;
//     path: string;
//   }[];
// }

// interface BalanceResponse {
//   jsonrpc: string;
//   id: number;
//   result: string;
// }

// export function Display({ wallets }: WalletDisplayProps) {
//   const ethWallets = wallets.filter(wallet => wallet.path.includes("60"));
//   const solWallets = wallets.filter(wallet => wallet.path.includes("501"));
//   const [copyStatus, setCopyStatus] = useState<{[key: string]: boolean}>({});
//   const [balances, setBalances] = useState<{[key: string]: string}>({});

//   const copyToClipboard = (content: string, walletType: string) => {
//     navigator.clipboard.writeText(content).then(() => {
//       setCopyStatus(prev => ({ ...prev, [walletType]: true }));

//       setTimeout(() => {
//         setCopyStatus(prev => ({ ...prev, [walletType]: false }));
//       }, 3000);
//     });
//   };
  
//   const formatPublicKey = (key: string, isEth: boolean) => {
//     if(isEth) {
//       key = "0x" + key;
//     }
//     return `${key.substring(0,6)}...${key.substring(key.length-4)}`;
//   };

//   const fetchEthBalance = async (publicKey: string, index: number) => {
//     try {
//       const response = await axios.post<BalanceResponse>("https://eth-mainnet.g.alchemy.com/v2/mky5zGxdo0X_AyQYBcwfygXClc6YRVoh", {
//         jsonrpc: "2.0",
//         method: "eth_getBalance",
//         params: [publicKey, "latest"],
//         id: 1
//       });

//       const balanceInWei = response.data.result;
//       const balanceInEth = (parseInt(balanceInWei, 16) / 10 ** 18).toFixed(5);
//       setBalances(prev => ({ ...prev, [`ethereum-${index}`]: balanceInEth }));
//     } catch (error) {
//       console.error("Error Fetching ETH Balance: ", error);
//     }
//   };

//   const fetchSolBalance = async (publicKey: string, index: number) => {
//     try{
//       const response = await axios.post<BalanceResponse>("https://solana-mainnet.g.alchemy.com/v2/mky5zGxdo0X_AyQYBcwfygXClc6YRVoh", {
//         jsonrpc: "2.0",
//         method: "getBalance",
//         params: [publicKey, "latest"],
//         id: 1
//       });
//       const balanceInLamports = parseInt(response.data.result);
//       const balanceInSol = (balanceInLamports / 10 ** 9);

//     } catch (error){
//       console.error("Error Fetching SOL Balance: ", error)
//     }
//   }

//   useEffect(()=> {
//     ethWallets.forEach((wallet, index)=>fetchEthBalance(wallet.publicKey, index));
//     solWallets.forEach((wallet, index)=>fetchSolBalance(wallet.publicKey, index));
//   }, [ethWallets, solWallets]);

  // return (
  //   <div>
  //     <p className="flex justify-center text-md font-semibold pb-2">Click on Wallet Name to Copy Public Key</p>
  //     <div className="bg-black-500 flex flex-col items-center justify-center gap-3">
  //       {ethWallets.map((wallet, index) => (
  //         <div key={index} className="w-180 h-25 p-3 border border-gray-500 rounded-lg flex items-center">
  //           <div className="flex">
  //             <div className="flex items-center pb-3 relative group">
  //               <EthereumIcon />
  //               <p 
  //                 className="p-4 text-lg font-bold pt-0 relative cursor-pointer hover:text-blue-500 " 
  //                 data-publickey={wallet.publicKey}
  //                 onClick={() => copyToClipboard(wallet.publicKey, `ethereum-${index}`)}
  //               >
  //                 Ethereum {copyStatus[`ethereum-${index}`] && <span className="text-sm ml-2">(Copied!)</span>}
  //               </p>
  //             </div>
  //             {balances[`ethereum-${index}`]==="0.00000"} Eth
  //           </div>
  //         </div>
  //       ))}

  //       {solWallets.map((wallet, index) => (
  //         <div key={index} className="w-180 h-25 p-3 border border-gray-500 rounded-lg flex items-center">
  //           <div className="flex">
  //             <div className="flex items-center pb-3 relative group">
  //               <SolanaIcon />
  //               <p 
  //                 className="p-4 text-lg font-bold pt-0 relative cursor-pointer hover:text-blue-500 " 
  //                 data-publickey={wallet.publicKey}
  //                 onClick={() => copyToClipboard(wallet.publicKey, `solana-${index}`)}
  //               >
  //                 Solana {copyStatus[`solana-${index}`] && <span className="text-green-500 text-sm ml-2">(Copied!)</span>}
  //               </p>
  //             </div>
  //             {balances[`solana-${index}`]} Sol
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
// }

