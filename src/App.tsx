import { CgaProvider } from '@/context/CgaContext';
import CgaMainPage from '@/sections/CgaMainPage';

function App() {
  return (
    <CgaProvider>
      <CgaMainPage />
    </CgaProvider>
  );
}

export default App;
