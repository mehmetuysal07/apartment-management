"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { prisma } from '../../lib/prisma';

interface Resident {
  name: string;
  phoneNumber: string;
}

interface Apartment {
  id: string;
  number: string;
  size: number;
  floor: string;
  residents: Resident[];
  status: 'occupied' | 'vacant';
  paid: boolean;
  paymentDate?: string;
  paymentMonth?: number;
  paymentYear?: number;
}

interface ApartmentContextProps {
  apartments: Apartment[];
  addApartment: (apartment: Apartment) => void;
  updateApartmentStatus: (id: string, status: string) => void;
  markAsPaid: (id: string) => void;
}

const ApartmentContext = createContext<ApartmentContextProps | undefined>(undefined);

export const ApartmentProvider: React.FC = ({ children }) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    loadApartments();
  }, []);

  const loadApartments = async () => {
    try {
      const response = await fetch('/api/apartments');
      const data = await response.json();
      setApartments(data.map(apt => ({
        ...apt,
        residents: apt.residents_json ? JSON.parse(`[${apt.residents_json}]`) : [],
        paid: Boolean(apt.paid)
      })));
    } catch (error) {
      console.error('Daireler yüklenirken hata:', error);
    }
  };

  const addApartment = async (apartment: Apartment) => {
    try {
      const newApartment = {
        ...apartment,
        id: Math.random().toString(36).substr(2, 9),
        paid: false
      };

      const response = await fetch('/api/apartments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApartment)
      });

      if (!response.ok) {
        let errorMessage = 'Daire eklenirken hata oluştu';
        try {
          const errorData = await response.json();
          errorMessage = errorData.details || errorData.error || errorMessage;
        } catch {
          // JSON parse hatası durumunda varsayılan mesajı kullan
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      await loadApartments();
      return data;
    } catch (error) {
      console.error('Daire eklenirken hata:', error);
      throw error;
    }
  };

  const updateApartmentStatus = (id: string, status: string) => {
    setApartments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  const markAsPaid = async (id: string) => {
    try {
      const response = await fetch(`/api/apartments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = 'Ödeme durumu güncellenirken hata oluştu';
        try {
          const errorData = await response.json();
          errorMessage = errorData.details || errorData.error || errorMessage;
        } catch {
          // JSON parse hatası durumunda varsayılan mesajı kullan
        }
        throw new Error(errorMessage);
      }

      await loadApartments();
    } catch (error) {
      console.error('Ödeme durumu güncellenirken hata:', error);
      throw error;
    }
  };

  return (
    <ApartmentContext.Provider value={{ apartments, addApartment, updateApartmentStatus, markAsPaid }}>
      {children}
    </ApartmentContext.Provider>
  );
};

export const useApartmentContext = () => {
  const context = useContext(ApartmentContext);
  if (!context) {
    throw new Error('useApartmentContext must be used within an ApartmentProvider');
  }
  return context;
};
