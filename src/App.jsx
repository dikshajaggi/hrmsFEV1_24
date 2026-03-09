import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { MainContextProvider } from "./context/MainContext";

function App() {
  return (
    <BrowserRouter>
      <MainContextProvider>
        <AppRoutes />
      </MainContextProvider>
    </BrowserRouter>
  );
}

export default App;