import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AccountMenu from "./components/navbar";
import adminroutes from "./pages/admin-routes";
import adminnearestroutes from "./pages/admin-nearest-routes";

import PointsAdd from "./pages/pointsAdd";
import Navbar from "./components/navbar";
import addEvents from "./pages/addEvents";
import RoutesList from "./pages/RoutesList";
import NearestList from "./pages/NearestList";
import Home from "./pages/Home";
// import { NearMe } from "@mui/icons-material";
import Nearest from "./pages/Nearest";
import markermap from "./pages/marker_map";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" Component={Home} />{" "}
        <Route path="/users" Component={Nearest} />{" "}
        <Route path="/add-route" Component={adminroutes} />{" "}
        <Route path="/add-nearest" Component={adminnearestroutes} />{" "}
        <Route path="/marker" Component={markermap} />{" "}
        <Route path="/routes" Component={RoutesList} />{" "}
        <Route path="/nearest-routes" Component={NearestList} />{" "}
        <Route path="/contests" Component={addEvents} />{" "}
        <Route path="/points-add/:id" element={<PointsAdd />} />
        {/* <Route path="/contests" Component={ContestList} />{" "} */}
        <Route path="/add-contest" Component={addEvents} />{" "}
        {/* 👈 Renders at /app/ */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
