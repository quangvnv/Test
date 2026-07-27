/* ============================================================
   cw-export.js — logic tương tác cho các trang xuất ô chữ.
   Toàn bộ xử lý focus/click/gõ phím/nhập liệu dùng EVENT
   DELEGATION (gắn 1 lần trên mỗi .sl) thay cho onfocus/onclick/
   onkeydown/oninput gắn trực tiếp trong HTML.
   ============================================================ */
(function () {
  'use strict';

  function gridOf(el) { return el.closest('.cw-grid'); }
  function cellAt(g, x, y) { return g.querySelector('.cw-in[data-x="' + x + '"][data-y="' + y + '"]'); }
  function dirOf(g) { return g.dataset.dir === 'down' ? 'down' : 'across'; }

  function highlight(g) {
    g.querySelectorAll('.cw-cell.cw-hl,.cw-cell.cw-cur').forEach(function (c) {
      c.classList.remove('cw-hl', 'cw-cur');
    });
    var sl = g.closest('.sl');
    if (sl) sl.querySelectorAll('.cw-clue.cw-clue-on').forEach(function (c) { c.classList.remove('cw-clue-on'); });
    if (g.dataset.cx == null) return;
    var el = cellAt(g, g.dataset.cx, g.dataset.cy);
    if (!el) return;
    var key = dirOf(g) === 'across' ? 'ac' : 'dn';
    var id = el.dataset[key];
    if (id != null) {
      g.querySelectorAll('.cw-in[data-' + key + '="' + id + '"]').forEach(function (i) {
        i.parentElement.classList.add('cw-hl');
      });
      var clue = sl && sl.querySelector('.cw-clue[data-k="' + key + '-' + id + '"]');
      if (clue) {
        clue.classList.add('cw-clue-on');
        if (clue.scrollIntoView) clue.scrollIntoView({ block: 'nearest' });
      }
    }
    el.parentElement.classList.add('cw-cur');
  }

  function focusCell(el) {
    var g = gridOf(el);
    if (!g) return;
    g.dataset.cx = el.dataset.x;
    g.dataset.cy = el.dataset.y;
    if (dirOf(g) === 'across' && el.dataset.ac == null && el.dataset.dn != null) g.dataset.dir = 'down';
    else if (dirOf(g) === 'down' && el.dataset.dn == null && el.dataset.ac != null) g.dataset.dir = 'across';
    highlight(g);
  }

  function clickCell(el) {
    var g = gridOf(el);
    if (!g) return;
    var k = el.dataset.x + ',' + el.dataset.y;
    if (g.dataset.lastxy === k && el.dataset.ac != null && el.dataset.dn != null) {
      g.dataset.dir = (dirOf(g) === 'across') ? 'down' : 'across';
      highlight(g);
    }
    g.dataset.lastxy = k;
  }

  function step(g, x, y, dx, dy, scan) {
    var nx = x + dx, ny = y + dy;
    for (var i = 0; i < 64; i++) {
      if (nx < 0 || ny < 0) return null;
      var t = cellAt(g, nx, ny);
      if (t) { t.focus(); if (t.select) t.select(); return t; }
      if (!scan) return null;
      nx += dx; ny += dy;
      if (!dx && !dy) return null;
    }
    return null;
  }

  function keyCell(e, el) {
    var g = gridOf(el);
    if (!g) return;
    var x = +el.dataset.x, y = +el.dataset.y, k = e.key;
    if (k === 'ArrowLeft' || k === 'ArrowRight') {
      g.dataset.dir = 'across';
      step(g, x, y, k === 'ArrowLeft' ? -1 : 1, 0, true);
      e.preventDefault(); highlight(g);
    } else if (k === 'ArrowUp' || k === 'ArrowDown') {
      g.dataset.dir = 'down';
      step(g, x, y, 0, k === 'ArrowUp' ? -1 : 1, true);
      e.preventDefault(); highlight(g);
    } else if (k === 'Backspace') {
      e.preventDefault();
      if (el.value) {
        el.value = '';
        el.classList.remove('cw-ok', 'cw-bad');
        el.parentElement.classList.remove('cw-wrong');
        return;
      }
      var d = dirOf(g);
      var p = step(g, x, y, d === 'across' ? -1 : 0, d === 'across' ? 0 : -1, false);
      if (p) { p.value = ''; p.classList.remove('cw-ok', 'cw-bad'); p.parentElement.classList.remove('cw-wrong'); }
    } else if (k === 'Delete') {
      el.value = '';
      el.classList.remove('cw-ok', 'cw-bad');
      el.parentElement.classList.remove('cw-wrong');
      e.preventDefault();
    } else if (k === ' ') {
      var d2 = dirOf(g);
      step(g, x, y, d2 === 'across' ? 1 : 0, d2 === 'across' ? 0 : 1, false);
      e.preventDefault();
    }
  }

  function inputCell(el) {
    el.value = (el.value || '').normalize('NFC').toUpperCase().slice(-1);
    el.classList.remove('cw-ok', 'cw-bad');
    el.parentElement.classList.remove('cw-wrong');
    var g = gridOf(el);
    if (!g) return;
    if (el.value) {
      var d = dirOf(g);
      step(g, +el.dataset.x, +el.dataset.y, d === 'across' ? 1 : 0, d === 'across' ? 0 : 1, false);
    }
    highlight(g);
  }

  function goClue(sl, el) {
    var g = sl && sl.querySelector('.cw-grid');
    if (!g) return;
    var m = /^(ac|dn)-(\d+)$/.exec(el.dataset.k || '');
    if (!m) return;
    g.dataset.dir = (m[1] === 'ac') ? 'across' : 'down';
    var list = g.querySelectorAll('.cw-in[data-' + m[1] + '="' + m[2] + '"]');
    if (list.length) { list[0].focus(); if (list[0].select) list[0].select(); }
  }

  function submitSlide(sl) {
    var ins = [].slice.call(sl.querySelectorAll('.cw-in'));
    var total = 0, correct = 0, un = 0;
    ins.forEach(function (i) {
      total++;
      i.classList.remove('cw-ok', 'cw-bad');
      i.parentElement.classList.remove('cw-wrong');
      var v = (i.value || '').normalize('NFC').toUpperCase(), a = i.dataset.a;
      if (!v) un++;
      else if (v === a) { i.classList.add('cw-ok'); correct++; }
      else { i.classList.add('cw-bad'); i.parentElement.classList.add('cw-wrong'); }
    });
    var box = document.getElementById('cwResultBox');
    if (!box) return;
    if (un > 0) {
      box.className = 'cw-result cw-result-warn';
      box.textContent = 'Còn ' + un + ' ô chưa điền — hãy làm hết rồi bấm Chấm điểm.';
    } else if (correct === total) {
      box.className = 'cw-result cw-result-ok';
      box.textContent = 'Chính xác toàn bộ ' + total + ' ô!';
    } else {
      box.className = 'cw-result cw-result-bad';
      box.textContent = 'Đúng ' + correct + '/' + total + ' ô - ô tô đỏ là sai, sửa lại rồi bấm Chấm điểm lại.';
    }
    box.style.display = 'block';
  }

  // Đặt --cols/--rows lên .cw-grid từ data-cols/data-rows (do trang xuất ghi
  // sẵn) — CSS dùng biến này để dựng lưới đúng số cột/dòng, không phụ thuộc
  // kích thước px cố định nữa nên tự co giãn theo màn hình.
  function initGridSizes() {
    document.querySelectorAll('.cw-grid').forEach(function (g) {
      var cols = parseInt(g.dataset.cols, 10) || 10;
      var rows = parseInt(g.dataset.rows, 10) || 10;
      g.style.setProperty('--cols', cols);
      g.style.setProperty('--rows', rows);
    });
  }

  function bindSlide(sl) {
    sl.addEventListener('focusin', function (e) {
      var el = e.target;
      if (el.classList && el.classList.contains('cw-in')) focusCell(el);
    });
    sl.addEventListener('keydown', function (e) {
      var el = e.target;
      if (el.classList && el.classList.contains('cw-in')) keyCell(e, el);
    });
    sl.addEventListener('input', function (e) {
      var el = e.target;
      if (el.classList && el.classList.contains('cw-in')) inputCell(el);
    });
    sl.addEventListener('click', function (e) {
      var inEl = e.target.closest('.cw-in');
      if (inEl) { clickCell(inEl); return; }
      var clueEl = e.target.closest('.cw-clue');
      if (clueEl) { goClue(sl, clueEl); return; }
      var checkBtn = e.target.closest('.sl-check');
      if (checkBtn) { submitSlide(sl); return; }
    });
  }

  // Thu nhỏ/khôi phục khung "slide" 960x540 theo bề rộng màn hình (desktop).
  // Trên di động (<=700px) bỏ hẳn transform để trang cuộn dọc tự nhiên —
  // lưới ô chữ đã tự co theo bề rộng khung chứa (xem cw-export.css).
  function fitScale() {
    var vw = window.innerWidth || 960;
    var scaler = document.getElementById('cwScaler');
    var wrap = document.getElementById('cwStageWrap');
    if (!scaler || !wrap) return;
    if (vw <= 700) {
      scaler.style.transform = '';
      wrap.style.width = '';
      wrap.style.height = '';
      return;
    }
    var sc = Math.min(vw / 1000, 1);
    sc = Math.max(sc, 0.3);
    var w = Math.round(960 * sc), h = Math.round(540 * sc);
    scaler.style.transform = 'scale(' + sc + ')';
    wrap.style.width = w + 'px';
    wrap.style.height = h + 'px';
  }

  function initAll() {
    initGridSizes();
    document.querySelectorAll('.sl').forEach(bindSlide);
    fitScale();
  }

  window.addEventListener('resize', fitScale);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
