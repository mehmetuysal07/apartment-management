"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { prisma } from '../../lib/prisma';
import { useApartmentContext } from './apartmentContext';

interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
  month: number;
  year: number;
}

interface MonthlyReport {
  month: number;
  year: number;
  totalExpenses: number;
  expensesByCategory: { [key: string]: number };
  perApartmentFee: number;
  paidCount: number;
  totalApartments: number;
}

interface ExpenseContextProps {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  getMonthlyReport: (month: number, year: number) => MonthlyReport;
  getAllMonthlyReports: () => MonthlyReport[];
}

const ExpenseContext = createContext<ExpenseContextProps | undefined>(undefined);

export const ExpenseProvider: React.FC = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { apartments } = useApartmentContext();

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Masraflar yüklenirken hata:', error);
    }
  };

  const addExpense = async (expense: Expense) => {
    try {
      await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      });
      await loadExpenses();
    } catch (error) {
      console.error('Masraf eklenirken hata:', error);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = 'Masraf silinirken hata oluştu';
        try {
          const errorData = await response.json();
          errorMessage = errorData.details || errorData.error || errorMessage;
        } catch {
          // JSON parse hatası durumunda varsayılan mesajı kullan
        }
        throw new Error(errorMessage);
      }

      await loadExpenses();
    } catch (error) {
      console.error('Masraf silinirken hata:', error);
      throw error;
    }
  };

  const getMonthlyReport = (month: number, year: number): MonthlyReport => {
    const monthlyExpenses = expenses.filter(
      (expense) => expense.month === month && expense.year === year
    );

    const totalExpenses = monthlyExpenses.reduce((acc, expense) => acc + expense.amount, 0);

    const expensesByCategory = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as { [key: string]: number });

    const totalApartments = apartments.length;

    const paidCount = apartments.filter(apt => 
      apt.paid && 
      apt.paymentMonth === month && 
      apt.paymentYear === year
    ).length;

    const perApartmentFee = totalApartments > 0 ? totalExpenses / totalApartments : 0;

    return {
      month,
      year,
      totalExpenses,
      expensesByCategory,
      perApartmentFee,
      paidCount,
      totalApartments,
    };
  };

  const getAllMonthlyReports = (): MonthlyReport[] => {
    const months = new Set(expenses.map(e => `${e.year}-${e.month}`));
    return Array.from(months).map(monthYear => {
      const [year, month] = monthYear.split('-').map(Number);
      return getMonthlyReport(month, year);
    });
  };

  return (
    <ExpenseContext.Provider value={{ 
      expenses, 
      addExpense, 
      deleteExpense, 
      getMonthlyReport,
      getAllMonthlyReports 
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider');
  }
  return context;
};

