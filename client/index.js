import { fetchEarthquakes } from './lib/earthquakes';
import { el, element, formatDate } from './lib/utils';
import { init, createPopup, clearMarkers } from './lib/map';

async function moveEarthquakes(type, period, title1) {
  const ul = document.querySelector('.earthquakes');
  const loading = document.querySelector('.loading');
  const cache = document.querySelector('.cache');
  const earthquakes = await fetchEarthquakes(type, period);

  cache.textContent = '';
  ul.textContent = '';
  clearMarkers();

  const parent = loading.parentNode;

  // Fékk frá dæmatímakennara
  // const url = new URL(link.href);
  // const { searchParams } = url;

  // const period = searchParams.get('period');
  // const type = searchParams.get('type');

  // console.log(earthquakes);

  if (!earthquakes) {
    parent.appendChild(
      el('p', 'Villa við að sækja gögn'),
    );
  } else {
      if (!earthquakes.info.cache) {
      cache.appendChild(
        el('p', 'Gögnin eru ',
          el('b', 'ekki í cache.'),
          ' Fyrirspurn tók ',
          el('b', `${earthquakes.info.time} sek`)),
      );
    } else {
      cache.appendChild(
        el('p', 'Gögnin eru ',
          el('b', 'í cache.'),
          ' Fyrirspurn tók ',
          el('b', `${earthquakes.info.time} sek`)),
      );
    }
  }

  earthquakes.data.features.forEach((quake) => {
    const {
      title, mag, time, url,
    } = quake.properties;

    const link = element('a', { href: url, target: '_blank' }, null, 'Skoða nánar');

    const markerContent = el('div',
      el('h3', title),
      el('p', formatDate(time)),
      el('p', link));
    const marker = createPopup(quake.geometry, markerContent.outerHTML);

    const onClick = () => {
      marker.openPopup();
    };

    const li = el('li');

    li.appendChild(
      el('div',
        el('h2', title),
        el('dl',
          el('dt', 'Tími'),
          el('dd', formatDate(time)),
          el('dt', 'Styrkur'),
          el('dd', `${mag} á richter`),
          el('dt', 'Nánar'),
          el('dd', url.toString())),
        element('div', { class: 'buttons' }, null,
          element('button', null, { click: onClick }, 'Sjá á korti'),
          link)),
    );

    ul.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // TODO
  // Bæta við virkni til að sækja úr lista
  // Nota proxy
  // Hreinsa header og upplýsingar þegar ný gögn eru sótt
  // Sterkur leikur að refactora úr virkni fyrir event handler í sér fall

  // Fjarlægjum loading skilaboð eftir að við höfum sótt gögn

  const map = document.querySelector('.map');

  init(map);

  const links = document.querySelectorAll('ul.nav a');
  links.forEach((link) => {
    const url = new URL(link.href);
    const { searchParams } = url;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      moveEarthquakes(searchParams.get('type'), searchParams.get('period'), '');
    });
  });
});
