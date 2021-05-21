title: Tabelle Element
description: The component bringing it all together

This is the component that brings it all together.
In most cases, we will want to render the HTML for each Tabelle itself.
If we render the form fields in our server-side templating language,
we will have a filterable and sortable table which works without client-side
JavaScript.

At this point in time, we do not provide templates ourselves.
The HTML itself provides the contract that the Tabelle then expects.

```handlebars
<form action="/components/preview/tabelle--sticky">
	<table class="tabelle">
		<thead>
			<tr>
				<th scope="col">
					{{#with col1}}
						<div class="tabelle-header" role="group" aria-labelledby="{{name}}_group">
							<span class="header" id="{{name}}_group">{{label}}</span>
							<input class="tabelle-arrow" id="{{name}}_asc" type="radio" name="sort" value="{{name}}-asc"/>
							<label class="tabelle-arrow--asc" for="{{name}}_asc">
								<span class="visually-hidden">Sort {{label}} Ascending</span>
							</label>

							<input class="tabelle-arrow" id="{{name}}_desc" type="radio" name="sort" value="{{name}}-desc" />
							<label class="tabelle-arrow--desc" for="{{name}}_desc">
								<span class="visually-hidden">Sort {{label}} Descending</span>
							</label>

							<input
								class="tabelle-input"
								name="{{name}}"
								type="text"
								aria-label="Filter {{label}}" />
						</div>
					{{/with}}
				</th>
				<th scope="col">
					{{#with col2}}
						<div class="tabelle-header" role="group" aria-labelledby="{{name}}_group">
							<span class="header" id="{{name}}_group">{{label}}</span>
							<input class="tabelle-arrow" id="{{name}}_asc" type="radio" name="sort" value="{{name}}-asc"/>
							<label class="tabelle-arrow--asc" for="{{name}}_asc">
								<span class="visually-hidden">Sort {{label}} Ascending</span>
							</label>

							<input class="tabelle-arrow" id="{{name}}_desc" type="radio" name="sort" value="{{name}}-desc" />
							<label class="tabelle-arrow--desc" for="{{name}}_desc">
								<span class="visually-hidden">Sort {{label}} Descending</span>
							</label>

							<input
								class="tabelle-input"
								name="{{name}}"
								type="text"
								aria-label="Filter {{label}}" />
						</div>
					{{/with}}
				</th>
				<th scope="col">
					{{#with col3}}
						<div class="tabelle-header" role="group" aria-labelledby="{{name}}_group">
							<span class="header" id="{{name}}_group">{{label}}</span>
							<input class="tabelle-arrow" id="{{name}}_asc" type="radio" name="sort" value="{{name}}-asc"/>
							<label class="tabelle-arrow--asc" for="{{name}}_asc">
								<span class="visually-hidden">Sort {{label}} Ascending</span>
							</label>

							<input class="tabelle-arrow" id="{{name}}_desc" type="radio" name="sort" value="{{name}}-desc" />
							<label class="tabelle-arrow--desc" for="{{name}}_desc">
								<span class="visually-hidden">Sort {{label}} Descending</span>
							</label>

							<select class="tabelle-input"
								name="{{name}}"
								aria-label="Filter {{label}}">
								<option>A</option>
								<option>B</option>
								<option>C</option>
							</select>
						</div>
					{{/with}}
				</th>
			</tr>
		</thead>
		<tbody>
			{{#each rows}}
			<tr>
			{{#each this}}
				<td>{{this}}</td>
			{{/each}}
			</tr>
			{{/each}}
		</tbody>
	</table>
</form>
```

## Custom Element

However, for the case where you quickly want to transform an exiting table into
a sortable and filterable table, you can also use the custom element `ta-belle`
which will wrap around your table and generate the input fields and sorting
arrows that you need.

`ta-belle` expects that the custom element will have a unique id (necessary if
you are replacing more than one table on a page). You also need to specify
a `search-src` attribute which will tell the `ta-belle` the endpoint for the
search resource which will return a new filtered or sorted HTML table.

The `ta-belle` also implements an auto submit so that the filtering and sorting
will occur whenever the user changes the filter/sort fields.

```handlebars
<ta-belle id="tabelle" search-src="/tabelle/1.html">
	<table>
		<thead>
			<tr>
				<th name="foo">Column 1</th>
				<th name="bar">Column 2</th>
				<th name="baz">Column 3</th>
			</tr>
		</thead>
		<tbody>
			{{#each rows}}
				<tr>
				{{#each this}}
					<td>{{this}}</td>
				{{/each}}
				</tr>
			{{/each}}
		</tbody>
	</table>
</ta-belle>
```

