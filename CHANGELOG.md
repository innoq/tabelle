# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2021-04-16
### Changed
- Now possible to customize `.tabelle-header` via CSS Properties
- Moved from image URLs for the icons to inline SVG data URLs
- Restructured project internals

## [0.2.2] - 2021-04-16
### Changed
- Updated Dependencies

## [0.2.1] - 2021-01-05
### Changed
- Updated Dependencies

## [0.2.0] - 2020-07-03
### Changed
- Tabelle generates a form next to the HTML table and connects it with the
`form` attribute of the input fields. This is backwards compatible to previous
versions because if developers have taken care to wrap the table in a form
themselves, then this is still supported by Tabelle.
- Added valueCache to prevent form submits when the value of the input field
hasn't changed. This also fixes a bug with Firefox which fires events both on
'keyup' and 'change' and deduplicates them.

## [0.1.2] - 2019-02-13
### Added
- Animated GIF

## [0.1.1] - 2019-02-13
### Added
- Make it possible to customize the length of the debounce

## [0.1.0] - 2019-02-08
### Added
- CHANGELOG
- `.visually-hidden` CSS class for hiding elements visually but still making them available for a screenreader

### Changed
- Restructured files so components are included in lib and made component hierarchy flatter
- tabelle-input now has an `aria-label` for a11y
- tabelle-arrow moved to tabelle-arrows
- tabelle-arrows added focus color
- tabelle-header with `role="group"` and `aria-labelledby` for a11y
- tabelle examples in Pattern Library use component partials
- add improved a11y elements in custom element

### Deprecated
- `.hide` CSS class. Use `.visually-hidden` instead.

## [0.1.17] - 2019-02-08
### Changed
- Update dependencies
- reference lib/index.js to make it easier to import
- Update README

## [0.1.16] - 2018-11-05
### Changed
- fix npm build command
- replace duplicate arrow functions with one submitForm function

## [0.1.15] - 2018-11-05
### Added
- EditorConfig
- Example for `sort` Attribute
- Travis configuration

### Changed
- Update dependencies
- Simplify linter configuration
- Restructure and refactor JavaScript

## [0.1.14] - 2018-10-26
### Changed
- Added way to encode the current sort direction of the Tabelle
- Restructured and improved JavaScript

## [0.1.13] - 2018-10-24
### Changed
- Fixed focus to move cursor to right spot
- Move preventDefault to end of overriding form submit

## [0.1.12] - 2018-10-24
### Changed
- Preserve focus when replacing whole `<ta-belle>`
- Fix linter

## [0.0.11] - 2018-10-24
### Changed
- switched to hijax-forms for form handing

## [0.0.10] - 2018-10-19
### Changed
- Added flexibility to display a response: replace whole `<ta-belle>` element
- Fix pushState

## [0.0.9] - 2018-10-12
### Added
- Linting

## [0.0.8] - 2018-10-12
### Added
- base.css

## [0.0.7] - 2018-10-12
### Changed
- Use relative URIs for icon images

## [0.0.6] - 2018-10-12
### Added
- Customization options for the table sort

## [0.0.5] - 2018-10-11
### Changed
- Consider exisiting value attribute
- Define only one sort for table

## [0.0.4] - 2018-10-11
### Changed
- Fixed CSS Path

## [0.0.3] - 2018-10-11
### Added
- Documentation in README

## [0.0.2] - 2018-10-11
### Added
- History API Support
- Autosubmit on input changes

### Changed
- CSS Structure

## 0.0.1 - 2018-10-10
### Added
- Initial CSS & JavaScript for Tabelle

[Unreleased]: https://github.com/innoq/tabelle/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/innoq/tabelle/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/innoq/tabelle/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/innoq/tabelle/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/innoq/tabelle/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/innoq/tabelle/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/innoq/tabelle/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/innoq/tabelle/compare/v0.0.17...v0.1.0
[0.0.17]: https://github.com/innoq/tabelle/compare/v0.0.16...v0.0.17
[0.0.16]: https://github.com/innoq/tabelle/compare/v0.0.15...v0.0.16
[0.0.15]: https://github.com/innoq/tabelle/compare/v0.0.14...v0.0.15
[0.0.14]: https://github.com/innoq/tabelle/compare/v0.0.13...v0.0.14
[0.0.13]: https://github.com/innoq/tabelle/compare/v0.0.12...v0.0.13
[0.0.12]: https://github.com/innoq/tabelle/compare/v0.0.11...v0.0.12
[0.0.11]: https://github.com/innoq/tabelle/compare/v0.0.10...v0.0.11
[0.0.10]: https://github.com/innoq/tabelle/compare/v0.0.9...v0.0.10
[0.0.9]: https://github.com/innoq/tabelle/compare/v0.0.8...v0.0.9
[0.0.8]: https://github.com/innoq/tabelle/compare/v0.0.7...v0.0.8
[0.0.7]: https://github.com/innoq/tabelle/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/innoq/tabelle/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/innoq/tabelle/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/innoq/tabelle/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/innoq/tabelle/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/innoq/tabelle/releases/tag/v0.0.2
