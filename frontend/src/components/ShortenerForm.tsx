import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { URLResponse } from '../interfaces';
import { Link2, Copy, BarChart2, Clock, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ShortenerForm() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<URLResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Nuevo estado para el historial
  const [history, setHistory] = useState<URLResponse[]>([]);

  // Efecto para cargar el historial al iniciar la aplicación
  useEffect(() => {
    const savedHistory = localStorage.getItem('shortener_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error leyendo el historial");
      }
    }
  }, []);

  // Función para guardar un nuevo enlace en el historial
  const saveToHistory = (newItem: URLResponse) => {
    // Evitar duplicados si acorta el mismo enlace dos veces
    const filteredHistory = history.filter(item => item.short_code !== newItem.short_code);
    // Guardamos el nuevo al principio y mantenemos un máximo de 5 elementos
    const newHistory = [newItem, ...filteredHistory].slice(0, 5);
    
    setHistory(newHistory);
    localStorage.setItem('shortener_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('shortener_history');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await apiClient.post<URLResponse>('/api/shorten', { original_url: url });
      setResult(response.data);
      saveToHistory(response.data); // Guardamos en memoria
      setUrl('');
    } catch (err) {
      setError('Error al acortar la URL. Asegúrate de que tenga un formato válido (ej. https://...).');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (shortUrl: string, code: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Caja Principal del Formulario */}
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Acorta tus enlaces
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link2 className="h-5 w-5 text-zinc-500" />
            </div>
            <input
              type="url"
              required
              placeholder="https://tu-enlace-super-largo.com"
              className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-zinc-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {loading ? 'Procesando...' : 'Acortar'}
          </button>
        </form>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {result && (
          <div className="bg-zinc-950 p-6 rounded-lg border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-4">
            <p className="text-zinc-400 text-sm mb-1">Tu enlace está listo:</p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <a href={result.short_url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 text-xl font-medium truncate max-w-full hover:underline">
                {result.short_url}
              </a>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => handleCopy(result.short_url, result.short_code)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors">
                  <Copy size={18} /> {copiedCode === result.short_code ? 'Copiado!' : 'Copiar'}
                </button>
                <Link to={`/analytics/${result.short_code}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors text-white">
                  <BarChart2 size={18} /> Analíticas
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sección del Historial */}
      {history.length > 0 && (
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-zinc-300">
              <Clock size={20} className="text-blue-400" /> Enlaces recientes
            </h3>
            <button 
              onClick={clearHistory}
              className="text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1 text-sm"
            >
              <Trash2 size={16} /> Limpiar
            </button>
          </div>
          
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.short_code} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50 hover:border-zinc-700 transition-colors gap-4">
                <div className="overflow-hidden w-full sm:w-1/2">
                  <a href={item.short_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-medium hover:underline block truncate">
                    {item.short_url}
                  </a>
                  <p className="text-xs text-zinc-500 truncate mt-1" title={item.original_url}>
                    {item.original_url}
                  </p>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                  <button 
                    onClick={() => handleCopy(item.short_url, item.short_code)} 
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-colors"
                    title="Copiar enlace"
                  >
                    <Copy size={16} />
                  </button>
                  <Link 
                    to={`/analytics/${item.short_code}`} 
                    className="p-2 bg-zinc-800 hover:bg-indigo-600 hover:text-white text-zinc-300 rounded-md transition-colors flex items-center gap-2 text-sm"
                  >
                    <BarChart2 size={16} /> <span className="sm:hidden">Ver datos</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}