### Custom Form within Custom Element

Sometimes the `search-src` attribute may not be sufficient. In this case,
you can create a form as a direct child of the `ta-belle`. Then Tabelle
will use this form to generate the HTTP requests instead of generating
a form itself.

You can either wrap this form around the table body itself, or you can
add place it next to the table. If the form does not contain the table
with the table headers, you need to ensure that the form has an `id`.
Then Tabelle will ensure that the generated input fields and sort options
reference this form via their `form` attribute.

```handlebars
<ta-belle id="tabelle">
	<form id="tabelle-form" action="/tabelle/2.html">
		<button class="hide" type="submit">Perform Sort / Filter</button>
	</form>
	<table>
		<thead>
			<tr>
				<th name="foo">Column 1</th>
				<th name="bar">Column 2</th>
				<th name="baz">Column 3</th>
			</tr>
		</thead>
		<tbody>
			{{#each rows}}
				<tr>
				{{#each this}}
					<td>{{this}}</td>
				{{/each}}
				</tr>
			{{/each}}
		</tbody>
	</table>
</ta-belle>
```

### Wrapping the form around the table and its contents

```handlebars
<ta-belle id="tabelle">
	<form id="tabelle-form" action="/tabelle/3.html">
		<button class="hide" type="submit">Perform Sort / Filter</button>

		<table>
			<thead>
				<tr>
					<th name="foo">Column 1</th>
					<th name="bar">Column 2</th>
					<th name="baz">Column 3</th>
				</tr>
			</thead>
			<tbody>
				{{#each rows}}
					<tr>
					{{#each this}}
						<td>{{this}}</td>
					{{/each}}
					</tr>
				{{/each}}
			</tbody>
		</table>
	</form>
</ta-belle>
```

### Disable sorting or filtering for a column

By default, the `ta-belle` will always generate both sorting controls and
filtering controls. If you want to turn this off for specific columns you
can set the `nosort` or `nofilter` attribute on the `th` column header.

```handlebars
<ta-belle id="tabelle" search-src="/tabelle/4.html">
	<table>
		<thead>
			<tr>
				<th name="foo">Column 1</th>
				<th name="bar" nosort>Column 2</th>
				<th name="baz" nofilter>Column 3</th>
			</tr>
		</thead>
		<tbody>
			{{#each rows}}
				<tr>
				{{#each this}}
					<td>{{this}}</td>
				{{/each}}
				</tr>
			{{/each}}
		</tbody>
	</table>
</ta-belle>
```

## Adding custom filter fields for specific columns

You can add a custom filter field to a column by adding an input
field or select field with the class "tabelle-input". Then this
field will be used instead of the filter field which would have
been automatically generated.

```handlebars
<ta-belle id="tabelle" search-src="/tabelle/5.html">
	<table>
		<thead>
			<tr>
				<th name="foo">Column 1</th>
				<th name="bar" nosort>Column 2</th>
				<th name="baz">
					<select class="tabelle-input"
						name="{{name}}"
						aria-label="Filter {{label}}">
						<option>A</option>
						<option>B</option>
						<option>C</option>
					</select>
				</th>
			</tr>
		</thead>
		<tbody>
			{{#each rows}}
				<tr>
				{{#each this}}
					<td>{{this}}</td>
				{{/each}}
				</tr>
			{{/each}}
		</tbody>
	</table>
</ta-belle>
```

### Existing Value

If you have an existing filter for a column, you can set this with the `value`
attribute on the `th` column header.

```handlebars
<ta-belle id="tabelle" search-src="/tabelle/6.html">
	<table>
		<thead>
			<tr>
				<th name="foo">Column 1</th>
				<th name="bar" value="a">Column 2</th>
				<th name="baz" value="y">Column 3</th>
			</tr>
		</thead>
		<tbody>
			{{#each rows}}
				<tr>
				{{#each this}}
					<td>{{this}}</td>
				{{/each}}
				</tr>
			{{/each}}
		</tbody>
	</table>
</ta-belle>
```

### Custom Filter Field

If you want to specify a custom filter field which is not of type `text`
(e.g. of `type=number` or a `select` field), then you can add this element
as a child of the `th` column header and ensure that it has the
`.tabelle-input` class.

