# tabelle
A library for generating pretty filterable and sortable tables that use your backend of choice

This library uses custom elements. In order for this to work, you need to use a browser which support it or use a polyfill.

# Install

    npm install tabelle

# How to Use Tabelle

Tabelle expects that you have an HTTP Resource which renders an HTML Table. In order to activate Tabelle, we can encapsulate our HTML Table in the `<ta-belle>` custom element which contains a link to the HTTP Resource:

    <ta-belle search-src="/components/preview/tabelle--custom-element-state">
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

# Options

In `<ta-belle>` you can add the following properties to activate the following behavior

|Property  |Behavior|
|----------|--------|
|change-uri|Modifies the browser history so that by forward/back you can restore the searches that have been made|

# Styling

We have made the styling as minimal as possible in order to allow you to customize the table as much as possible!