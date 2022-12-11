//import styled components
import swap from "../../src/assets/swap.png";
import {
  Card,
  HeaderForCard,
  SpaceBetweenForCard,
  FloatRight,
  Dropdown,
  Footer,
  ArrowInside,
  CenterMid,
  Span,
  SwapIcon,
  SettingsButton,
} from "../components/CardForSwap";
import CenteredDiv from "../components/CenteredDiv";
import Input from "../components/Input";
import Button from "../components/Button";
import { useContext } from "react";
import { EtherContext } from "../context/EtherProvider";

export default function Swap() {
  const { address, balance } = useContext(EtherContext);
  console.log(address, balance);

  return (
    <CenteredDiv>
      <Card>
        <HeaderForCard>
          <p>Swap</p>

          <FloatRight>
            <SettingsButton
              onClick={() => {
                alert("Settings!");
              }}
            >
              Settings
              <Span>&#9881;</Span>
            </SettingsButton>
          </FloatRight>
        </HeaderForCard>

        <CenterMid>
          <SpaceBetweenForCard>
            <Dropdown>
              <option value="ETH">ETH</option>
            </Dropdown>

            <Input placeholder="0.0" />
          </SpaceBetweenForCard>
          <ArrowInside>
            <SwapIcon src={swap} />
          </ArrowInside>
          <SpaceBetweenForCard>
            <Dropdown>
              <option value="ETH">ETH</option>
            </Dropdown>

            <Input placeholder="0.0" />
          </SpaceBetweenForCard>
        </CenterMid>
        <Footer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Button
              onClick={() => {
                if(address){
                  alert("Connected!");
                };
              }}
            >
              {address[0] == undefined
                ? "Connect Wallet"
                : address[0]?.slice(0, 6) + "..." + address[0]?.slice(-4)}
            </Button>
            <div
              style={{
                padding: "10px",
              }}
            >
              <p>BALANCE: {balance[0]} GoerliETH</p>
            </div>
          </div>
        </Footer>
      </Card>
    </CenteredDiv>
  );
}
