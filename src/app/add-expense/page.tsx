"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useExpenseContext } from "../context/expenseContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMoneyBill, 
  faSave, 
  faCalendarAlt,
  faClipboard,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { toast } from "react-toastify";

export default function AddExpense() {
  const { addExpense } = useExpenseContext();
  const router = useRouter();
  
  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    date: new Date().toISOString().split('T')[0], // Bugünün tarihini varsayılan olarak ayarla
    description: "", // Açıklama alanı ekledik
    category: "genel" // Kategori alanı ekledik
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpense({
      ...expense,
      [name]: value,
    });
  };

  const handleSaveExpense = () => {
    if (!expense.name || !expense.amount || !expense.date) {
      toast.error("Lütfen tüm zorunlu alanları doldurun!");
      return;
    }

    addExpense({
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
      amount: Number(expense.amount)
    });

    toast.success("Masraf başarıyla eklendi!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Yeni Masraf Ekle</h1>
              <p className="text-green-100">Apartman masraflarını buradan ekleyebilirsiniz</p>
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
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <div className="grid grid-cols-1 gap-6">
            {/* Masraf Adı */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faClipboard} className="text-gray-400" />
                Masraf Adı
              </label>
              <input
                type="text"
                name="name"
                value={expense.name}
                onChange={handleInputChange}
                placeholder="Örn: Elektrik Faturası"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Masraf Tutarı */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faMoneyBill} className="text-gray-400" />
                Tutar (₺)
              </label>
              <input
                type="number"
                name="amount"
                value={expense.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Masraf Tarihi */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                Tarih
              </label>
              <input
                type="date"
                name="date"
                value={expense.date}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Kategori Seçimi */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Kategori</label>
              <select
                name="category"
                value={expense.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="genel">Genel Giderler</option>
                <option value="elektrik">Elektrik</option>
                <option value="su">Su</option>
                <option value="dogalgaz">Doğalgaz</option>
                <option value="temizlik">Temizlik</option>
                <option value="bakim">Bakım Onarım</option>
                <option value="diger">Diğer</option>
              </select>
            </div>

            {/* Açıklama */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Açıklama (Opsiyonel)</label>
              <textarea
                name="description"
                value={expense.description}
                onChange={handleInputChange}
                placeholder="Masraf hakkında ek bilgiler..."
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Kaydet Butonu */}
            <button
              onClick={handleSaveExpense}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
            >
              <FontAwesomeIcon icon={faSave} />
              <span>Masrafı Kaydet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
