import { useContext } from "react";
import { CenterMid } from "../components/CardForSwap";
import CenteredDiv from "../components/CenteredDiv";
import { EtherContext } from "../context/EtherProvider";

export default function About() {
  const { address, balance } = useContext(EtherContext);
  console.log(address, balance);

  return (
    <CenteredDiv>
      <p
        style={{
          marginTop: "5rem",
        }}
      >
        ADDRESS: {address}
      </p>
      <p>BALANCE: {balance} GoerliETH</p>
    </CenteredDiv>
  );
}
