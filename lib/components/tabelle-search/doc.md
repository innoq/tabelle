title: Tabelle Search
description: Providing a global search field for a Tabelle

A `tabelle-search` component can be used in combination with a Tabelle
in order to provide a search function globally within the Tabelle.
A `tabelle-search` component can be associated with both the progressively
enhanced [`ta-belle`](/tabelle/) or the client-side
[`tabelle-cljs`](/tabelle_cljs/) elements by either placing the element
directly within the Tabelle element or by adding a `tabelleId` attribute
to the `tabelle-search` component referencing the HTML ID of the Tabelle
element so that the `tabelle-search` component can interact with the
Tabelle in question. The `tabelleId` attribute will make the most sense
when the search field needs to be placed outside of the Tabelle element
for layout reasons. See more documentation TODO and TODO.

The `tabelle-search` element expects an `input` element to be placed inside
of the component. The element does not generate its own input fields because
we assume that users of this library want to use their own input fields that
are styled according to their corporate design.

```handlebars
<tabelle-search>
	<label for="tabelle-search">Filter Table</label>
	<input id="tabelle-search" type="search">
</tabelle-search>
```

## Accessibility

`tabelle-search` is also opinionated about the accessibility of the input
field that is placed within its protection. If an input field is placed
within a `tabelle-search` without a label that can be recognized by
assistive technologies, the `tabelle-search` component will add an ugly
red border to that input field in the hopes that the hideousness of the
aesthetics of the input field will cause the developer to come to their
senses and add a label.

### Invalid input field without a label

```handlebars
<tabelle-search>
	<input name="oh-no">
</tabelle-search>
```

### Valid input field with a label referencing it via its `for` attribute

```handlebars
<tabelle-search>
	<label for="tabelle-search">Filter Table</label>
	<input id="tabelle-search" type="search">
</tabelle-search>
```

### Valid input field with label that hides the label visually

```handlebars
<tabelle-search>
	<label class="visually-hidden" for="tabelle-search">Filter Table</label>
	<input id="tabelle-search" type="search">
</tabelle-search>
```

### Valid input field which is nested within a label

```handlebars
<tabelle-search>
	<label>
		Filter Table
		<input type="search">
	</label>
</tabelle-search>
```

### Valid input field which adds a label with the `aria-label` attribute

```handlebars
<tabelle-search>
	<input type="search" aria-label="Filter Table">
</tabelle-search>
```

### Valid input field which adds a label using the `aria-labelledby` attribute

```handlebars
<span id="filter-table">Filter Table</span>
<tabelle-search>
	<input type="search" aria-labelledby="filter-table">
</tabelle-search>
```

**Note:** If the search element is used exclusively for filtering the table
when JavaScript is activated, add a `hidden` Attribute to the element so
that it is only shown when JavaScript is available. The `tabelle-search`
element is smart and knows how to unhide itself when it is safe to do so!
Additionally, the `tabelle-search` element will also only unhide itself if
the element contains a valid input element which can be used for the search.
The input element must have a reference to a valid `label` or specify a
valid `aria-label` / `aria-labelledby` attribute, or the element will be
embarrassed and decide not to show its face!

It you want to activate a filter field to filter all of the entries in the
table in addition to (or instead of) the column filters. In this case, you
can add a `tabelle-search` element surrounding the input fields that will
be used to filter the input field. Here we do not generate our own input
fields, because we assume that users of this library want their own input
fields that are styled according to their corporate design.



[server-side]
[client-side rendered JavaScript Tabelle](/tabelle_cljs/). The purpose of
the component is to provide a search field which can be used to filter the
whole table instead of (or in addition to) multiple columns.

It is possible to use the input field within the `tabelle-search` component
inside of an HTML form in order to provide filtering of the table on the
server. In this context, the element would be compatible with the
[server-side variant of the Tabelle component](/tabelle/).

However, in many contexts we want to add the search field within (or referenced by)
the `tabelle-cljs`

