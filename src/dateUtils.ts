import {
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    startOfYear,
    endOfYear,
    isWeekend,
    isSameMonth,
    isSameDay,
    isToday,
    isWithinInterval,
    isAfter,
    isBefore,
} from 'date-fns';
import { PickerItemContext, DayOfWeek, DisabledDates, DatePredicate, DateRange } from './types';

export function paddedDaysInMonth(dateInMonth: Date, weekStartsOn: DayOfWeek) {
    const start = startOfWeek(startOfMonth(dateInMonth), { weekStartsOn });
    const end = endOfWeek(endOfMonth(dateInMonth), { weekStartsOn });

    return eachDayOfInterval({ start, end });
}

export function dayClasses(ctx: PickerItemContext) {
    return {
        'v-picker__day': true,
        'v-picker__day--weekend': isWeekend(ctx.date),
        'v-picker__day--padding': !isSameMonth(ctx.date, ctx.reference),
        'v-picker__day--selected': ctx.selected ? isSameDay(ctx.date, ctx.selected) : false,
        'v-picker__day--disabled': ctx.disabled ?? false,
        'v-picker__day--today': isToday(ctx.date),
    };
}

function isDatePredicate(d: DisabledDates): d is DatePredicate {
    return typeof d === 'function';
}

export function isDayDisabled(date: Date, disabled: DisabledDates) {
    if (isDatePredicate(disabled)) {
        return disabled(date);
    }

    if (Array.isArray(disabled)) {
        return disabled.some((d) => isSameDay(d, date));
    }

    if (disabled.start && disabled.end) {
        return (
            isSameDay(date, disabled.start) ||
            isSameDay(date, disabled.end) ||
            isWithinInterval(date, disabled as Interval)
        );
    } else if (disabled.start && !disabled.end) {
        return isSameDay(date, disabled.start) || isAfter(date, disabled.start);
    } else if (!disabled.start && disabled.end) {
        return isSameDay(date, disabled.end) || isBefore(date, disabled.end);
    }

    return false;
}

function withinRange(first: Date, last: Date, disabled: DateRange) {
    if (disabled.start && disabled.end) {
        return (
            (isSameDay(first, disabled.start) || isAfter(first, disabled.start)) &&
            (isSameDay(last, disabled.end) || isBefore(last, disabled.end))
        );
    } else if (disabled.start && !disabled.end) {
        return isSameDay(first, disabled.start) || isAfter(first, disabled.start);
    } else if (!disabled.start && disabled.end) {
        return isSameDay(last, disabled.end) || isBefore(last, disabled.end);
    }

    return false;
}

export function isMonthDisabled(date: Date, disabled: DisabledDates) {
    // Don't check if we would have to check every day of the month
    if (isDatePredicate(disabled) || Array.isArray(disabled)) {
        return false;
    }

    const first = startOfMonth(date);
    const last = endOfMonth(date);

    return withinRange(first, last, disabled);
}

export function isYearDisabled(date: Date, disabled: DisabledDates) {
    // Don't check if we would have to check every day of the year
    if (isDatePredicate(disabled) || Array.isArray(disabled)) {
        return false;
    }

    const first = startOfYear(date);
    const last = endOfYear(date);

    return withinRange(first, last, disabled);
}
