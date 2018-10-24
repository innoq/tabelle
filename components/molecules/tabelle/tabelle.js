/* globals customElements, HTMLElement, history */
import { find, replaceNode, prependChild } from 'uitil/dom'
import { createElement } from 'uitil/dom/create'
import { submitForm as submit } from 'hijax-form/util'
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
  return createElement('input', { id: id, class: 'tabelle-arrow', type: 'radio', name: 'sort', value: name + '-' + direction })
}

function arrowLabel (id, direction) {
  return createElement('label', { for: id, class: 'tabelle-arrow--' + direction })
}

function createFilter (disabled, name, value, input) {
  if (disabled) {
    return ''
  }
  return input || createElement('input', { type: 'text', name: name, class: 'tabelle-input', value: value || '' }, ' ')
}

function createHeader ({ name, input, value, nosort, nofilter }, tdContent) {
  const header = createElement('span', { class: 'header' }, tdContent)
  const idUp = idGen()
  const upRadio = nosort ? '' : arrowRadio(idUp, name, 'asc')
  const upLabel = nosort ? '' : arrowLabel(idUp, 'asc')

  const idDown = idGen()
  const downRadio = nosort ? '' : arrowRadio(idDown, name, 'desc')
  const downLabel = nosort ? '' : arrowLabel(idDown, 'desc')

  const filter = createFilter(nofilter, name, value, input)

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
    if (!this.id) {
      console.error('Tabelle needs an id attribute in order to be created.')
      return
    }

    this.table.classList.add('tabelle')
    if (this.action) {
      this.createForm()
    }
    this.transformHeaders()

    this.arrows.forEach(el => this.submitOnChange(el))
    this.textFilters.forEach(el => this.submitOnKeyup(el))
    this.selectFilters.forEach(el => this.submitOnChange(el))

    this.form.addEventListener('submit', ev => {
      ev.preventDefault()
      this.submitForm()
    })

    if (this.changeUri) {
      history.replaceState({ tabelle: this.outerHTML }, document.title, window.location.href)
      window.onpopstate = ev => this.restoreState(ev)
    }
  }

  createForm () {
    const form = createForm(this.action)
    prependChild(form, this)
    prependChild(this.table, form)
  }

  transformHeaders () {
    this.headers
      .filter(th => th.getAttribute('name'))
      .forEach(th => {
        const name = th.getAttribute('name')
        const value = th.getAttribute('value')
        const headerContent = extractContent(th)
        const properties = {
          name: name,
          value: value,
          input: th.querySelector('.tabelle-input'),
          nosort: th.hasAttribute('nosort'),
          nofilter: th.hasAttribute('nofilter')
        }

        const newContent = createHeader(properties, headerContent)
        replaceNode(th, createElement('th', {}, newContent))
      })
  }

  submitOnChange (input) {
    input.addEventListener('change', () => {
      this.submitForm()
    })
  }

  submitOnKeyup (input) {
    input.addEventListener('keyup', debounce(300, () => this.submitForm()))
  }

  submitForm () {
    submit(this.form)
      .then(response => {
        if (!response.ok) {
          throw new Error('Submit not successful')
        }
        return response.text()
          .then(html => ({ html: html, uri: response.url }))
      }).then(({ html, uri }) => {
        let tabelle = template2dom(html, '#' + this.id)

        let newTableBody = tabelle.querySelector('.tabelle tbody')
        if (tabelle.querySelector('.tabelle tbody') && this.tableBody) {
          replaceNode(this.tableBody, newTableBody)
        } else {
          replaceNode(this, tabelle)
        }

        this.updateState(uri, tabelle)
      })
  }

  updateState (uri, tabelle) {
    if (this.changeUri) {
      let state = { tabelle: tabelle.outerHTML }
      history.pushState(state, document.title, uri)
    }
  }

  restoreState (event) {
    if (event.state && event.state.tabelle) {
      this.outerHTML = event.state.tabelle
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
