import './App.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { TablePage } from './pages/table';

const App = () => {
  return (
    <MantineProvider>
      <Notifications />
      <Router>
        <Routes>
          <Route path='/' element={<TablePage />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
};

export default App;

