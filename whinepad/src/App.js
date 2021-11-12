import './App.css';
import Discovery from './components/Discovery';
import DataFlow from './components/DataFlow';
// uncomment for the state-only option
// import DataFlow from './components/DataFlow1';
import schema from './config/schema';

const isDiscovery = window.location.pathname.replace(/\//g, '') === 'discovery';

let data = JSON.parse(localStorage.getItem('data'));

// default example data, read from the schema
if (!data) {
  data = [{}];
  Object.keys(schema).forEach((key) => (data[0][key] = schema[key].samples[0]));
}

function App() {
  if (isDiscovery) {
    return <Discovery />;
  }
  return <DataFlow schema={schema} initialData={data} />;
}

export default App;
