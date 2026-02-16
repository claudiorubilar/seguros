
import { useState, useEffect } from 'react';
import { Policy, Client, Agent, Brokerage, User, Claim, Quote, Prospect, Task, Insurer, Commission, Incentive } from '../types';
import api from '../services/apiService';

export const useAppData = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [brokerages, setBrokerages] = useState<Brokerage[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [claims, setClaims] = useState<Claim[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [insurers, setInsurers] = useState<Insurer[]>([]);
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [incentives, setIncentives] = useState<Incentive[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const appData = await api.getAppData();
                setPolicies(appData.policies);
                setClients(appData.clients);
                setAgents(appData.agents);
                setBrokerages(appData.brokerages);
                setUsers(appData.users);
                setClaims(appData.claims);
                setQuotes(appData.quotes);
                setProspects(appData.prospects);
                setTasks(appData.tasks);
                setInsurers(appData.insurers);
                setCommissions(appData.commissions);
                setIncentives(appData.incentives);
            } catch (error) {
                console.error("Failed to fetch app data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const addUser = async (newUser: Omit<User, 'id' | 'lastLogin' | 'status'>) => {
        const addedUser = await api.addUser(newUser);
        setUsers(prevUsers => [...prevUsers, addedUser]);
    };

    const updateUser = async (updatedUser: User) => {
        const result = await api.updateUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === result.id ? result : u));
    };

    const toggleUserStatus = async (userId: string) => {
        const updatedUser = await api.toggleUserStatus(userId);
        if (updatedUser) {
            setUsers(prevUsers => prevUsers.map(u => u.id === userId ? updatedUser : u));
        }
    };
    
    const deleteUser = async (userId: string) => {
        await api.deleteUser(userId);
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    };
    
    const addTask = async (newTaskData: Omit<Task, 'id' | 'status'>) => {
        const addedTask = await api.addTask(newTaskData);
        setTasks(prevTasks => [...prevTasks, addedTask]);
    };

    const updateTask = async (updatedTaskData: Task) => {
        const updatedTask = await api.updateTask(updatedTaskData);
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const addQuote = async (newQuoteData: Omit<Quote, 'id' | 'quoteNumber' | 'creationDate' | 'status'>) => {
        const addedQuote = await api.addQuote(newQuoteData);
        setQuotes(prev => [...prev, addedQuote]);
        window.dispatchEvent(new CustomEvent('quoteActivity'));
    };

    const updateQuote = async (updatedQuoteData: Quote) => {
        const updatedQuote = await api.updateQuote(updatedQuoteData);
        setQuotes(prev => prev.map(q => q.id === updatedQuote.id ? updatedQuote : q));
        window.dispatchEvent(new CustomEvent('quoteActivity'));
    };

    const addProspect = async (newProspectData: Omit<Prospect, 'id' | 'status' | 'lastContacted' | 'attachments' | 'activityLog'>) => {
        const addedProspect = await api.addProspect(newProspectData);
        setProspects(prev => [...prev, addedProspect]);
    };

    const updateProspect = async (updatedProspectData: Prospect) => {
        const updatedProspect = await api.updateProspect(updatedProspectData);
        setProspects(prev => prev.map(p => p.id === updatedProspect.id ? updatedProspect : p));
    };
    
    const deleteProspect = async (prospectId: string) => {
        await api.deleteProspect(prospectId);
        setProspects(prev => prev.filter(p => p.id !== prospectId));
    };

    return { policies, clients, agents, brokerages, users, claims, quotes, prospects, tasks, insurers, commissions, incentives, isLoading, addUser, updateUser, toggleUserStatus, deleteUser, addTask, updateTask, addQuote, updateQuote, addProspect, updateProspect, deleteProspect };
};