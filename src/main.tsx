import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App.tsx'
import { Provider } from 'react-redux';
import { store } from '@/store/Index.ts';
// import { setupMockApi } from '@/mock/api/config/setup';

// // モックAPIのセットアップ
// if (import.meta.env.VITE_API_MODE === "mock") {
//   console.log('Setting up mock API...');
//   setupMockApi();
// }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
