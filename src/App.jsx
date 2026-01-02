import {  Routes, Route } from 'react-router-dom';
import './App.css'
import Dashboard from '../Components/Dashboard';
import DetailedCard from '../Components/DetailedCard';
import CreateTask from '../Components/CreateTask';
function App() {

  return (
 <div>
    <Routes>
      <Route path='/' element={<Dashboard/>} />
      <Route path='/create_task' element={<CreateTask/>} />
      <Route path='/card' element={<DetailedCard/>} />
    </Routes>
    </div>
  )
}

export default App
