import React, { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import {Link, useNavigate} from 'react-router-dom';
import {buildToolRegistry} from '../config/toolRegistry';
import { useAuth } from '../context/AuthContext.jsx';
import { getFavorites, addFavorite, removeFavorite } from '../services/favouriteService';
import {FaCrown} from "react-icons/fa";
import {getUserProfile} from "../services/authService.js";
// --- Component ToolCard ---
const ToolCard = ({ tool, isFavorite, onToggleFavorite, userPremium }) => {
  const IconComponent = tool.icon;
  const auth = useAuth() || {};
  const isAuthenticated = auth.isAuthenticated || false;
  const navigate = useNavigate(); // dùng để điều hướng thủ công

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to save favorites');
      return;
    }
    onToggleFavorite(tool.name);
  };

  const handleCardClick = (e) => {
    e.preventDefault();
    if (tool.premium && !userPremium) {
      alert('This is a premium tool. Please upgrade to access it.');
      return;
    }
    navigate(tool.path);
  };

  return (
      <div
          onClick={handleCardClick}
          className="cursor-pointer group block bg-white dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-600"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="text-gray-400 dark:text-gray-500 group-hover:text-brand-green transition-colors">
            {IconComponent ? <IconComponent className="h-6 w-6" /> : <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>}
          </div>
          <button
              className={`${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} opacity-0 group-hover:opacity-100 transition-opacity`}
              onClick={handleFavoriteClick}
          >
            {isFavorite ? (
                <HeartIconSolid className="h-5 w-5" />
            ) : (
                <HeartIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 group-hover:text-brand-green transition-colors flex items-center">
          {tool.name}
          {tool.premium && (
              <FaCrown className="h-4 w-4 text-yellow-400 ml-1" />
          )}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {tool.description || `Handy tool for various tasks.`}
        </p>
      </div>
  );
};

// --- Component WelcomeBox & SponsorBox ---
const WelcomeBox = () => (
  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Welcome to IT Tools</h2>
    <p className="text-gray-600 dark:text-gray-300">
      A collection of handy tools for developers, IT professionals, and tech enthusiasts.
      Explore our collection and bookmark your favorites!
    </p>
  </div>
);

const SponsorBox = () => (
  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg shadow">
    <h2 className="text-xl font-bold text-green-800 dark:text-green-300 mb-3">Support Us</h2>
    <p className="text-green-700 dark:text-green-400">
      If you find these tools useful, consider supporting our project to help us maintain
      and develop more helpful resources.
    </p>
  </div>
);

// --- Main HomePage Component ---
const HomePage = () => {
  const auth = useAuth() || {}; // Add fallback to empty object
  const isAuthenticated = auth.isAuthenticated || false; // Add fallback for isAuthenticated
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tools, setTools] = useState([]);
  const [userPremium,setUserpremium] =useState(null);
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = await getUserProfile();
      // console.log(userProfile);
      // console.log(userProfile.isPremium);
      setUserpremium(userProfile.isPremium);
    };

    fetchUserProfile();
  }, []);
  // Fetch user's favorites on component mount if authenticated
  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) {
        setFavorites([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const userFavorites = await getFavorites();
        setFavorites(userFavorites || []); // Ensure we have a fallback if API returns null
      } catch (error) {
        console.error("Failed to load favorites:", error);
        setFavorites([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFavorites();
  }, [isAuthenticated]);
  
  // Handle toggling a favorite
  const handleToggleFavorite = async (toolName) => {
    const isFavorite = favorites.includes(toolName);
    
    try {
      if (isFavorite) {
        await removeFavorite(toolName);
        setFavorites(prev => prev.filter(name => name !== toolName));
      } else {
        await addFavorite(toolName);
        setFavorites(prev => [...prev, toolName]);
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };
  useEffect(() => {
    const initializeTools = async () => {
      const { tools} = await buildToolRegistry();
      console.log(tools);
      setTools(tools);
    };

    initializeTools();
  }, []);
  // Get favorite tools based on names
  const favoriteTools = tools.filter(tool => favorites.includes(tool.name));
  
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <WelcomeBox />
        <SponsorBox />
      </div>
      
      {/* Favorites Section - Only show if user is authenticated and has favorites */}
      {isAuthenticated && favoriteTools.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
            <HeartIconSolid className="h-5 w-5 text-red-500 mr-2" />
            Your Favorites
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {favoriteTools.map(tool => (
              <ToolCard 
                key={`fav-${tool.id}`} 
                tool={tool}
                userPremium={userPremium}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite} 
              />
            ))}
          </div>
        </>
      )}
      
      {/* All Tools Section */}
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        All Tools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-10">Loading tools...</div>
        ) : (
          tools.map(tool => (
            <ToolCard 
              key={tool.id} 
              tool={tool}
              userPremium={userPremium}
              isFavorite={favorites.includes(tool.name)}
              onToggleFavorite={handleToggleFavorite} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;