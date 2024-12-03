// import { useEffect } from 'react';
import SignUp from './pages/auth/SignUp'
import Login from './pages/auth/Login'
import Logout from './pages/auth/Logout';
import Container from '@mui/material/Container'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './pages/Profile';
import AuthListener from './utils/AuthListener';

function App() {

  return (
    <Router>
      <AuthListener />
      <Container 
       maxWidth={false}
       disableGutters   
       sx={{ display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center", 
          width: "100%", 
          padding: "0 !important", 
          margin: "0 !important", 
        }} >
        <Routes>
          <Route path='/profile' element={<Profile />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout/>} />
          <Route path='*' element={<Profile />} />
        </Routes>
      </Container>
    </Router>
  )
}

export default App

// sx={{ display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center", padding: '0 !important'}}