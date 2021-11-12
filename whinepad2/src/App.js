import './App.css';
import Discovery from './components/Discovery';
import DataFlow from './components/DataFlow';

const isDiscovery = window.location.pathname.replace(/\//g, '') === 'discovery';
  
function App() {
  if (isDiscovery) {
    return <Discovery />;
  }
  return <DataFlow />;
}

export default App;