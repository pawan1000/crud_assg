import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AddUser from './components/AddUser';
import ListUser from './components/ListUser';
import Loader from './components/Loader';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AddUser />}></Route>
          <Route path='/users' element={<ListUser />}></Route>
          <Route path='/loader' element={<Loader />} ></Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
