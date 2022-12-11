import { createContext, useState } from "react";

export const EtherContext = createContext({
  address: "",
  setAddress: (address) => {},

  balance: 0,
  setBalance: (balance) => {},
});

export const EtherProvider = ({ children }) => {
  const [address, setAddress] = useState(false);
  const [balance, setBalance] = useState(0);

  return (
    <EtherContext.Provider
      value={{
        address: [address, setAddress],
        balance: [balance, setBalance],
      }}
    >
      {children}
    </EtherContext.Provider>
  );
};
