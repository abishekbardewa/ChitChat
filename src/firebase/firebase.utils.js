import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
	apiKey: 'AIzaSyALDG-f1O2hkmSSukjOlpztgsZPHc0Erg4',
	authDomain: 'slack-clone-e80f3.firebaseapp.com',
	projectId: 'slack-clone-e80f3',
	storageBucket: 'slack-clone-e80f3.appspot.com',
	messagingSenderId: '729013773601',
	appId: '1:729013773601:web:864c7ed515110fa45b8a60',
	measurementId: 'G-NQ8Y0MJ1ZV',
};
// Initialize Firebase
firebase.initializeApp(config);
export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
