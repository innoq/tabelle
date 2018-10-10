import { find, replaceNode, prependChild } from 'uitil/dom'
import { createElement } from 'uitil/dom/create'

let id = 0

function idGen () {
  return 'arrowId' + id++
}

function arrowRadio (id, name, direction) {
  return createElement('input', { id: id, class: 'tabelle-arrow', type: 'radio', name: name + 'Sort', value: direction })
}

function arrowLabel (id, direction) {
  return createElement('label', { for: id, class: 'tabelle-arrow--' + direction })
}

function createHeader (name, tdContent, filter) {
  const header = createElement('span', { class: 'header' }, tdContent)
  const idUp = idGen()
  const upRadio = arrowRadio(idUp, name, 'asc')
  const upLabel = arrowLabel(idUp, 'asc')

  const idDown = idGen()
  const downRadio = arrowRadio(idDown, name, 'desc')
  const downLabel = arrowLabel(idDown, 'desc')

  const input = filter || createElement('input', { type: 'text', name: name + 'Search', class: 'tabelle-input' })

  return createElement('div', { class: 'tabelle-header' },
    header, upRadio, upLabel, downRadio, downLabel, input)
}

function createForm (uri) {
  const submitButton = createElement('input', { type: 'submit', class: 'hide' })
  return createElement('form', { action: uri }, submitButton)
}

function extractContent (el) {
  if (el.childElementCount) {
    return el.children
  }
  return el.textContent
}

class Tabelle extends HTMLElement {
  connectedCallback () {
    console.log(this.headers)
    this.createForm()
    this.transformHeaders()
  }

  createForm () {
    const form = createForm(this.action)
    prependChild(form, this)
    prependChild(this.table, form)
  }

  transformHeaders () {
    this.headers
      .filter ( th => th.getAttribute('name') )
      .forEach ( th => {
        const name = th.getAttribute('name')
        const headerContent = extractContent(th)
        const newContent = createHeader(name, headerContent)
        replaceNode(th, createElement('th', {}, newContent))
      })
  }

  get headers () {
    return find(this, 'thead th')
  }

  get action () {
    return this.getAttribute('search-src')
  }

  get table () {
    return this.querySelector('table')
  }
}

customElements.define('ta-belle', Tabelle)