import { useReducer } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';

interface State {
  email: string;
  password: string;
  error: string;
}

type Action =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: State = {
  email: '',
  password: '',
  error: '',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: '' };
    default:
      return state;
  }
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading: authLoading } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'CLEAR_ERROR' });
    
    if (!state.email.trim()) {
      dispatch({ type: 'SET_ERROR', payload: '请输入邮箱地址' });
      return;
    }
    if (!state.password) {
      dispatch({ type: 'SET_ERROR', payload: '请输入密码' });
      return;
    }

    try {
      await login(state.email, state.password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      let errorMessage = '登录失败，请稍后重试';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">🍳</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">欢迎回来</h1>
          <p className="text-gray-500 mt-2">登录您的 xCook 账户</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label="邮箱地址"
              placeholder="your@email.com"
              value={state.email}
              onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            <Input
              type="password"
              label="密码"
              placeholder="请输入密码"
              value={state.password}
              onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            {state.error && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">{state.error}</p>
                    {state.error === '用户不存在' && (
                      <p className="text-sm text-red-600 mt-2">
                        还没有账户？{' '}
                        <Link to="/register" className="font-semibold text-primary hover:text-primary-dark underline transition-colors">
                          立即注册
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" loading={authLoading}>
              登录
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              还没有账户？{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
