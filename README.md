# tabelle
A library for generating pretty filterable and sortable tables that use your backend of choice

This library uses custom elements. In order for this to work, you need to use a browser which support it or use a polyfill.

# Install

    npm install tabelle

OR you can install tabelle from the unpkg cdn

The CSS styles are available from:

- https://unpkg.com/tabelle@{VERSION}dist/tabelle.css (with minimal styling for the table element)
- https://unpkg.com/tabelle@{VERSION}/dist/tabelle-base.css (provides only base css for the structure of the components)

The JavaScript is available from:

- https://unpkg.com/tabelle@{VERSION}/dist/tabelle.js

# How to Use Tabelle

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

What Tabelle does is encapsulate your table in an HTML form and then generate a different header for each column which has the input fields you need in order to perform querying against your backend.

By default, Tabelle will generate a text input field with the name specified by the `<th>` element (e.g. `foo`). This means that when you input text in the field and the form submits, a query will be generated with the query parameter `?foo={your text}`.

By default, Tabelle will also generate a sort option for sorting ascending or decending. This is also an input field which will have the name `sort`. The value for the input will be the name of your column plus the direction (e.g. for `<th name="bar">` the inputs with values `bar-asc` and `bar-desc` will be generated.) This means that when you select an arrow and the form submits, a query will be generated with the query paramter `?sort={{name}-asc or {name}-desc}`. By default, Tabelle generates the value `asc` for ascending and `desc` for decending sort order.

By default, Tabelle will autosubmit the wrapping form whenever the user inputs a filter or clicks on the arrows in order to sort the column. Tabelle will take the result from submitting the form and replace the `<tbody>` from the `<tbody>` that is retrieved from the server.

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

When you want to set an existing filter for a column when rendering a column, you can do this by setting a value attribute in the column. Then this value will appear in the value of the filter field.

    <th name="foo" value="Faa">Foo</th>

# Handling empty result sets

When you have made a search query and no results are found, it may be likely that you want to add some helpful message for the user letting them know that no search results are found. We want to allow maximum flexibility and allow you to translate and style your message however you would like.

To help you do this, if you return a `<ta-belle>` element from the server which does not have a `<tbody>`, the whole `<ta-belle>` element will be replaced in the DOM instead of just the `<tbody>`. Here is an example of what a response could look like:

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

# Options

In `<ta-belle>` you can add the following properties to activate the following behavior

|Property  |Behavior|
|----------|--------|
|change-uri|Modifies the browser history so that by forward/back you can restore the searches that have been made|

In the `<th>` headers, you can add the following properties to activate the following behavior

|Property  |Behavior|
|----------|--------|
|name      |The name of the query parameter which is used for searching. If no `name` is specified, no filter column will be generated|
|value     |specifies value which will be set for the generated input field|
|nosort    |if no sorting functions should be generated for the column|
|nofilter  |if not filtering functions are generated for the column|

# Styling

We have made the styling as minimal as possible in order to allow you to customize the table as much as possible!