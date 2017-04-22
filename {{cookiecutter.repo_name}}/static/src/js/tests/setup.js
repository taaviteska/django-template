import { jsdom } from 'jsdom';
import setupBrowserGlobals from 'jsdom-global';


setupBrowserGlobals();

global.document = jsdom('');
global.window = document.defaultView;
global.navigator = { userAgent: 'node.js' };
global.gettext = str => str;
global.DJ_CONST = {
    USER: {
        id: 1,
        username: 'taavi',
        email: 'taavi@test.com',
        full_name: 'Taavi Teska',
        timezone: 'Europe/Tallinn',
    },
};
