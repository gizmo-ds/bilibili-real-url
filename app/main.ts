import { ViteSSG } from 'vite-ssg/single-page';
import 'virtual:uno.css';
import 'vfonts/Lato.css';
import './style.scss';
import App from './App';

export const createApp = ViteSSG(App);
