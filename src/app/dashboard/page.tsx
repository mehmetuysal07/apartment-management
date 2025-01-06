"use client";
import { useApartmentContext } from "../context/apartmentContext";
import { useExpenseContext } from "../context/expenseContext";
import Link from "next/link";
import { 
  faHouse, 
  faTrash, 
  faMoneyBill, 
  faChartLine, 
  faPlus,
  faBuilding,
  faCalendarAlt,
  faCheckCircle,
  faTimesCircle,
  faUser,
  faSignOutAlt,
  faChartBar,
  faWallet,
  faHome
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

export default function Dashboard() {
  const { apartments, markAsPaid } = useApartmentContext();
  const { expenses, deleteExpense } = useExpenseContext();
  const [username, setUsername] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Mevcut ay ve yıl bilgisini al
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');
  }, []);

  useEffect(() => {
    // localStorage'dan user bilgisini al
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Sadece mevcut aya ait masrafları hesapla
  const calculateCurrentMonthExpenses = () => {
    return expenses.reduce((total, expense) => {
      if (expense.month === currentMonth && expense.year === currentYear) {
        return total + (Number(expense.amount) || 0);
      }
      return total;
    }, 0);
  };

  // Mevcut ay için daire başına düşen aidat
  const calculateCurrentMonthApartmentExpense = () => {
    const totalExpense = calculateCurrentMonthExpenses();
    return apartments.length > 0 ? totalExpense / apartments.length : 0;
  };

  const currentMonthExpenses = calculateCurrentMonthExpenses();
  const apartmentExpense = calculateCurrentMonthApartmentExpense();

  // Mevcut ay için masrafları filtrele
  const filteredExpenses = expenses.filter(expense => 
    expense.month === currentMonth && expense.year === currentYear
  );

  // Ay adını al
  const getMonthName = (month: number) => {
    const months = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    return months[month - 1];
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      localStorage.removeItem('user');
      router.push('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Üst Banner - Daha şık bir görünüm */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-white">AYS</h1>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-indigo-100 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
                <Link href="/reports" className="text-indigo-100 hover:text-white transition-colors">
                  Raporlar
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                <FontAwesomeIcon icon={faUser} className="text-indigo-100" />
                <span className="text-white">{user?.username || 'Kullanıcı'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-indigo-100 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Üst Bilgi Kartı */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {getMonthName(currentMonth)} {currentYear} Özeti
              </h2>
              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} />
                  <span>{apartments.length} Daire</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMoneyBill} />
                  <span>{apartmentExpense.toLocaleString('tr-TR')} ₺ / Daire</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/add-apartment">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all text-sm">
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Daire Ekle</span>
                </button>
              </Link>
              <Link href="/add-expense">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm">
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Masraf Ekle</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* İstatistik Kartları - Yeni renkler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Toplam Masraf Kartı */}
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 shadow-sm text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <FontAwesomeIcon icon={faWallet} className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-violet-100 mb-1">Toplam Masraf</p>
                <h3 className="text-2xl font-semibold">
                  {currentMonthExpenses.toLocaleString('tr-TR')} ₺
                </h3>
              </div>
            </div>
          </div>

          {/* Ödeme Oranı Kartı */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-sm text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <FontAwesomeIcon icon={faChartLine} className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-emerald-100 mb-1">Ödeme Oranı</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-semibold">
                    {apartments.length > 0 
                      ? `${Math.round((apartments.filter(apt => apt.paid).length / apartments.length) * 100)}%`
                      : '0%'}
                  </h3>
                  <span className="text-sm text-emerald-100">
                    ({apartments.filter(apt => apt.paid).length}/{apartments.length})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Aidat Kartı */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-sm text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <FontAwesomeIcon icon={faMoneyBill} className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-blue-100 mb-1">Aidat (Daire Başına)</p>
                <h3 className="text-2xl font-semibold">
                  {apartmentExpense.toLocaleString('tr-TR')} ₺
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Ana Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daireler Listesi */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Daireler</h2>
              </div>
              
              <div className="p-6">
                {apartments && apartments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {apartments.map((apartment, index) => (
                      <div 
                        key={index} 
                        className="bg-slate-50 rounded-xl p-5 hover:shadow-md hover:bg-white transition-all border border-slate-100"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">
                              {apartment.number}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                              <span>{apartment.size} m²</span>
                              <span>•</span>
                              <span>Kat {apartment.floor}</span>
                            </div>
                          </div>
                          <div className={`p-1.5 rounded-full ${apartment.paid ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <FontAwesomeIcon 
                              icon={apartment.paid ? faCheckCircle : faTimesCircle} 
                              className={`text-base ${apartment.paid ? 'text-green-600' : 'text-gray-400'}`} 
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-white p-3 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">Aylık Aidat</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {apartmentExpense.toLocaleString('tr-TR')} ₺
                            </p>
                          </div>
                          <button
                            onClick={async () => {
                              try {
                                await markAsPaid(apartment.id);
                              } catch (error) {
                                toast.error(error instanceof Error ? error.message : "Ödeme durumu güncellenirken bir hata oluştu");
                              }
                            }}
                            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all 
                              ${apartment.paid 
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700'
                              }`}
                          >
                            {apartment.paid ? "Ödendi ✓" : "Ödeme Yap"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FontAwesomeIcon icon={faHome} className="text-gray-300 text-4xl mb-4" />
                    <p className="text-gray-500 mb-4">Henüz daire eklenmedi</p>
                    <Link href="/add-apartment">
                      <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all text-sm">
                        İlk Daireyi Ekle
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Son Masraflar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {getMonthName(currentMonth)} Masrafları
                  </h2>
                  <Link href="/add-expense">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all text-sm">
                      <FontAwesomeIcon icon={faPlus} className="text-xs" />
                      <span>Ekle</span>
                    </button>
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {filteredExpenses.length > 0 ? (
                  <div className="space-y-3">
                    {filteredExpenses.map((expense, index) => (
                      <div
                        key={expense.id || index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:shadow-sm transition-all border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-50 rounded-lg">
                            <FontAwesomeIcon icon={faMoneyBill} className="text-green-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{expense.name}</p>
                            <p className="text-sm font-semibold text-gray-700">
                              {expense.amount.toLocaleString('tr-TR')} ₺
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              await deleteExpense(expense.id);
                              toast.success('Masraf başarıyla silindi');
                            } catch (error) {
                              toast.error(error instanceof Error ? error.message : "Masraf silinirken bir hata oluştu");
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FontAwesomeIcon icon={faMoneyBill} className="text-gray-300 text-4xl mb-4" />
                    <p className="text-gray-500 mb-4">Bu ay için henüz masraf eklenmedi</p>
                    <Link href="/add-expense">
                      <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm">
                        Masraf Ekle
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
