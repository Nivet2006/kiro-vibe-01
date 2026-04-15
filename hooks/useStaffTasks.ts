// Custom hook for task management
// Validates: Requirements 4.1, 4.4

'use client';

import { useState, useEffect } from 'react';
import { StaffTask } from '@/types';
import { fetchStaffTasks, createStaffTask as createStaffTaskAPI, updateStaffTaskStatus } from '@/lib/supabase';
import { mockStaffTasks } from '@/lib/mockData';

const STAFF_MEMBERS = ['John', 'Sarah', 'Mike', 'Emma'];
let currentStaffIndex = 0;

export function useStaffTasks() {
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStaffTasks();
      setTasks(data);
    } catch (err) {
      console.error('[useStaffTasks] Failed to fetch tasks:', err);
      setError('Failed to load tasks');
      // Fallback to mock data
      setTasks(mockStaffTasks);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: Omit<StaffTask, 'id' | 'createdAt' | 'assignedTo'>) => {
    try {
      // Round-robin assignment
      const assignedTo = STAFF_MEMBERS[currentStaffIndex];
      currentStaffIndex = (currentStaffIndex + 1) % STAFF_MEMBERS.length;

      const newTask: Omit<StaffTask, 'id' | 'createdAt'> = {
        ...task,
        assignedTo,
      };

      await createStaffTaskAPI(newTask);
      
      // Add to local state
      const createdTask: StaffTask = {
        ...newTask,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [...prev, createdTask]);
    } catch (err) {
      console.error('[useStaffTasks] Failed to create task:', err);
      throw err;
    }
  };

  const updateTaskStatus = async (id: string, status: StaffTask['status']) => {
    try {
      await updateStaffTaskStatus(id, status);
      // Update local state
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, status } : task
        )
      );
    } catch (err) {
      console.error('[useStaffTasks] Failed to update task status:', err);
      throw err;
    }
  };

  const assignTask = async (id: string, assignedTo: string) => {
    try {
      // TODO: Implement assignTask API call
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, assignedTo } : task
        )
      );
    } catch (err) {
      console.error('[useStaffTasks] Failed to assign task:', err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTaskStatus,
    assignTask,
    refetch: loadTasks,
  };
}
