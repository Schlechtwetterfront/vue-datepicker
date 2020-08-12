## Slots

The pickers provide several slots for customization. You could for example use the slots `next`, `prev`, `nextNext` and `prevPrev` to replace all text-arrows with e.g. Font Awesome icons.

These slots usually replace the _contents_, not the whole element/button.

| Slot           | Fallback slot | Description                                                            |
| -------------- | ------------- | ---------------------------------------------------------------------- |
| `next`         | -             | Generic next button slot                                               |
| `prev`         | -             | Generic back button slot                                               |
| `nextNext`     | -             | "Double arrow" next slot (used in `DayPicker` to navigate by one year) |
| `prevPrev`     | -             | "Double arrow" prev slot (used in `DayPicker` to navigate by one year) |
| `nextDecade`   | `next`        | `YearPicker`s next                                                     |
| `prevDecade`   | `prev`        | `YearPicker`s prev                                                     |
| `nextYear`     | `next`        | `MonthPicker`s next                                                    |
| `prevYear`     | `prev`        | `MonthPicker`s prev                                                    |
| `nextMonth`    | `next`        | `DayPicker`s next                                                      |
| `prevMonth`    | `prev`        | `DayPicker`s prev                                                      |
| `nextNextYear` | `nextNext`    | `DayPicker`s next year (double arrow)                                  |
| `prevPrevYear` | `prevPrev`    | `DayPicker`s prev year (double arrow)                                  |
| `year`         | -             | Display year item in the `YearPicker`                                  |
| `month`        | -             | Display month item in the `MonthPicker`                                |
| `day`          | -             | Display day item in the `DayPicker`                                    |
| `decadeLabel`  | -             | Used to display the picker label in the `YearPicker`                   |
| `yearLabel`    | -             | Used to display the picker label in the `MonthPicker`                  |
| `monthLabel`   | -             | Used to display the picker label in the `DayPicker`                    |
| `weekdayLabel` | -             | Used to display the weekday labels in the `DayPicker`                  |
| `below`        | -             | A (usually empty) slot below the picker items                          |
| `above`        | -             | A (usually empty) slot above the picker header/controls                |

### Context

Slots are generally passed a context. Currently there are two different contexts that can be passed

#### `PickerContext`

This is a context describing the picker's state.

| Prop        | Type          | Description                                      |
| ----------- | ------------- | ------------------------------------------------ |
| `reference` | `Date`        | The picker's reference date (see reference date) |
| `selected`  | `Date | null` | The picker's currently selected date             |
| `locale`    | `Locale?`     | `date-fns` locale or `undefined`                 |

This context is passed to every slot but `year`, `month` and `day`.

#### `PickerItemContext`

This is a context describing a single item of a picker (like a day in the day picker). Additionally to the properties of the `PickerContext` it also contains:

| Prop       | Type      | Description                                                                                                                       |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `date`     | `Date`    | A date describing the current item. For the month picker it's the first of each month. For the year picker the first of each year |
| `disabled` | `boolean` | If this item is disabled (see disabled dates)                                                                                     |
