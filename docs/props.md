## Props

### `Picker`

| Prop | Type |
Description |
| --------------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| `mode` | `PickerMode` | Default: `PickerMode.INLINE`/`inline`
| `transitions` | `boolean` | Default: `true`. See [Transitions](styling-and-transitions.md#transitions)
| `kind` | `PickerKind` | The "lowest" picker kind. If `month`, the user can only switch between the month and year pickers. Default: `PickerKind.DAY`/`day` |
| `showDayOfWeek` | `boolean` | Show day of week headere row for day picker. Default: `true`
| `showControls` | `boolean` | Show controls/picker header. Default: `true`
| `referenceDate` | `Date?` | See [The Reference Date](usage.md#the-reference-date)
| `weekStartsOn` | `DayOfWeek | number` |
| `disabledDates` | `Date[] | DateRange | (Date) => boolean` | Disable dates (see [Disabling dates](usage.md#disabling-dates))
| `inputProps` | `object?` | Props passed along to the `input` element (if enabled) |
| `parse` | `string => Date?` | Function to parse direct user date string input |
| `valueFormat` | `Date => string` | Function to format the selected date as something that can be set as the `input`s value |
| `locale` | `Locale?` | A `date-fns` locale (see [i18n](i18n.md))

### `DayPicker`

| Prop | Type |
Description |
| --------------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| `transitions` | `boolean` | See above
| `showDayOfWeek` | `boolean` | See above
| `showControls` | `boolean` | See above
| `referenceDate` | `Date?` | See above
| `weekStartsOn` | `DayOfWeek | number` | See above
| `disabledDates` | `Date[] | DateRange | (Date) => boolean` | See above
| `locale` | `Locale?` | See above

### `MonthPicker`

| Prop | Type |
Description |
| --------------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| `transitions` | `boolean` | See above
| `showControls` | `boolean` | See above
| `referenceDate` | `Date?` | See above
| `disabledDates` | `Date[] | DateRange | (Date) => boolean` | See above
| `locale` | `Locale?` | See above

### `YearPicker`

| Prop | Type |
Description |
| --------------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| `transitions` | `boolean` | See above
| `showControls` | `boolean` | See above
| `referenceDate` | `Date?` | See above
| `disabledDates` | `Date[] | DateRange | (Date) => boolean` | See above
| `locale` | `Locale?` | See above
