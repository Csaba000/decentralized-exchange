import Navbar from "./components/Navbar";
import { EtherContext, EtherProvider } from "./context/EtherProvider";
import Home from "./pages/Home.jsx";

function App() {
  return (
    <EtherProvider>
      <Navbar />
    </EtherProvider>
  );
}

export default App;
