import "./App.css";
import Layout from "./components/Layout/Layout";
import { AuthProvider } from './context/AuthContext'; 
import { SessionTimeout } from './components/SessionTimeout';


function App() {
  return (
    <AuthProvider>
      <SessionTimeout />
      <Layout />
    </AuthProvider>
  );
}

export default App;
