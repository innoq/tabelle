title: Sort Arrows
description: Style radio buttons to look like sortable arrows

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

## Sort Ascending

```handlebars
<input class="tabelle-arrow" id="{{name}}_asc" type="radio" name="sort" value="{{name}}-asc"/>
<label class="tabelle-arrow--asc" for="{{name}}_asc">
	<span class="visually-hidden">Sort {{label}} Ascending</span>
</label>
```

## Sort Descending

```handlebars
<input class="tabelle-arrow" id="{{name}}_desc" type="radio" name="sort" value="{{name}}-desc" />
<label class="tabelle-arrow--desc" for="{{name}}_desc">
	<span class="visually-hidden">Sort {{label}} Descending</span>
</label>
```

## Arrow that is already checked

```handlebars
<input class="tabelle-arrow" id="{{name}}_asc" type="radio" name="sort" value="{{name}}-asc" checked />
<label class="tabelle-arrow--asc" for="{{name}}_asc">
	<span class="visually-hidden">Sort {{label}} Ascending</span>
</label>
```


## Multiple Arrows -- Can only select one sort option

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