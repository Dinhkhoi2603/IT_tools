import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/ AuthPage";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
        </Routes>
      </Router>
  );
}

export default App;
