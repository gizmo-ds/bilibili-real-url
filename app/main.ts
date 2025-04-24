import { ViteSSG } from 'vite-ssg/single-page';
import 'virtual:uno.css';
import 'vfonts/FiraCode.css';
import './style.scss';
import App from './App.vue';

export const createApp = ViteSSG(App);
