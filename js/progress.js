window.TL = window.TL || {};

(function (TL) {
  const KEY = 'techlearning.v1';
  let memory = { lessons: {} };

  function load() {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) memory = JSON.parse(raw);
    } catch (e) {
      /* storage unavailable: keep progress in memory for this visit */
    }
    if (!memory.lessons) memory.lessons = {};
  }

  function save() {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(memory));
    } catch (e) {
      /* ignore */
    }
  }

  load();

  TL.progress = {
    stars: (id) => (memory.lessons[id] && memory.lessons[id].stars) || 0,
    isDone: (id) => TL.progress.stars(id) > 0,
    setResult(id, stars) {
      const best = Math.max(TL.progress.stars(id), stars);
      memory.lessons[id] = { stars: best };
      save();
      return best;
    },
    chapterComplete: (lessonIds) => lessonIds.length > 0 && lessonIds.every(TL.progress.isDone),
    totalStars: () => Object.values(memory.lessons).reduce((n, l) => n + (l.stars || 0), 0),
    reset() {
      memory = { lessons: {} };
      save();
    },
  };
})(window.TL);
