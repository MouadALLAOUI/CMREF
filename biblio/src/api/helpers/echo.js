import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export const echo = new Echo({
  broadcaster: 'reverb',
  key: process.env.REACT_APP_REVERB_APP_KEY,
  wsHost: process.env.REACT_APP_REVERB_HOST,
  wsPort: process.env.REACT_APP_REVERB_PORT ?? 80,
  wssPort: process.env.REACT_APP_REVERB_PORT ?? 443,
  forceTLS: (process.env.REACT_APP_REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
});