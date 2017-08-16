// Add JavaScript imports here
import renderNavigationBar from './components/NavigationBar';

// Add style imports here
import '../scss/main.scss';


function initApp(navBarContainer) {
    renderNavigationBar(navBarContainer);
}


export { initApp };  // eslint-disable-line import/prefer-default-export
