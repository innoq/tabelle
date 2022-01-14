Tabelle Version History
=======================
All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


Unreleased
----------

- [minor] added `tabelle-search` component for searching over multiple columns


1.2.0 - 2022-01-19
------------------
- [minor] allow custom elements to enhance a filter field a column header
- [patch] preserve attributes of `th` elements when transforming them
- [patch] fixed undefined value landing in the `valueCache` of a Tabelle


1.1.0 - 2021-07-21
------------------
- [minor] use `data-sort` attribute on `td` to specify custom sort value for `tabelle-cljs`

1.0.2 - 2021-05-27
------------------
- [patch] used correct CSS property when showing the sort down property


1.0.1 - 2021-05-27
------------------
- [patch] css properties used for focus should be the same as for checked


1.0.0 - 2021-05-21
------------------
- [major] modified the implementation of the `.tabelle-arrows` component.
  Inserting the arrows directly into the DOM is now deprecated: we recommend
  wrapping them in a `<fieldset class="tabelle-arrows>`.
  All changes should be backwards compatible, even though the component behaves
  a bit differently now. However, if for some reason the `.tabelle-arrow--asc`
  or `.tabelle-arrow--desc` labels are not wrapped in a `.tabelle-header` class,
  this could cause bugs because the new version uses absolute positioning to
  position the `::after` element of the `.tabelle-arrow--asc` and
  `.tabelle-arrow--desc` in over the nearest parent with `position: relative;`
- [patch] fixed focus for `tabelle-arrows` so it is retained on a `ta-belle`
  submit
- [patch] fixed `tabelle-cljs` bug when using a custom field for filtering


0.5.0 - 2021-05-06
---------------------
- [minor] made `name` optional for `th` header of `tabelle-cljs`
- [minor] added `nofilter` attribute to `ta-belle` and `tabelle-cljs` to
  deactivate automatic generation of filter fields for the whole table


0.4.0 - 2021-04-27
------------------
- [minor] `tabelle-cljs` component for client-side filtering and sorting
- [minor] added custom CSS properties for customizing `.tabelle-arrow`


0.3.1 - 2021-04-16
------------------
- [patch] Clean-up files for deployment


0.3.0 - 2021-04-16
------------------
- [minor] now possible to customize `.tabelle-header` via CSS Properties
- [patch] moved from image URLs for the icons to inline SVG data URLs
- [patch] restructured project internals


0.2.2 - 2021-04-16
------------------
- [patch] updated dependencies


0.2.1 - 2021-01-05
------------------
- [patch] updated dependencies


0.2.0 - 2020-07-03
------------------
- [minor] Tabelle generates a form next to the HTML table and connects it with
the `form` attribute of the input fields. This is backwards compatible to
previous versions because if developers have taken care to wrap the table in a
form themselves, then this is still supported by Tabelle.
- [patch] Added valueCache to prevent form submits when the value of the input
field hasn't changed. This also fixes a bug with Firefox which fires events
both on 'keyup' and 'change' and deduplicates them.


0.1.2 - 2019-02-13
------------------
- [patch] animated GIF


0.1.1 - 2019-02-13
------------------
- [patch] made it possible to customize the length of the debounce


0.1.0 - 2019-02-08
------------------
- [minor] added `.visually-hidden` CSS class for hiding elements visually but
  still making them available for a screenreader
- [minor] tabelle-input now has an `aria-label` for a11y
- [minor] moved tabelle-arrow to tabelle-arrows
- [minor] added focus color for tabelle-arrows
- [minor] tabelle-header has `role="group"` and `aria-labelledby` for a11y
- [minor] add improved a11y elements in custom element
- [minor] deprecated `.hide` CSS class. Use `.visually-hidden` instead.
- [patch] tabelle examples in Pattern Library use component partials
- [patch] restructured files so components are included in lib and made
  component hierarchy flatter
- [patch] added CHANGELOG


0.0.17 - 2019-02-08
-------------------
- [patch] reference lib/index.js in `package.json` to make it easier to import
- [patch] updated dependencies
- [patch] updated README


0.0.16 - 2018-11-05
-------------------
- [patch] fixed npm build command
- [patch] replaced duplicate arrow functions with one submitForm function


0.0.15 - 2018-11-05
-------------------
- [patch] added EditorConfig
- [patch] added example for `sort` Attribute
- [patch] added Travis configuration
- [patch] updated dependencies
- [patch] simplified linter configuration
- [patch] restructure and refactored JavaScript


0.0.14 - 2018-10-26
-------------------
- [patch] added way to encode the current sort direction of the Tabelle
- [patch] restructured and improved JavaScript


0.0.13 - 2018-10-24
-------------------
- [patch] fixed focus to move cursor to right spot
- [patch] moved preventDefault to end of overriding form submit


0.0.12 - 2018-10-24
-------------------
- [patch] now preserves focus when replacing whole `<ta-belle>`
- [patch] fixed linter


0.0.11 - 2018-10-24
-------------------
- [patch] switched to hijax-forms for form handing


0.0.10 - 2018-10-19
-------------------
- [patch] added flexibility to display a response by replacing whole
  `<ta-belle>` element
- [patch] fixed pushState


0.0.9 - 2018-10-12
------------------
- [patch] fixed linter


0.0.8 - 2018-10-12
------------------
- [patch] added base.css


0.0.7 - 2018-10-12
------------------
- [patch] now use relative URIs for icon images


0.0.6 - 2018-10-12
------------------
- [patch] added customization options for the table sort


0.0.5 - 2018-10-11
------------------
- [patch] consider exisiting value attribute
- [patch] define only one sort for table


0.0.4 - 2018-10-11
------------------
- [patch] fixed CSS Path


0.0.3 - 2018-10-11
------------------
- [patch] added documentation in README


0.0.2 - 2018-10-11
------------------
- [patch] added History API Support
- [patch] added autosubmit on input changes
- [patch] changed CSS Structure


0.0.1 - 2018-10-10
------------------
- [patch] added initial CSS & JavaScript for Tabelle
