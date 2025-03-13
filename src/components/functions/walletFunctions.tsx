import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { useWalletStore } from "../store/WalletStore";
import HDKey from "hdkey";
import { keccak256 } from "ethers";
import { getAddress } from "ethers";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { useEffect } from "react";

export interface Wallet {
  publicKey: string;
  privateKey: string;
  mnemonics: string;
  path: string;
}

interface DerivationPaths {
  ethereum: string;
  solana: string;
}

const DERIVATION_PATHS: DerivationPaths = {
  ethereum: "m/44'/60'/0'/0/0",
  solana: "m/44'/501'/0'/0'"
};

export function useWallet() {
  const { 
    setMnemonics, setSeed, setError,
    setIsRecovering, setCurrentScreen,
    inputPhrase,  setIsVisible, 
    setVisiblePrivKey, visiblePrivKey,
    wallets, setWallets
  } = useWalletStore();

  const getEthAddress = (publicKey: string): string => {
    const compressedPubKey = Buffer.from(publicKey, 'hex');
    const hash = keccak256(compressedPubKey);
    return getAddress("0x" + hash.slice(-40));
  };

  useEffect(() => {
    const storedMnemonic = localStorage.getItem("Mnemonics");
    const storedSeed = localStorage.getItem("Seed");
    const storedWallets = localStorage.getItem("Wallets");

    if (storedMnemonic && storedSeed && storedWallets) {
      setMnemonics(storedMnemonic.split(" "));
      setSeed(storedSeed);
      setWallets(JSON.parse(storedWallets));
      setCurrentScreen("wallet");
    }
  }, []);

  const WalletGeneration = (mnemonic: string): Wallet[] => {
    try {
      const seedBuffer = mnemonicToSeedSync(mnemonic);
      const seedHex = seedBuffer.toString('hex');
      localStorage.setItem("Seed", seedHex);

      const ethHdKey = HDKey.fromMasterSeed(seedBuffer);
      const ethDerived = ethHdKey.derive(DERIVATION_PATHS.ethereum);

      if (!ethDerived.privateKey || !ethDerived.publicKey) {
        throw new Error("Failed to generate Ethereum Keys");
      }

      const ethPrivateKey = ethDerived.privateKey.toString('hex');
      const ethPublicKey = ethDerived.publicKey.toString('hex');
      const ethAddress = getEthAddress(ethPublicKey);

      const ethWallet: Wallet = {
        publicKey: ethAddress,
        privateKey: ethPrivateKey,
        mnemonics: mnemonic,
        path: DERIVATION_PATHS.ethereum
      };

      const solDerived = derivePath(DERIVATION_PATHS.solana, seedHex);
      const keyPair = Keypair.fromSeed(solDerived.key);
      const solPrivateKey = bs58.encode(keyPair.secretKey);
      const solPublicKey = keyPair.publicKey.toBase58();

      const solWallet: Wallet = {
        publicKey: solPublicKey,
        privateKey: solPrivateKey,
        mnemonics: mnemonic,
        path: DERIVATION_PATHS.solana
      };

      return [ethWallet, solWallet];
    } catch (error) {
      console.error("Error generating keys:", error);
      return [];
    }
  };

  const handleRecoverWallet = () => {
    setIsRecovering(true);
    setCurrentScreen("recover");
  };

  const handleValidateRecovery = () => {
    let mnemonics = inputPhrase.trim();
    if (mnemonics) {
      if (!validateMnemonic(mnemonics)) {
        setError("Invalid mnemonics");
        return;
      }
    }
    const words = mnemonics.split(" ");
    setMnemonics(words);
    localStorage.setItem("Mnemonics", mnemonics); 

    const wallet = WalletGeneration(mnemonics);

    if(wallet){
      const updatedWallets = [...wallets, ...wallet];
      setWallets(updatedWallets);
      localStorage.setItem("Wallets", JSON.stringify(updatedWallets));
      setVisiblePrivKey([...visiblePrivKey, false]);  
  }

  }

  const handleWalletGen = () => {
    setIsRecovering(false);
    let mnemonics = inputPhrase.trim();
    if (mnemonics) {
      if (!validateMnemonic(mnemonics)) {
        setError("Invalid mnemonics");
        return;
      }
    } else {
      mnemonics = generateMnemonic();
      setIsVisible(true);
    }

    const words = mnemonics.split(" ");
    setMnemonics(words);
    setCurrentScreen("wallet");
    localStorage.setItem("Mnemonics", mnemonics); 

    const wallet = WalletGeneration(mnemonics);

    if(wallet){
      const updatedWallets = [...wallets, ...wallet];
      setWallets(updatedWallets);
      localStorage.setItem("Wallets", JSON.stringify(updatedWallets));
      setIsVisible(true);
      setVisiblePrivKey([...visiblePrivKey, false]);  
  }
  };

  return { handleRecoverWallet, WalletGeneration, handleWalletGen, handleValidateRecovery };
}
