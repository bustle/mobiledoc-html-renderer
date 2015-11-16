import ImageCard from "./cards/image";

/**
 * runtime HTML renderer
 * renders a mobiledoc to HTML
 *
 * input: mobiledoc
 * output: HTML
 */

import utils from './utils/dom';
const { createElement, createTextNode, setAttribute, appendChild } = utils;

function createElementFromMarkerType([tagName, attributes]=['', []]){
  let element = createElement(tagName);
  attributes = attributes || [];

  for (let i=0,l=attributes.length; i<l; i=i+2) {
    let propName = attributes[i],
        propValue = attributes[i+1];
    setAttribute(element, propName, propValue);
  }
  return element;
}

function setDefaultCards(cards) {
  cards.image = cards.image || ImageCard;
}

export default class Renderer {
  /**
   * @param mobiledoc
   * @param {Array} cards
   * @return {String}
   */
  render({version, sections: sectionData}, cards={}) {
    const [markerTypes, sections] = sectionData;
    this.root = createElement('div');
    this.cards = cards;
    setDefaultCards(this.cards);
    this.markerTypes = markerTypes;

    sections.forEach((section) => this.renderSection(section));

    return this.root.toString();
  }

  renderSection(section) {
    const [type] = section;
    let rendered;
    switch (type) {
      case 1: // markup section
        rendered = this.renderMarkupSection(section);
        appendChild(this.root, rendered);
        break;
      case 2:
        rendered = this.renderImageSection(section);
        appendChild(this.root, rendered);
        break;
      case 3: // list section
        rendered = this.renderListSection(section);
        appendChild(this.root, rendered);
        break;
      case 10: // card section
        rendered = this.renderCardSection(section);
        appendChild(this.root, rendered);
        break;
      default:
        throw new Error('Unimplement renderer for type ' + type);
    }
  }

  renderListSection([type, tagName, items]) {
    const element = createElement(tagName);
    items.forEach(li => {
      appendChild(element, this.renderListItem(li));
    });
    return element;
  }

  renderListItem(markers) {
    const element = createElement('li');
    this._renderMarkersOnElement(element, markers);
    return element;
  }

  renderImageSection([type, url]) {
    let element = createElement('img');
    setAttribute(element, 'src', url);
    return element;
  }

  renderCardSection([type, name, payload]) {
    let element;
    if (this.cards && this.cards[name]) {
      element = createElement('div');
      let buffer = [];
      this.cards[name].html.setup(buffer, {}, {}, payload);
      buffer.forEach(string => {
        appendChild(element, createTextNode(string));
      });
    } else if (payload.src) {
      element = createElement('img');
      setAttribute(element, 'src', payload.src);
    } else {
      element = createElement('p');
    }
    return element;
  }

  renderMarkupSection([type, tagName, markers]) {
    const element = createElement(tagName);
    this._renderMarkersOnElement(element, markers);
    return element;
  }

  _renderMarkersOnElement(element, markers) {
    let elements = [element];
    let currentElement = element;

    for (let i=0, l=markers.length; i<l; i++) {
      let marker = markers[i];
      let [openTypes, closeTypes, text] = marker;

      for (let j=0, m=openTypes.length; j<m; j++) {
        let markerType = this.markerTypes[openTypes[j]];
        let openedElement = createElementFromMarkerType(markerType);
        appendChild(currentElement, openedElement);
        elements.push(openedElement);
        currentElement = openedElement;
      }

      appendChild(currentElement, createTextNode(text));

      for (let j=0, m=closeTypes; j<m; j++) {
        elements.pop();
        currentElement = elements[elements.length - 1];
      }
    }
  }
}
