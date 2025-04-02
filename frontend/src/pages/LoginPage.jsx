import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-light-gray to-green-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-brand-green dark:text-green-400 mb-6">
          Welcome Back!
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Login to access your tools.
        </p>

        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green focus:outline-none dark:bg-gray-800 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6">
             <div className="flex justify-between items-baseline">
                <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                Password
                </label>
                <a href="#" className="text-sm text-brand-green hover:underline dark:text-green-400">Forgot password?</a>
             </div>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green focus:outline-none dark:bg-gray-800 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-green hover:underline dark:text-green-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;