import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import groupService from '../services/groupService';
import { AuthContext } from './AuthContext';

export const GroupContext = createContext(null);

export const GroupProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await groupService.getAll();
      setGroups(data.groups || []);
      return data.groups || [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGroups();
    } else {
      setGroups([]);
      setActiveGroup(null);
    }
  }, [isAuthenticated, fetchGroups]);

  const fetchGroupDetails = useCallback(async (groupId) => {
    const data = await groupService.getById(groupId);
    setActiveGroup(data);
    return data;
  }, []);

  const createGroup = useCallback(
    async (data) => {
      const response = await groupService.create(data);
      await fetchGroups();
      return response.group;
    },
    [fetchGroups]
  );

  const updateGroup = useCallback(
    async (groupId, data) => {
      const response = await groupService.update(groupId, data);
      await fetchGroups();
      return response.group;
    },
    [fetchGroups]
  );

  const removeGroup = useCallback(
    async (groupId) => {
      await groupService.remove(groupId);
      await fetchGroups();
    },
    [fetchGroups]
  );

  const addMember = useCallback(
    async (groupId, email) => {
      const response = await groupService.addMember(groupId, email);
      await fetchGroups();
      return response.group;
    },
    [fetchGroups]
  );

  const removeMember = useCallback(
    async (groupId, userId) => {
      const response = await groupService.removeMember(groupId, userId);
      await fetchGroups();
      return response.group;
    },
    [fetchGroups]
  );

  return (
    <GroupContext.Provider
      value={{
        groups,
        loading,
        activeGroup,
        fetchGroups,
        fetchGroupDetails,
        createGroup,
        updateGroup,
        removeGroup,
        addMember,
        removeMember
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroups = () => useContext(GroupContext);