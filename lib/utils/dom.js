const VOID_TAGS = 'area base br col command embed hr img input keygen link meta param source track wbr'.split(' ');

class Element {
  constructor(tagName) {
    this.tagName = tagName.toLowerCase();
    this.isVoid = VOID_TAGS.indexOf(this.tagName) !== -1;
    this.childNodes = [];
    this.attributes = [];
  }

  appendChild(element) {
    this.childNodes.push(element);
  }

  setAttribute(propName, propValue) {
    this.attributes.push(propName, propValue);
  }

  toString() {
    let html = `<${this.tagName}`;

    if (this.attributes.length) {
      for (let i=0; i < this.attributes.length; i=i+2) {
        let propName = this.attributes[i],
            propValue = this.attributes[i+1];
        html += ` ${propName}="${propValue}"`;
      }
    }
    html += `>`;

    if (!this.isVoid) {
      for (let i=0; i<this.childNodes.length; i++) {
        html += this.childNodes[i].toString();
      }
      html += `</${this.tagName}>`;
    }

    return html;
  }
}

function addHTMLSpaces(text) {
  return text.replace(/  /g, ' &nbsp;');
}

class TextNode {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return addHTMLSpaces(this.value);
  }
}

export function createElement(tagName) {
  return new Element(tagName);
}

export function appendChild(target, child) {
  target.appendChild(child);
}

export function createTextNode(text) {
  return new TextNode(text);
}

export function setAttribute(element, propName, propValue) {
  element.setAttribute(propName, propValue);
}

export function createDocumentFragment() {
  return createElement('div');
}

export function normalizeTagName(name) {
  return name.toLowerCase();
}
