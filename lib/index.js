import Renderer from './renderer';

export function registerGlobal(window) {
  window.MobiledocHTMLRenderer = Renderer;
}

export default Renderer;
