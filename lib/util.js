/* eslint-env browser */

export function listenFor (className, thenDo) {
  return event => {
    if (event.target.classList.contains(className)) {
      thenDo(event)
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
