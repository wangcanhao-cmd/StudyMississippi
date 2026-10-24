const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
document.querySelectorAll('[data-pending-submit]').forEach(button => {
  button.addEventListener('click', () => {
    alert('This form was migrated from the legacy site, but a new submission endpoint has not been configured yet.');
  });
});

/* Official Study Mississippi logo placement */
document.querySelectorAll('.site-header .brand img').forEach(img => {
  img.src = 'assets/study-mississippi-horizontal-exact.svg';
  img.alt = 'Study Mississippi';
});
document.querySelectorAll('.site-footer .footer-brand img').forEach(img => {
  img.src = 'assets/study-mississippi-vertical-exact.svg';
  img.alt = 'Study Mississippi / Mississippi Association of International Educators';
});

/* Header search normalization */
(function () {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  let form = nav.querySelector('.header-search');
  const searchLink = Array.from(nav.querySelectorAll('a')).find(a => {
    const href = a.getAttribute('href') || '';
    return href === 'search.html' || href.endsWith('/search.html');
  });

  if (!form) {
    form = document.createElement('form');
    form.className = 'header-search';
    form.action = 'search.html';
    form.method = 'get';
    form.setAttribute('role', 'search');
    form.innerHTML = '<label class="sr-only" for="global-site-search">Search</label>' +
      '<input id="global-site-search" name="q" type="search" placeholder="Search" autocomplete="off">' +
      '<button type="submit" aria-label="Search">⌕</button>';

    if (searchLink) {
      searchLink.replaceWith(form);
    } else {
      nav.appendChild(form);
    }
  } else if (searchLink) {
    searchLink.remove();
  }

  const input = form.querySelector('input[name="q"]');
  if (input && /search\.html$/.test(window.location.pathname)) {
    input.value = new URLSearchParams(window.location.search).get('q') || '';
  }
})();



/* Header section dropdowns */
(() => {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  const normalize = value => (value || '').trim().replace(/\s+/g, ' ');
  const findByText = (selector, text) =>
    Array.from(document.querySelectorAll(selector)).find(el => normalize(el.textContent) === text);

  const setClosestId = (selector, text, closestSelector, id) => {
    const el = findByText(selector, text);
    const target = el && (closestSelector ? el.closest(closestSelector) : el);
    if (target && !document.getElementById(id)) target.id = id;
  };

  // Stable in-page anchors for the formal website structure.

  setClosestId('.section-kicker', 'Institution Profiles', 'article', 'institution-profiles');
  setClosestId('.section-kicker', 'International Office Contacts', 'article', 'international-office-contacts');
  const firstMemberGrid = document.querySelector('.member-grid');
  if (firstMemberGrid && !document.getElementById('external-links')) firstMemberGrid.id = 'external-links';

  // These four already have IDs in the page source, but keep the mapping explicit.
  const directory = document.querySelector('#directory');
  if (directory) directory.id = 'directory';

  setClosestId('.section-kicker', 'Collaboration Records', '.page-section', 'collaboration-records');
  setClosestId('h2', 'Partners', '.page-section', 'partnerships');

  setClosestId('h2', 'MAIE Executive Board', '.page-section', 'executive-board');
  setClosestId('h2', 'News & Events', '.page-section', 'news-events');

  const menus = {
    'about.html': [
      ['Mission', 'mission'],
      ['MAIE Executive Board', 'executive-board'],
      ['Former Officers', 'former-officers']
    ],
    'member-institutions.html': [
      ['Institution Profiles', 'institution-profiles'],
      ['International Office Contacts', 'international-office-contacts'],
      ['External Links', 'external-links']
    ],
    'study-in-mississippi.html': [
      ['Mississippi Institutions Directory', 'directory'],
      ['Open Doors data', 'open-doors'],
      ['MS Promo Video', 'ms-promo-video'],
      ['Connect with us', 'connect-with-us'],
      ['Why study in MS?', 'why-study-ms'],
      ['Study in the States', 'study-in-the-states'],
      ['Opportunities', 'opportunities']
    ],
    'outreach-partnerships.html': [
      ['Collaboration Records', 'collaboration-records'],
      ['Partnerships', 'partnerships']
    ],
    'news.html': [
      ['State Meetings', 'state-meetings'],
      ['News & Events', 'news-events']
    ]
  };

  Object.entries(menus).forEach(([page, items]) => {
    const parent = Array.from(nav.children).find(el => {
      if (el.tagName !== 'A') return false;
      const href = (el.getAttribute('href') || '').split('#')[0];
      return href === page;
    });
    if (!parent || parent.closest('.nav-item')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'nav-item has-dropdown';
    parent.before(wrapper);
    wrapper.appendChild(parent);
    parent.classList.add('nav-parent');
    parent.setAttribute('aria-haspopup', 'true');

    const chevron = document.createElement('span');
    chevron.className = 'nav-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '▾';
    parent.appendChild(chevron);

    const dropdown = document.createElement('div');
    dropdown.className = 'nav-dropdown';
    dropdown.setAttribute('aria-label', parent.textContent.trim() + ' sections');

    items.forEach(([label, id]) => {
      const link = document.createElement('a');
      link.href = page + '#' + id;
      link.textContent = label;
      dropdown.appendChild(link);
    });

    wrapper.appendChild(dropdown);
  });

  // Close the mobile menu when any parent or submenu link is chosen.
  nav.addEventListener('click', event => {
    if (!event.target.closest('a')) return;
    nav.classList.remove('open');
    const toggle = document.querySelector('.menu-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  });

  // IDs above are created at runtime, so resolve an incoming hash after they exist.
  if (window.location.hash) {
    const id = decodeURIComponent(window.location.hash.slice(1));
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({block: 'start'});
    });
  }
})();

/* Global stylesheet cache version */
(() => {
  const version = "20261024-contact-chevron-space";
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    const href = link.getAttribute("href") || "";
    if (/^styles\.css(?:\?|$)/.test(href)) {
      const next = "styles.css?v=" + version;
      if (href !== next) link.setAttribute("href", next);
    }
  });
})();
