import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RecipeProvider } from './context/RecipeContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { RecipeEditorPage } from './pages/RecipeEditorPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProfilePage } from './pages/ProfilePage';
import { NutritionDataPage } from './pages/NutritionDataPage';
import { DailyMenuPage } from './pages/DailyMenuPage';

// 认证路由 - 已登录用户不能访问登录/注册页面
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  
  // 已登录用户重定向到首页
  if (user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  
  return <>{children}</>;
}

// 受保护路由 - 未登录用户只能看到登录页面
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!user) {
    // 保存尝试访问的页面，登录后跳转回来
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* 首页 - 未登录重定向到登录页 */}
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      
      {/* 菜谱详情 - 未登录重定向到登录页 */}
      <Route path="/recipe/:id" element={
        <ProtectedRoute>
          <RecipeDetailPage />
        </ProtectedRoute>
      } />
      
      {/* 分类 - 未登录重定向到登录页 */}
      <Route path="/categories" element={
        <ProtectedRoute>
          <CategoriesPage />
        </ProtectedRoute>
      } />
      
      {/* 认证页面 - 已登录用户不能访问 */}
      <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
      
      {/* 受保护页面 - 需要登录 */}
      <Route path="/recipe/new" element={
        <ProtectedRoute>
          <RecipeEditorPage />
        </ProtectedRoute>
      } />
      <Route path="/recipe/:id/edit" element={
        <ProtectedRoute>
          <RecipeEditorPage />
        </ProtectedRoute>
      } />
      <Route path="/favorites" element={
        <ProtectedRoute>
          <FavoritesPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/admin/nutrition" element={
        <ProtectedRoute>
          <NutritionDataPage />
        </ProtectedRoute>
      } />
      <Route path="/daily-menu" element={
        <ProtectedRoute>
          <DailyMenuPage />
        </ProtectedRoute>
      } />
      
      {/* 404 重定向到登录页 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <RecipeProvider>
          <AppRoutes />
        </RecipeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
