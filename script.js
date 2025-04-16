document.querySelector('.menu-button').addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('hidden');
  });
  async function sharePost() {
    const { db, collection, addDoc, auth } = window.firebaseStuff;
    const title = document.getElementById("postTitle").value;
    const message = document.getElementById("postMessage").value;
    const imageUrl = document.getElementById("uploadcareInput").value;
  
    const user = auth.currentUser;
    if (!user) {
        alert("Lütfen paylaşım yapmadan önce giriş yapın.");
        return;
    }
      await addDoc(collection(db, "posts"), {
        title,
        message,
        imageUrl,
        createdAt: new Date(),
        userId: user.uid, //Kullanıcı bilgisi
      });
      alert("Gönderi paylaşıldı!");
      loadPosts(); 
    } try {
    }catch (err) {
      alert("Hata: " + err.message);
    }

  async function loadPosts() {
    const { db, collection, getDocs } = window.firebaseStuff;
    const querySnapshot = await getDocs(collection(db, "posts"));
    const postsContainer = document.getElementById("postsContainer");
  
    postsContainer.innerHTML = ""; // Önce temizle
  
    querySnapshot.forEach((doc) => {
      const post = docSnap.data();
      const postId = docSnap.id;
  
      const postCard = document.createElement("div");
      postCard.className = "post-card";

      const user = window.firebaseStuff.auth.currentUser;
  
      postCard.innerHTML = `
      ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post image">` : ""}
      <div class="post-title">${post.title}</div>
      <div class="post-message">${post.message}</div>
      <div class="post-likes">
  <button onclick="toggleLike('${postId}')">❤️ Beğen</button>
  <span id="like-count-${postId}">${post.likeCount || 0}</span>
</div>
      $ {
      user && user.uid === post.userId

      ? `<button onclick= "deletePost('${doc.id}')" class="delete-btn">Sil</button>`
      : "" 
      

    }
    
    `;
    
  
      postsContainer.appendChild(postCard);
    });
  }
  
  // Sayfa yüklenince çağır:
  window.addEventListener("DOMContentLoaded", loadPosts);
  async function deletePost(postId) {
    const { db, collection, getDocs, deleteDoc, doc } = window.firebaseStuff;
  
    if (confirm("Bu gönderiyi silmek istediğine emin misin?")) {
      await deleteDoc(doc(db, "posts", postId));
      loadPosts(); // Silindikten sonra tekrar yükle
    }
  }
  async function addComment(postId, commentText) {
    const { db, collection, addDoc, auth, doc } = window.firebaseStuff;
  
    const user = auth.currentUser;
    if (!user) {
      alert("Yorum yapmadan önce giriş yapmalısınız.");
      return;
    }
  
    const commentsRef = collection(doc(db, "posts", postId), "comments");
  
    const coommentsSnap = await getDocs(commentsRe);
    let commentsHml = "";
    commentsSnap.forEach((c) => {
        const data = c.data();
        commentsHtml += `<div class="comment">💬 ${data.text}</div>`;

    });
    postCard.innerHTML = `...`; 
 


    postsContainer.appendChild(postCard);
  });

      text: commentText
      userId: user.uid,
      createdAt: new Date()
    });
  
    loadPosts(); // Yorum eklenince güncelle
  }
  querySnapshot.forEach(async (docSnap) => {
    const post = docSnap.data();
    const postId = docSnap.id;
  
    const postCard = document.createElement("div");
    postCard.className = "post-card";
  
    const user = window.firebaseStuff.auth.currentUser;
  
    // Yorumları çek
    const commentsRef = collection(doc(db, "posts", postId), "comments");
    const commentsSnap = await getDocs(commentsRef);
    let commentsHtml = "";
    commentsSnap.forEach((c) => {
      const data = c.data();
      commentsHtml += `<div class="comment">💬 ${data.text}</div>`;
    });
  
    postCard.innerHTML = `
      ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post image">` : ""}
      <div class="post-title">${post.title}</div>
      <div class="post-message">${post.message}</div>
      ${
        user && user.uid === post.userId
          ? `<button onclick="deletePost('${postId}')" class="delete-btn">Sil</button>`
          : ""
      }
      <div class="comments">${commentsHtml}</div>
      ${
        user
          ? `
        <input type="text" placeholder="Yorum yaz..." id="comment-${postId}" class="comment-input"/>
        <button onclick="addComment('${postId}', document.getElementById('comment-${postId}').value)" class="comment-btn">Gönder</button>
        `
          : `<div class="comment-login-msg">Yorum yapabilmek için giriş yapın.</div>`
      }
    `;
  
    postsContainer.appendChild(postCard);
  });
  async function login() {
    const { auth, signInWithEmailAndPassword } = window.firebaseStuff;
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      showUserInfo(userCredential.user);
    } catch (error) {
      document.getElementById("authMessage").innerText = error.message;
    }
  }
  
  async function register() {
    const { auth, createUserWithEmailAndPassword } = window.firebaseStuff;
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      showUserInfo(userCredential.user);
    } catch (error) {
      document.getElementById("authMessage").innerText = error.message;
    }
  }
  
  function logout() {
    const { auth, signOut } = window.firebaseStuff;
    signOut(auth).then(() => {
      document.getElementById("userBox").style.display = "none";
      document.getElementById("authMessage").innerText = "Çıkış yapıldı.";
    });
  }
  
  function showUserInfo(user) {
    document.getElementById("userEmail").innerText = `Hoş geldin: ${user.email}`;
    document.getElementById("userBox").style.display = "block";
    document.getElementById("authMessage").innerText = "";
  }
  firebaseStuff.auth.onAuthStateChanged((user) => {
    if (user) {
      showUserInfo(user);
    }
  });
  // firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB3EVHoelP1NsIgPvN1ysNCVdzONJwWuDE",
    authDomain: "ankabetik.firebaseapp.com",
    projectId: "ankabetik",
    storageBucket: "ankabetik.firebasestorage.app",
    messagingSenderId: "10034574423",
    appId: "1:10034574423:web:fbfe5e745913bf05b15f12",
    measurementId: "G-E7CHKH5BYC"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.firebaseStuff = {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  db,
};
// Giriş/Kayıt Modülünü Açma/Kapama
function toggleAuthBox() {
    const authBox = document.getElementById("authBox");
    const displayStyle = authBox.style.display === "none" ? "block" : "none";
    authBox.style.display = displayStyle;
  }
  
  // Giriş Yap
  async function login() {
    const { auth, signInWithEmailAndPassword } = window.firebaseStuff;
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      showUserInfo(userCredential.user);
      toggleAuthBox(); // Modülü kapat
    } catch (error) {
      document.getElementById("authMessage").innerText = error.message;
    }
  }
  
  // Kayıt Ol
  async function register() {
    const { auth, createUserWithEmailAndPassword } = window.firebaseStuff;
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      showUserInfo(userCredential.user);
      toggleAuthBox(); // Modülü kapat
    } catch (error) {
      document.getElementById("authMessage").innerText = error.message;
    }
  }
  
  // Kullanıcı Bilgilerini Göster
  function showUserInfo(user) {
    document.getElementById("userEmail").innerText = `Hoş geldin: ${user.email}`;
    document.getElementById("userBox").style.display = "block";
    document.getElementById("authMessage").innerText = "";
  }
  
  // Çıkış Yap
  function logout() {
    const { auth, signOut } = window.firebaseStuff;
    signOut(auth).then(() => {
      document.getElementById("userBox").style.display = "none";
      document.getElementById("authMessage").innerText = "Çıkış yapıldı.";
    });
  }
  
  // Kullanıcı Durumunu Kontrol Et
  firebaseStuff.auth.onAuthStateChanged((user) => {
    if (user) {
      showUserInfo(user);
    }
  });
  // Menü Modülünü Açma/Kapama
function toggleMenu() {
    const menuBox = document.getElementById("menuBox");
    const displayStyle = menuBox.style.display === "none" ? "block" : "none";
    menuBox.style.display = displayStyle;
  }
  
  // Giriş/Kayıt Modülünü Açma/Kapama
  function toggleAuthBox() {
    const authBox = document.getElementById("authBox");
    const displayStyle = authBox.style.display === "none" ? "block" : "none";
    authBox.style.display = displayStyle;
  }
  
  // Giriş Fonksiyonu (Firebase ile entegre edilecek)
  function login() {
    // Giriş işlemleri yapılacak.
  }
  
  // Kayıt Fonksiyonu (Firebase ile entegre edilecek)
  function register() {
    // Kayıt işlemleri yapılacak.
  }
  async function toggleLike(postId) {
    const { db, collection, doc, getDoc, setDoc, deleteDoc, auth } = window.firebaseStuff;
    const user = auth.currentUser;
    if (!user) {
      alert("Beğenmek için giriş yapmalısın.");
      return;
    }
  
    const postRef = doc(db, "posts", postId);
    const likeRef = doc(collection(postRef, "likes"), user.uid);
    const postSnap = await getDoc(postRef);
    const likeSnap = await getDoc(likeRef);
  
    let likeCount = postSnap.data().likeCount || 0;
  
    if (likeSnap.exists()) {
      // Zaten beğenmişse, beğeniyi kaldır
      await deleteDoc(likeRef);
      likeCount--;
    } else {
      // İlk defa beğeniyorsa
      await setDoc(likeRef, { liked: true });
      likeCount++;
    }
  
    await setDoc(postRef, { likeCount }, { merge: true });
  
    // Sayfadaki beğeni sayısını güncelle
    document.getElementById(`like-count-${postId}`).innerText = likeCount;
  }
  function toggleAuthBox() {
    const authBox = document.getElementById("authBox");
    authBox.style.display = authBox.style.display === "none" ? "block" : "none";
  }
  
  // Sekmeler arası geçiş
  function showLogin() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
  }
  
  function showRegister() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
  }
  
  // Giriş
  async function login() {
    const { auth, signInWithEmailAndPassword } = window.firebaseStuff;
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      showUserInfo(userCredential.user);
      document.getElementById("authBox").style.display = "none"; // formu gizle
    } catch (error) {
      document.getElementById("authMessage").innerText = error.message;
    }
  }
  
  // Kayıt
  async function register() {
    const { auth, createUserWithEmailAndPassword } = window.firebaseStuff;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      showUserInfo(userCredential.user);
      document.getElementById("authBox").style.display = "none";
    } catch (error) {
      document.getElementById("authMessage").innerText = error.message;
    }
  }
  
  // Kullanıcı Bilgisi Göster
  function showUserInfo(user) {
    document.getElementById("userEmail").innerText = `Hoş geldin: ${user.email}`;
    document.getElementById("userBox").style.display = "block";
  }
  
  // Otomatik giriş kontrolü
  firebaseStuff.auth.onAuthStateChanged((user) => {
    if (user) {
      showUserInfo(user);
    }
  });
  function toggleRegisterForm() {
    const extra = document.getElementById("registerExtra");
    const btn = document.getElementById("registerBtn");
    if (extra.style.display === "none") {
      extra.style.display = "block";
      btn.style.display = "inline-block";
    } else {
      extra.style.display = "none";
      btn.style.display = "none";
    }
  }
  
  async function register() {
    const { auth, createUserWithEmailAndPassword, db, collection, addDoc } = window.firebaseStuff;
  
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const name = document.getElementById("nameInput").value;
    const surname = document.getElementById("surnameInput").value;
    const birth = document.getElementById("birthInput").value;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Ekstra bilgileri Firestore'a kaydet
      await addDoc(collection(db, "userProfiles"), {
        uid: user.uid,
        name,
        surname,
        birth,
        email
      });
  
      showUserInfo(user);
      toggleAuthBox();
    } catch (error) {
      document.getElementById("authMessage").innerText = error.message;
    }
  }
  
  async function register() {
    const { auth, createUserWithEmailAndPassword } = window.firebaseStuff;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      toggleRegisterForm(); // formu kapat
    } catch (error) {
      alert("Hata: " + error.message);
    }
  }
  async function register() {
    const { auth, createUserWithEmailAndPassword } = window.firebaseStuff;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      alert("Kayıt başarılı!");
    } catch (error) {
      alert("Hata: " + error.message);
    }
  }
  