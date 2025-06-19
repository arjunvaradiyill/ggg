'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../services/api';

interface AuthCheckProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'doctor' | 'user';
  redirectTo?: string;
}

export default function AuthCheck({ 
  children, 
  requiredRole = 'admin', 
  redirectTo = '/' 
}: AuthCheckProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if user is authenticated
        const authenticated = authAPI.isAuthenticated();
        const currentUser = authAPI.getCurrentUser();

        if (!authenticated || !currentUser) {
          router.push(redirectTo);
          return;
        }

        // Check role if required
        if (requiredRole && currentUser.role !== requiredRole) {
          // Redirect based on user role
          if (currentUser.role === 'doctor') {
            router.push('/doctor/dashboard');
          } else {
            router.push('/dashboard');
          }
          return;
        }

        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, requiredRole, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <span className="text-lg font-semibold text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 