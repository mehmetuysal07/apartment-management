"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faBuilding } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setError(''); // Hata mesajını temizle
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Giriş yapılırken bir hata oluştu');
      }

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Arkaplan efektleri */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md px-8 py-10 mx-4 relative z-10">
        {/* Logo ve Başlık */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/30">
            <FontAwesomeIcon icon={faBuilding} className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Apartman Yönetim Sistemi
          </h1>
          <p className="text-slate-400">
            Yönetim paneline hoş geldiniz
          </p>
        </div>

        {/* Giriş Formu */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
          <div className="space-y-6">
            {/* Kullanıcı Adı */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-blue-400" />
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Kullanıcı adınızı girin"
              />
            </div>

            {/* Şifre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <FontAwesomeIcon icon={faLock} className="text-blue-400" />
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Şifrenizi girin"
              />
            </div>

            {/* Giriş Butonu */}
            <button
              onClick={handleLogin}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              Giriş Yap
            </button>

            {/* Alt Bilgi */}
            <div className="text-center">
              <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                Şifrenizi mi unuttunuz?
              </a>
            </div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <p className="text-center text-slate-500 text-sm mt-8">
          © 2025 Apartman Yönetim Sistemi. Tüm hakları saklıdır.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
