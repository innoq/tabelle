title: Input Field
description: Use default input fields to filter a column

For this type of filter field we really use the default input with no styling
so it is as easy as possible for you to style the input fields yourself.

The only requirement for the component is that you set the `.tabelle-input`
class (if you want to use the styling for the header layout).

Also: **remember to set an `aria-label` for your input field!!**
Otherwise, there will not be any context for screenreader users to let them
know what the input field does.

By default, you should _always_ set the `name` and `label` for the input
field.

```handlebars
<input
	class="tabelle-input"
	name="{{name}}"
	type="text"
	aria-label="Filter {{label}}" />
```

You can optionally set the value field for the input field.

```handlebars
<input
	class="tabelle-input"
	name="{{name}}"
	type="text"
	value="{{value}}"
	aria-label="Filter {{label}}" />
```
