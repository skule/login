// initializing Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyAeYLGQoI_WiHLOfl8ECzmnGXv4m_11Ids",
    authDomain: "skule-ca.firebaseapp.com",
    projectId: "skule-ca",
    storageBucket: "skule-ca.appspot.com",
    messagingSenderId: "835757294370",
    appId: "1:835757294370:web:0628ddbd27de0259199b7b",
    measurementId: "G-Q83KN6Q5SY"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: window.location, // redirect back to this page
    // This must be true email link sign-in
    handleCodeInApp: true
};

// handle the form submission
const form = document.getElementById('login-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    document.getElementById('login-form-email').disabled = true;
    document.getElementById('login-form-submit').className = "button is-link is-loading";
    var formData = new FormData(form);
    var email = formData.get('email');
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            window.localStorage.setItem('emailForSignIn', email);
            document.getElementById('response-message').className = "message is-success";
            document.getElementById('response-message-header').innerHTML = "Success";
            document.getElementById('response-message-body').innerHTML = "An email has been sent to you with a link to sign in. Please check your email.";
        })
        .catch((error) => {
            document.getElementById('response-message').className = "message is-danger";
            document.getElementById('response-message-header').innerHTML = "Error";
            document.getElementById('response-message-body').innerHTML = error;
        });
});

// check if the user has signed in with email link
if (isSignInWithEmailLink(auth, window.location.href)) {
    var email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again.
        email = window.prompt('Please provide your email for confirmation');
    }
    // The client SDK will parse the code from the link for you.
    signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
            // clear the email from storage
            window.localStorage.removeItem('emailForSignIn');
            document.getElementById('response-message').className = "message is-success";
            document.getElementById('response-message-header').innerHTML = "Welcome" + result.user.email;
            document.getElementById('response-message-body').innerHTML = "You have signed in successfully. You will be redirected to the page you were trying to access shortly.";
            // get url from query string gotten from window.location.search, tag is redirect
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            window.location = redirect ? redirect : '/';
        })
        .catch((error) => {
            document.getElementById('response-message').className = "message is-danger";
            document.getElementById('response-message-header').innerHTML = "Error";
            document.getElementById('response-message-body').innerHTML = error;
        });
}

document.addEventListener('DOMContentLoaded', () => {
    (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
        const $notification = $delete.parentNode;
        $delete.addEventListener('click', () => {
            $notification.parentNode.removeChild($notification);
        });
    });
});