import React, { ReactElement, useContext, useState } from "react";
import useWeb3Wallet from "./useWeb3Wallet";

export enum Chains {
  NotSelected,
  Ethereum,
  Avalanche,
  Solana,
}

interface ChainContextType {
  chain: Chains;
  setChain: (chain: Chains) => void;
}

const ChainContext = React.createContext<ChainContextType>({
  chain: Chains.NotSelected,
  setChain: () => {},
});

export const useChain: () => [Chains, (chain: Chains) => void] = () => {
  const { chain, setChain } = useContext(ChainContext);
  return [chain, setChain];
};

export const ChainContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const [chain, setChain] = useState(Chains.NotSelected);

  return (
    <ChainContext.Provider value={{ chain, setChain }}>
      {children}
    </ChainContext.Provider>
  );
};
