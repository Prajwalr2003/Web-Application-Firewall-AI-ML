import "./App.css";
import Header from "./components/Header";
import Container from "./components/Container";
import FooterBar from "./components/FooterBar";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/Auth";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <>
      <AuthProvider>
        <ToastProvider>
          <Header />
          <Container>
            <Outlet></Outlet>
          </Container>
          <FooterBar />
        </ToastProvider>
      </AuthProvider>
    </>
  );
}

export default App;
