import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, MousePointerClick, Activity } from 'lucide-react';
import { apiClient } from '../api/client';
import { AnalyticsResponse } from '../interfaces';

export default function Dashboard() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiClient.get<AnalyticsResponse>(`/api/analytics/${shortCode}`);
        setData(response.data);
      } catch (err) {
        setError('No se pudieron cargar las analíticas o el enlace no existe.');
      } finally {
        setLoading(false);
      }
    };

    if (shortCode) fetchAnalytics();
  }, [shortCode]);

  if (loading) return <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center text-zinc-400 gap-2"><Activity className="animate-spin" /> Cargando métricas...</div>;
  if (error) return <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center text-red-400">{error}</div>;
  if (!data) return null;

  return (
    // Aquí está la clave del centrado: min-h para el alto dinámico y flex para centrar el bloque entero
    <div className="w-full max-w-4xl mx-auto min-h-[75vh] flex flex-col justify-center px-4">
      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} /> Volver al acortador
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex items-center gap-4 shadow-lg">
            <div className="p-4 bg-blue-500/10 rounded-xl text-blue-400">
              <MousePointerClick size={32} />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Clics Totales</p>
              <p className="text-4xl font-bold text-white">{data.total_clicks}</p>
            </div>
          </div>
          <div className="md:col-span-2 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-center shadow-lg">
            <p className="text-zinc-400 text-sm mb-1">Código de enlace</p>
            <p className="text-2xl font-mono text-emerald-400">/{data.short_code}</p>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
          <h3 className="text-xl font-semibold mb-6">Tráfico a lo largo del tiempo</h3>
          {data.timeline.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="date" stroke="#a1a1aa" tick={{fill: '#a1a1aa'}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#a1a1aa" tick={{fill: '#a1a1aa'}} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <Line type="monotone" dataKey="clicks" name="Clics" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#18181b', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-zinc-500">
              Aún no hay clics registrados para generar la gráfica.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}