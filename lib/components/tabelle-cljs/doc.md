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
