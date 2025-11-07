/* Global script for nav toggle, modal, form handling, toasts, and cross-page apply buttons */

document.addEventListener('DOMContentLoaded', () => {
  // NAV toggle (works on all pages)
  document.querySelectorAll('.menu-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = btn.closest('.header-inner').querySelector('.nav');
      if (!nav) return;
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
  });

  // Modal elements (shared across pages)
  const modal = document.getElementById('admissionModal');
  const closeModalButtons = document.querySelectorAll('#closeModal, .modal-close');

  // open modal from main Apply button (#applyBtn)
  document.querySelectorAll('#applyBtn, .apply-now-inline').forEach(el => {
    el.addEventListener('click', (e) => {
      // when clicked, ensure modal exists
      if (!modal) {
        console.warn('Modal not found on this page.');
        return;
      }
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      // focus first input
      const first = modal.querySelector('input,select,textarea,button');
      if (first) first.focus();
    });
  });

  // close modal
  closeModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  });

  // click outside to close
  window.addEventListener('click', (e) => {
    if (modal && e.target === modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  // close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  // Admission form submit (redirect to thankyou.html)
  document.querySelectorAll('#admissionForm').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        const orig = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = orig;
          form.reset();
          // redirect
          window.location.href = 'thankyou.html';
        }, 1000);
      } else {
        // fallback redirect
        window.location.href = 'thankyou.html';
      }
    });
  });

  // Contact form handling (toast)
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submit = contactForm.querySelector('button[type="submit"]');
      if (submit) {
        submit.disabled = true;
        const orig = submit.textContent;
        submit.textContent = 'Sending...';
        setTimeout(() => {
          submit.disabled = false;
          submit.textContent = orig;
          contactForm.reset();
          showToast('Message sent! We will contact you soon.');
        }, 900);
      }
    });
  }

  function showToast(msg, time = 3000) {
    if (!toast) {
      alert(msg);
      return;
    }
    toast.textContent = msg;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.style.display = 'none', 400);
    }, time);
  }
});
