// initializing Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// requires firebaseConfig to be placed correctly in root of the main project
import { firebaseConfig } from "../firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const actionCodeSettings = {
    // URL you want to redirect back to. The domain for this URL must be in the authorized domains list in the Firebase Console.
    url: window.location.href, // redirect back to this login page, keep the redirect query string
    // This must be true for email link sign-in
    handleCodeInApp: true
};

// handle the form submission
const form = document.getElementById('login-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    var formData = new FormData(form);
    var email = formData.get('email');
    document.getElementById('login-form-email').disabled = true;
    document.getElementById('login-form-submit').className = "button is-link is-loading";
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            window.localStorage.setItem('emailForSignIn', email);
            document.getElementById('response-message').className = "message is-success";
            document.getElementById('response-message-header').innerHTML = "Success";
            document.getElementById('response-message-body').innerHTML = "An email has been sent to you with a link to sign in. Please check your email.";
            document.getElementById('login-form-email').disabled = false;
            document.getElementById('login-form-submit').className = "button is-link";
        })
        .catch((error) => {
            document.getElementById('response-message').className = "message is-danger";
            document.getElementById('response-message-header').innerHTML = "Error";
            document.getElementById('response-message-body').innerHTML = error;
            document.getElementById('login-form-email').disabled = false;
            document.getElementById('login-form-submit').className = "button is-link";
            //console.log(error);
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
            document.getElementById('login-form-email').disabled = false;
            document.getElementById('login-form-submit').className = "button is-link";
            // get url from query string gotten from window.location.search, tag is redirect
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            window.location.replace(redirect ? redirect : '/');
        })
        .catch((error) => {
            document.getElementById('response-message').className = "message is-danger";
            document.getElementById('response-message-header').innerHTML = "Error";
            document.getElementById('response-message-body').innerHTML = error;
            document.getElementById('login-form-email').disabled = false;
            document.getElementById('login-form-submit').className = "button is-link";
        });
}

