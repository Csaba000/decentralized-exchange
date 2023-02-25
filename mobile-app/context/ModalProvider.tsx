import { createContext, Dispatch, SetStateAction, useState } from "react";

interface Props {
  slippage: string;
  setSlippage: Dispatch<SetStateAction<string>>;
  deadline: string;
  setDeadline: Dispatch<SetStateAction<string>>;
}

export const ModalContext = createContext<Props>({
  slippage: "",
  setSlippage: () => {},

  deadline: "",
  setDeadline: () => {},
});

interface Props2 {
  children: React.ReactNode;
}

export const ModalProvider = ({ children }: Props2) => {
  const [slippage, setSlippage] = useState("");
  const [deadline, setDeadline] = useState("");

  return (
    <ModalContext.Provider
      value={{
        slippage: [slippage, setSlippage],
        deadline: [deadline, setDeadline],
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
