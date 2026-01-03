import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/user/UserPage";
import AdminPage from "./pages/admin/AdminPage";
import AboutUs from "./pages/main/AboutUs";
import Contact from "./pages/main/Contact";
import Login from "./pages/main/Login";
import Register from "./pages/main/Register";
import Profile from "./pages/user/Profile";
import EditProfile from "./pages/user/EditProfile";
import Feeds from "./pages/user/Feeds";
import Post from "./pages/user/Post";
import CreateAction from "./pages/user/CreateAction";
import BoardPage from "./pages/user/BoardPage";
import ExploreBoards from "./pages/user/components/ExploreBoards";
import ExploreDescs from "./pages/user/components/ExploreDescs";
import EditBoard from "./pages/user/EditBoard";
import BoardMembers from "./pages/user/BoardMembers";
import DescMembers from "./pages/user/DescMembers";
import DescPage from "./pages/user/DescPage";
import TestDrafts from "./pages/user/TestDrafts";
import Playground from "./pages/user/Playground";
import SearchPage from "./pages/user/SearchPage";
import { TestPage } from "./pages/user/test/TestPage";
import AsidePanel from "./components/AsidePanel";
import Terms from "./pages/user/Terms";
import ResetPassword from "./pages/main/ResetPassword";
import EditDesc from "./pages/user/EditDesc";
import { useSelector } from "react-redux";

const App = () => {
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    // Apply theme class to document element
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Routes>
      <Route path="/about" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      <Route element={<UserPage />}>
        <Route path="profile" element={<Profile isMyProfile={true} />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route
          path="user/:username"
          element={<Profile isMyProfile={false} />}
        />
        <Route path="/" element={<Feeds />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route
          path="b/:community/post/:itemId"
          element={<Post itemType={"post"} />}
        />
        <Route
          path="d/:community/test/:itemId"
          element={<Post itemType={"test"} />}
        />
        <Route path="create/:action" element={<CreateAction />} />
        <Route path="b/all" element={<ExploreBoards />} />
        <Route path="d/all" element={<ExploreDescs />} />
        <Route path="test/drafts" element={<TestDrafts />} />
        <Route path="b/:boardId" element={<BoardPage />} />
        <Route path="b/:boardId/members" element={<BoardMembers />} />
        <Route path="d/:descId/members" element={<DescMembers />} />
        <Route path="b/:boardId/edit" element={<EditBoard />} />
        <Route path="d/:descId/edit" element={<EditDesc />} />
        <Route path="d/:descId" element={<DescPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/explore" element={<AsidePanel />} />
      </Route>
      <Route path="/terms" element={<Terms />} />
      <Route path="d/:descId/tests/:testId/start" element={<TestPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/playground" element={<Playground />} />
    </Routes>
  );
};

export default App;
