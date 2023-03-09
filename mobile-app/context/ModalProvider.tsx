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
  const [slippage, setSlippage] = useState("1");
  const [deadline, setDeadline] = useState("30");

  return (
    <ModalContext.Provider
      value={
        {
          slippage: [slippage, setSlippage] as any,
          deadline: [deadline, setDeadline] as any,
        } as any
      }
    >
      {children}
    </ModalContext.Provider>
  );
};
