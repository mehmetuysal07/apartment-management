"use client";
import React, { createContext, useContext, useState } from 'react';

interface Payment {
  id: string;
  amount: number;
  date: string;
  status: string; // Ödeme durumu ekledim
}

interface PaymentContextType {
  payments: Payment[];
  markAsPaid: (id: string) => void; // markAsPaid fonksiyonunu ekledim
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>([]);

  const markAsPaid = (id: string) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id ? { ...payment, status: 'Ödendi' } : payment
      )
    );
  };

  return (
    <PaymentContext.Provider value={{ payments, markAsPaid }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
};
