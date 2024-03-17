import { Navbar, Welcome, Footer, Services } from "./components";
import HelloWorld from './components/HelloWorld/HelloWorld';

const App = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
      <Welcome />
      <HelloWorld />
    </div>
    <Services />
    <Footer />
  </div>
);

export default App;
