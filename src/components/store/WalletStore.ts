import { create } from "zustand";

type Wallet = { publicKey: string; privateKey: string; path: string };

type WalletState = {
  wallets: Wallet[];
  mnemonics: string[];
  seed: string;
  error: string;
  inputPhrase: string;
  visiblePrivKey: boolean[];
  isVisible: boolean;
  isRecovering: boolean;
  currentScreen: "index" | "recover" | "wallet";

  setWallets: (wallets: Wallet[]) => void;
  clearWallets: () => void;
  setMnemonics: (mnemonics: string[]) => void;
  setSeed: (seed: string) => void;
  setVisiblePrivKey: (visiblePrivKey: boolean[]) => void;
  setIsVisible: (isVisible: boolean) => void;
  setInputPhrase: (inputPhrase: string) => void;
  setIsRecovering: (isRecovering: boolean) => void;
  setError: (error: string) => void;
  setCurrentScreen: (screen: "index" | "recover" | "wallet") => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  wallets: [],
  mnemonics: Array(12).fill(""),
  seed: "",
  error: "",
  inputPhrase: "",
  visiblePrivKey: [],
  isVisible: false,
  isRecovering: false,
  currentScreen: "index",

  setWallets: (newWallets) =>
    set((state) => {
      const updatedWallets = [...state.wallets];

      newWallets.forEach((newWallet) => {
        const existingIndex = updatedWallets.findIndex(
          (w) => w.publicKey === newWallet.publicKey
        );
        if (existingIndex === -1) {
          updatedWallets.push(newWallet);
        }
      });

      return { wallets: updatedWallets };
    }),

  clearWallets: () => set({ wallets: [] }),
  setMnemonics: (mnemonics) => set({ mnemonics }),
  setSeed: (seed) => set({ seed }),
  setVisiblePrivKey: (visiblePrivKey) => set({ visiblePrivKey }),
  setInputPhrase: (inputPhrase) => set({ inputPhrase }),
  setIsVisible: (isVisible) => set({ isVisible }),
  setIsRecovering: (isRecovering) => set({ isRecovering }),
  setError: (error) => set({ error }),
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
}));
