import "App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomeScreen from "pages/home";
import MapScreen from "pages/map";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/map" element={<MapScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
