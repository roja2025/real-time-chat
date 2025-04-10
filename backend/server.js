const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3010 });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    console.log('Received:', message);

    // Broadcast message to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });

    // Bot auto-reply
    let replyText = null;
    if (message.text.toLowerCase() === 'hi') {
      replyText = 'Hello! 👋';
    } else if (message.text.toLowerCase().includes('how are you')) {
      replyText = "I'm good! 😊";
    } else if (message.text.toLowerCase().includes('bye')) {
      replyText = "Goodbye! 👋";
    } 

    if (replyText) {
      const botReply = {
        text: replyText,
        timestamp: new Date().toISOString()
      };
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(botReply));
        }
      });
    }
  });

  console.log('New client connected');
});

console.log('WebSocket server running on ws://localhost:3010');
