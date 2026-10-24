window.TL = window.TL || {};

(function (TL) {
  const el = TL.el;
  const PRIMES = [3, 5, 7, 11, 13, 17, 19, 23];
  // Two primes of each size, for the "try to crack it" demo (1 to 7 digits).
  const PAIRS = { 1: [5, 7], 2: [53, 89], 3: [947, 983], 4: [9967, 9973], 5: [99989, 99991], 6: [999979, 999983], 7: [9999973, 9999991] };
  const RUN_MAX = 7;
  const SPEED = 1e9; // guesses per second for a fast computer

  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  function modpow(b, e, m) {
    let r = 1n;
    let base = BigInt(b) % BigInt(m);
    let ex = BigInt(e);
    const mod = BigInt(m);
    while (ex > 0n) {
      if (ex & 1n) r = (r * base) % mod;
      base = (base * base) % mod;
      ex >>= 1n;
    }
    return Number(r);
  }

  TL.rsaKeys = function (p, q) {
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    let e = 3;
    while (e < phi && gcd(e, phi) !== 1) e += 2;
    let d = 1;
    while ((e * d) % phi !== 1) d++;
    return { p, q, n, phi, e, d };
  };

  const fmt = (n) => n.toLocaleString('en-US');

  // Time to try 10^d / 2 guesses, as friendly words. L = log10(seconds).
  TL.humanTime = function (L) {
    const s = Math.pow(10, L);
    if (L < -3) return 'less than a millisecond';
    if (s < 1) return 'less than a second';
    if (s < 60) return `${Math.round(s)} second${Math.round(s) === 1 ? '' : 's'}`;
    if (s < 3600) return `${Math.round(s / 60)} minutes`;
    if (s < 86400) return `${Math.round(s / 3600)} hours`;
    const years = L - Math.log10(31557600);
    if (years < 0) return `${Math.round(s / 86400)} days`;
    if (years < 4) return `${fmt(Math.round(Math.pow(10, years)))} years`;
    if (years < 6) return `${fmt(Math.round(Math.pow(10, years) / 1000))} thousand years`;
    if (years < 9) return `${fmt(Math.round(Math.pow(10, years) / 1e6))} million years`;
    const universe = years - Math.log10(13.8e9);
    if (universe < 0) return `${fmt(Math.round(Math.pow(10, years) / 1e9))} billion years`;
    if (universe < 6) return `${fmt(Math.round(Math.pow(10, universe)))} times the age of the universe`;
    return `10^${Math.round(universe)} times the age of the universe`;
  };

  class RsaLab {
    constructor(root, lesson, { onFinish }) {
      this.cfg = lesson.sandbox;
      this.keys = null;
      this.locked = null;
      this.unlockedOk = false;
      this.crackedFar = false;

      this.goalBox = el('div', { class: 'goal' });
      this.status = el('p', { 'aria-live': 'polite', class: 'caption-text', text: this.cfg.intro });

      const primeSelect = (cls, value, label) =>
        el(
          'label',
          { class: 'lab-field' },
          el('span', { class: 'lab-label', text: label }),
          el('select', { class: `text-input ${cls}`, onchange: () => this.makeKeys() }, PRIMES.map((p) => el('option', { value: String(p), text: String(p), selected: p === value })))
        );
      this.pSel = primeSelect('sel-p', 3, 'Prime p');
      this.qSel = primeSelect('sel-q', 11, 'Prime q');
      this.keyCards = el('div', { class: 'cards' });
      this.msgInput = el('input', { class: 'text-input msg-input', type: 'number', min: '2', value: '4', 'aria-label': 'Secret number', oninput: () => this.msgChanged() });
      this.dInput = el('input', { class: 'text-input d-input', type: 'number', min: '1', 'aria-label': 'Private key to try' });
      this.lockBtn = el('button', { class: 'btn primary', text: 'Lock it', onclick: () => this.lock() });
      this.unlockBtn = el('button', { class: 'btn', text: 'Unlock it', onclick: () => this.unlock() });
      this.lockOut = el('p', { class: 'calc-out', 'aria-live': 'polite' });
      this.unlockOut = el('p', { class: 'calc-out', 'aria-live': 'polite' });

      this.digits = el('input', { class: 'digits-input', type: 'range', min: '1', max: '300', value: '2', 'aria-label': 'Digits in each prime', oninput: () => this.crackInfo() });
      this.digitsVal = el('strong', { class: 'digits-val' });
      this.crackOut = el('p', { class: 'calc-out', 'aria-live': 'polite' });
      this.runBtn = el('button', { class: 'btn', text: 'Run the cracker', onclick: () => this.runCrack() });
      this.runOut = el('p', { class: 'calc-out' });

      root.append(
        el('div', { class: 'caption' }, this.goalBox, this.status),
        el(
          'div',
          { class: 'lab-panel' },
          el('h3', { text: '1. Make your keys and lock a number' }),
          el('div', { class: 'lab-row' }, this.pSel, this.qSel),
          this.keyCards,
          el(
            'div',
            { class: 'lab-row' },
            el('label', { class: 'lab-field' }, el('span', { class: 'lab-label', text: 'Secret number' }), this.msgInput),
            this.lockBtn
          ),
          this.lockOut,
          el(
            'div',
            { class: 'lab-row' },
            el('label', { class: 'lab-field' }, el('span', { class: 'lab-label', text: 'Key to unlock with' }), this.dInput),
            this.unlockBtn
          ),
          this.unlockOut
        ),
        el(
          'div',
          { class: 'lab-panel' },
          el('h3', { text: '2. Try to crack it' }),
          el('p', { class: 'hint', text: 'The cracker only knows the public number n and tries every possible prime until one divides it. Slide to make the primes bigger.' }),
          el('div', { class: 'lab-row' }, el('label', { class: 'lab-field wide' }, el('span', { class: 'lab-label' }, 'Digits in each prime: ', this.digitsVal), this.digits)),
          this.crackOut,
          el('div', { class: 'lab-row' }, this.runBtn),
          this.runOut
        ),
        el('div', { class: 'controls' }, el('span', { class: 'spacer' }), el('button', { class: 'btn primary', text: 'Take the quiz', onclick: onFinish }))
      );
      this.makeKeys();
      this.crackInfo();
      this.refreshGoal();
    }

    makeKeys() {
      const p = Number(this.pSel.querySelector('select').value);
      const q = Number(this.qSel.querySelector('select').value);
      this.locked = null;
      this.lockOut.textContent = '';
      this.unlockOut.textContent = '';
      if (p === q) {
        this.keys = null;
        TL.renderCards(this.keyCards, []);
        this.status.textContent = 'Pick two different primes.';
        this.lockBtn.disabled = true;
        this.unlockBtn.disabled = true;
        return;
      }
      const k = (this.keys = TL.rsaKeys(p, q));
      TL.renderCards(this.keyCards, [
        [
          { t: String(k.n), sub: `n = ${p} × ${q}  (public)`, tone: 'cyan' },
          { t: String(k.e), sub: 'e  (public)', tone: 'cyan' },
          { t: String(k.d), sub: 'd  (private!)', tone: 'red' },
        ],
      ]);
      this.msgInput.max = String(k.n - 1);
      this.dInput.value = String(k.d);
      this.lockBtn.disabled = false;
      this.unlockBtn.disabled = true;
      this.status.textContent = `Public key: n = ${k.n} and e = ${k.e}. Private key: d = ${k.d}. (We used (${p} − 1) × (${q} − 1) = ${k.phi} to find d.)`;
    }

    msgChanged() {
      this.locked = null;
      this.unlockBtn.disabled = true;
      this.lockOut.textContent = '';
      this.unlockOut.textContent = '';
    }

    lock() {
      const k = this.keys;
      if (!k) return;
      const m = Number(this.msgInput.value);
      if (!Number.isInteger(m) || m < 2 || m >= k.n) {
        this.lockOut.textContent = `Pick a whole number from 2 to ${k.n - 1}.`;
        return;
      }
      const c = modpow(m, k.e, k.n);
      this.locked = { m, c };
      const big = BigInt(m) ** BigInt(k.e);
      this.lockOut.textContent = `Lock: ${m} multiplied by itself ${k.e} times is ${big}. Divide by ${k.n} and keep the remainder: ${c}. The locked number is ${c}.`;
      this.unlockBtn.disabled = false;
      this.unlockOut.textContent = '';
    }

    unlock() {
      const k = this.keys;
      if (!k || !this.locked) return;
      const dTry = Math.max(1, Math.floor(Number(this.dInput.value) || 1));
      const r = modpow(this.locked.c, dTry, k.n);
      const ok = r === this.locked.m;
      this.unlockOut.textContent = `Unlock with ${dTry}: ${this.locked.c} multiplied by itself ${dTry} times, remainder after dividing by ${k.n}, is ${r}. ${ok ? 'Your secret number is back!' : 'That is not your number: the wrong key gives nonsense.'}`;
      if (ok && dTry === k.d) {
        this.unlockedOk = true;
        this.refreshGoal();
      }
    }

    crackInfo() {
      const d = Number(this.digits.value);
      this.digitsVal.textContent = String(d);
      const logTries = d - Math.log10(2);
      const L = logTries - Math.log10(SPEED);
      const pair = PAIRS[d];
      const n = pair ? pair[0] * pair[1] : null;
      const tries = logTries < 7 ? fmt(Math.round(Math.pow(10, logTries))) : `10^${Math.round(logTries)}`;
      this.crackOut.textContent =
        `${n ? `The public number is n = ${fmt(n)}. ` : `n has about ${2 * d} digits. `}` +
        `The cracker needs roughly ${tries} guesses. At a billion guesses a second that takes ${TL.humanTime(L)}.` +
        (d >= 300 ? ' Real HTTPS keys use primes about this big.' : '');
      this.runBtn.disabled = d > RUN_MAX;
      this.runOut.textContent = d > RUN_MAX ? 'Too big to run here. Your computer would be busy far too long!' : '';
      if (d >= 20 && !this.crackedFar) {
        this.crackedFar = true;
        this.refreshGoal();
      }
    }

    runCrack() {
      const d = Number(this.digits.value);
      const pair = PAIRS[d];
      if (!pair) return;
      const n = pair[0] * pair[1];
      const t0 = performance.now();
      let i = 2;
      let tries = 0;
      while (n % i !== 0) {
        i++;
        tries++;
      }
      tries++;
      const ms = Math.max(1, Math.round(performance.now() - t0));
      this.runOut.textContent = `Found it: ${n} = ${i} × ${n / i}, after ${fmt(tries)} guesses (${ms} ms).`;
    }

    refreshGoal() {
      TL.clear(this.goalBox);
      const done = this.unlockedOk && this.crackedFar;
      this.goalBox.classList.toggle('done', done);
      this.goalBox.append(
        el('strong', { text: done ? 'Done! ' : 'Goal: ' }),
        done
          ? 'You locked and unlocked a number, and saw why huge primes keep it safe.'
          : `${this.unlockedOk ? '✓' : '○'} Lock a number and unlock it with the private key.   ${this.crackedFar ? '✓' : '○'} Slide the cracker to 20 digits or more.`
      );
    }

    destroy() {}
  }

  TL.RsaLab = RsaLab;
  TL.labs = TL.labs || {};
  TL.labs.rsa = RsaLab;
})(window.TL);
