import { Locale } from 'date-fns';

export interface PickerContext {
    reference: Date;
    selected: Date | null;
    locale?: Locale;
}

export interface PickerItemContext extends PickerContext {
    date: Date;
    disabled: boolean;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export enum PickerKind {
    DAY = 'day',
    MONTH = 'month',
    YEAR = 'year',
}

export enum PickerMode {
    /**
     * Show the picker directly inline
     *
     * Without input tag
     */
    INLINE = 'inline',
    /**
     * Show an input and open the picker as a popup
     */
    INPUT_POPUP = 'input',
    /**
     * Show both input and picker
     */
    INPUT_INLINE = 'input-inline',
}

export interface DateRange {
    start?: Date;
    end?: Date;
}

export type DatePredicate = (date: Date) => boolean;

export type DisabledDates = DatePredicate | Date[] | DateRange;
