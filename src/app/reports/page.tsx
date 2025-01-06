"use client";

import { useExpenseContext } from "../context/expenseContext";
import { useApartmentContext } from "../context/apartmentContext";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faCalendarAlt,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Reports() {
  const { getMonthlyReport } = useExpenseContext();
  const { apartments } = useApartmentContext();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const report = getMonthlyReport(selectedMonth, selectedYear);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => selectedYear - i);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Aylık Raporlar</h1>
              <p className="text-purple-100">Aylık masraf ve aidat raporları</p>
            </div>
            <Link href="/dashboard">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200">
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Geri Dön</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Tarih Seçici */}
          <div className="flex gap-4 mb-8">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="p-2 border rounded-lg"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1).toLocaleString('tr-TR', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="p-2 border rounded-lg"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Rapor Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Toplam Masraf</h3>
              <p className="text-3xl font-bold text-purple-900">
                {report.totalExpenses.toLocaleString('tr-TR')} ₺
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Daire Başı Aidat</h3>
              <p className="text-3xl font-bold text-green-900">
                {report.perApartmentFee.toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-sm text-green-600 mt-1">
                {report.totalApartments} daire için hesaplandı
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Ödeme Oranı</h3>
              <p className="text-3xl font-bold text-blue-900">
                {report.totalApartments > 0 
                  ? `${Math.round((report.paidCount / report.totalApartments) * 100)}%`
                  : '0%'}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {report.paidCount} / {report.totalApartments} daire ödeme yaptı
              </p>
            </div>
          </div>

          {/* Kategori Bazlı Masraflar */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Kategori Bazlı Masraflar</h3>
            <div className="space-y-4">
              {Object.entries(report.expensesByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <span className="font-medium capitalize">{category}</span>
                  <span className="font-bold">{amount.toLocaleString('tr-TR')} ₺</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 