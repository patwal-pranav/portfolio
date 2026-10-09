/**
 * Pranav Patwal Portfolio Main UI Scripts
 * Handles mobile nav, smooth interactions, Web Audio SFX, clipboard copy, and toast notices.
 */

// Web Audio API Synthesizer for tactile feedback
class AudioFx {
  constructor() {
    this.ctx = null;
    this.muted = true; // muted by default for polite UX
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  toggle() {
    this.muted = !this.muted;
    if (!this.muted) {
      this.initContext();
      this.playChime();
    }
    return !this.muted;
  }

  playClick() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playChime() {
    if (this.muted || !this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.08 + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.5);
      });
    } catch (e) {}
  }
}

const sfx = new AudioFx();

// Toast notification helper
function showToast(message) {
  const toast = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-message');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  sfx.playClick();

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// Copy to clipboard helper
function copyText(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${label}: ${text}`);
  }).catch(() => {
    // Fallback
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`Copied ${label}: ${text}`);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileMenuBtn.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileMenuBtn.textContent = '☰';
      });
    });
  }

  // Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const navItem = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });

    // Navbar blur background intensifier
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (scrollY > 50) {
        navbar.style.background = 'rgba(6, 9, 14, 0.92)';
        navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
      } else {
        navbar.style.background = 'rgba(10, 14, 23, 0.75)';
        navbar.style.boxShadow = 'none';
      }
    }
  });


  // Audio Toggle Button
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      const active = sfx.toggle();
      audioToggleBtn.textContent = active ? '🔔' : '🔕';
      audioToggleBtn.title = active ? 'Mute Sound Effects' : 'Enable Sound Effects';
      showToast(active ? 'Sound effects enabled' : 'Sound effects muted');
    });
  }

  // Hanko Seal Hover & Click
  const hankoStamps = document.querySelectorAll('.hanko-seal, .hanko-stamp-large');
  hankoStamps.forEach(stamp => {
    stamp.addEventListener('click', () => {
      sfx.playChime();
      showToast('Pranav Patwal (印) — Authenticated RHCSA & JLPT N4');
    });
  });

  // Credential ID Copy Buttons
  document.querySelectorAll('[data-copy-text]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const text = el.getAttribute('data-copy-text');
      const label = el.getAttribute('data-copy-label') || 'ID';
      copyText(text, label);
    });
  });

  // Contact Form Submission (Interactive Mock with mailto fallback)
  // Contact Form Submission & Dispatch Hub
  const contactForm = document.getElementById('portfolio-contact-form');
  const dispatchModal = document.getElementById('contact-dispatch-modal');
  const dispatchCloseBtn = document.getElementById('contact-modal-close-btn');
  const dispatchPreviewFrom = document.getElementById('dispatch-preview-from');
  const dispatchPreviewSubject = document.getElementById('dispatch-preview-subject');
  const dispatchGmailBtn = document.getElementById('dispatch-gmail-btn');
  const dispatchMailtoBtn = document.getElementById('dispatch-mailto-btn');
  const dispatchCopyBtn = document.getElementById('dispatch-copy-btn');
  const dispatchCopyLabel = document.getElementById('dispatch-copy-label');

  let currentDraft = { to: 'patwalpranav@gmail.com', from: '', subject: '', body: '' };

  function closeDispatchModal() {
    if (dispatchModal) {
      dispatchModal.classList.remove('active');
    }
  }

  if (dispatchCloseBtn) {
    dispatchCloseBtn.addEventListener('click', closeDispatchModal);
  }

  if (dispatchModal) {
    dispatchModal.addEventListener('click', (e) => {
      if (e.target === dispatchModal) closeDispatchModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dispatchModal && dispatchModal.classList.contains('active')) {
      closeDispatchModal();
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim() || 'Inquiry for Linux SysAdmin Role';
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in your name, email and message.');
        return;
      }

      const formattedBody = `From: ${name} (${email})\n\n${message}\n\n---\nSent via Pranav Patwal Portfolio`;

      currentDraft = {
        to: 'patwalpranav@gmail.com',
        from: `${name} <${email}>`,
        subject: subject,
        body: formattedBody
      };

      // Populate preview in modal
      if (dispatchPreviewFrom) dispatchPreviewFrom.textContent = currentDraft.from;
      if (dispatchPreviewSubject) dispatchPreviewSubject.textContent = currentDraft.subject;

      // Configure Gmail Web Link (100% reliable for browser users)
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=patwalpranav@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(formattedBody)}`;
      if (dispatchGmailBtn) {
        dispatchGmailBtn.href = gmailUrl;
        dispatchGmailBtn.onclick = () => {
          showToast('Opening Gmail composer in browser...');
          setTimeout(closeDispatchModal, 800);
        };
      }

      // Configure Desktop Mailto Link
      const mailtoUrl = `mailto:patwalpranav@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formattedBody)}`;
      if (dispatchMailtoBtn) {
        dispatchMailtoBtn.href = mailtoUrl;
        dispatchMailtoBtn.onclick = () => {
          showToast('Opening default mail client...');
          setTimeout(closeDispatchModal, 800);
        };
      }

      // Configure Copy Draft Button
      if (dispatchCopyBtn) {
        dispatchCopyBtn.onclick = () => {
          const fullDraftText = `To: patwalpranav@gmail.com\nSubject: ${subject}\n\n${formattedBody}`;
          copyText(fullDraftText, 'Draft & Email');
          if (dispatchCopyLabel) dispatchCopyLabel.textContent = '✓ Copied!';
          setTimeout(() => {
            if (dispatchCopyLabel) dispatchCopyLabel.textContent = 'Copy';
            closeDispatchModal();
          }, 1200);
        };
      }

      // Open Modal
      sfx.playChime();
      if (dispatchModal) {
        dispatchModal.classList.add('active');
      }
    });
  }

  // Click sounds on interactive buttons
  document.querySelectorAll('button, .btn-primary, .btn-secondary, .btn-terminal-inline, .quick-cmd-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
    });
  });
});
