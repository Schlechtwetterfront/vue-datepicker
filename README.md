# `vue-datepicker` [![npm (scoped)](https://img.shields.io/npm/v/@schlechtwetterfront/vue-datepicker)](https://www.npmjs.com/package/@schlechtwetterfront/vue-datepicker)

A customizable datepicker for Vue 3. Has a peer dependency on `date-fns` `2.x`.

Check out the playground/examples [here](https://schlechtwetterfront.github.io/vue-datepicker)

## Usage

Install package and dependencies

```bash
# yarn
yarn add @schlechtwetterfront/vue-dialogs
yarn add date-fns

# npm
npm install @schlechtwetterfront/vue-dialogs
npm install date-fns
```

This library does not need a global installation. Instead just import one of the components like `Picker` and use them

```vue
<template>
    <section class="my-app">
        <Picker v-model="myDate" />
    </section>
</template>

<script>
import { ref } from 'vue';
import { Picker } from '@schlechtwetterfront/vue-datepicker';

export default {
    components: { Picker },
    setup() {
        const myDate = ref(new Date());

        return { myDate };
    },
};
</script>
```

For more detailed documentation see:

-   [Usage](docs/usage.md)
-   [Props](docs/props.md)
-   [`<input>` element](docs/input-el.md)
-   [Slots](docs/slots.md)
-   [i18n](docs/i18n.md)
-   [Styling & transitions](docs/styling-and-transitions.md)
