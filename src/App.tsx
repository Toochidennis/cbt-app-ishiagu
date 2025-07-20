import { HashRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css'
import Layout from '@/components/modules/admin/Layout'
import Dashboard from '@/layouts/admin/Dashboard'
import Subjects from '@/layouts/admin/Subjects'
import Classes from '@/layouts/admin/Classes'
import Users from '@/layouts/admin/Users'
import Results from '@/layouts/admin/Results'
import Settings from '@/layouts/admin/Settings'
import Login from '@/components/commons/Login'
import StudentDashboard from '@/layouts/student/Dashboard'
import ProtectedRoute from '@/states/ProtectedRoute'
import Unauthorized from '@/components/commons/Unauthorized';
import RedirectByRole from './components/commons/RedirectByRole';
import StudentExam from '@/layouts/student/StudentExam';
import Exams from '@/layouts/admin/Exams';
import ResultSubjects from '@/components/modules/admin/ResultSubjects';


function App() {
  return (
    <HashRouter>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<RedirectByRole />} />

        {/* Login route is public*/}
        <Route path='/login' element={<Login />} />

        {/* Admin routes*/}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />} >
          <Route
            path="/admin"
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
          <Route
            path="/results/subjects"
            element={
              <Layout>
                <ResultSubjects />
              </Layout>
            }
          />
        </Route>

        {/** Student routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />} >
          <Route path='/student' element={<StudentDashboard />} />
          <Route path='/exam' element={<StudentExam />} />
        </Route>
        <Route path='*' element={<Unauthorized />} />
      </Routes>
    </HashRouter>
  )
}

export default App
