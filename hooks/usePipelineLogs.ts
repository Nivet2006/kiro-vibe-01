// Custom hook for log management
// Validates: Requirements 1.7, 8.1

'use client';

import { useState, useEffect } from 'react';
import { PipelineLog } from '@/types';
import { fetchPipelineLogs, createPipelineLog as createPipelineLogAPI } from '@/lib/supabase';
import { mockPipelineLogs } from '@/lib/mockData';

export function usePipelineLogs() {
  const [logs, setLogs] = useState<PipelineLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPipelineLogs();
      setLogs(data);
    } catch (err) {
      console.error('[usePipelineLogs] Failed to fetch logs:', err);
      setError('Failed to load logs');
      // Fallback to mock data
      setLogs(mockPipelineLogs);
    } finally {
      setLoading(false);
    }
  };

  const createLog = async (log: Omit<PipelineLog, 'id' | 'timestamp'>) => {
    try {
      await createPipelineLogAPI(log);
      
      // Add to local state
      const newLog: PipelineLog = {
        ...log,
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      setLogs(prev => [newLog, ...prev]);
    } catch (err) {
      console.error('[usePipelineLogs] Failed to create log:', err);
      throw err;
    }
  };

  return {
    logs,
    loading,
    error,
    createLog,
    refetch: loadLogs,
  };
}
