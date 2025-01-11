// import { useEffect } from 'react';
import SignUp from './pages/auth/SignUp'
import Login from './pages/auth/Login'
import Logout from './pages/auth/Logout';
import Container from '@mui/material/Container'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Movie from './pages/Movie';
import AuthListener from './utils/AuthListener';
import ProtectedRoute from './utils/ProtectedRoute';
import RedirectIfAuthenticated from './utils/RedirectIfAuthenticated';
import Search from './pages/Search';
import ActorProfile from './pages/Actor';
import ForgotPassword from './pages/auth/ForgotPassword';
import Cast from './pages/Cast';
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
            <Route path='/' element={<Home />} />
            <Route path='/actor/:id' element={<ActorProfile />} />
            <Route path='/search' element={<Search />} />
            <Route path='/movie/:id' element={<Movie />} />
            <Route path='/movie/cast/:id' element={<Cast />} />

            <Route path='*' element={<Navigate to="/" replace />} />
            <Route path='/logout' element={<Logout />} />
            <Route element={<RedirectIfAuthenticated />} >
              <Route path='/register' element={<SignUp />} />
              <Route path='/login' element={<Login />} />
              <Route path='/forgot-password' element={<ForgotPassword/>} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path='/profile' element={<Profile />} />
            </Route>
          </Routes>
        </Container>
      </AuthListener>
    </Router>
  )
}

export default App

// sx={{ display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center", padding: '0 !important'}}