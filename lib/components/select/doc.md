title: Select Field
description: Use default select fields to filter a column

One other common input field that is used to filter a column in a table is a
`select` field. In the same way as with the [Input Field](/input/), we can
use the default select field without styling, because this is very likely
something that you are going to want to style in your own application.

The `select` component also uses the same `.tabelle-input` class.

```handlebars
<select
		class="tabelle-input"
		name="{{name}}"
		aria-label="Filter {{label}}">
	<option>A</option>
	<option>B</option>
	<option>C</option>
</select>
```
