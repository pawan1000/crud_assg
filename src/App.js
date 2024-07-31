import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AddUser from './components/AddUser';
import ListUser from './components/ListUser';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AddUser />}></Route>
          <Route path='/users' element={<ListUser />}></Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
