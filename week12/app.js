// ============================================
// MovieList — app.js  |  Jarell Dorsey
// ============================================

const API_KEY = 'ddda70f227a2961fe7345eac060747bd'; // <-- paste your key here
const BASE    = 'https://api.themoviedb.org/3';
const IMG     = 'https://image.tmdb.org/t/p/w500';

// ---------- STORAGE HELPERS ----------
function getWatchlist() {
  return JSON.parse(localStorage.getItem('watchlist') || '[]');
}
function saveWatchlist(list) {
  localStorage.setItem('watchlist', JSON.stringify(list));
}
function addToWatchlist(movie) {
  const list = getWatchlist();
  if (!list.find(m => m.id === movie.id)) {
    list.push({ ...movie, watched: false });
    saveWatchlist(list);
    alert(`"${movie.title}" added to your watchlist!`);
  } else {
    alert(`"${movie.title}" is already in your watchlist.`);
  }
}

// ============================================
// HOME PAGE (index.html)
// ============================================
if (document.querySelector('.search-btn')) {

  const input  = document.querySelector('.search-input');
  const btn    = document.querySelector('.search-btn');
  const grid   = document.querySelector('.results-grid');
  const label  = document.querySelector('.section-label');

  async function search() {
    const q = input.value.trim();
    if (!q) return;
    label.textContent = `Results for "${q}"`;
    grid.innerHTML = '<p style="color:var(--text-muted);padding:2rem">Searching...</p>';

    const res  = await fetch(`${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(q)}`);
    const data = await res.json();
    renderGrid(data.results || []);
  }

  function renderGrid(movies) {
    if (!movies.length) {
      grid.innerHTML = '<p style="color:var(--text-muted);padding:2rem">No results found.</p>';
      return;
    }
    grid.innerHTML = movies.slice(0, 12).map(m => `
      <div class="movie-card">
        <div class="movie-poster" style="background:#14141f;">
          ${m.poster_path
            ? `<img src="${IMG}${m.poster_path}" alt="${m.title}" style="width:100%;height:100%;object-fit:cover;">`
            : `<div class="poster-overlay"><span class="poster-icon">🎬</span></div>`}
          <div class="movie-rating-badge ${m.vote_average >= 8.5 ? 'rating-gold' : ''}">${m.vote_average?.toFixed(1) || 'N/A'}</div>
        </div>
        <div class="movie-info">
          <h3 class="movie-title">${m.title}</h3>
          <p class="movie-meta">${m.release_date?.slice(0,4) || ''}</p>
          <a href="detail.html?id=${m.id}" class="movie-detail-link">View details →</a>
          <button class="add-btn" data-id="${m.id}">+ Add to Watchlist</button>
        </div>
      </div>
    `).join('');

    // Wire up add buttons
    grid.querySelectorAll('.add-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => addToWatchlist(movies[i]));
    });
  }

  btn.addEventListener('click', search);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
}

// ============================================
// WATCHLIST PAGE (watchlist.html)
// ============================================
if (document.querySelector('.watchlist-table')) {

  function renderWatchlist() {
    const list  = getWatchlist();
    const table = document.querySelector('.watchlist-table');
    const sub   = document.querySelector('.page-sub');
    const watched = list.filter(m => m.watched).length;

    // Update subtitle
    if (sub) sub.textContent = `${list.length} movies saved · ${watched} watched · ${list.length - watched} to go`;

    // Update stats bar
    document.querySelectorAll('.stat-num').forEach((el, i) => {
      if (i === 0) el.textContent = list.length;
      if (i === 1) el.textContent = watched;
      if (i === 2) el.textContent = list.length - watched;
      if (i === 3) {
        const avg = list.length ? (list.reduce((s, m) => s + (m.vote_average || 0), 0) / list.length).toFixed(1) : '—';
        el.textContent = avg;
      }
    });

    // Rebuild table rows (keep header)
    const header = table.querySelector('.table-header');
    table.innerHTML = '';
    table.appendChild(header);

    if (!list.length) {
      table.innerHTML += '<p style="padding:2rem;color:var(--text-muted)">Your watchlist is empty. <a href="index.html" style="color:var(--accent2)">Search for movies →</a></p>';
      return;
    }

    list.forEach((m, idx) => {
      const row = document.createElement('div');
      row.className = `table-row${m.watched ? ' watched' : ''}`;
      row.innerHTML = `
        <div class="col-poster">
          <div class="row-poster" style="background:#14141f;overflow:hidden;">
            ${m.poster_path ? `<img src="${IMG}${m.poster_path}" style="width:100%;height:100%;object-fit:cover;">` : '🎬'}
          </div>
        </div>
        <div class="col-title">
          <a href="detail.html?id=${m.id}" class="row-title">${m.title}</a>
          <span class="row-genre">${m.release_date?.slice(0,4) || ''}</span>
        </div>
        <div class="col-year">${m.release_date?.slice(0,4) || ''}</div>
        <div class="col-rating">
          <span class="rating-pill ${m.vote_average >= 8.5 ? 'rating-gold' : ''}">★ ${m.vote_average?.toFixed(1) || 'N/A'}</span>
        </div>
        <div class="col-status">
          <span class="status-badge ${m.watched ? 'status-watched' : 'status-unwatched'}">${m.watched ? 'Watched' : 'Unwatched'}</span>
        </div>
        <div class="col-actions">
          <button class="action-btn toggle-btn">⟳ Toggle</button>
          <button class="action-btn remove-btn">✕ Remove</button>
        </div>
      `;
      row.querySelector('.toggle-btn').addEventListener('click', () => {
        const list2 = getWatchlist();
        list2[idx].watched = !list2[idx].watched;
        saveWatchlist(list2);
        renderWatchlist();
      });
      row.querySelector('.remove-btn').addEventListener('click', () => {
        const list2 = getWatchlist().filter((_, i) => i !== idx);
        saveWatchlist(list2);
        renderWatchlist();
      });
      table.appendChild(row);
    });
  }

  renderWatchlist();
}

// ============================================
// DETAIL PAGE (detail.html)
// ============================================
if (document.querySelector('.detail-panel')) {

  const id = new URLSearchParams(window.location.search).get('id');

  if (id) {
    fetch(`${BASE}/movie/${id}?api_key=${API_KEY}`)
      .then(r => r.json())
      .then(m => {
        // Fill in all the fields
        document.title = `MovieList — ${m.title}`;
        document.querySelector('.detail-title').textContent = m.title;
        document.querySelector('.detail-overview').textContent = m.overview;
        document.querySelector('.big-rating-num').textContent = m.vote_average?.toFixed(1);
        document.querySelector('.detail-year').textContent = m.release_date?.slice(0,4);
        document.querySelector('.detail-runtime').textContent = `${m.runtime} min`;
        document.querySelector('.detail-director').textContent = m.production_companies?.[0]?.name || '';

        // Genres
        document.querySelector('.detail-genres').innerHTML = m.genres.map(g =>
          `<span class="genre-tag">${g.name}</span>`).join('');

        // Poster
        if (m.poster_path) {
          document.querySelector('.detail-poster').innerHTML =
            `<img src="${IMG}${m.poster_path}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-lg);">`;
        }

        // Banner bg text
        const bgText = document.querySelector('.detail-banner .hero-bg-text');
        if (bgText) bgText.textContent = m.title.split(' ')[0].toUpperCase();

        // Add to watchlist button
        document.querySelector('.add-btn-large').addEventListener('click', () => addToWatchlist(m));
      });
  }
}