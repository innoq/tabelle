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
for layout reasons. See more documentation and examples of how the component
works within the [`ta-belle` element](/tabelle/tabelle_search/) and within
the [`tabelle-cljs` element](/tabelle_cljs/tabelle_search/).

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


## Custom Events sent by `tabelle-search` component

The `tabelle-search` component communicates with the Tabelle element by
sending a custom `"tabelle-search"` Event. The Event is specified as follows:

### Event Name

`tabelle-search`

### Event Detail

the `detail` of the `"tabelle-search"` will be an object containing the
following properties:

<table>
	<thead>
		<tr><th>Property</th><th>Description</th></tr>
	</thead>
	<tbody>
		<tr>
			<td>name</td>
			<td>
				The <code>name</code> of the input field wrapped within the
				<code>tabelle-search</code> component
			</td>
		</tr>
		<tr>
			<td>value</td>
			<td>
				The current value of the input field wrapped within the
				<code>tabelle-search</code> component
			</td>
		</tr>
	</tbody>
</table>

### Event Dispatching

If the `tabelle-search` has a `tabelleId`, the Event will be dispatched
directly to the element referenced by that ID. Otherwise, the Event is
dispatched on the `tabelle-search` element and bubbles up to any parent nodes.
The assumption is then that the `tabelle-search` is contained within a Tabelle,
and the Tabelle will intercept this event and perform the search.


## Progressive Enhancement

The `tabelle-search` component works well with progressive enhancement because
the input element can be nested within a form which performs the filtering of
the table. However, if the `tabelle-search` is intended to be used
_exclusively_ with client-side JavaScript, the element should be rendered with
a `hidden` attribute. The `tabelle-search` element is smart enough to know how
to unhide itself once JavaScript is available.

```handlebars
<tabelle-search hidden>
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

**Note:** The fact that the component supports this attribute does not mean
that it is the best way to add a label to an input field. If in doubt, use the
actual `label` element.

```handlebars
<span id="filter-table">Filter Table</span>
<tabelle-search>
	<input type="search" aria-labelledby="filter-table">
</tabelle-search>
```


## Debouncing

The `tabelle-search` element will not send an event upon every keystroke, but
will instead debounce the input for a number of milliseconds (default 300)
before sending the event. This number can be customized with the `debounce`
attribute.

```handlebars
<tabelle-search hidden debounce="400">
	<label for="tabelle-search">Filter Table</label>
	<input id="tabelle-search" type="search">
</tabelle-search>
```
