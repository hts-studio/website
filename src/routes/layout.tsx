import { Outlet } from "react-router-dom";
import Footer from "../common/Footer";

export default function Layout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}
