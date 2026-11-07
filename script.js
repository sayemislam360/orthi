(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var layer = $('#hearts');
  var icons = ['❤', '💗', '🌸', '🌷', '💕'];

  // ভাসমান হার্ট ও ফুল
  function floatOne() {
    if (reduce) return;
    var el = document.createElement('span');
    el.className = 'fl';
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    el.style.left = Math.random() * 96 + '%';
    el.style.fontSize = 16 + Math.random() * 20 + 'px';
    el.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
    el.style.animationDuration = 5 + Math.random() * 4 + 's';
    el.addEventListener('animationend', function () { el.remove(); });
    layer.appendChild(el);
  }
  function burst(n) {
    for (var i = 0; i < n; i++) setTimeout(floatOne, i * 110);
  }

  function goTo(el) {
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  // ১ → ২ : চমক
  var surprise = $('#surprise');
  $('#startBtn').addEventListener('click', function () {
    surprise.hidden = false;
    surprise.classList.add('show');
    burst(22);
    setTimeout(function () { goTo(surprise); }, 50);
  });

  // ২ → ৩ : বাকি অংশ খোলা
  var rest = $('#rest');
  $('#moreBtn').addEventListener('click', function () {
    rest.hidden = false;
    burst(10);
    setTimeout(function () { goTo($('#memories')); }, 50);
  });

  // ছবি: না থাকলে সুন্দর প্লেসহোল্ডার দেখাবে, ছোঁয়া দিলে উঠে আসবে
  document.querySelectorAll('.polaroid').forEach(function (card) {
    var img = card.querySelector('img');
    function hide() { img.style.display = 'none'; }
    img.addEventListener('error', hide);
    if (img.complete && img.naturalWidth === 0) hide();
    card.addEventListener('click', function () { card.classList.toggle('active'); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('active'); }
    });
  });

  // চিঠি
  var envelope = $('#envelope'), paper = $('#paperWrap'), letterBtn = $('#letterBtn');
  var letterOpen = false;
  letterBtn.addEventListener('click', function () {
    letterOpen = !letterOpen;
    letterBtn.setAttribute('aria-expanded', String(letterOpen));
    if (letterOpen) {
      envelope.classList.add('open');
      letterBtn.textContent = 'চিঠি বন্ধ করো';
      setTimeout(function () { paper.classList.add('open'); }, 700);
      setTimeout(function () { paper.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }, 1500);
      burst(6);
    } else {
      paper.classList.remove('open');
      envelope.classList.remove('open');
      letterBtn.textContent = 'চিঠি খোলো';
    }
  });

  // কেক
  var cake = $('#cakeSvg'), wish = $('#wish'), candleBtn = $('#candleBtn');
  var blown = false;
  candleBtn.addEventListener('click', function () {
    blown = !blown;
    cake.classList.toggle('out', blown);
    wish.classList.toggle('show', blown);
    candleBtn.textContent = blown ? 'আবার জ্বালাও' : 'মোমবাতি নিভিয়ে দাও';
    if (blown) burst(10);
  });

  // শেষ অংশ: কনফেটি ও ভাসমান হার্ট
  var finalSec = $('#final'), box = $('#confetti');
  var colors = ['#f7b6c8', '#e8789a', '#ffe08a', '#fde4ec', '#ffc2d4'];
  for (var i = 0; i < 28; i++) {
    var c = document.createElement('i');
    c.style.left = Math.random() * 100 + '%';
    c.style.background = colors[i % colors.length];
    c.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
    c.style.animationDuration = 6 + Math.random() * 5 + 's';
    c.style.animationDelay = -Math.random() * 10 + 's';
    box.appendChild(c);
  }
  var timer = null;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var on = entries[0].isIntersecting;
      finalSec.classList.toggle('in-view', on);
      if (on && !timer) { timer = setInterval(floatOne, 900); }
      if (!on && timer) { clearInterval(timer); timer = null; }
    }, { threshold: 0.4 }).observe(finalSec);
  }

  // আবার দেখো
  $('#againBtn').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    burst(8);
  });
})();
