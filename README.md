# tabelle

[![npm](https://img.shields.io/npm/v/tabelle.svg)](https://www.npmjs.com/package/tabelle)

A library for generating pretty filterable and sortable tables that use your backend of choice

This library uses custom elements. In order for this to work, you need to use a browser which support it or use a polyfill.

![Animated Tabelle Example](https://res.cloudinary.com/innoq-deutschland-gmbh/image/upload/v1618568686/tabelle-opt_uxgcwe.gif)

## Install

    npm install tabelle

OR you can install tabelle from the unpkg cdn

The CSS styles are available from:

- https://unpkg.com/tabelle@{VERSION}/dist/tabelle.css (with minimal styling for the table element)
- https://unpkg.com/tabelle@{VERSION}/dist/tabelle-base.css (provides only base css for the structure of the components)

The JavaScript is available from:

- https://unpkg.com/tabelle@{VERSION}/dist/tabelle.js (for tables rendered on the server)
- https://unpkg.com/tabelle@{VERSION}/dist/tabelle-cljs.js (for tables rendered on the client)

## How to Use Tabelle with SSR

Tabelle expects that you have an HTTP Resource which renders an HTML Table. In order to activate Tabelle, we can encapsulate our HTML Table in the `<ta-belle>` custom element which contains a link to the HTTP Resource:

    <ta-belle id="tabelleId" search-src="/components/preview/tabelle--custom-element-state">
        <table class="tabelle">
            <thead>
                <tr>
                    <th name="foo">Foo</th>
                    <th name="bar">Bar</th>
                    <th name="baz">Baz</th>
                </tr>
            </thead>
            <tbody>
                ...
            </tbody>
        </table>
    </ta-belle>

The `id` attribute is required for the `ta-belle`.

The contract is that the `<th>` elements receive a `name` attribute which corresponds to the query parameter which will perform filtering for this column. If you leave the `name` column away, the column will remain unchanged.

What Tabelle does is generate a form for your table in an HTML form and then generate a different header for each column which has the input fields you need in order to perform querying against your backend.
The HTML form for Tabelle is rendered next to your table and connected to the filter inputs in your table via the [form](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#htmlattrdefform) attribute.
This means that you can also have other HTML forms embedded inside of your HTML table if you want to.

By default, Tabelle will generate a text input field with the name specified by the `<th>` element (e.g. `foo`). This means that when you input text in the field and the form submits, a query will be generated with the query parameter `?foo={your text}`.

By default, Tabelle will also generate a sort option for sorting ascending or decending. This is also an input field which will have the name `sort`. The value for the input will be the name of your column plus the direction (e.g. for `<th name="bar">` the inputs with values `bar-asc` and `bar-desc` will be generated.) This means that when you select an arrow and the form submits, a query will be generated with the query paramter `?sort={{name}-asc or {name}-desc}`. By default, Tabelle generates the value `asc` for ascending and `desc` for decending sort order.

By default, Tabelle will autosubmit its form whenever the user inputs a filter or clicks on the arrows in order to sort the column. Tabelle will take the result from submitting the form and replace the `<ta-belle>` element with the `<ta-belle>` element with the same `id` that is retrieved from the server.

**The sorting and filtering logic need to be implemented in the backend.**

It is also currently possible to add a select field to filter a column instead of a text field. Since we believe that HTML is the best description language to describe itself, we have implemented this by allowing you to render a select field in your `<th>` with the class `.tabelle-input`. If this is the case, this select field will be used instead of generating an input field.

    <th>
        My header
        <select class=".tabelle-input" name="searchMe">
            <option>Option1</option>
            <option>Option2</option>
            <option>Option3</option>
        </select>
    </th>

Since Tabelle replaces the entire HTML of the `<ta-belle>` element, you also need to ensure that the filters and sort direction that you sent to the server are rendered in the DOM that you return. You can set the filter when rendering a column via the `value` attribute of the `th` element.

    <th name="foo" value="Faa">Foo</th>

To set the sort direction for a `<ta-belle>` you can set the `sort` attribute of the `ta-belle` to the `name-direction` where the `name` is the name of the column and `direction` is the direction for the sort (either `asc` or `desc`). This is also the value of the `sort` query parameter which is sent to the server whenever you change the sort direction.

    <ta-belle sort="foo-asc">...</ta-belle>

### Handling empty result sets

When you have made a search query and no results are found, it may be likely that you want to add some helpful message for the user letting them know that no search results are found. We want to allow maximum flexibility and allow you to translate and style your message however you would like.

To help you do this, just add the extra information in the `<ta-belle>` component. This will then appear when `<ta-belle>` replaces the content of the `<ta-belle>` component.

    <ta-belle id="tabelle" search-src="...">
        <table>
            <thead>
                <tr>
                    <th name="foo" value="NON-MATCHING-STRING">Foo</th>
                    <th name="bar">Bar</th>
                    <th name="baz">Baz</th>
                </tr>
            </thead>
        </table>
        <p>We did not find any search results for the filters you specified!</p>
    </ta-belle>

You can also use this feature in order to embed a pagination component in your `<ta-belle>` which will be replaced after each round-trip with the server.

## How to Use Tabelle with CSR

As of v0.4.0, Tabelle also offers a custom element which will do the filtering
and sorting of tables on the client as a progressive enhancement. This custom
element is named `<tabelle-cljs>` and has a very similar API to that of
`<ta-belle>`. The JavaScript for this component is bundled separately because
it is a larger bundle (ca. 54KB) and you will probably only want to add the
JavaScript dependency if you actually have a sortable table in the HTML which
you are serving to the client.

It should be possible to use both `<ta-belle>` and `<tabelle-cljs>` in your
application if for some of your tables you need to do sorting and filtering on
the server and for other tables, the progressively enhanced version is
sufficient. The CSS and HTML Markup for both is compatible, so any styling or
customization that you do will work for both.

## Options

In `<ta-belle>` or `<tabelle-cljs>` you can add the following properties to activate the following behavior

|Property                      |Behavior|
|------------------------------|--------|
|change-uri (`<ta-belle>` only)|Modifies the browser history so that by forward/back you can restore the searches that have been made|
|sort                          |Value of the current sort direction. If either 'asc' or 'desc' is set, the ascending or descending arrow will be automatically selected
|debounce                      |Number in milliseconds to debounce before sending an input field to the server (Default 300)|

In the `<th>` headers, you can add the following properties to activate the following behavior

|Property  |Behavior|
|----------|--------|
|name      |`ta-belle`: The name of the query parameter which is used for searching. If no `name` is specified, no filter column will be generated <br> `tabelle-cljs`: `name` is optional and can be used to customize the name of the class that is added to all the columns to activate sorting and filtering|
|value     |specifies value which will be set for the generated input field|
|nosort    |if no sorting functions should be generated for the column|
|nofilter  |if not filtering functions are generated for the column|

## Styling

We have made the styling as minimal as possible in order to allow you to customize the table as much as possible!

## Resources

* [Example Rails App](https://tabelle-rails-example.herokuapp.com/)
