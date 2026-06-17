import React, { useState } from 'react';
import './App.css';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

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
    </div>
  );
}

export default App;
