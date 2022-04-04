'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

//tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

//event delegation
//1.) Add event listener to common parent element
//2.) determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //console.log(e.target); //e.target
  //picked parent element that had all the elements we are interested in and
  //assigned one event handler vs giving each element an event handler
  //Matching strat
  if (e.target.classList.contains('nav__link')) {
    //e.preventDefault();
    const id = e.target.getAttribute('href'); //this references the current element being click on
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
}); //WE USE THIS TO DETERMIN where the click even came from'

//tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')));

tabsContainer.addEventListener('click', function (e) {
  //const clicked = e.target; //span not button clicked
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return; //basically click outside and no parent operartions tab
  //remove content
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  //console.log(clicked.dataset.tab);
  //activate content area
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//menu fade animation

const handleHover = function (e) {
  //console.log(this, e.currentTarget);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el != link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//sticky navigation
//const initialCoords = section1.getBoundingClientRect();

//entries are an array of the threshold entries
//can have multiple thresholds in an array
//its all about the viewport

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
//getbounding gives of the size of the element and its position to the viewport
//console.log(navHeight);

const stickyNav = function (entries) {
  //callback function when the threshold is made
  const [entry] = entries;
  //console.log(entry); //do i take the entries prop?
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //90px before the threshold is reached
});

headerObserver.observe(header);

//reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null, //viewport
  threshold: 0.15, //only revealed when 15% visible
});

allSections.forEach(function (section) {
  //loops over all the sections
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});

///////////////////////////////////////////////////////////////////
///lazy loading
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null, //viewport
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');

  const btnleft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.2) translateX(-1200px)';
  // slider.style.overflow = 'visible';

  //want to make them all side by side
  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
  //0%,100,200,300

  const createDots = function () {
    //only looping through slides 4 times for the i
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot dots__dot--active" data-slide="${i}"></button>`
      );
    });
  };

  //deacticate then activate
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
    // if (!slide) return;
    // slide.classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activateDot(0);
  };
  init();

  //Next Slide
  btnRight.addEventListener('click', nextSlide);

  btnleft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    //console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset; //destructuring
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();

//////////////////////////////////
// life cycle of webpage/DOM
//DOM CONTENT LOADED
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' }); //fastest way and modern
});
