// ═══════════════════════════════════════════
// spotify.js — Spotify Web API integration
// PKCE OAuth flow — no client secret required
// ═══════════════════════════════════════════

const SPOTIFY_CLIENT_ID = '232ec36fd78e4b9580248d8f1e5b7294';
const SPOTIFY_REDIRECT_URI = 'https://thefretshed.com/callback';
const SPOTIFY_SCOPES = 'streaming user-read-email user-read-private';

const LS_TOKEN   = 'ngc-spotify-token';
const LS_EXPIRY  = 'ngc-spotify-expiry';
const LS_VERIFIER = 'ngc-spotify-verifier';
const LS_TRACK   = (title) => `ngc-spotify-track-${title.toLowerCase().replace(/\s+/g, '-')}`;

// ─── PKCE Helpers ───────────────────────────────────────────────────────────

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => chars[b % chars.length]).join('');
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// ─── Token Management ───────────────────────────────────────────────────────

function getToken() {
  const token  = localStorage.getItem(LS_TOKEN);
  const expiry = localStorage.getItem(LS_EXPIRY);
  if (!token || !expiry) return null;
  if (Date.now() > parseInt(expiry)) {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_EXPIRY);
    return null;
  }
  return token;
}

function saveToken(token, expiresIn) {
  localStorage.setItem(LS_TOKEN, token);
  localStorage.setItem(LS_EXPIRY, Date.now() + expiresIn * 1000);
}

function isSpotifyConnected() {
  return !!getToken();
}

// ─── OAuth Flow ─────────────────────────────────────────────────────────────

async function spotifyLogin() {
  const verifier = generateRandomString(64);
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem(LS_VERIFIER, verifier);

  const params = new URLSearchParams({
    client_id:             SPOTIFY_CLIENT_ID,
    response_type:         'code',
    redirect_uri:          SPOTIFY_REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge:        challenge,
    scope:                 SPOTIFY_SCOPES,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

async function handleSpotifyCallback() {
  const params = new URLSearchParams(window.location.search);
  const code   = params.get('code');
  if (!code) return;

  const verifier = localStorage.getItem(LS_VERIFIER);
  if (!verifier) return;

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     SPOTIFY_CLIENT_ID,
        grant_type:    'authorization_code',
        code,
        redirect_uri:  SPOTIFY_REDIRECT_URI,
        code_verifier: verifier,
      }),
    });

    const data = await response.json();
    if (data.access_token) {
      saveToken(data.access_token, data.expires_in);
      localStorage.removeItem(LS_VERIFIER);
    }
  } catch (err) {
    console.error('Spotify token exchange failed:', err);
  }

  // Clean the URL so the callback params don't persist
  window.history.replaceState({}, document.title, '/');
}

function spotifyLogout() {
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_EXPIRY);
  updateSpotifyButtonState();
}

// ─── Search & Embed ─────────────────────────────────────────────────────────

async function searchSpotifyTrack(title, artist) {
  const cached = localStorage.getItem(LS_TRACK(title));
  if (cached) return JSON.parse(cached);

  const token = getToken();
  if (!token) return null;

  try {
    const q = encodeURIComponent(`track:${title} artist:${artist}`);
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    const track = data.tracks?.items?.[0];
    if (!track) return null;

    const result = { id: track.id, name: track.name, artist: track.artists[0].name };
    localStorage.setItem(LS_TRACK(title), JSON.stringify(result));
    return result;
  } catch (err) {
    console.error('Spotify search failed:', err);
    return null;
  }
}

function getSpotifyEmbedUrl(trackId) {
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
}

// ─── UI: Song Card Player ───────────────────────────────────────────────────

async function initSpotifyPlayer(cardEl, title, artist) {
  // Only run if connected
  if (!isSpotifyConnected()) return;

  // Don't add a second player if already present
  if (cardEl.querySelector('.spotify-player')) return;

  const playerEl = document.createElement('div');
  playerEl.className = 'spotify-player';
  playerEl.innerHTML = `<div class="spotify-player-loading">Searching Spotify…</div>`;

  // Insert at bottom of song-card-body
  const body = cardEl.querySelector('.song-card-body');
  if (body) body.appendChild(playerEl);

  const track = await searchSpotifyTrack(title, artist);

  if (!track) {
    playerEl.innerHTML = `<div class="spotify-player-notfound">Not found on Spotify</div>`;
    return;
  }

  playerEl.innerHTML = `
    <div class="spotify-player-collapsed" onclick="event.stopPropagation(); toggleSpotifyEmbed(this)" title="Expand Spotify player">
      <svg class="spotify-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
      <span class="spotify-track-name">${track.name}</span>
      <span class="spotify-track-artist">${track.artist}</span>
      <span class="spotify-expand-hint">▶ Play</span>
    </div>
    <div class="spotify-embed-container" style="display:none;" onclick="event.stopPropagation()">
      <iframe
        src="${getSpotifyEmbedUrl(track.id)}"
        width="100%" height="80" frameborder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy">
      </iframe>
      <button class="spotify-collapse-btn" onclick="event.stopPropagation(); toggleSpotifyEmbed(this.previousElementSibling)">Collapse ▲</button>
    </div>
  `;
}

function toggleSpotifyEmbed(collapseEl) {
  const container = collapseEl.closest('.spotify-player');
  const collapsed  = container.querySelector('.spotify-player-collapsed');
  const embed      = container.querySelector('.spotify-embed-container');
  if (!collapsed || !embed) return;
  const isOpen = embed.style.display !== 'none';
  collapsed.style.display = isOpen ? '' : 'none';
  embed.style.display      = isOpen ? 'none' : '';
}

// ─── UI: Connect Button ──────────────────────────────────────────────────────

function updateSpotifyButtonState() {
  const btn = document.getElementById('spotify-connect-btn');
  if (!btn) return;
  if (isSpotifyConnected()) {
    btn.classList.add('connected');
    btn.onclick = spotifyLogout;
    const label = btn.querySelector('.spotify-btn-label');
    const sub   = btn.querySelector('.spotify-btn-sub');
    if (label) label.textContent = 'Spotify Connected';
    if (sub)   sub.textContent   = 'Click to disconnect';
  } else {
    btn.classList.remove('connected');
    btn.onclick = spotifyLogin;
    const label = btn.querySelector('.spotify-btn-label');
    const sub   = btn.querySelector('.spotify-btn-sub');
    if (label) label.textContent = 'Connect Spotify';
    if (sub)   sub.textContent   = 'Adds inline players to curriculum song cards';
  }
}

// ─── Init ────────────────────────────────────────────────────────────────────

async function initSpotify() {
  // Handle OAuth callback if we're returning from Spotify
  if (window.location.search.includes('code=')) {
    await handleSpotifyCallback();
  }
  updateSpotifyButtonState();
}

// Run on load
initSpotify();
