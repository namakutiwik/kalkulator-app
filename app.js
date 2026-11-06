// Firebase dimuat langsung dari CDN → tidak perlu npm / build step
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const $ = (id) => document.getElementById(id);

// --- Isi dropdown angka 1–10 ---
for (const sel of [$("angka1"), $("angka2")]) {
  for (let i = 1; i <= 10; i++) sel.add(new Option(i, i));
}

// --- Login / logout ---
$("btn-login").addEventListener("click", async () => {
  $("error").textContent = "";
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (err) {
    $("error").textContent = "Login gagal: " + err.code;
  }
});

$("btn-logout").addEventListener("click", () => signOut(auth));

// Tampilan berganti otomatis sesuai status login
onAuthStateChanged(auth, (user) => {
  $("view-login").hidden = !!user;
  $("view-app").hidden = !user;
  if (user) {
    $("user-name").textContent = user.displayName || user.email;
    $("user-photo").src = user.photoURL || "";
  }
});

// --- Kalkulator ---
$("btn-hitung").addEventListener("click", () => {
  const a = Number($("angka1").value);
  const b = Number($("angka2").value);
  const hasil = $("operator").value === "+" ? a + b : a - b;
  $("hasil").textContent = hasil;
});
