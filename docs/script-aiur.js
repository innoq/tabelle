(function () {
'use strict';

/* global HTMLElement */
class ComponentPreview extends HTMLElement {
	connectedCallback() {
		this._previewFrame = this.querySelector("." + this.getAttribute("preview")) ||
			this.querySelector("#" + this.getAttribute("preview"));
		this.setDimensions();
		this._previewFrame.addEventListener("load", event => this.fitPreviewFrame());
	}

	setDimensions() {
		let height = this.getAttribute("height");
		let width = this.getAttribute("width");
		if(height) this._previewFrame.style.height = parseInt(height) + "px";
		if(width) this._previewFrame.style.width = parseInt(width) + "px";
	}

	fitPreviewFrame() {
		if(!this.hasAttribute("height")) {
			let frameBody = this._previewFrame.contentWindow.document.body;
			let bodyDisplay = frameBody.style.display;
			frameBody.style.display = "inline-block";
			let height = frameBody.offsetHeight;
			frameBody.style.display = bodyDisplay;
			// TODO: fix me: 16, a magic number for now to prevent scrollbars
			this._previewFrame.style.height = height + 16 + "px";
		}
	}
}

/* global HTMLElement, fetch */
// TODO use "find" attribute with css selector to extract parts of external page
// TODO overall proper embedding process ...

class ExternalText extends HTMLElement {
	connectedCallback() {
		this._wrapElementType = this.getAttribute("wrap");
		this._src = this.getAttribute("src");
		this._embedTarget = this;

		this.prepareEmbed();
		this.loadExternal();
	}

	prepareEmbed() {
		if(this._wrapElementType !== null) {
			let bed = document.createElement(this._wrapElementType);
			this.append(bed);
			this._embedTarget = bed;
		}
	}

	async loadExternal() {
		let response = await fetch(this._src);
		let externalText = await response.text();
		this.embedExternal(externalText);
	}

	embedExternal(body) {
		body = body.replace(/^<!DOCTYPE[^>[]*(\[[^]]*\])?>/gm, "").trim();
		body = body.replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, "");
		if(body.includes("<body")) {
			body = body.replace("//").split("<body>")[1].split("</body>")[0].trim();
		}
		body = body.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
		this._embedTarget.innerText = body;
	}
}

/* global HTMLElement, CustomEvent, localStorage */

// TODO enhance with touches: https://github.com/stbaer/ev-pos/blob/master/src/index.js
// TODO consider snap feature? snap to edges? stepped resize?

function betterParseInt(string) {
	let parsed = parseInt(string);
	return isNaN(parsed) ? 0 : parsed;
}

class ResizeHandle extends HTMLElement {
	connectedCallback() {
		this.init();
	}

	adoptedCallback() {
		this.init();
	}

	init() {
		this._target = document.querySelector("#" + this.getAttribute("for"));
		if(this._target) {
			this.addEventListener("mousedown", this.startDrag.bind(this));
			document.addEventListener("mouseup", this.stopDrag.bind(this));
			document.addEventListener("mousemove", this.drag.bind(this));
			let directions = this.getAttribute("direction").toLowerCase();
			this._useDirectionX = directions.indexOf("x") > -1;
			this._useDirectionY = directions.indexOf("y") > -1;
			if(this.hasAttribute("remember") && this.hasAttribute("id")) {
				this._rememberState = true;
				this._storageId = "resize-handle#" + this.id;
				this.recallState();
			}
		}
	}

	startDrag(event) {
		event.preventDefault();
		let targetsComputedStyle = window.getComputedStyle(this._target);
		this._targetsBoxSizing = targetsComputedStyle.getPropertyValue("box-sizing");

		if(this._targetsBoxSizing === "content-box") {
			this._targetsOriginWidth = this._target.offsetWidth -
				betterParseInt(targetsComputedStyle.getPropertyValue("padding-left")) -
				betterParseInt(targetsComputedStyle.getPropertyValue("padding-right")) -
				betterParseInt(targetsComputedStyle.getPropertyValue("border-left-width")) -
				betterParseInt(targetsComputedStyle.getPropertyValue("border-right-width"));
			this._targetsOriginHeight = this._target.offsetHeight -
				betterParseInt(targetsComputedStyle.getPropertyValue("padding-top")) -
				betterParseInt(targetsComputedStyle.getPropertyValue("padding-bottom")) -
				betterParseInt(targetsComputedStyle.getPropertyValue("border-top-width")) -
				betterParseInt(targetsComputedStyle.getPropertyValue("border-bottom-width"));
		} else {
			this._targetsOriginWidth = this._target.offsetWidth;
			this._targetsOriginHeight = this._target.offsetHeight;
		}

		this._mouseOriginX = event.pageX;
		this._mouseOriginY = event.pageY;

		this._isBeingDragged = true;
		window.requestAnimationFrame(() => this.classList.add("dragging"));

		this.dispatchEvent(new CustomEvent("resizestart", {
			detail: {
				directionX: this._useDirectionX,
				directionY: this._useDirectionY,
				targetWidth: this._useDirectionX ? this._target.style.width : undefined,
				targetHeight: this._useDirectionY ? this._target.style.height : undefined,
				pageX: event.pageX,
				pageY: event.pageY
			}
		}));
	}

	drag(event) {
		if(this._isBeingDragged) {
			window.requestAnimationFrame(() => {
				let deltaX = event.pageX - this._mouseOriginX;
				let deltaY = event.pageY - this._mouseOriginY;
				if(this._useDirectionX) {
					this._target.style.width = this._targetsOriginWidth + deltaX + "px";
				}
				if(this._useDirectionY) {
					this._target.style.height = this._targetsOriginHeight + deltaY + "px";
				}
			});
		}
	}

	stopDrag(event) {
		if(this._isBeingDragged) {
			this._isBeingDragged = false;
			window.requestAnimationFrame(() => this.classList.remove("dragging"));

			this.rememberState(this._target.style.width, this._target.style.height);

			this.dispatchEvent(new CustomEvent("resizeend", {
				detail: {
					directionX: this._useDirectionX,
					directionY: this._useDirectionY,
					targetWidth: this._useDirectionX ? this._target.style.width : undefined,
					targetHeight: this._useDirectionY ? this._target.style.height : undefined,
					pageX: event.pageX,
					pageY: event.pageY
				}
			}));
		}
	}

	rememberState(width, height) {
		if(this._rememberState) {
			localStorage.setItem(this._storageId, JSON.stringify({ width, height }));
		}
	}

	recallState() {
		if(this._rememberState) {
			let state = JSON.parse(localStorage.getItem(this._storageId));
			if(state && state.width !== "") {
				this._target.style.width = state.width;
			}
			if(state && state.height !== "") {
				this._target.style.height = state.height;
			}
		}
	}
}

/* global HTMLElement */
class TabsConstrol extends HTMLElement {
	connectedCallback() {
		window.requestAnimationFrame(() => {
			this.setAttribute("role", "tablist");
			this._triggers = Array.from(this.querySelectorAll("[role=\"tab\"]"));
			this._triggers.forEach(trigger => trigger.setAttribute("tabindex", 0));
			this._targetMap = new Map();
			this._triggers.forEach(triggerElement => {
				let triggerTargetId = "#" + triggerElement.getAttribute("aria-controls");
				let triggerTargetElement = document.querySelector(triggerTargetId);
				this._targetMap.set(triggerTargetId, triggerTargetElement);
				triggerElement.addEventListener("click", e => this.switch(triggerElement));
			});

			this._triggers.forEach(triggerElement => {
				if(triggerElement.getAttribute("aria-selected") !== "true") {
					this._targetMap.
						get("#" + triggerElement.getAttribute("aria-controls")).
						setAttribute("hidden", "true");
				}
			});
		});
	}

	switch(clickedElement) {
		if(clickedElement.getAttribute("aria-selected") === "true") {
			return;
		}
		window.requestAnimationFrame(() => {
			this._triggers.forEach(trigger => trigger.setAttribute("aria-selected", "false"));
			clickedElement.setAttribute("aria-selected", "true");
			this._targetMap.forEach(targetElement => targetElement.setAttribute("hidden", "true"));
			let clickTargetElement = this._targetMap.get("#" + clickedElement.getAttribute("aria-controls"));
			clickTargetElement.removeAttribute("hidden");
		});
	}
}

/* global customElements */

customElements.define("component-preview", ComponentPreview);
customElements.define("external-text", ExternalText);
customElements.define("resize-handle", ResizeHandle);
customElements.define("tabs-control", TabsConstrol);

}());
