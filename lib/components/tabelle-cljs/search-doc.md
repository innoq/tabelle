title: Tabelle Search within tabelle-cljs
description: Adding filter field to table to filter all columns in the table

It is possible to add an additional field to filter all of the columns
using the `tabelle-search` component either as a direct child of the
`tabelle-cljs` or by referencing the HTML ID of the `tabelle-cljs` in
the `tabelleId` attribute of the `tabelle-search` component. See
[the documentation on `tabelle-search`](/tabelle_search/) for more
information.

**Note:** At this time, only a single `tabelle-search` field is supported
for the `tabelle-cljs` component. If more than one field are available on
the page, their filter values will continually override each other.

## Example with `tabelle-search` as a direct child of tabelle-cljs

```handlebars
<tabelle-cljs>
	<tabelle-search hidden>
		<label for="table-filter">Filter Table:</label>
		<input id="table-filter" type="search">
		<button>Search</button>
	</tabelle-search>
	<table>
		<thead>
			<tr>
				<th>Animal</th>
				<th>Food</th>
				<th>Color</th>
				<th>Date</th>
			</tr>
		</thead>
		<tbody>
			{{#each rows}}
				<tr>
				{{#each this}}
					{{#if this.value}}
						<td data-sort="{{this.value}}">{{this.formatted}}</td>
					{{else}}
						<td>{{this}}</td>
					{{/if}}
				{{/each}}
				</tr>
			{{/each}}
		</tbody>
	</table>
</tabelle-cljs>
```

## Example `tabelle-search` referencing `tabelle-cljs` via id

```handlebars
<tabelle-search hidden tabelleId="tabelle">
	<label for="table-filter">Filter Table:</label>
	<input id="table-filter" type="search">
	<button>Search</button>
</tabelle-search>
<tabelle-cljs id="tabelle">
	<table>
		<thead>
			<tr>
				<th>Animal</th>
				<th>Food</th>
				<th>Color</th>
				<th>Date</th>
			</tr>
		</thead>
		<tbody>
			{{#each rows}}
				<tr>
				{{#each this}}
					{{#if this.value}}
						<td data-sort="{{this.value}}">{{this.formatted}}</td>
					{{else}}
						<td>{{this}}</td>
					{{/if}}
				{{/each}}
				</tr>
			{{/each}}
		</tbody>
	</table>
</tabelle-cljs>
```
