import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import Layout from '@/components/modules/admin/Layout'
import Dashboard from '@/layouts/admin/Dashboard'
import Subjects from '@/layouts/admin/Subjects'
import Classes from '@/layouts/admin/Classes'
import Users from '@/layouts/admin/Users'
import Exams from '@/layouts/admin/Exams'
import Results from '@/layouts/admin/Results'
import Settings from '@/layouts/admin/Settings'
import PageNotFound from '@/components/commons/PageNotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
        <Route
          path="*"
          element={
            <Layout>
              <PageNotFound />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
