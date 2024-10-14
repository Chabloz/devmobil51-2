const ws = new WebSocket('ws://localhost:8887');

ws.onopen = () => {
  console.log('Connected');
  ws.send(JSON.stringify({
    type: 'message',
    data: 'Hello'
  }));
}

