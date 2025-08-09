import "./index.css";
import Index from "./pages/Index.jsx";
import Categories from "./pages/Categories.jsx";
import TopRated from "./pages/TopRated.jsx";
import NewReleases from "./pages/NewReleases.jsx";
import GameDetails from "./pages/GameDetails.jsx";
import NotFound from "./pages/NotFound.jsx";
import { Routes, Route } from "react-router-dom";

const App = () => (
  <div className="relative">
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/top-rated" element={<TopRated />} />
      <Route path="/new-releases" element={<NewReleases />} />
      <Route path="/game/:id" element={<GameDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
);

export default App;