```handlebars
<ta-belle id="tabelle" search-src="/tabelle/7.html">
	<table>
		<thead>
			<tr>
				<th name="foo">Column 1</th>
				<th name="bar">
					Column 2
					<input type="number" class="tabelle-input">
				</th>
				<th name="baz">
					Column 3
					<select class="tabelle-input">
						<option>A</option>
						<option>B</option>
						<option>C</option>
					</select>
				</th>
			</tr>
		</thead>
		<tbody>
			{{#each rows}}
				<tr>
				{{#each this}}
					<td>{{this}}</td>
				{{/each}}
				</tr>
			{{/each}}
		</tbody>
	</table>
</ta-belle>
```

### Debounce

You can customize the length of the debounce interval by setting the
`debounce` parameter on the custom element.

```handlebars
<ta-belle id="tabelle" debounce="1000" search-src="/tabelle/8.html">
	<table>
		<thead>
			<tr>
				<th name="foo">Column 1</th>
				<th name="bar">Column 2</th>
				<th name="baz">Column 3</th>
			</tr>
		</thead>
		<tbody>
			{{#each rows}}
				<tr>
				{{#each this}}
					<td>{{this}}</td>
				{{/each}}
				</tr>
			{{/each}}
		</tbody>
	</table>
</ta-belle>
```

### Hooking up the History API

If you want to add each sort or filter that you trigger to the browser history,
you can do this by adding the `change-uri` to the custom `ta-belle` element.
This will then update your browser URI bar to show you the sort/filter
requests that are being made, and you can access previous sort/filter
combinations by navigating with the Browser Back button.

```handlebars
<ta-belle id="tabelle" search-src="/tabelle/9.html" change-uri>
	<table>
		<thead>
			<tr>
				<th name="foo">Column 1</th>
				<th name="bar">Column 2</th>
				<th name="baz">Column 3</th>
			</tr>
		</thead>
		<tbody>
			{{#each rows}}
				<tr>
				{{#each this}}
					<td>{{this}}</td>
				{{/each}}
				</tr>
			{{/each}}
		</tbody>
	</table>
</ta-belle>
```

### Rendering Empty States

When the `ta-belle` triggers a sort or filter, the `ta-belle` element which
is returned will be replaced in its entirety. We can use this to handle empty
states, or handle pagination which might be relevant to the data which is
currently being shown. You can add any element to the body of the `ta-belle`
next to the `table` and this will be included in what the user sees when
Tabelle replaces the content.

```handlebars
<ta-belle id="tabelle" search-src="/tabelle/10.html" change-uri>
	<table>
		<thead>
			<tr>
				<th name="foo">Column 1</th>
				<th name="bar" value="Filter">Column 2</th>
				<th name="baz">Column 3</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
	<p>We're sorry! We did not find any entries matching those filters.</p>
</ta-belle>
```

### Activating Sticky Headers

You can add the `.tabelle--sticky` class to your table to activate sticky
table headers.

```handlebars height=300
<ta-belle id="tabelle" search-src="/tabelle/11.html" change-uri>
	<table class="tabelle--sticky">
		<thead>
			<tr>
				<th name="foo">Column 1</th>
				<th name="bar">Column 2</th>
				<th name="baz">Column 3</th>
			</tr>
		</thead>
		<tbody>
			{{#each rows}}
				<tr>
				{{#each this}}
					<td>{{this}}</td>
				{{/each}}
				</tr>
			{{/each}}
			{{#each rows}}
				<tr>
				{{#each this}}
					<td>{{this}}</td>
				{{/each}}
				</tr>
			{{/each}}
			{{#each rows}}
				<tr>
				{{#each this}}
					<td>{{this}}</td>
				{{/each}}
				</tr>
			{{/each}}
			{{#each rows}}
				<tr>
				{{#each this}}
					<td>{{this}}</td>
				{{/each}}
				</tr>
			{{/each}}
		</tbody>
	</table>
</ta-belle>
```

### Deactivating filter for a Tabelle

When you set the `nofilter` attribute on a `ta-belle`, no
filter fields will be generated within the table headers. This
is useful if you only want to implementing sorting for a table,
or if you are implementing a separate unified search somewhere
else on the page.

```handlebars
<ta-belle id="tabelle" search-src="/tabelle/12.html" nofilter>
	<table>
		<thead>
			<tr>
				<th name="foo">Column 1</th>
				<th name="bar">Column 2</th>
				<th name="baz">Column 3</th>
			</tr>
		</thead>
		<tbody>
			<tbody>
				{{#each rows}}
					<tr>
					{{#each this}}
						<td>{{this}}</td>
					{{/each}}
					</tr>
				{{/each}}
			</tbody>
		</tbody>
	</table>
</ta-belle>
```
