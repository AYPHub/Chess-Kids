import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

// Custom hook for API calls with loading and error states
export const useAPI = () => {
  const { toast } = useToast();

  const handleAPICall = async (apiFunction, options = {}) => {
    const {
      loadingMessage = 'Loading...',
      successMessage = null,
      errorMessage = 'Something went wrong',
      showToast = true
    } = options;

    try {
      const result = await apiFunction();
      
      if (successMessage && showToast) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }
      
      return { data: result, error: null };
    } catch (error) {
      console.error('API Error:', error);
      
      if (showToast) {
        toast({
          title: "Error",
          description: error.response?.data?.detail || errorMessage,
          variant: "destructive",
        });
      }
      
      return { data: null, error };
    }
  };

  return { handleAPICall };
};

// Hook for managing loading states
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  
  const withLoading = async (asyncFunction) => {
    setIsLoading(true);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return [isLoading, setIsLoading, withLoading];
};

// Hook for data fetching with automatic loading and error handling
export const useFetch = (fetchFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handleAPICall } = useAPI();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      const result = await handleAPICall(fetchFunction, {
        ...options,
        showToast: false // Don't show toast for automatic fetches
      });
      
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data);
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, dependencies);

  const refetch = () => {
    const result = handleAPICall(fetchFunction, options);
    result.then(({ data, error }) => {
      if (error) {
        setError(error);
      } else {
        setData(data);
        setError(null);
      }
    });
  };

  return { data, isLoading, error, refetch };
};