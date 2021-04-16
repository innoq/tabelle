title: Tabelle Header
description: A component to format a table header

The Header component has the class `.tabelle-header` and is responsible for
providing the layout within a header.

You can customize the layout with the following CSS Properties.

```
--tabelle-arrow-height: ; /* Default: 1rem */
--tabelle-filter-height: ; /* Default: auto */
--tabelle-column-gap: ; /* Default: 0.125rem */
```

## A Header with Input Field

```handlebars
<div class="tabelle-header" role="group" aria-labelledby="{{name}}_group">
	<span class="header" id="{{name}}_group">{{label}}</span>
	<input class="tabelle-arrow" id="{{name}}_asc" type="radio" name="sort" value="{{name}}-asc"/>
	<label class="tabelle-arrow--asc" for="{{name}}_asc">
		<span class="visually-hidden">Sort {{label}} Ascending</span>
	</label>

	<input class="tabelle-arrow" id="{{name}}_desc" type="radio" name="sort" value="{{name}}-desc" />
	<label class="tabelle-arrow--desc" for="{{name}}_desc">
		<span class="visually-hidden">Sort {{label}} Descending</span>
	</label>

	<input
		class="tabelle-input"
		name="{{name}}"
		type="text"
		aria-label="Filter {{label}}" />
</div>
```

## A Header with Select Field

```handlebars
<div class="tabelle-header" role="group" aria-labelledby="{{name}}_group">
	<span class="header" id="{{name}}_group">{{label}}</span>
	<input class="tabelle-arrow" id="{{name}}_asc" type="radio" name="sort" value="{{name}}-asc"/>
	<label class="tabelle-arrow--asc" for="{{name}}_asc">
		<span class="visually-hidden">Sort {{label}} Ascending</span>
	</label>

	<input class="tabelle-arrow" id="{{name}}_desc" type="radio" name="sort" value="{{name}}-desc" />
	<label class="tabelle-arrow--desc" for="{{name}}_desc">
		<span class="visually-hidden">Sort {{label}} Descending</span>
	</label>

	<select class="tabelle-input"
		name="{{name}}"
		aria-label="Filter {{label}}">
		<option>A</option>
		<option>B</option>
		<option>C</option>
	</select>
</div>
```

## A Header without Sort

```handlebars
<div class="tabelle-header" role="group" aria-labelledby="{{name}}_group">
	<span class="header" id="{{name}}_group">{{label}}</span>

	<input
		class="tabelle-input"
		name="{{name}}"
		type="text"
		aria-label="Filter {{label}}" />
</div>
```

## A Header without Filter

```handlebars
<div class="tabelle-header" role="group" aria-labelledby="{{name}}_group">
	<span class="header" id="{{name}}_group">{{label}}</span>
	<input class="tabelle-arrow" id="{{name}}_asc" type="radio" name="sort" value="{{name}}-asc"/>
	<label class="tabelle-arrow--asc" for="{{name}}_asc">
		<span class="visually-hidden">Sort {{label}} Ascending</span>
	</label>

	<input class="tabelle-arrow" id="{{name}}_desc" type="radio" name="sort" value="{{name}}-desc" />
	<label class="tabelle-arrow--desc" for="{{name}}_desc">
		<span class="visually-hidden">Sort {{label}} Descending</span>
	</label>
</div>
```
