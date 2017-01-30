import { jsdom } from 'jsdom';
import setupBrowserGlobals from 'jsdom-global';


setupBrowserGlobals();

global.document = jsdom('');
global.window = document.defaultView;
global.navigator = { userAgent: 'node.js' };
global.gettext = str => str;
