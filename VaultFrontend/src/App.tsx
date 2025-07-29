import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from '@/routes/index';
import ThemeConfig from '@/theme/index';
import 'react-circular-progressbar/dist/styles.css';
import { SettingsProvider } from './contexts/SettingsContext';
import Loader from './components/common/loader';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthProvider } from '@/contexts/authContext';
import { Toaster } from 'sonner'; // ✅ Import from sonner

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        <SettingsProvider>
          <ThemeConfig>
            <RouterProvider router={router} />
            <Toaster position="top-right" richColors theme="system" /> 
          </ThemeConfig>
        </SettingsProvider>
      </DndProvider>
    </AuthProvider>
  );
};

export default App;
