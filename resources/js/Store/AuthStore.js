import {observable, action, makeAutoObservable} from "mobx";
import jwt_decode from "jwt-decode";
import CryptoJS from 'crypto-js';
import sign from 'jwt-encode';
class AuthStore {
    appState = null;

    constructor() {
        makeAutoObservable(this, {
            appState: observable,
            saveToken: action,
            getToken: action,
        });
    }

    saveToken = (appState) => {
        try {
            localStorage.setItem('appState', CryptoJS.AES.encrypt(sign(appState,"secret"),"udemy-laravel-js").toString());
            this.getToken();
        } catch (e) {
            console.log(e)
        }
    }

    getToken = () => {
        try {
            const appSateData = localStorage.getItem("appState");
            if (appSateData) {
                var bytes = CryptoJS.AES.decrypt(appSateData,'udemy-laravel-js');
                var orginalText = bytes.toString(CryptoJS.enc.Utf8);
                this.appState = jwt_decode(orginalText);
            } else {
                this.appState = null;
            }

        } catch (e) {
            console.log(e)
        }
    }

    removeToken = () => {
        localStorage.removeItem("appState");
        this.appState = null;
    }
}

export default new AuthStore();
