import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import News from "./pages/News";
import Analytics from "./pages/Analytics";
import Chatbot from "./components/Chatbot";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/portfolio"
          element={<Portfolio />}
        />

        <Route
          path="/news"
          element={<News />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

      </Routes>

      {/* FinAI Assistant - available on every page */}
      <Chatbot />

    </BrowserRouter>
  );
}


export default App;