class Element {
  constructor(tagName) {
    this.tagName = tagName.toLowerCase();
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

    for (let i=0; i<this.childNodes.length; i++) {
      html += this.childNodes[i].toString();
    }
    html += `</${this.tagName}>`;
    return html;
  }
}

class TextNode {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

class Document {
  createElement(tagName) {
    return new Element(tagName);
  }
  createTextNode(text) {
    return new TextNode(text);
  }
}

const doc = new Document();

export default {
  createElement(tagName) {
    return doc.createElement(tagName);
  },
  appendChild(target, child) {
    target.appendChild(child);
  },
  createTextNode(text) {
    return doc.createTextNode(text);
  },
  setAttribute(element, propName, propValue) {
    element.setAttribute(propName, propValue);
  }
};
