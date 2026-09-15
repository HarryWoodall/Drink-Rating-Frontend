import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ScrollToTop } from "./components/shared/ScrollToTop";
import { HomePage } from "./pages/homePage/HomePage";
import { CocktailPage } from "./pages/cocktail/CocktailPage";
import { AboutPage } from "./pages/AboutPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LoginPage } from "./pages/login/LoginPage";
import { RegisterPage } from "./pages/register/RegisterPage";
import { SearchPage } from "./pages/searchPage/SearchPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { FavouritesPage } from "./pages/favourites/FavouritesPage";
import { ResetPasswordPage } from "./pages/resetPassword/ResetPasswordPage";
import { ResetPasswordRequestPage } from "./pages/resetPasswordRequest/ResetPasswordRequestPage";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/reset-password-request"
          element={<ResetPasswordRequestPage />}
        />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="cocktail/:name" element={<CocktailPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="favourites" element={<FavouritesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
