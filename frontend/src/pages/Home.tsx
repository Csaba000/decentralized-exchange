//import styled components
import swap from '../../src/assets/swap.png';
import { Card, HeaderForCard, SpaceBetweenForCard, FloatRight, Dropdown, Footer, ArrowInside, CenterMid, Span, SwapIcon, SettingsButton } from '../components/CardForSwap';
import CenteredDiv from '../components/CenteredDiv';
import Input from '../components/Input';
import Button from '../components/Button';


export default function Swap() {
  return (
    <CenteredDiv>
      <Card>
        <HeaderForCard>
          <p>Swap</p>

          <FloatRight>
            <SettingsButton onClick={() => { alert("Settings!") }}>Settings
              <Span>&#9881;</Span>

            </SettingsButton>
          </FloatRight>
        </HeaderForCard>

        <CenterMid >
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
          <Button onClick={() => { alert("Connecting") }}>Connect Wallet</Button>
        </Footer>
      </Card>
    </CenteredDiv>
  )
}
