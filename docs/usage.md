## Usage

### Return values and `v-model`

`v-model` can be used with the picker. The value will either be a `Date` or `null`.

For the `DayPicker` this obviously makes sense. But what about the month and year pickers?

These two also return standard `Date`s. It's your job to ignore the day (and month) parts of the date. Usually, the first of a certain day range will be returned. I.e. a `MonthPicker` will return `2000-03-01` when March is selected, a `YearPicker` will return `2000-01-01` when the year 2000 is selected.

### The Reference Date

For all date logic this library uses a _reference date_. For that purpose all the pickers take a prop `referenceDate`.

Based on this date, all the selectable items (days, months, years) will be calculated.

If a `DayPicker` gets a `referenceDate` of `1989-11-09` it will offer all days of November 1989 for selection.

Same applies to the `MonthPicker` (all months of the year 1989 [for some reason always the same...]) and to the `YearPicker` (all years from the decade spanning 1980 to 1989).

```vue
<template>
    <Picker :referenceDate="new Date(1989, 10, 09)" />
    <DayPicker :referenceDate="new Date(1989, 10, 09)" />
    <MonthPicker :referenceDate="new Date(1989, 10, 09)" />
    <YearPicker :referenceDate="new Date(1989, 10, 09)" />
</template>
```

This could be used to start of the user a few months in the future (if e.g. your hand-knit hats needed at least 3 months to knit).

If no `referenceDate` is supplied, it will try to use the `modelValue` (most likely passed via `v-model`) or finally fall back to "now" (`new Date()`).

### Disabling dates

The day picker pads the grid with days from the last/next month. These are disabled be default.

Further days can be disabled by providing the `disabledDates` prop. This prop either takes:

-   a list of `Date`s: will check each day against this list (only compares the date part, not time)
-   a `DateRange` (`{ start?: Date, end?: Date}`): disabled a range of dates, either or both of `start` and `end` can be set
    -   Only `start`: Every date that comes after `start` is disabled
    -   Only `end`: Every date that comes before `end` is disabled
    -   Both: Every date that is between the two is disabled
-   a function taking a `Date` and returning a `boolean`

All of these work for disabling days in the date picker. Only the date range will be checked to see if items in the month or year picker are disabled.
