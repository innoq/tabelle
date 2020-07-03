/* eslint-env browser */
import { find } from 'uitil/dom'
import httpRequest from 'uitil/dom/http'

export function listenFor (className, thenDo) {
  return event => {
    if (event.target.classList.contains(className)) {
      thenDo(event)
    }
  }
}

// Needed because both 'change' and 'keyup' are triggered for text
// input fields in Firefox, but only 'keyup' is triggered in Chrome
export function listenForChange (className, thenDo, valueCache) {
  return event => {
    if (event.target.classList.contains(className)) {
      const input = event.target
      const name = input && input.getAttribute('name')
      const inputValue = input && input.value

      // Brauchen unterschiedlichen Wert für den cache für Checkboxen/Radios
      // weil das Element unabhängig vom 'checked' den gleichen Wert hat.
      const value = input.checked ? `${inputValue}:checked` : inputValue

      if (name && valueCache[name] !== value) {
        valueCache[name] = value
        thenDo(event)
      }
    }
  }
}

export function template2dom (htmlString, selector) {
  const tmp = document.createElement('template')
  tmp.innerHTML = htmlString.trim()
  return selector ? tmp.content.querySelector(selector) : tmp.content.firstChild
}

export function extractContent (el) {
  if (el.childNodes.length) {
    return el.childNodes[0]
  }
  return el.textContent
}

// Adapted from https://github.com/FND/hijax-form/blob/master/src/util.js
export function submitForm (form, { headers, cors, strict } = {}) {
  let method = form.getAttribute('method')
  method = method ? method.toUpperCase() : 'GET'
  let uri = form.getAttribute('action')
  const payload = serializeForm(form)

  if (method === 'GET') {
    if (uri.indexOf('?') !== -1) {
      throw new Error('query strings are invalid within `GET` forms\' ' +
          '`action` URI please use hidden fields instead')
    }
    uri = [uri, payload].join('?')
  } else {
    headers = headers || {}
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    var body = payload // eslint-disable-line no-var
  }

  form.setAttribute('aria-busy', 'true')
  const reset = () => {
    form.removeAttribute('aria-busy')
  }
  return httpRequest(method, uri, headers, body, { cors, strict })
    .then(res => {
      reset()
      return res
    })
    .catch(err => {
      reset()
      throw err
    })
}

function inputsFor (form) {
  let container = form
  let formSelector = ''
  if (form.id && document.querySelector(`[form=${form.id}]`)) {
    container = document
    formSelector = `[form=${form.id}]`
  }
  const selector = ['input', 'textarea', 'select']
    .map(tag => `${tag}[name]${formSelector}:not(:disabled)`).join(', ')
  return find(container, selector)
}

function radioButtonFor (form, name) {
  let container = form
  let formSelector = ''
  if (form.id && document.querySelector(`[form=${form.id}]`)) {
    container = document
    formSelector = `[form=${form.id}]`
  }
  return container.querySelector(`input[type=radio][name=${name}]${formSelector}:checked`)
}

// stringify form data as `application/x-www-form-urlencoded`
// required due to insufficient browser support for `FormData`
// NB: only supports a subset of form fields, notably excluding named buttons
//     and file inputs
export function serializeForm (form) {
  const radios = {}
  return inputsFor(form).reduce((params, node) => {
    const { name } = node
    let value
    switch (node.nodeName.toLowerCase()) {
      case 'textarea':
        value = node.value
        break
      case 'select':
        value = node.multiple
          ? find(node, 'option:checked').map(opt => opt.value)
          : node.value
        break
      case 'input':
        switch (node.type) {
          case 'file':
            throw new Error('`input[type=file]` fields are unsupported')
          case 'checkbox':
            if (node.checked) {
              value = node.value
            }
            break
          case 'radio':
            if (!radios[name]) {
              const field = radioButtonFor(form, name)
              value = field ? field.value : undefined
              if (value) {
                radios[name] = true
              }
            }
            break
          default:
            value = node.value
            break
        }
        break
    }

    if (value !== undefined) {
      let values = value || ['']
      if (!values.pop) {
        values = [values]
      }
      values.forEach(value => {
        const param = [name, value].map(encodeURIComponent).join('=')
        params.push(param)
      })
    }
    return params
  }, []).join('&')
}
