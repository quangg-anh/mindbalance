document.addEventListener('DOMContentLoaded', () => {
  // Particles
  const pc = document.getElementById('particles');
  if (pc) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const s = Math.random() * 4 + 2;
      p.style.width = s + 'px';
      p.style.height = s + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (Math.random() * 12 + 8) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      pc.appendChild(p);
    }
  }
  // Init engine
  window.game = new VNEngine();
});
