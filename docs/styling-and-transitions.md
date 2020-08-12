## Styling & Transitions

### Styling

This library does not really come with an included stylesheet or similar. You can however use the `.scss` files used in the playground in your project.

-   Basic layout: [\_layout.scss](../examples/assets/_layout.scss)
-   Styling with colors: [\_style.scss](../examples/assets/_style.scss)

### Transitions

The picker components use some transitions by default. To enable these you will need to include the required CSS transitions/animations.

-   Transition animations: [\_transitions.scss](../examples/assets/_transitions.scss)

If you do _not_ want transitions, you should also set `:transitions="false"` when using the pickers. Otherwise some flashing may occur when Vue is switching between components.
