function $(id) {
  return document.getElementById(id);
}

function formatNow() {
  const now = new Date();
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(now);
}

function formatDOB(isoDate) {
  if (!isoDate) return "-";
  const d = new Date(isoDate + "T00:00:00");
  if (Number.isNaN(d.getTime())) return isoDate;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

function getSelectedGender() {
  const checked = document.querySelector('input[name="gender"]:checked');
  return checked ? checked.value : "";
}

function setError(inputEl, errEl, msg) {
  errEl.textContent = msg;
  inputEl.classList.add("input-error");
}

function clearError(inputEl, errEl) {
  errEl.textContent = "";
  inputEl.classList.remove("input-error");
}

/* Footer year */
(function setYear() {
  const y = $("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();

/* Mobile nav */
const navToggle = $("navToggle");
const navMenu = $("navMenu");
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  navMenu.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.tagName === "A" && window.innerWidth < 720) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* Username in hero */
const userNameEl = $("userName");
const changeNameBtn = $("changeNameBtn");

function setUserName(name) {
  const safe = (name || "").trim();
  userNameEl.textContent = safe ? safe : "Guest";
  localStorage.setItem("altro_user_name", userNameEl.textContent);
}
(function initUserName() {
  const saved = localStorage.getItem("altro_user_name");
  if (saved && saved.trim()) {
    setUserName(saved);
    return;
  }
  const asked = prompt("Masukkan nama kamu:", "Guest");
  setUserName(asked);
})();
if (changeNameBtn) {
  changeNameBtn.addEventListener("click", () => {
    const asked = prompt("Ganti nama kamu:", userNameEl.textContent || "Guest");
    setUserName(asked);
  });
}

/* Current time */
const currentTimeEl = $("currentTime");
function tickTime() {
  if (currentTimeEl) currentTimeEl.textContent = formatNow();
}
tickTime();
setInterval(tickTime, 1000);

/* Output popup controls */
const overlay = $("outputOverlay");
const outputPanel = $("outputPanel");
const outputClose = $("outputClose");

function openOutputPopup() {
  if (overlay) overlay.classList.add("is-open");
  if (outputPanel) {
    outputPanel.classList.add("is-open");
    outputPanel.setAttribute("aria-hidden", "false");
  }
}
function closeOutputPopup() {
  if (overlay) overlay.classList.remove("is-open");
  if (outputPanel) {
    outputPanel.classList.remove("is-open");
    outputPanel.setAttribute("aria-hidden", "true");
  }
}
if (overlay) overlay.addEventListener("click", closeOutputPopup);
if (outputClose) outputClose.addEventListener("click", closeOutputPopup);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeOutputPopup();
});

/* Form validation + output */
const form = $("messageForm");
const nameInput = $("name");
const dobInput = $("dob");
const msgInput = $("message");

const errName = $("errName");
const errDob = $("errDob");
const errGender = $("errGender");
const errMessage = $("errMessage");

const outName = $("outName");
const outDob = $("outDob");
const outGender = $("outGender");
const outMessage = $("outMessage");

function validate() {
  let ok = true;

  const name = nameInput.value.trim();
  if (name.length < 3) {
    setError(nameInput, errName, "Nama minimal 3 karakter.");
    ok = false;
  } else {
    clearError(nameInput, errName);
  }

  const dob = dobInput.value;
  if (!dob) {
    setError(dobInput, errDob, "Tanggal lahir wajib diisi.");
    ok = false;
  } else {
    const dobDate = new Date(dob + "T00:00:00");
    const now = new Date();
    if (dobDate > now) {
      setError(dobInput, errDob, "Tanggal lahir tidak boleh di masa depan.");
      ok = false;
    } else {
      clearError(dobInput, errDob);
    }
  }

  const gender = getSelectedGender();
  if (!gender) {
    errGender.textContent = "Pilih salah satu gender.";
    ok = false;
  } else {
    errGender.textContent = "";
  }

  const message = msgInput.value.trim();
  if (message.length < 10) {
    setError(msgInput, errMessage, "Pesan minimal 10 karakter.");
    ok = false;
  } else {
    clearError(msgInput, errMessage);
  }

  return { ok, name, dob, gender, message };
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const res = validate();
    if (!res.ok) return;

    outName.textContent = res.name;
    outDob.textContent = formatDOB(res.dob);
    outGender.textContent = res.gender;
    outMessage.textContent = res.message;

    tickTime();
    if (
      document.activeElement &&
      typeof document.activeElement.blur === "function"
    ) {
      document.activeElement.blur();
    }
    openOutputPopup();
  });
}

/* Portfolio detail toggle */
function closePortfolioDetail(card) {
  const btn = card.querySelector(".detail-toggle");
  const panel = card.querySelector(".p-detail-collapse");
  if (!btn || !panel) return;

  card.classList.remove("detail-open");
  btn.textContent = "Lihat Detail";
  btn.setAttribute("aria-expanded", "false");
  panel.setAttribute("aria-hidden", "true");
  panel.style.maxHeight = "0px";
}
function openPortfolioDetail(card) {
  const btn = card.querySelector(".detail-toggle");
  const panel = card.querySelector(".p-detail-collapse");
  if (!btn || !panel) return;

  card.classList.add("detail-open");
  btn.textContent = "Tutup Detail";
  btn.setAttribute("aria-expanded", "true");
  panel.setAttribute("aria-hidden", "false");
  panel.style.maxHeight = panel.scrollHeight + "px";
}
function syncOpenPanelsHeight() {
  document
    .querySelectorAll(".card-media.detail-open .p-detail-collapse")
    .forEach((panel) => {
      panel.style.maxHeight = panel.scrollHeight + "px";
    });
}
document.querySelectorAll(".detail-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".card-media");
    if (!card) return;

    const isOpen = card.classList.contains("detail-open");
    document.querySelectorAll(".card-media.detail-open").forEach((openCard) => {
      if (openCard !== card) closePortfolioDetail(openCard);
    });

    if (isOpen) closePortfolioDetail(card);
    else openPortfolioDetail(card);
  });
});
window.addEventListener("resize", syncOpenPanelsHeight);
