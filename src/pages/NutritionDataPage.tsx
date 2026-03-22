import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NutritionDataManager } from '../components/admin/NutritionDataManager';
import { Header } from '../components/layout/Header';
import { nutritionApi } from '../services/api';

export function NutritionDataPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminSession');
    if (adminSession === 'authenticated') {
      setIsAdmin(true);
    }
  }, []);

  const checkAdmin = async () => {
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await nutritionApi.adminLogin(password);
      if (result.success) {
        setIsAdmin(true);
        sessionStorage.setItem('adminSession', 'authenticated');
      } else {
        setError('密码错误');
        setPassword('');
      }
    } catch (err) {
      setError('验证失败，请稍后重试');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleExit = () => {
    setIsAdmin(false);
    setPassword('');
    sessionStorage.removeItem('adminSession');
    navigate('/');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              营养数据管理
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              请输入管理员密码以访问此页面
            </p>
            <div className="mt-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="密码"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    checkAdmin();
                  }
                }}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
              <button
                onClick={checkAdmin}
                disabled={loading}
                className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? '验证中...' : '确认'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 py-4 sm:py-6">
        <NutritionDataManager onExit={handleExit} />
      </div>
    </div>
  );
}
