"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApartmentContext } from "../context/apartmentContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBuilding,
  faSave, 
  faArrowLeft,
  faRuler,
  faLayerGroup,
  faHome,
  faUser,
  faPhone
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { toast } from "react-toastify";

export default function AddApartment() {
  const router = useRouter();
  const { addApartment } = useApartmentContext();

  const [apartment, setApartment] = useState({
    number: "",
    floor: "",
    size: "",
    status: "vacant",
    paid: false,
    residents: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApartment({
      ...apartment,
      [name]: value,
    });
  };

  const handleSaveApartment = async () => {
    try {
      if (!apartment.number || !apartment.floor || !apartment.size) {
        toast.error("Lütfen tüm zorunlu alanları doldurun!");
        return;
      }

      const formattedApartment = {
        ...apartment,
        size: parseInt(apartment.size),
        floor: apartment.floor,
        residents: []
      };

      await addApartment(formattedApartment);
      toast.success("Daire başarıyla eklendi!");
      router.push("/dashboard");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Daire eklenirken bir hata oluştu";
      toast.error(errorMessage);
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Yeni Daire Ekle</h1>
              <p className="text-blue-100">Apartmana yeni daire ekleyebilirsiniz</p>
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
            {/* Daire Numarası/Adı */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faHome} className="text-gray-400" />
                Daire Numarası/Adı
              </label>
              <input
                type="text"
                name="number"
                value={apartment.number}
                onChange={handleInputChange}
                placeholder="Örn: 1A veya Daire 5"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Kat Bilgisi */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faLayerGroup} className="text-gray-400" />
                Bulunduğu Kat
              </label>
              <input
                type="number"
                name="floor"
                value={apartment.floor}
                onChange={handleInputChange}
                placeholder="Örn: 2"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Daire Büyüklüğü */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faRuler} className="text-gray-400" />
                Daire Büyüklüğü (m²)
              </label>
              <input
                type="number"
                name="size"
                value={apartment.size}
                onChange={handleInputChange}
                placeholder="Örn: 120"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Daire Durumu */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-gray-400" />
                Daire Durumu
              </label>
              <select
                name="status"
                value={apartment.status}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="vacant">Boş</option>
                <option value="occupied">Dolu</option>
              </select>
            </div>

            {/* Bilgilendirme Kartı */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">Önemli Bilgi</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Daire bilgilerini ekledikten sonra, sakinlerin bilgilerini dashboard üzerinden güncelleyebilirsiniz.
                  </p>
                </div>
              </div>
            </div>

            {/* Kaydet Butonu */}
            <button
              onClick={handleSaveApartment}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <FontAwesomeIcon icon={faSave} />
              <span>Daireyi Kaydet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
