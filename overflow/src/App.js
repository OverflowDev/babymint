import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

import Drop from "./drop/Drop";

function App() {
  return (
    <div className="h-screen overflow-hidden">
      <ThirdwebProvider desiredChainId={ChainId.Rinkeby}>
        <Drop />
      </ThirdwebProvider>
    </div>
  );
}

export default App;
