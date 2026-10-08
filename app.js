/**
 * ============================================================================
 * DOS BOTONES - GAME ENGINE & INTERACTIVITY
 * ============================================================================
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('dosBotones_muted') === 'true';
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      localStorage.setItem('dosBotones_muted', this.muted);
      return this.muted;
    }

    playTone(frequency, type, duration, gainValue = 0.15, pitchBend = 0) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      if (pitchBend !== 0) {
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(20, frequency + pitchBend),
          this.ctx.currentTime + duration
        );
      }

      gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    }

    playSuccess() {
      if (this.muted) return;
      this.init();
      // Arpegio triunfal dulce
      setTimeout(() => this.playTone(523.25, 'triangle', 0.15, 0.2), 0);    // C5
      setTimeout(() => this.playTone(659.25, 'triangle', 0.15, 0.2), 80);   // E5
      setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.25), 160); // G5
      setTimeout(() => this.playTone(1046.50, 'triangle', 0.35, 0.2), 240); // C6
    }

    playError() {
      if (this.muted) return;
      this.init();
      // Tono grave descendente
      this.playTone(220, 'sawtooth', 0.28, 0.22, -120);
    }

    playStreak() {
      if (this.muted) return;
      this.init();
      // Fanfarria brillante
      setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.25), 0);
      setTimeout(() => this.playTone(783.99, 'sine', 0.12, 0.25), 70);
      setTimeout(() => this.playTone(987.77, 'sine', 0.15, 0.25), 140);
      setTimeout(() => this.playTone(1318.51, 'triangle', 0.4, 0.3), 210);
    }

    playClick() {
      if (this.muted) return;
      this.playTone(400, 'sine', 0.05, 0.08, -100);
    }
  }

  // --- PARTICLE & CONFETTI ENGINE (HTML5 Canvas) ---
  class FXCanvas {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.animId = null;

      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    burst(x, y, count = 60, colors = ['#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#a855f7']) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 3,
          size: Math.random() * 7 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.3,
          life: 1,
          decay: Math.random() * 0.02 + 0.015,
          shape: Math.random() > 0.5 ? 'rect' : 'circle'
        });
      }

      if (!this.animId) {
        this.loop();
      }
    }

    loop() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // Gravedad
        p.vx *= 0.98; // Rozamiento
        p.rotation += p.vRot;
        p.life -= p.decay;

        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.globalAlpha = p.life;
        this.ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }

        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.loop());
      } else {
        this.animId = null;
      }
    }
  }

  // --- TRIVIA QUESTIONS DATABASE (Para el Modo Duelo de Saber) ---
  const TRIVIA_QUESTIONS = [
    {
      q: '¿Qué animal duerme con un ojo abierto?',
      choice1: { title: 'El Delfín', desc: 'Mamífero marino' },
      choice2: { title: 'El Búho', desc: 'Ave rapaz' },
      winner: 1,
      fact: '¡Los delfines apagan solo un hemisferio cerebral para seguir respirando!'
    },
    {
      q: '¿Cuál pesa más en la Tierra?',
      choice1: { title: '1 kg de Hierro', desc: 'Metal denso' },
      choice2: { title: '1 kg de Plumas', desc: 'Aves ligeras' },
      winner: null, // Caso especial: pesan igual
      specialEqual: true,
      fact: '¡Ambos pesan exactamente lo mismo: 1 kilogramo!'
    },
    {
      q: '¿Cuántos corazones tiene un pulpo?',
      choice1: { title: '3 Corazones', desc: 'Sistema trifásico' },
      choice2: { title: '1 Corazón', desc: 'Como nosotros' },
      winner: 1,
      fact: '¡Tienen tres corazones y sangre azul a base de cobre!'
    },
    {
      q: '¿El tomate es biológicamente...',
      choice1: { title: 'Una Fruta', desc: 'Contiene semillas' },
      choice2: { title: 'Una Verdura', desc: 'Uso en cocina' },
      winner: 1,
      fact: '¡Científicamente es una fruta (baya), aunque en cocina se use como verdura!'
    },
    {
      q: '¿Qué planeta está más cerca del Sol?',
      choice1: { title: 'Mercurio', desc: 'El más interior' },
      choice2: { title: 'Venus', desc: 'El más caliente' },
      winner: 1,
      fact: '¡Mercurio es el primero, aunque Venus es más caliente por efecto invernadero!'
    },
    {
      q: '¿Cuál es el océano más grande del planeta?',
      choice1: { title: 'Pacífico', desc: 'Cubre 165M km²' },
      choice2: { title: 'Atlántico', desc: 'Entre América y Europa' },
      winner: 1,
      fact: '¡El Océano Pacífico ocupa más superficie que todas las tierras emergidas juntas!'
    },
    {
      q: '¿Qué invento surgió primero?',
      choice1: { title: 'El Encendedor', desc: 'Lámpara Döbereiner' },
      choice2: { title: 'La Cerilla', desc: 'Fósforo de fricción' },
      winner: 1,
      fact: '¡El primer mechero mecánico se inventó en 1823, años antes del fósforo de fricción!'
    },
    {
      q: '¿Dónde se encuentra la Torre Eiffel?',
      choice1: { title: 'París', desc: 'Francia' },
      choice2: { title: 'Roma', desc: 'Italia' },
      winner: 1,
      fact: '¡Inaugurada en París para la Exposición Universal de 1889!'
    },
    {
      q: '¿Qué contiene más vitamina C?',
      choice1: { title: 'El Pimiento Rojo', desc: 'Hortaliza crujiente' },
      choice2: { title: 'La Naranja', desc: 'Cítrico clásico' },
      winner: 1,
      fact: '¡El pimiento rojo contiene casi el triple de vitamina C que una naranja!'
    },
    {
      q: '¿Los rayos caen dos veces en el mismo lugar?',
      choice1: { title: 'Sí, a menudo', desc: 'En rascacielos' },
      choice2: { title: 'No, nunca', desc: 'Mito popular' },
      winner: 1,
      fact: '¡El Empire State recibe entre 20 y 25 impactos de rayo cada año!'
    }
  ];

  // --- MAIN GAME APPLICATION CONTROLLER ---
  class DosBotonesApp {
    constructor() {
      // Estado del juego
      this.score = 0;
      this.streak = 0;
      this.round = 1;
      this.currentMode = 'classic'; // 'classic' | 'speed' | 'trivia'
      this.targetButton = 1; // 1 o 2
      this.isProcessingClick = false;

      // Temporizador para modo Speed
      this.timerDuration = 3000;
      this.timerLeft = 3000;
      this.timerInterval = null;

      // Trivia state
      this.triviaIndex = 0;
      this.shuffledTrivia = [];

      // Estadísticas persistentes
      this.stats = this.loadStats();

      // Servicios
      this.sound = new SoundFX();
      this.fx = new FXCanvas('fx-canvas');

      // Elementos DOM
      this.dom = {
        score: document.getElementById('val-score'),
        streak: document.getElementById('val-streak'),
        streakWrapper: document.getElementById('streak-wrapper'),
        multiplier: document.getElementById('val-multiplier'),
        bestStreak: document.getElementById('val-best-streak'),
        accuracy: document.getElementById('val-accuracy'),

        promptCategory: document.getElementById('prompt-category'),
        promptText: document.getElementById('prompt-text'),

        resultBanner: document.getElementById('result-banner'),
        resultIconWrap: document.getElementById('result-icon-wrap'),
        resultEmoji: document.getElementById('result-emoji'),
        resultHeadline: document.getElementById('result-headline'),
        resultSubtext: document.getElementById('result-subtext'),

        btn1: document.getElementById('btn-choice-1'),
        btn2: document.getElementById('btn-choice-2'),
        labelChoice1: document.getElementById('label-choice-1'),
        descChoice1: document.getElementById('desc-choice-1'),
        labelChoice2: document.getElementById('label-choice-2'),
        descChoice2: document.getElementById('desc-choice-2'),

        timerContainer: document.getElementById('timer-bar-container'),
        timerFill: document.getElementById('timer-bar-fill'),
        timerText: document.getElementById('timer-text'),

        btnSound: document.getElementById('btn-sound-toggle'),
        btnTheme: document.getElementById('btn-theme-toggle'),
        btnStatsModal: document.getElementById('btn-stats-modal'),
        btnCloseModal: document.getElementById('btn-close-modal'),
        btnModalOk: document.getElementById('btn-modal-ok'),
        btnResetGame: document.getElementById('btn-reset-game'),
        btnWipeStats: document.getElementById('btn-wipe-stats'),
        statsModal: document.getElementById('stats-modal'),

        modeButtons: document.querySelectorAll('.mode-chip'),
        paletteSelect: document.getElementById('theme-palette-select'),

        statTotalClicks: document.getElementById('stat-total-clicks'),
        statTotalWins: document.getElementById('stat-total-wins'),
        statTotalLosses: document.getElementById('stat-total-losses'),
        statMaxStreak: document.getElementById('stat-max-streak'),
        statWinRate: document.getElementById('stat-win-rate'),
        statRatioFill: document.getElementById('stat-ratio-fill')
      };

      this.init();
    }

    loadStats() {
      const defaultStats = {
        totalClicks: 0,
        totalWins: 0,
        totalLosses: 0,
        bestStreak: 0,
        bestScore: 0
      };
      try {
        const saved = localStorage.getItem('dosBotones_stats');
        return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
      } catch (e) {
        return defaultStats;
      }
    }

    saveStats() {
      localStorage.setItem('dosBotones_stats', JSON.stringify(this.stats));
    }

    init() {
      this.initThemeAndPalette();
      this.initSoundIcons();
      this.bindEvents();
      this.updateScoreboard();
      this.startNewRound();
    }

    initThemeAndPalette() {
      const savedTheme = localStorage.getItem('dosBotones_theme') || 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
      this.updateThemeIcons(savedTheme);

      const savedPalette = localStorage.getItem('dosBotones_palette') || 'cyber';
      document.documentElement.setAttribute('data-palette', savedPalette);
      if (this.dom.paletteSelect) {
        this.dom.paletteSelect.value = savedPalette;
      }
    }

    initSoundIcons() {
      const soundOn = this.dom.btnSound.querySelector('.icon-sound-on');
      const soundOff = this.dom.btnSound.querySelector('.icon-sound-off');
      if (this.sound.muted) {
        soundOn.classList.add('hidden');
        soundOff.classList.remove('hidden');
      } else {
        soundOn.classList.remove('hidden');
        soundOff.classList.add('hidden');
      }
    }

    updateThemeIcons(theme) {
      const sun = this.dom.btnTheme.querySelector('.icon-sun');
      const moon = this.dom.btnTheme.querySelector('.icon-moon');
      if (theme === 'light') {
        sun.classList.add('hidden');
        moon.classList.remove('hidden');
      } else {
        sun.classList.remove('hidden');
        moon.classList.add('hidden');
      }
    }

    bindEvents() {
      // Elección con los dos botones
      this.dom.btn1.addEventListener('click', (e) => this.handleButtonClick(1, e));
      this.dom.btn2.addEventListener('click', (e) => this.handleButtonClick(2, e));

      // Atajos de teclado
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

        if (e.key === '1' || e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') {
          e.preventDefault();
          this.triggerChoice(1);
        } else if (e.key === '2' || e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') {
          e.preventDefault();
          this.triggerChoice(2);
        } else if (e.key === ' ' || e.key === 'Enter') {
          if (this.isProcessingClick) {
            e.preventDefault();
          }
        }
      });

      // Modos de juego
      this.dom.modeButtons.forEach((chip) => {
        chip.addEventListener('click', () => {
          const mode = chip.getAttribute('data-mode');
          this.setMode(mode);
        });
      });

      // Sonido toggle
      this.dom.btnSound.addEventListener('click', () => {
        const isMuted = this.sound.toggleMute();
        this.initSoundIcons();
      });

      // Tema toggle
      this.dom.btnTheme.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('dosBotones_theme', next);
        this.updateThemeIcons(next);
      });

      // Modal de Estadísticas
      this.dom.btnStatsModal.addEventListener('click', () => this.openStatsModal());
      this.dom.btnCloseModal.addEventListener('click', () => this.closeStatsModal());
      this.dom.btnModalOk.addEventListener('click', () => this.closeStatsModal());
      this.dom.statsModal.addEventListener('click', (e) => {
        if (e.target === this.dom.statsModal) this.closeStatsModal();
      });

      // Reinicio de partida
      this.dom.btnResetGame.addEventListener('click', () => {
        this.sound.playClick();
        this.score = 0;
        this.streak = 0;
        this.round = 1;
        this.updateScoreboard();
        this.showBanner('idle', '🎯', 'Partida reiniciada', '¡Comienza una nueva racha!');
        this.startNewRound();
      });

      // Borrar todas las estadísticas
      this.dom.btnWipeStats.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas borrar todo tu historial y mejores marcas?')) {
          this.stats = { totalClicks: 0, totalWins: 0, totalLosses: 0, bestStreak: 0, bestScore: 0 };
          this.saveStats();
          this.updateScoreboard();
          this.updateModalStats();
        }
      });

      // Selector de paleta de colores de botones
      if (this.dom.paletteSelect) {
        this.dom.paletteSelect.addEventListener('change', (e) => {
          const pal = e.target.value;
          document.documentElement.setAttribute('data-palette', pal);
          localStorage.setItem('dosBotones_palette', pal);
        });
      }
    }

    setMode(mode) {
      if (this.currentMode === mode) return;
      this.currentMode = mode;
      this.sound.playClick();

      this.dom.modeButtons.forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
      });

      if (mode === 'speed') {
        this.dom.timerContainer.classList.remove('hidden');
      } else {
        this.dom.timerContainer.classList.add('hidden');
        this.stopTimer();
      }

      if (mode === 'trivia') {
        this.shuffledTrivia = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
        this.triviaIndex = 0;
      }

      this.round = 1;
      this.startNewRound();
    }

    startNewRound() {
      this.clearButtonHighlights();
      this.isProcessingClick = false;

      if (this.currentMode === 'classic') {
        // En clásico, 50% de probabilidad
        this.targetButton = Math.random() < 0.5 ? 1 : 2;
        this.dom.promptCategory.textContent = `Ronda ${this.round}`;
        this.dom.promptText.textContent = '¿Cuál de los dos botones es el ganador secreto?';
        this.dom.labelChoice1.textContent = 'BOTÓN ALFA';
        this.dom.descChoice1.textContent = 'Opción Izquierda';
        this.dom.labelChoice2.textContent = 'BOTÓN OMEGA';
        this.dom.descChoice2.textContent = 'Opción Derecha';
      } else if (this.currentMode === 'speed') {
        this.targetButton = Math.random() < 0.5 ? 1 : 2;
        this.dom.promptCategory.textContent = `⚡ Ronda Rápida ${this.round}`;
        this.dom.promptText.textContent = '¡Rápido! Elige el botón correcto antes de que acabe el tiempo';
        this.dom.labelChoice1.textContent = 'RAYO 1';
        this.dom.descChoice1.textContent = 'Opción Izquierda';
        this.dom.labelChoice2.textContent = 'RAYO 2';
        this.dom.descChoice2.textContent = 'Opción Derecha';
        this.startTimer();
      } else if (this.currentMode === 'trivia') {
        if (this.triviaIndex >= this.shuffledTrivia.length) {
          this.shuffledTrivia = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
          this.triviaIndex = 0;
        }

        const q = this.shuffledTrivia[this.triviaIndex];
        // En algunas preguntas randomizamos el orden de los botones
        const swap = Math.random() < 0.5;

        if (!swap) {
          this.dom.labelChoice1.textContent = q.choice1.title;
          this.dom.descChoice1.textContent = q.choice1.desc;
          this.dom.labelChoice2.textContent = q.choice2.title;
          this.dom.descChoice2.textContent = q.choice2.desc;
          this.targetButton = q.winner; // 1 o null
        } else {
          this.dom.labelChoice1.textContent = q.choice2.title;
          this.dom.descChoice1.textContent = q.choice2.desc;
          this.dom.labelChoice2.textContent = q.choice1.title;
          this.dom.descChoice2.textContent = q.choice1.desc;
          this.targetButton = q.winner === 1 ? 2 : 1;
        }

        this.dom.promptCategory.textContent = `🧠 Pregunta ${this.round} / ${TRIVIA_QUESTIONS.length}`;
        this.dom.promptText.textContent = q.q;
      }
    }

    startTimer() {
      this.stopTimer();
      // Tiempo base: 3.0s, baja ligeramente con rachas altas hasta un mínimo de 1.4s
      const reduction = Math.min(1.6, this.streak * 0.15);
      this.timerDuration = (3.0 - reduction) * 1000;
      this.timerLeft = this.timerDuration;
      const startTime = performance.now();

      const update = (now) => {
        const elapsed = now - startTime;
        this.timerLeft = Math.max(0, this.timerDuration - elapsed);
        const percent = (this.timerLeft / this.timerDuration) * 100;
        this.dom.timerFill.style.width = `${percent}%`;
        this.dom.timerText.textContent = `${(this.timerLeft / 1000).toFixed(1)}s`;

        if (this.timerLeft <= 0) {
          this.handleTimeout();
        } else {
          this.timerInterval = requestAnimationFrame(update);
        }
      };

      this.timerInterval = requestAnimationFrame(update);
    }

    stopTimer() {
      if (this.timerInterval) {
        cancelAnimationFrame(this.timerInterval);
        this.timerInterval = null;
      }
    }

    handleTimeout() {
      this.stopTimer();
      if (this.isProcessingClick) return;
      this.isProcessingClick = true;

      this.sound.playError();
      this.stats.totalClicks++;
      this.stats.totalLosses++;
      this.streak = 0;
      this.saveStats();
      this.updateScoreboard();

      this.showBanner('error', '⏰', '¡Se agotó el tiempo!', 'Fuiste demasiado lento. Tu racha vuelve a 0.');

      // Resaltar el botón que era el correcto
      const correctBtn = this.targetButton === 1 ? this.dom.btn1 : this.dom.btn2;
      correctBtn.classList.add('btn-win');

      setTimeout(() => {
        this.round++;
        this.startNewRound();
      }, 1400);
    }

    triggerChoice(buttonIndex) {
      const btn = buttonIndex === 1 ? this.dom.btn1 : this.dom.btn2;
      if (btn) {
        btn.click();
      }
    }

    handleButtonClick(chosenButton, event) {
      if (this.isProcessingClick) return;
      this.isProcessingClick = true;

      this.stopTimer();

      // Efecto ripple visual
      if (event) {
        this.createRipple(event, chosenButton === 1 ? this.dom.btn1 : this.dom.btn2);
      }

      const isWin = (this.targetButton === null) || (chosenButton === this.targetButton);
      const chosenBtnEl = chosenButton === 1 ? this.dom.btn1 : this.dom.btn2;
      const otherBtnEl = chosenButton === 1 ? this.dom.btn2 : this.dom.btn1;

      this.stats.totalClicks++;

      if (isWin) {
        // --- CASO ACIERTO ---
        this.stats.totalWins++;
        this.streak++;
        if (this.streak > this.stats.bestStreak) {
          this.stats.bestStreak = this.streak;
        }

        // Puntos basados en racha
        const multiplier = 1 + (this.streak - 1) * 0.25;
        const roundPoints = Math.round(100 * multiplier);
        this.score += roundPoints;

        if (this.score > this.stats.bestScore) {
          this.stats.bestScore = this.score;
        }

        // Efectos de sonido y visuales
        if (this.streak % 5 === 0 || this.streak === this.stats.bestStreak && this.streak > 3) {
          this.sound.playStreak();
        } else {
          this.sound.playSuccess();
        }

        // Explosión de confeti en el botón
        const rect = chosenBtnEl.getBoundingClientRect();
        this.fx.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 65);

        // Estilos de victoria
        chosenBtnEl.classList.add('btn-win');

        // Mensaje dinámico de elogio
        let headline = '¡ACERTASTE!';
        let subtext = `+${roundPoints} puntos`;

        if (this.currentMode === 'trivia') {
          const q = this.shuffledTrivia[this.triviaIndex];
          subtext = q.fact || `+${roundPoints} puntos`;
          this.triviaIndex++;
        } else {
          if (this.streak >= 10) headline = '¡IMPARABLE! 🔥';
          else if (this.streak >= 5) headline = '¡EN RACHA DORADA! 🌟';
          else if (this.streak >= 3) headline = '¡EXCELENTE INTUICIÓN!';
        }

        this.showBanner('success', '✨', headline, subtext);
      } else {
        // --- CASO FALLO ---
        this.stats.totalLosses++;
        this.sound.playError();

        chosenBtnEl.classList.add('btn-loss');
        otherBtnEl.classList.add('btn-win'); // Mostrar cuál era el correcto

        let subtext = `El correcto era el ${this.targetButton === 1 ? 'Botón 1' : 'Botón 2'}. Racha reiniciada.`;
        if (this.currentMode === 'trivia') {
          const q = this.shuffledTrivia[this.triviaIndex];
          subtext = q.fact || subtext;
          this.triviaIndex++;
        }

        this.streak = 0;
        this.showBanner('error', '💥', '¡FALLASTE!', subtext);
      }

      this.saveStats();
      this.updateScoreboard();

      // Siguiente ronda después de un momento para apreciar el resultado
      const delay = isWin ? 1100 : 1500;
      setTimeout(() => {
        this.round++;
        this.startNewRound();
      }, delay);
    }

    createRipple(e, button) {
      const rect = button.getBoundingClientRect();
      const x = (e.clientX || rect.left + rect.width / 2) - rect.left;
      const y = (e.clientY || rect.top + rect.height / 2) - rect.top;

      const rippleLayer = button.querySelector('.ripple-layer');
      if (!rippleLayer) return;

      const circle = document.createElement('span');
      circle.classList.add('ripple-circle');
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
      circle.style.width = `${Math.max(rect.width, rect.height) * 2}px`;
      circle.style.height = `${circle.style.width}`;
      circle.style.marginLeft = `-${parseInt(circle.style.width) / 2}px`;
      circle.style.marginTop = `-${parseInt(circle.style.height) / 2}px`;

      rippleLayer.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 700);
    }

    clearButtonHighlights() {
      this.dom.btn1.classList.remove('btn-win', 'btn-loss');
      this.dom.btn2.classList.remove('btn-win', 'btn-loss');
    }

    showBanner(status, emoji, title, subtext) {
      this.dom.resultBanner.className = `result-banner ${status}`;
      this.dom.resultEmoji.textContent = emoji;
      this.dom.resultHeadline.textContent = title;
      this.dom.resultSubtext.textContent = subtext;
    }

    updateScoreboard() {
      this.dom.score.textContent = this.score.toLocaleString();
      this.dom.streak.textContent = this.streak;
      this.dom.bestStreak.textContent = this.stats.bestStreak;

      // Multiplicador de racha
      const mult = 1 + Math.max(0, this.streak - 1) * 0.25;
      this.dom.multiplier.textContent = `x${mult.toFixed(1)}`;

      // Fuego en racha
      if (this.streak >= 3) {
        this.dom.streakWrapper.classList.add('on-fire');
      } else {
        this.dom.streakWrapper.classList.remove('on-fire');
      }

      // Precisión global
      const accuracy = this.stats.totalClicks > 0
        ? Math.round((this.stats.totalWins / this.stats.totalClicks) * 100)
        : 0;
      this.dom.accuracy.textContent = `${accuracy}%`;
    }

    openStatsModal() {
      this.sound.playClick();
      this.updateModalStats();
      this.dom.statsModal.classList.remove('hidden');
    }

    closeStatsModal() {
      this.dom.statsModal.classList.add('hidden');
    }

    updateModalStats() {
      this.dom.statTotalClicks.textContent = this.stats.totalClicks;
      this.dom.statTotalWins.textContent = this.stats.totalWins;
      this.dom.statTotalLosses.textContent = this.stats.totalLosses;
      this.dom.statMaxStreak.textContent = this.stats.bestStreak;

      const winRate = this.stats.totalClicks > 0
        ? Math.round((this.stats.totalWins / this.stats.totalClicks) * 100)
        : 0;

      this.dom.statWinRate.textContent = `${winRate}%`;
      this.dom.statRatioFill.style.width = `${winRate}%`;
    }
  }

  // Lanzar la aplicación cuando el DOM esté cargado
  document.addEventListener('DOMContentLoaded', () => {
    new DosBotonesApp();
  });
})();
