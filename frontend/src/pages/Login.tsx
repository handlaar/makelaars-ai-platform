import { API_URL } from '../config';
import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const data = isRegister ? { email, password, name } : { email, password };
      
      const response = await axios.post(`${API_URL}${endpoint}`, data);
      onLogin(response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Er ging iets mis');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">
          {isRegister ? 'Registreren' : 'Inloggen'}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Naam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isRegister ? 'Registreren' : 'Inloggen'}
          </button>
        </form>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="w-full text-blue-600 hover:underline"
        >
          {isRegister ? 'Al een account? Inloggen' : 'Nog geen account? Registreren'}
        </button>
      </div>
    </div>
  );
}
