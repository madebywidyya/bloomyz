const translations = {
  id: {
    menu:"MENU",home:"Beranda",explore:"Jelajahi",myLearning:"Belajarku",quiz:"Pusat Kuis",library:"Perpustakaan",yourSpace:"RUANG KAMU",garden:"Taman Belajar",notes:"Catatan",gardenCardTitle:"Tamanmu menunggu!",gardenCardText:"Belajar sedikit setiap hari, biarkan pengetahuanmu tumbuh.",visitGarden:"Kunjungi taman",guestMode:"Mode tamu",workspace:"Ruang belajar",signIn:"Masuk / Daftar",goodDay:"HARI YANG INDAH UNTUK BELAJAR",hello:"Halo, Learner!",welcomeSub:"Setiap hal besar dimulai dari rasa ingin tahu yang kecil.",dailyInspiration:"INSPIRASI HARI INI",heroTitle:"Grow your mind,<br>one little step at a time.",heroText:"Tidak perlu terburu-buru. Temukan hal baru, nikmati prosesnya, dan rayakan setiap kemajuanmu.",startExploring:"Mulai menjelajah",learningTime:"Waktu belajar",minutes:"menit",startYourJourney:"Perjalananmu dimulai di sini",totalPoints:"Total poin",collectPoints:"Kumpulkan poin dari aktivitasmu",streak:"Streak belajar",days:"hari",littleByLittle:"Sedikit demi sedikit, setiap hari",discover:"TEMUKAN SESUATU YANG BARU",exploreWorlds:"Jelajahi dunia belajar",seeAll:"Lihat semua",mathDesc:"Angka, pola & logika",scienceDesc:"Jelajahi keajaiban alam",languageDesc:"Kata membuka dunia",techDesc:"Ciptakan sesuatu yang baru",yourJourney:"PERJALANANMU",continueLearning:"Lanjutkan belajar",comingSoon:"SEGERA HADIR",nothingHere:"Belum ada perjalanan belajar",chooseFirst:"Pilih topik yang menarik perhatianmu dan mulai petualangan pertama.",findLesson:"Temukan pelajaran",littleChallenge:"TANTANGAN KECIL",curiosityTitle:"Ikuti rasa ingin tahumu!",curiosityText:"Pilih satu topik baru hari ini. Tidak ada target sempurna, cukup mulai.",oneStep:"Satu langkah kecil",footerQuote:"Made for curious minds, everywhere. ✿",aboutBloomy:"Tentang BLOOMY",modalTitle:"Mulai perjalananmu",modalText:"Kamu bisa menjelajah sebagai tamu atau menyiapkan akun untuk pengalaman personal.",continueGuest:"Lanjut sebagai tamu",createAccount:"Buat akun (segera hadir)",accountNote:"Pendaftaran akun online belum aktif pada versi awal ini."
  },
  en: {
    menu:"MENU",home:"Home",explore:"Explore",myLearning:"My Learning",quiz:"Quiz Center",library:"Library",yourSpace:"YOUR SPACE",garden:"Learning Garden",notes:"My Notes",gardenCardTitle:"Your garden is waiting!",gardenCardText:"Learn a little every day and let your knowledge grow.",visitGarden:"Visit garden",guestMode:"Guest mode",workspace:"Workspace",signIn:"Sign in / Sign up",goodDay:"A LOVELY DAY TO LEARN",hello:"Hello, Learner!",welcomeSub:"Every big thing begins with a little curiosity.",dailyInspiration:"DAILY INSPIRATION",heroTitle:"Grow your mind,<br>one little step at a time.",heroText:"No need to rush. Discover something new, enjoy the process, and celebrate every little win.",startExploring:"Start exploring",learningTime:"Learning time",minutes:"mins",startYourJourney:"Your journey starts here",totalPoints:"Total points",collectPoints:"Collect points as you explore",streak:"Learning streak",days:"days",littleByLittle:"A little bit, every day",discover:"DISCOVER SOMETHING NEW",exploreWorlds:"Explore learning worlds",seeAll:"See all",mathDesc:"Numbers, patterns & logic",scienceDesc:"Explore the wonders of nature",languageDesc:"Words open up the world",techDesc:"Create something new",yourJourney:"YOUR JOURNEY",continueLearning:"Continue learning",comingSoon:"COMING SOON",nothingHere:"No learning journey yet",chooseFirst:"Pick a topic that sparks your interest and start your first adventure.",findLesson:"Find a lesson",littleChallenge:"A LITTLE CHALLENGE",curiosityTitle:"Follow your curiosity!",curiosityText:"Pick one new topic today. No perfect goal needed, just begin.",oneStep:"One little step",footerQuote:"Made for curious minds, everywhere. ✿",aboutBloomy:"About BLOOMY",modalTitle:"Start your journey",modalText:"Explore as a guest or get ready for a more personal experience with an account.",continueGuest:"Continue as guest",createAccount:"Create an account (coming soon)",accountNote:"Online account registration is not active in this early version."
  }
};
let currentLanguage = localStorage.getItem("bloomy-language") || "id";
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600)}
function applyLanguage(){
  document.documentElement.lang=currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key=el.dataset.i18n, value=translations[currentLanguage][key];
    if(value!==undefined) el.innerHTML=value;
  });
  document.querySelector("#languageToggle b").textContent=currentLanguage.toUpperCase();
  localStorage.setItem("bloomy-language",currentLanguage);
  updateDate();
}
function updateDate(){
  const locale=currentLanguage==="id"?"id-ID":"en-US";
  document.getElementById("todayLabel").textContent=new Intl.DateTimeFormat(locale,{weekday:"short",day:"numeric",month:"short"}).format(new Date());
}
document.getElementById("languageToggle").addEventListener("click",()=>{currentLanguage=currentLanguage==="id"?"en":"id";applyLanguage();showToast(currentLanguage==="id"?"Bahasa Indonesia aktif":"English is now active")});
const overlay=document.getElementById("modalOverlay");
function openModal(){overlay.classList.add("open");overlay.setAttribute("aria-hidden","false")}
function closeModal(){overlay.classList.remove("open");overlay.setAttribute("aria-hidden","true")}
document.getElementById("accountButton").addEventListener("click",openModal);
document.getElementById("profileButton").addEventListener("click",openModal);
document.getElementById("modalClose").addEventListener("click",closeModal);
document.getElementById("guestContinue").addEventListener("click",()=>{closeModal();showToast(currentLanguage==="id"?"Kamu sedang menjelajah sebagai tamu 🌷":"You're exploring as a guest 🌷")});
document.getElementById("createAccount").addEventListener("click",()=>showToast(currentLanguage==="id"?"Fitur akun akan hadir pada tahap berikutnya.":"Account features are coming in a later stage."));
overlay.addEventListener("click",e=>{if(e.target===overlay)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
document.getElementById("notificationButton").addEventListener("click",()=>showToast(currentLanguage==="id"?"Belum ada notifikasi baru.":"No new notifications."));
const sidebar=document.getElementById("sidebar");
document.getElementById("menuToggle").addEventListener("click",()=>sidebar.classList.toggle("open"));
document.addEventListener("click",e=>{if(window.innerWidth<=760&&!sidebar.contains(e.target)&&!e.target.closest("#menuToggle"))sidebar.classList.remove("open")});
const pageLabels={home:["home","Beranda"],explore:["explore","Jelajahi"],learning:["myLearning","Belajarku"],quiz:["quiz","Pusat Kuis"],library:["library","Perpustakaan"],garden:["garden","Taman Belajar"],notes:["notes","Catatan"]};
function navigate(page){
 const [key,fallback]=pageLabels[page]||["explore","Jelajahi"];
 const label=translations[currentLanguage][key]||fallback;
 document.getElementById("pageName").textContent=label;
 document.querySelectorAll(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.page===page));
 sidebar.classList.remove("open");
 if(page!=="home") showToast(currentLanguage==="id"?`${label} akan dikembangkan pada stage berikutnya.`:`${label} will be developed in a future stage.`);
}
document.querySelectorAll("[data-page]").forEach(link=>link.addEventListener("click",e=>{
 const page=link.dataset.page;
 if(page){e.preventDefault();history.replaceState(null,"",`#${page}`);navigate(page)}
}));
document.querySelectorAll(".subject-card").forEach(card=>card.addEventListener("click",e=>{e.preventDefault();showToast(currentLanguage==="id"?"Halaman materi akan hadir pada Stage 2.":"Subject lessons are coming in Stage 2.")}));
window.addEventListener("hashchange",()=>navigate(location.hash.slice(1)||"home"));
applyLanguage();
if(location.hash) navigate(location.hash.slice(1));
