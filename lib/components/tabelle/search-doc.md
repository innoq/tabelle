title: Tabelle Search within ta-belle
description: Adding filter field to table to filter all columns in the table

It is possible to add an additional field to filter all of the columns
using the `tabelle-search` component either as a direct child of the
`ta-belle` or by referencing the HTML ID of the `ta-belle` in
the `tabelleId` attribute of the `tabelle-search` component. See
[the documentation on `tabelle-search`](/tabelle_search/) for more
information.

As with other features for the `ta-belle` element, the actual search
behavior must be implemented on the server.

## Example with `tabelle-search` as a direct child of ta-belle

```handlebars
<ta-belle id="tabelle">
	<form id="tabelle-form" action="/tabelle/tabelle_search/0.html">
		<tabelle-search hidden>
			<label for="table-filter">Filter Table:</label>
			<input id="table-filter" type="search" name="table-filter">
			<button>Search</button>
		</tabelle-search>
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
		<button class="hide" type="submit">Perform Sort / Filter</button>
	</form>
</ta-belle>
```

## Example `tabelle-search` referencing `ta-belle` via id

```handlebars
<tabelle-search hidden tabelleId="tabelle">
	<label for="table-filter">Filter Table:</label>
	<input id="table-filter" type="search" name="tabelle-filter" form="tabelle-form">
	<button>Search</button>
</tabelle-search>
<ta-belle id="tabelle">
	<form id="tabelle-form" action="/tabelle/tabelle_search/1.html">
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
		<button class="hide" type="submit">Perform Sort / Filter</button>
	</form>
</ta-belle>
```
