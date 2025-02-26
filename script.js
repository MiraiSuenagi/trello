// Импорт Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Конфигурация Firebase
const firebaseConfig = {
 	apiKey: "AIzaSyANrrrtTUCnTknIzjBh1WZ0qIILwn1Y8Mk",
            authDomain: "trello1231-3365e.firebaseapp.com",
            projectId: "trello1231-3365e",
            storageBucket: "trello1231-3365e.firebasestorage.app",
            messagingSenderId: "176568505073",
            appId: "1:176568505073:web:7f4fc8fa5315fd2f490f50",
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Элементы DOM
const authContainer = document.getElementById('auth-container');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const usernameInput = document.getElementById('username');
const signInButton = document.getElementById('sign-in');
const signUpButton = document.getElementById('sign-up');
const toggleRegisterButton = document.getElementById('toggle-register');
const navbar = document.querySelector('.navbar');
const boardHeader = document.querySelector('.board-header');
const boardContent = document.getElementById('boardContent');
const signOutButton = document.getElementById('sign-out');

// Переменные для данных
let lists = [];
let cards = [];
let nextListId = 1;
let nextCardId = 1;
let cardBeingDragged = null;
let dropTarget = null;
let currentCardId = null;

// Функция для показа формы авторизации
function showAuthForm() {
    authContainer.style.display = 'flex';
    navbar.style.display = 'none';
    boardHeader.style.display = 'none';
    boardContent.style.display = 'none';
    signOutButton.style.display = 'none';
}

// Функция для показа контента приложения
function showAppContent() {
    authContainer.style.display = 'none';
    navbar.style.display = 'flex';
    boardHeader.style.display = 'flex';
    boardContent.style.display = 'flex';
    signOutButton.style.display = 'block';
}

// Переключение между входом и регистрацией
toggleRegisterButton.addEventListener('click', function() {
    if (usernameInput.style.display === 'none') {
        usernameInput.style.display = 'block';
        signInButton.style.display = 'none';
        signUpButton.style.display = 'block';
        toggleRegisterButton.textContent = 'Перейти к входу';
    } else {
        usernameInput.style.display = 'none';
        signInButton.style.display = 'block';
        signUpButton.style.display = 'none';
        toggleRegisterButton.textContent = 'Перейти к регистрации';
    }
});

// Регистрация пользователя
signUpButton.addEventListener('click', async function() {
    const email = emailInput.value;
    const password = passwordInput.value;
    const username = usernameInput.value;

    if (!email || !password || !username) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Сохраняем имя пользователя в Firestore
        await setDoc(doc(db, 'users', user.uid), {
            username: username,
            email: email
        });

        console.log('User signed up:', user);
        showAppContent();
    } catch (error) {
        console.error('Error signing up:', error.message);
        alert('Ошибка регистрации: ' + error.message);
    }
});

// Вход пользователя
signInButton.addEventListener('click', async function() {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User signed in:', user);
        showAppContent();
    } catch (error) {
        console.error('Error signing in:', error.message);
        alert('Ошибка входа: ' + error.message);
    }
});

// Выход из системы
signOutButton.addEventListener('click', function() {
    signOut(auth).then(() => {
        console.log('User signed out');
        showAuthForm();
    }).catch((error) => {
        console.error('Error signing out:', error.message);
    });
});

// Отслеживание состояния аутентификации
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in:', user);
        showAppContent();
        loadData(); // Загружаем данные при входе
    } else {
        console.log('User is signed out');
        showAuthForm();
    }
});

// Загрузка данных из Firestore
async function loadData() {
    const listsSnapshot = await getDocs(collection(db, 'lists'));
    listsSnapshot.forEach(doc => {
        const list = doc.data();
        lists.push(list);
        renderList(list);
    });

    const cardsSnapshot = await getDocs(collection(db, 'cards'));
    cardsSnapshot.forEach(doc => {
        const card = doc.data();
        cards.push(card);
        renderCard(card);
    });
}

// Сохранение списка в Firestore
async function saveList(list) {
    await addDoc(collection(db, 'lists'), list);
}

// Сохранение карточки в Firestore
async function saveCard(card) {
    await addDoc(collection(db, 'cards'), card);
}

// Остальной код вашего приложения
document.addEventListener('DOMContentLoaded', function() {
    // Ваш код для работы с досками и карточками
});