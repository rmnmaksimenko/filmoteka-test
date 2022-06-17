import FilmApiService from './filmApiService';
import { filmCardRender } from './renderCards';
import { initPagination, paginationProperties } from './pagePagination';
import { SHOW_TRANDING_FILMS } from './searchType';
import { NotiflixLoading, NotiflixLoadingRemove } from './loading';

import buttonColorChange from './changeButtonColor';

const filmApiService = new FilmApiService();

const filmsWrap = document.querySelector('.films-wrap');
const filmList = document.querySelector('.films-list');
const filmRait = document.querySelector('.film-info__rait');
const searchForm = document.getElementById('search-form');
const footer = document.querySelector('.footer');
footer.classList.add('is-hidden');

filmsWrap.addEventListener('DOMContentLoaded', showTranding);

export async function showTranding() {
  searchForm.reset();
  try {
    const resolve = await filmApiService.fetchTranding();
    const genres = await filmApiService.getGenreName();
    const filmArray = resolve.data.results;
    const genreArray = genres.data.genres;

    NotiflixLoading();
    //Add paginationProperties
    paginationProperties.pageName = SHOW_TRANDING_FILMS;
    paginationProperties.page = resolve.data.page;
    paginationProperties.totalPages = resolve.data.total_pages;

    setTimeout(() => {
      filmList.innerHTML = filmCardRender(filmArray, genreArray);
      initPagination(paginationProperties); //Add Pagination
      footer.classList.remove('is-hidden');
      NotiflixLoadingRemove();
      buttonColorChange.CallButtonColorChange();
    }, 500);
  } catch (error) {
    console.log(error);
  }
}
showTranding();
// ===<div class = 'film-info__rait'>${item.vote_average}</div>  -  Рейтинг всталять после года
