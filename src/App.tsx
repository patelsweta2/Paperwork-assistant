import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster 
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1A2B4C',
          color:'#FAF8F3',
          fontFamily: "'JetBrains Mono', monospace'",
          fontSize: "14px",
          borderRadius: "8px",
          padding: "12px 16px"
        },
        success: {
          iconTheme: {
            primary: '#2F6E4E',
            secondary: '#FAF8F3',
          },
        },
        error: {
          iconTheme: {
            primary: '#C0392B',
            secondary: "#FAF8F3",
          },
        },
      }}
      />
      <Home />
    </>
  );
}

export default App;


