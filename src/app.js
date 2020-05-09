import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import './styles/styles.scss';

import Header from './components/Header';
import Container from './components/Container';

const jsx = (
    <React.Fragment>
        <Header />
        <Container />
    </React.Fragment>
);

ReactDOM.render(jsx, document.getElementById('app'));
