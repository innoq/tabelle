title: Sort Arrows
description: Style radio buttons as a sorting component

Our sort options are actually radio buttons which are styled using CSS to look
like arrows. By default, Tabelle expects that the `name` for the sort option is
`sort` for all sort options which occur in the table. This is inline with the
[recommendation for the `aria-sort`][aria-sort] attribute for table headers,
that authors should only apply `aria-sort` to one header at a time.

Because browsers take care of selecting only one radio button with the same
`name` at any given time, the browser takes care that only one column is sorted.
The server should expect that an HTTP Request with the query parameter
`?sort=` and the values `{{name}}-asc` or `{{name}}-desc` to be sent to the
server whenever the user selects one of the sort arrows. The server is then
expected to perform the sort and return HTML content with a new table that
has sorted the table.

[aria-sort]: https://www.w3.org/TR/2017/REC-wai-aria-1.1-20171214/#aria-sort

You can customize the styles with the following CSS Properties.

```
--tabelle-arrow-height: ; /* Default: 1rem */
--tabelle-arrow-color: ; /* Default: #acacac */
--tabelle-arrow-color-checked: ; /* Default: #535353 */
--tabelle-arrow-color-hover: ; /* Default: #6882cb */
--tabelle-arrow-color-focus: ; /* Default: #6882cb */
```

You can also override the focus style for the arrows using the
following CSS property:

```
/* Default `3px solid #7fb2f8` or `3px solid -webkit-focus-ring-color` */
--tabelle-focus-style: ;
```

Wrap the radio buttons in a `fieldset` with the `.tabelle-arrows` class.

```handlebars
<fieldset class="tabelle-arrows">
	<legend>Sort {{label}}</legend>
	<input class="tabelle-arrow" id="{{name}}_asc" type="radio" name="sort" value="{{name}}-asc"/>
	<label class="tabelle-arrow--asc" for="{{name}}_asc">
		<span class="visually-hidden">Ascending</span>
	</label>

	<input class="tabelle-arrow" id="{{name}}_desc" type="radio" name="sort" value="{{name}}-desc" />
	<label class="tabelle-arrow--desc" for="{{name}}_desc">
		<span class="visually-hidden">Descending</span>
	</label>
</fieldset>
```

## Arrow that is already checked (ascending)

```handlebars
<fieldset class="tabelle-arrows">
	<legend>Sort {{label}}</legend>
	<input class="tabelle-arrow" id="{{name}}_asc" type="radio" name="sort" value="{{name}}-asc" checked />
	<label class="tabelle-arrow--asc" for="{{name}}_asc">
		<span class="visually-hidden">Ascending</span>
	</label>

	<input class="tabelle-arrow" id="{{name}}_desc" type="radio" name="sort" value="{{name}}-desc" />
	<label class="tabelle-arrow--desc" for="{{name}}_desc">
		<span class="visually-hidden">Descending</span>
	</label>
</fieldset>
```

## Arrow that is already checked (descending)

```handlebars
<fieldset class="tabelle-arrows">
	<legend>Sort {{label}}</legend>
	<input class="tabelle-arrow" id="{{name}}_asc" type="radio" name="sort" value="{{name}}-asc" />
	<label class="tabelle-arrow--asc" for="{{name}}_asc">
		<span class="visually-hidden">Ascending</span>
	</label>

	<input class="tabelle-arrow" id="{{name}}_desc" type="radio" name="sort" value="{{name}}-desc" checked />
	<label class="tabelle-arrow--desc" for="{{name}}_desc">
		<span class="visually-hidden">Descending</span>
	</label>
</fieldset>
```

## Using sort arrows without a wrapping fieldset (DEPRECATED)

You can also insert the arrows directly into the DOM without wrapping
them in a `fieldset`.

This is intended mainly to maintain backwards compatiblity, because previous
versions of Tabelle did not wrap them in a `fieldset`.

```handlebars
<input class="tabelle-arrow" id="{{name}}_asc" type="radio" name="sort" value="{{name}}-asc"/>
<label class="tabelle-arrow--asc" for="{{name}}_asc">
	<span class="visually-hidden">Sort {{label}} Ascending</span>
</label>

<input class="tabelle-arrow" id="{{name}}_desc" type="radio" name="sort" value="{{name}}-desc" />
<label class="tabelle-arrow--desc" for="{{name}}_desc">
	<span class="visually-hidden">Sort {{label}} Descending</span>
</label>
```
