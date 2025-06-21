import { useState, useEffect } from 'react';
import { getCompressionJobs, saveCompressionJob } from '../../utils/api';
import { CompressionJob } from '@/types';
import { set } from 'mongoose';

export const useCompressionJobs = () => {
  const [savedResults, setSavedResults] = useState<CompressionJob[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCompressionJobs = async () => {
    try {
      setLoading(true);
      const response = await getCompressionJobs();
      setSavedResults(response.jobs || []);
    } catch (error) {
      console.error('Failed to load compression jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async (jobData: any) => {
    try {
      setLoading(true);
      const savedJob = await saveCompressionJob(jobData);
      await loadCompressionJobs(); // Refresh the list
      return savedJob;
    } catch (error) {
      console.error('Failed to save job:', error);
      throw error;
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompressionJobs();
  }, []);

  return {
    savedResults,
    loading,
    loadCompressionJobs,
    saveJob
  };
};