import { Header } from '@/components/layout/Header';
import { RoutesConfig } from '@/types/pagesConfig';
import { lazy, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Footer } from './components/layout/Footer';
import MainPage from './pages/MainPage';
import { AuthService } from './services/auth.service';
import { login, logout } from './store/user/user.slice';
import { onRequest } from './types';
import { ITelegramUser, IUser } from './types/auth';
import { setTokenToLocalStorage } from './utils/localstorage';

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const SlotsPage = lazy(() => import('@/pages/SlotsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initDataUnsafe: {
          user?: ITelegramUser;
        };
        sendData: (data: string) => void;
        close: () => void;
        onEvent: (event: string, handler: () => void) => void;
        offEvent: (event: string, handler: () => void) => void;
        isExpanded?: boolean;
        expand: () => void;
        ready: () => void;
      };
    };
  }
}

function App() {
  const dispatch = useDispatch()
  // const trigger = useUpdateUserTrigger()

  const [userData, setUserData] = useState<any>(null);

  const checkAuth = async () => {

    // dispatch(setLoading(true))
    try {
      // const savedUserData = getTokenFromLocalStorage()

      const mockData = { "id": 2027571609, "first_name": "Artem", "last_name": "", "username": "TeM4ik20", "language_code": "ru", "c": true, "allows_write_to_pm": true, "photo_url": "https://t.me/i/userpic/320/kf7ulebcULGdGk8Fpe4W3PkcpX2DxWO1rIHZdwT60vM.svg" }

      const data: { token: string, user: IUser } = await onRequest(AuthService.login(mockData))
      console.log(data.user)

      setTokenToLocalStorage(data.token)

      // setUserData(data)

      if (data) {
        dispatch(login(data.user))
      } else {
        dispatch(logout())
      }


      // if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      //   const newUserData = window.Telegram.WebApp.initDataUnsafe.user

      //   const data: { token: string, user: IUser } = await onRequest(AuthService.login(newUserData))
      //   console.log(data)

      //   setTokenToLocalStorage(data.token)

      //   // setUserData(data)

      //   if (data) {
      //     dispatch(login(data.user))
      //   } else {
      //     dispatch(logout())
      //   }
      // }
      // else {
      //   toast.warning('no telegram data')
      // }



    } catch (error) {
      console.error("Ошибка при получении профиля:", error)
      // dispatch(logout())
    } finally {
      // dispatch(setLoading(false))
    }

  }

  useEffect(() => {
    checkAuth()
  }, []);

  return (
    <div className='min-h-screen flex flex-col bg-casino-primary'>
      <Router>
        <Header />
        <p className='break-words text-casino-gold-light'>{userData && JSON.stringify(userData)}</p>
        <main className='h-full z-[0]'>
          <Routes>
            <Route path={RoutesConfig.HOME.path} element={<MainPage />} />
            <Route path="/slots" element={<SlotsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </Router>
    </div>
  );
}

export default App;