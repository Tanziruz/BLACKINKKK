import { FirebaseApp, FirebaseServerAppSettings } from "firebase/app";

export interface FirebaseServerApp extends FirebaseApp {
    name: string;
    readonly settings: FirebaseServerAppSettings;
}