import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css'
import Layout from '@/components/modules/admin/Layout'
import Dashboard from '@/layouts/admin/Dashboard'
import Subjects from '@/layouts/admin/Subjects'
import Classes from '@/layouts/admin/Classes'
import Users from '@/layouts/admin/Users'
import Exams from '@/layouts/admin/Exams'
import Results from '@/layouts/admin/Results'
import Settings from '@/layouts/admin/Settings'
import Unauthorized from '@/components/commons/UnAuthorized'
import Login from '@/components/commons/Login'
import StudentDashboard from '@/layouts/student/Dashboard'
import ProtectedRoute from '@/states/ProtectedRoute'



function App() {
  return (
    <BrowserRouter>
    <ToastContainer />
    
      <Routes>
        {/* Login route is public*/}
        <Route path='/login' element={<Login />} />

        {/* Admin routes*/}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />} >
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/subjects"
            element={
              <Layout>
                <Subjects />
              </Layout>
            }
          />
          <Route
            path="/classes"
            element={
              <Layout>
                <Classes />
              </Layout>
            }
          />
          <Route
            path="/users"
            element={
              <Layout>
                <Users />
              </Layout>
            }
          />
          <Route
            path="/exams"
            element={
              <Layout>
                <Exams />
              </Layout>
            }
          />
          <Route
            path="/results"
            element={
              <Layout>
                <Results />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <Settings />
              </Layout>
            }
          />
        </Route>

        {/** Student routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />} >
          <Route path='/student' element={<StudentDashboard />} />
        </Route>
        <Route path='*' element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
