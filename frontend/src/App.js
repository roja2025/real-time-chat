import { useEffect, useState, useRef } from 'react';
import './App.css';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3010');

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== '') {
      const message = {
        text: input,
        timestamp: new Date().toISOString()
      };
      ws.current.send(JSON.stringify(message));
      setInput('');
    }
  };

  return (
    <div style={{ background: 'linear-gradient(to right,#1e3c72,#fcb69f)', minHeight: '100vh', padding: '2rem' }}>
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '20px',
        boxShadow: '0 8px 24px rgba(11, 46, 245, 0.7)',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ color: 'black', fontSize: '24px', fontWeight: 'bold', marginBottom: '1rem',fontFamily: 'lo'}}>Real-Time Chat</h2>

        <div style={{
          height: '300px',
          overflowY: 'auto',
          border: '0.5px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: 'rgba(224, 220, 217, 0.5)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 24px rgba(240, 61, 145, 0.7)',
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {new Date(msg.timestamp).toLocaleTimeString()}:
              </span>
              <span style={{ marginLeft: '8px', color: '#111827' }}>{msg.text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '14px'
            }}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message"
          />
          <button
            onClick={sendMessage}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
