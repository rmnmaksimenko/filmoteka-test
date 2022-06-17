import * as basicLightbox from 'basiclightbox';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import FilmApiService from './filmApiService';
import { textModalBtn, addBtnListenet } from './modalBtn';
import posterNotFound from '../images/desktop/poster-not-found-desktop.png';
import posterNotFound2x from '../images/desktop/poster-not-found-desktop@2x.png';

const filmApiService = new FilmApiService();

const movieItemRef = document.querySelector('.films-list');
movieItemRef.addEventListener('click', onMovieItemClick);

const scrollableElement = document.querySelector('.modal');

async function onMovieItemClick(evt) {
  evt.preventDefault();

  const isMovieItemEl =
    evt.target.classList.contains('films-list__poster') ||
    evt.target.closest('.film-info');
  if (!isMovieItemEl) {
    return;
  }

  const currentMovie = evt.target.closest('.films-list__card');
  filmApiService.queryID = currentMovie.dataset.id;

  try {
    const { data } = await filmApiService.fetchMovieID();
    console.log(data);
    disablePageScroll(scrollableElement);

    getGenreModalMovie(data.genres);
    createMovieItemClick(data);

    addBtnListenet(filmApiService.queryID);
    textModalBtn(filmApiService.queryID);

    document
      .querySelector('[data-modal-close]')
      .addEventListener('click', onCloseModalBtn);
    window.addEventListener('keydown', onCloseModalEscape);
  } catch (error) {
    console.log(error.message);
  }
}
export function getGenreModalMovie(genreArr) {
  const genresNames = genreArr.map(genre => genre.name);

  if (genresNames.length > 2) {
    return genresNames.slice(0, 2).join(', ').concat([', Other']);
  }
  return genresNames.join(', ') || 'No Genre';
}

let modalMovie;
function createMovieItemClick({
  poster_path,
  title,
  vote_average,
  vote_count,
  popularity,
  original_title,
  genres,
  overview,
  name,
  original_name,
}) {
  let src = `https://image.tmdb.org/t/p/w500${poster_path}`;
  let src2x = `https://image.tmdb.org/t/p/w780${poster_path}`;
  let src3x = `https://image.tmdb.org/t/p/w1280${poster_path}`;

  if (!poster_path) {
    src = posterNotFound;
    src2x = posterNotFound2x;
    src3x = posterNotFound2x;
  }

  modalMovie = basicLightbox.create(
    `<div class="modal">
  <div class="modal__wrapper">
    <button type="button" class="modal__circle-btn" data-modal-close>
      <svg
        class="modal__circle-svg"
        width="30"
        height="30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m7.975 8-.699.701 3.149 3.149 3.15 3.15-3.138 3.138L7.3 21.275l.712.713.713.712 3.137-3.137L15 16.425l3.138 3.138 3.137 3.137.713-.712.712-.713-3.137-3.137L16.425 15l3.15-3.15 3.15-3.15-.713-.712-.712-.713-3.15 3.15-3.15 3.15-3.138-3.138C10.137 8.712 8.713 7.3 8.699 7.3c-.014 0-.34.315-.724.7"
          fill-rule="evenodd"
        />
      </svg>
    </button>
    <div class="modal-item poster">
      <div class="poster__wrapp">
        <img
          class="poster__movie"
          data-src="${poster_path}"
          src="${src}"
          alt="${title || name}"
          srcset="
            ${src} 1x,
            ${src2x} 2x,
            ${src3x} 3x
          "
        /> 
      </div>
    </div>
    <div class="modal-item">
      <div class="movie-desc">
        <h1 class="movie-desc__item movie-title">${title || name}</h1>
        <div class="movie-desc__item movie-info">
          <div class="movie-info__item movie__vote">
            <p class="movie-info__param">Vote / Votes</p>
            <p class="movie-info__value">
              <span class="movie-info__value--vote-left">${vote_average}</span>
              /
              <span class="movie-info__value--vote-right">${vote_count}</span>
            </p>
          </div>
          <div class="movie-info__item">
            <p class="movie-info__param">Popularity</p>
            <p class="movie-info__value">${popularity.toFixed(1)}</p>
          </div>
          <div class="movie-info__item">
            <p class="movie-info__param">Original Title</p>
            <p class="movie-info__value movie-info__value--text-title">
              ${original_title || original_name}
            </p>
          </div>
          <div class="movie-info__item">
            <p class="movie-info__param">Genre</p>
            <p class="movie-info__value movie-info__value--text-genre">
            ${getGenreModalMovie(genres)}</p>
          </div>
        </div>
        <div class="movie-desc__item movie-overview">
          <p class="movie-overview__title">About</p>
          <p class="movie-overview__text">${overview}</p>
        </div>
      </div>
      <ul class="feature-button">
        <li class="feature-button__item">
          <button class="feature-button__watched" type="button">
            add to Watched
          </button>
        </li>
        <li class="feature-button__item">
          <button class="feature-button__queue" type="button">
            add to queue
          </button>
        </li>
      </ul>
    </div>
  </div>
</div>
`,
    {
      onClose: () => {
        window.removeEventListener('keydown', onCloseModalEscape),
          enablePageScroll(scrollableElement);
      },
    }
  );
  modalMovie.show();
}

function onCloseModalBtn() {
  modalMovie.close();
  enablePageScroll(scrollableElement);
}

function onCloseModalEscape(evt) {
  if (evt.code === 'Escape') {
    modalMovie.close();
    enablePageScroll(scrollableElement);
  }
}
