// import { useEffect } from 'react';
import SignUp from './pages/auth/SignUp'
import Login from './pages/auth/Login'
import Logout from './pages/auth/Logout';
import Container from '@mui/material/Container'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './pages/Profile';
import Movie from './pages/Movie';
import AuthListener from './utils/AuthListener';
import ProtectedRoute from './utils/ProtectedRoute';
import RedirectIfAuthenticated from './utils/RedirectIfAuthenticated';

function App() {

  return (
    <Router>
      <AuthListener>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center",
            width: "100%",
            padding: "0 !important",
            margin: "0 !important",
          }} >
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
            <Route element={<ProtectedRoute />}>
              <Route path='/movie/:id' element={<Movie />} />
            </Route>
          </Routes>
        </Container>
      </AuthListener>
    </Router>
  )
}

export default App

// sx={{ display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center", padding: '0 !important'}}