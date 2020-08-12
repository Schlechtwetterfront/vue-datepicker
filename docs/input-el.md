## Using an `input` element

The `Picker` can be used "inline" and with an `input` element.

To enable this, pass `input` as `mode` to the picker.

```vue
<template>
    <Picker mode="input" />
</template>

<script>
import { Picker } from '@schlechtwetterfront/vue-datepicker';

export default {
    components: { Picker },
    setup() {
        return {};
    },
};
</script>
```

The `input` mode also has some additional features.

### Value format

A function that takes a `Date` and returns the `string` that will be set as the `input` element's value. The default will format the date as `yyyy-MM-dd`.

```vue
<template>
    <Picker mode="input" :valueFormat="format" />
</template>

<script>
import { Picker } from '@schlechtwetterfront/vue-datepicker';
import { format } from 'date-fns';

export default {
    components: { Picker },
    setup() {
        return {
            format: (date) => format(date, 'dd.MM.yyyy'),
        };
    },
};
</script>
```

### Input parsing

The `Picker` also supports letting the user directly enter the date string, instead of selecting a date. To enable this behavior, pass a function that takes a `string` and returns a `Date` in prop `parse`.

There is no default behavior here and the `input` will be readonly if this prop is not set.

```vue
<template>
    <Picker mode="input" :parse="parseDateStr" />
</template>

<script>
import { Picker } from '@schlechtwetterfront/vue-datepicker';
import { parse } from 'date-fns';

export default {
    components: { Picker },
    setup() {
        return {
            parseDateStr: (dateStr) => parse(dateStr, 'MM/dd/yyyy', new Date()),
        };
    },
};
</script>
```

### Input element classes, id and attributes

To set `class`, `name`, `id`, etc. on the `input` element, pass these as an object into the prop `inputProps`.

```vue
<template>
    <Picker
        mode="input"
        :inputProps="{
            placeholder: 'Enter date here',
            name: 'orderDate',
        }"
    />
</template>
```
