import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoList from "./components/VideoList";
import VideoUpload from "./components/VideoUpload";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VideoList />} />
        <Route path="/upload" element={<VideoUpload />} />
      </Routes>
    </Router>
  );
};

export default App;
