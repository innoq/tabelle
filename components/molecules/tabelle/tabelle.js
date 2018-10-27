/* eslint-env browser */
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

function listenFor (className, thenDo) {
  return event => {
    if (event.target.classList.contains(className)) {
      thenDo(event)
    }
  }
}

function idGen () {
  return 'arrowId' + id++
}

function arrowRadio (id, name, direction, checked) {
  const attrs = { id: id, class: 'tabelle-arrow', type: 'radio', name: 'sort', value: name + '-' + direction }
  if (checked) {
    attrs.checked = 'checked'
  }
  return createElement('input', attrs)
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

function createHeader ({ name, input, value, nosort, nofilter, currentSort }, tdContent) {
  const header = createElement('span', { class: 'header' }, tdContent)
  const idUp = idGen()
  const upRadio = nosort ? '' : arrowRadio(idUp, name, 'asc', currentSort === name + '-asc')
  const upLabel = nosort ? '' : arrowLabel(idUp, 'asc')

  const idDown = idGen()
  const downRadio = nosort ? '' : arrowRadio(idDown, name, 'desc', currentSort === name + '-desc')
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

function transformHeaders (headers, currentSort) {
  headers
    .filter(th => th.getAttribute('name'))
    .forEach(th => {
      const name = th.getAttribute('name')
      const value = th.getAttribute('value')
      const headerContent = extractContent(th)
      const properties = {
        name: name,
        value: value,
        input: th.querySelector('.tabelle-input'),
        currentSort: currentSort,
        nosort: th.hasAttribute('nosort'),
        nofilter: th.hasAttribute('nofilter')
      }

      const newContent = createHeader(properties, headerContent)
      replaceNode(th, createElement('th', {}, newContent))
    })
}

function transformTabelle (tabelle) {
  const table = tabelle.querySelector('table')
  if (table) {
    table.classList.add('tabelle')
  }

  const action = tabelle.getAttribute('search-src')
  if (action) {
    const form = createForm(action)
    prependChild(form, tabelle)
    prependChild(table, form)
  }

  transformHeaders(find(tabelle, 'thead th'), tabelle.getAttribute('sort') || '')
  return tabelle
}

class Tabelle extends HTMLElement {
  connectedCallback () {
    if (!this.id) {
      console.error('Tabelle needs an id attribute in order to be created.')
      return
    }

    transformTabelle(this)
    this.initialize()

    if (this.changeUri) {
      history.replaceState({ tabelle: this.innerHTML }, document.title, window.location.href)
      window.onpopstate = ev => this.restoreState(ev)
    }
  }

  initialize () {
    this.setFocus()
    this.addListeners()
  }

  setFocus () {
    if (this.focused) {
      const toFocus = this.querySelector(`.tabelle-input[name="${this.focused}"]`)
      if (toFocus) {
        const tmpVal = toFocus.value
        toFocus.focus()
        toFocus.value = ''
        toFocus.value = tmpVal
      }
    }
  }

  addListeners () {
    this.form.addEventListener('change', listenFor('tabelle-input', () => this.submitForm()))
    this.form.addEventListener('change', listenFor('tabelle-arrow', () => this.submitForm()))
    this.form.addEventListener('keyup', debounce(300, listenFor('tabelle-input', () => this.submitForm())))

    this.form.addEventListener('submit', ev => {
      this.submitForm()
      ev.preventDefault()
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

        const active = document.activeElement
        this.focused = null
        if (active && this.contains(active)) {
          this.focused = active.getAttribute('name')
        }

        const transformedTabelle = transformTabelle(tabelle)
        const markup = transformedTabelle.innerHTML

        this.innerHTML = markup
        this.initialize()

        this.updateState(uri, markup)
      })
  }

  updateState (uri, tabelleMarkup) {
    if (this.changeUri) {
      let state = { tabelle: tabelleMarkup }
      history.pushState(state, document.title, uri)
    }
  }

  restoreState (event) {
    if (event.state && event.state.tabelle) {
      this.innerHTML = event.state.tabelle
      this.initialize()
    }
  }

  get form () {
    return this.querySelector('form')
  }

  get changeUri () {
    return this.hasAttribute('change-uri')
  }
}

customElements.define('ta-belle', Tabelle)
