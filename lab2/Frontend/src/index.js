import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import unregister from './registerServiceWorker';
import {store, persistor} from "./js/store/index";
//import store from "./js/store/index";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';

// ReactDOM.render(<Provider store={store}><App /></Provider>, 
//     document.getElementById('root'));


ReactDOM.render(<Provider store={store}><PersistGate loading={null} persistor={persistor}><App /></PersistGate></Provider>, 
    document.getElementById('root'));

unregister();
