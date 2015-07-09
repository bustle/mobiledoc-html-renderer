import Renderer from './html-renderer';

export function registerGlobal(window) {
  window.MobiledocHTMLRenderer = Renderer;
}

export default Renderer;
