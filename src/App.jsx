import { useEffect } from 'react';
import SignUp from './pages/auth/SignUp'
import Login from './pages/auth/Login'
import Logout from './pages/auth/Logout';
import Container from '@mui/material/Container'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './pages/Profile';
import AuthListener from './utils/AuthListener';
import ProtectedRoute from './utils/ProtectedRoute';
import RedirectIfAuthenticated from './utils/RedirectIfAuthenticated';

function App() {

  return (
    <Router>
      <AuthListener>
        <Container sx={{ display: "flex", flexDirection: 'column', alignItems: "center" }}>
          <Routes>
            <Route element={<RedirectIfAuthenticated />} >
              <Route path='/register' element={<SignUp />} />
              <Route path='/login' element={<Login />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path='/profile' element={<Profile />} />
              <Route path='*' element={<Profile />} />
            </Route>
              <Route path='/logout' element={<Logout />} />
          </Routes>
        </Container>
      </AuthListener>
    </Router>
  )
}

export default App
