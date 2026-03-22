import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🍳</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">xCook</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              location.pathname === '/' 
                ? 'bg-primary/10 text-primary' 
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            首页
          </Link>
          <Link
            to="/categories"
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              location.pathname === '/categories' 
                ? 'bg-primary/10 text-primary' 
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            分类
          </Link>
          <Link
            to="/favorites"
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              location.pathname === '/favorites' 
                ? 'bg-primary/10 text-primary' 
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            收藏
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/recipe/new"
            className="btn btn-primary text-sm hidden sm:flex"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            创建菜谱
          </Link>
          <Link
            to="/recipe/new"
            className="btn btn-primary p-2 sm:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>

          <Link
            to="/daily-menu"
            className="btn btn-ghost p-2"
            title="每日菜单"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:block">
                {user.displayName || user.email.split('@')[0]}
              </span>
              <Link
                to="/profile"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm hover:shadow-md transition-shadow"
                title={user.displayName || user.email}
              >
                {(user.displayName?.[0] || user.email[0]).toUpperCase()}
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-ghost text-sm"
            >
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
