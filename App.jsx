import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [analyticsData, setAnalyticsData] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url_original: longUrl })
      });
      if (response.ok) {
        const data = await response.json();
        setShortUrl(data.codigo_corto);
      } else {
        alert('Error al acortar la URL');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al acortar la URL');
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:8000/analytics');
        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
        } else {
          alert('Error al cargar los datos de análisis');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los datos de análisis');
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Bienvenido a la aplicación
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Pega aquí la URL larga"
          />
          <button type="submit">Acortar</button>
        </form>
        {shortUrl && (
          <p>Enlace corto generado: <a href={`http://localhost:8000/${shortUrl}`}>{`http://localhost:8000/${shortUrl}`}</a></p>
        )}
      </header>

      <h2>Análisis de enlaces</h2>
      <table>
        <thead>
          <tr>
            <th>URL Original</th>
            <th>Código Corto</th>
            <th>Clics</th>
            <th>Paises</th>
          </tr>
        </thead>
        <tbody>
          {analyticsData.map((url) => (
            <tr key={url.codigo_corto}>
              <td>{url.url_original}</td>
              <td>{url.codigo_corto}</td>
              <td>{url.clics}</td>
              <td>{url.paises.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
