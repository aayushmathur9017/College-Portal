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


/* ===== Chatbot Functionality (ABES Virtual Assistant) ===== */
const toggleBtn = document.getElementById("chatbot-toggle");
const chatWindow = document.getElementById("chatbot-window");
const closeBtn = document.getElementById("chatbot-close");
const sendBtn = document.getElementById("chatbot-send");
const input = document.getElementById("chatbot-input");
const messages = document.getElementById("chatbot-messages");

// open/close chatbot
if (toggleBtn && chatWindow) {
  toggleBtn.onclick = () => chatWindow.classList.toggle("hidden");
}
if (closeBtn) {
  closeBtn.onclick = () => chatWindow.classList.add("hidden");
}

// send message
if (sendBtn) sendBtn.onclick = sendMessage;
if (input) {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}

function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;
  addMessage("user", text);
  input.value = "";
  setTimeout(() => getBotResponse(text), 700);
}

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerHTML = `<span>${text}</span>`;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

// ====== Chatbot AI Logic (Simulated ABES College Assistant) ======
function getBotResponse(inputText) {
  const text = inputText.toLowerCase();
  let response = "";

  if (text.includes("mid term") || text.includes("exam")) {
    response = "Mid Term 2 exams are expected around November–December. Please check the ABES ERP or notice board for official dates.";
  } 
  else if (
  text.includes("datesheet") &&
  text.includes("mca") &&
  (text.includes("mid term 2") || text.includes("midterm 2") || text.includes("mid 2"))
) {
  response = `📅 <strong>MCA Mid Term 2 Datesheet (Nov 2025)</strong><br><br>
  <strong>17 Nov</strong> – Essentials of AI<br>
  <strong>18 Nov</strong> – Soft Skills I<br>
  <strong>19 Nov</strong> – Data Structure using C++<br>
  <strong>20 Nov</strong> – Operating System<br>
  <strong>21 Nov</strong> – Essentials of Mathematics<br>
  <strong>22 Nov</strong> – Web Designing<br><br>
  <strong>16 Dec</strong> – Software Project Management<br><br>
  For any updates, please check the official <a href="https://abes.ac.in/exam.html" target="_blank">ABES Exam Portal</a>.`;
}
  else if (text.includes("fee") || text.includes("fees structure")) {
    if (text.includes("btech")) response = "B.Tech Fee Structure: ₹1,35,000 per year (approx). Source: https://abes.ac.in/fees.html";
    else if (text.includes("mca")) response = "MCA Fee Structure: ₹1,70,000 per year (approx). Source: https://abes.ac.in/fees.html";
    else if (text.includes("mba")) response = "MBA Fee Structure: ₹1,65,000 per year (approx). Source: https://abes.ac.in/fees.html";
    else response = "You can view the detailed course-wise fee structure here: https://abes.ac.in/fees.html";
  } 
  else if (text.includes("where") && text.includes("campus")) {
    response = "ABES Engineering College is located at NH-09, near Crossing Republik, Ghaziabad, Uttar Pradesh 201009.";
  } 
  else if (text.includes("apply") || text.includes("admission")) {
    response = "You can apply online via the ABES admission portal: https://abes.ac.in/admission.html or contact +91-9876543210.";
  } 
  else if (text.includes("contact") || text.includes("email")) {
    response = "You can reach ABES at info@abes.ac.in or call +91-9876543210.";
  } 
  else if (
  text.includes("courses") ||
  text.includes("programs") ||
  text.includes("offerings") ||
  text.includes("available courses")
) {
  response = `🎓 <strong>Courses Offered at ABES Engineering College:</strong><br><br>
  <strong>Undergraduate Programs:</strong><br>
  • B.Tech (Computer Science & Engineering)<br>
  • B.Tech (Information Technology)<br>
  • B.Tech (Electronics & Communication Engineering)<br>
  • B.Tech (Mechanical Engineering)<br>
  • BCA (Bachelor of Computer Applications)<br>
  • BBA (Bachelor of Business Administration)<br><br>
  <strong>Postgraduate Programs:</strong><br>
  • MCA (Master of Computer Applications)<br>
  • MBA (Master of Business Administration)<br>
  • M.Tech (Computer Science / Electronics / Mechanical)<br><br>
  For complete details, visit the official <a href="https://abes.ac.in/programs.html" target="_blank">Courses Page</a>.`;
}
  else {
    response = "I’m not sure about that 🤔. You can check more details at the official website: https://abes.ac.in";
  }

  addMessage("bot", response);
}
// ===== Chatbot Toggle Logic =====
// ===== Chatbot Toggle Logic =====
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("chatbot-toggle");
  const chatWindow = document.getElementById("chatbot-window");
  const closeBtn = document.getElementById("chatbot-close");
  
  // ensure chatbot starts hidden
  if (chatWindow) {
    chatWindow.classList.add("hidden");
  }

  // toggle open/close when 💬 button is clicked
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      if (chatWindow.classList.contains("hidden")) {
        chatWindow.classList.remove("hidden");
      } else {
        chatWindow.classList.add("hidden");
      }
    });
  }

  // close button
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      chatWindow.classList.add("hidden");
    });
  }
});


