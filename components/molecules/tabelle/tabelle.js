import { find, replaceNode, prependChild } from 'uitil/dom'
import { createElement } from 'uitil/dom/create'
import { submit } from 'uitil/dom/forms'
import debounce from 'uitil/debounce'

let id = 0

function template2dom (htmlString, selector) {
  let tmp = document.createElement('template')
  tmp.innerHTML = htmlString.trim()
  return selector ? tmp.content.querySelector(selector) : tmp.content.firstChild
}

function idGen () {
  return 'arrowId' + id++
}

function arrowRadio (id, name, direction) {
  return createElement('input', { id: id, class: 'tabelle-arrow', type: 'radio', name: "sort", value: name + "-" + direction })
}

function arrowLabel (id, direction) {
  return createElement('label', { for: id, class: 'tabelle-arrow--' + direction })
}

function createHeader ({ name, input, value }, tdContent) {
  const header = createElement('span', { class: 'header' }, tdContent)
  const idUp = idGen()
  const upRadio = arrowRadio(idUp, name, 'asc')
  const upLabel = arrowLabel(idUp, 'asc')

  const idDown = idGen()
  const downRadio = arrowRadio(idDown, name, 'desc')
  const downLabel = arrowLabel(idDown, 'desc')

  const filter = input || createElement('input', { type: 'text', name: name, class: 'tabelle-input', value: value || '' })

  return createElement('div', { class: 'tabelle-header' },
    header, upRadio, upLabel, downRadio, downLabel, filter)
}

function createForm (uri) {
  const submitButton = createElement('input', { type: 'submit', class: 'hide' })
  return createElement('form', { action: uri }, submitButton)
}

function extractContent (el) {
  if (el.childNodes.length) {
    return el.childNodes[0]
  }
  return el.textContent
}

class Tabelle extends HTMLElement {
  connectedCallback () {
    this.table.classList.add('tabelle')
    this.createForm()
    this.transformHeaders()

    this.arrows.forEach(el => this.submitOnChange(el))
    this.textFilters.forEach(el => this.submitOnKeyup(el))
    this.selectFilters.forEach(el => this.submitOnChange(el))

    this.form.addEventListener('submit', ev => {
      ev.preventDefault()
      this.submitForm()
    })

    if (this.changeUri) {
      window.onpopstate = ev => this.restoreState(ev.state)
    }
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
        const value = th.getAttribute('value')
        const headerContent = extractContent(th)
        const properties = {
          name: name,
          value: value,
          input: th.querySelector('.tabelle-input')
        }

        const newContent = createHeader(properties, headerContent)
        replaceNode(th, createElement('th', {}, newContent))
      })
  }

  submitOnChange(input) {
    input.addEventListener('change', () => {
      this.submitForm()
    })
  }

  submitOnKeyup(input) {
    input.addEventListener('keyup', debounce(300, () => this.submitForm()))
  }

  submitForm() {
    submit(this.form)
      .then(response => {
        if (!response.ok) {
          throw new Error('Submit not successful')
        }
        return response.text()
          .then(html => ({html: html, uri: response.url}))
      }).then(({ html, uri }) => {
        let tabelle = template2dom(html, '.tabelle tbody')
        replaceNode(this.tableBody, tabelle)
        this.updateState(uri, tabelle)
      })
  }

  updateState(uri, tbody) {
    if (this.changeUri) {
      let state = { tbody: tbody.innerHTML }
      history.pushState(state, document.title, uri)
    }
  }

  restoreState(state) {
    if (state.tbody) {
      this.tableBody = state.tbody
    }
  }

  get arrows () {
    return find(this, '.tabelle-arrow')
  }

  get textFilters () {
    return find(this, '[type=text].tabelle-input')
  }

  get selectFilters () {
    return find(this, 'select.tabelle-input')
  }

  get headers () {
    return find(this, 'thead th')
  }

  get action () {
    return this.getAttribute('search-src')
  }

  get form () {
    return this.querySelector('form')
  }

  get table () {
    return this.querySelector('.tabelle')
  }

  get tableBody () {
    return this.querySelector('.tabelle tbody')
  }

  set tableBody (htmlString) {
    this.tableBody.innerHTML = htmlString
  }

  get changeUri () {
    return this.hasAttribute('change-uri')
  }
}

customElements.define('ta-belle', Tabelle)