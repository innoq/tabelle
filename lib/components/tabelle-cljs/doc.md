title: Tabelle + Client-Side JavaScript
description: Combining Tabelle with client-side sorting and Filtering

Tabelle was developed from the start to work primarily with server-side
rendered tables. This is particularly necessary when we need pagination
of some sort (e.g. all the data I need is not already listed in our table,
so I'm forced to do a server round trip anyway).

But what about when I _do_ have all the data in my table already?
Is it worth it to do a server round trip when we could
[progressively enhance](https://adactio.com/journal/959) our table to do
the sorting and filtering with JavaScript?

Turns out that we can use the same exact frontend components and hook
up client-side filtering and sorting with JavaScript!

```handlebars
<tabelle-cljs>
	<table>
		<thead>
			<tr>
				<th>Column 1</th>
				<th>Column 2</th>
				<th>Column 3</th>
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
</tabelle-cljs>
```

Additionally, the component also implements keyboard usability within the
table by ensuring that the focus will move through all of the controls in
the Tabelle sequentially (the default focus behavior of radio buttons is
maybe not exactly what a user would expect because browsers expect users
to iterate through radio buttons using arrows instead of the Tab key).

## Customizing filter classes

**Note:** Internally, Tabelle uses [List.js](https://listjs.com/) to sort and
filter the table, so Tabelle will add classes to your `tbody` and `td` elements
at runtime in order for the sorting and filtering to work. By default, Tabelle
will generate a unique class for each column starting with the `ta-` prefix.
If you want to customize this class name, you can do this by setting the
`name` Attribute on the `th` element. Then this class will be used.

```handlebars
<tabelle-cljs>
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
</tabelle-cljs>
```

## Adding custom filter fields for specific columns

You can add a custom filter field to a column by adding an input
field or select field with the class "tabelle-input". Then this
field will be used instead of the filter field which would have
been automatically generated.

```handlebars
<tabelle-cljs>
	<table>
		<thead>
			<tr>
				<th>
					Column 1
				</th>
				<th>Column 2</th>
				<th>
					Column 3
					<select class="tabelle-input"
						name="baz"
						aria-label="Filter Column 3">
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
</tabelle-cljs>
```


## Filtering cells which contain structured HTML elements

When you add structured HTML elements within a table cell, Tabelle will filter
over the `textContent` of the element of each cell.

```handlebars
<tabelle-cljs>
	<table>
		<thead>
			<tr>
				<th>Column 1</th>
				<th>Column 2</th>
				<th>Column 3</th>
			</tr>
		</thead>
		<tbody>
			{{#each rows}}
				<tr>
				{{#each this}}
					<td><a href="#">{{this}}</a></td>
				{{/each}}
				</tr>
			{{/each}}
		</tbody>
	</table>
</tabelle-cljs>
```

## `colspan` attribute support

In order for sorting and filtering to work, please make sure that
your tables use correct _semantic_ HTML. When you use the `colspan`
attribute for your table cells, Tabelle will match them up to the
correct column for sorting and filtering.

```handlebars
<tabelle-cljs>
	<table>
		<thead>
			<tr>
				<th>Column 1</th>
				<th>Column 2</th>
				<th>Column 3</th>
				<th>Column 4</th>
				<th>Column 5</th>
			</tr>
		</thead>
		<tbody>
			<tr><td>Column 1</td><td colspan="2">Column 2</td><td colspan="2">Column 4</td></tr>
			<tr><td colspan="5">Column 1</td></tr>
			<tr><td colspan="3">Column 1</td><td colspan="2">Column 4</td></tr>
			<tr><td>Column 1</td><td colspan="3">Column 2</td><td>Column 5</td></tr>
		</tbody>
	</table>
</tabelle-cljs>
```

## Disable sorting and filtering for specific columns

You can disable sorting and filtering of a column by adding the `nosort` and/or
`nofilter` attributes to the `th` element in the header.

```handlebars
<tabelle-cljs>
	<table>
		<thead>
			<tr>
				<th>Column 1</th>
				<th nosort>Column 2</th>
				<th nofilter>Column 3</th>
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
</tabelle-cljs>
```

## Specifying existing filter

You can set a `value` element on an `th` header in order to activate filtering
on a column.

```handlebars
<tabelle-cljs>
	<table>
		<thead>
			<tr>
				<th value="e">Column 1</th>
				<th>Column 2</th>
				<th>Column 3</th>
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
</tabelle-cljs>
```

## Specifying existing sort direction

You can specify an existing sort direction with the `sort` attribute
on the `tabelle-cljs` to the `${name}-${direction}` where the `name` is the
name of the column and `direction` is the direction for the sort (either `asc`
or `desc`).

```handlebars
<tabelle-cljs sort="foo-desc">
	<table>
		<thead>
			<tr>
				<th>Column 1</th>
				<th>Column 2</th>
				<th>Column 3</th>
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
</tabelle-cljs>
```

### Deactivating filter-fields for a Tabelle

When you set the `nofilter` attribute on a `tabelle-cljs`, no
filter fields will be generated within the table headers. This
is useful if you only want to implementing sorting for a table,
or if you are implementing a separate unified search somewhere
else on the page.

```handlebars
<tabelle-cljs nofilter>
	<table>
		<thead>
			<tr>
				<th>Column 1</th>
				<th>Column 2</th>
				<th>Column 3</th>
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
