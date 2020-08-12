import {
    paddedDaysInMonth,
    isDayDisabled,
    isMonthDisabled,
    isYearDisabled,
} from '../src/dateUtils';

import { dateMatches, month, year } from './utils';

const monday = 1;

describe('dateMatches', () => {
    it('should match two different Date instances with same date component', () => {
        const a = new Date(2000, 0, 1);
        const b = new Date(2000, 0, 1);

        expect(dateMatches(a, b)).toBe(true);
    });

    it('should not match different date components', () => {
        const a = new Date(2000, 0, 1);
        const b = new Date(2000, 0, 2);

        expect(dateMatches(a, b)).toBe(false);
    });
});

describe('paddedDaysInMonth', () => {
    it('should pad weeks that start/end in the middle of week', () => {
        const date = new Date(2020, 7, 1);
        const first = new Date(2020, 6, 27);
        const last = new Date(2020, 8, 6);

        const days = paddedDaysInMonth(date, monday);

        expect(days).toHaveLength(6 * 7);

        expect(dateMatches(days[0], first)).toBe(true);
        expect(dateMatches(days[days.length - 1], last)).toBe(true);
    });
});

describe('isDayDisabled', () => {
    it('should disable with const predicate', () => {
        const predicate = (date: Date) => true;

        expect(isDayDisabled(new Date(), predicate)).toBe(true);
    });

    it('should disable with predicate', () => {
        const predicate = (date: Date) => dateMatches(date, new Date(1998, 10, 20, 12));

        expect(isDayDisabled(new Date(1998, 10, 20, 20), predicate)).toBe(true);
    });

    it('should disable with list of dates', () => {
        const disabled = [new Date(2000, 4, 5)];

        expect(isDayDisabled(new Date(2000, 4, 5), disabled)).toBe(true);
    });

    it('should disable with range', () => {
        const range = { start: new Date(2017, 8, 20), end: new Date(2017, 9, 10) };

        expect(isDayDisabled(new Date(2017, 9, 1), range)).toBe(true);

        expect(isDayDisabled(new Date(2017, 8, 20), range)).toBe(true);

        expect(isDayDisabled(new Date(2017, 9, 10), range)).toBe(true);

        expect(isDayDisabled(new Date(2017, 0, 1), range)).toBe(false);
    });

    it('should disable with open ended range', () => {
        const range = { start: new Date(2017, 8, 20) };

        expect(isDayDisabled(new Date(2017, 8, 19), range)).toBe(false);

        expect(isDayDisabled(new Date(2017, 8, 20), range)).toBe(true);

        expect(isDayDisabled(new Date(2017, 9, 1), range)).toBe(true);

        expect(isDayDisabled(new Date(2020, 9, 1), range)).toBe(true);

        expect(isDayDisabled(new Date(2030, 9, 1), range)).toBe(true);
    });

    it('should disable with open "started" range', () => {
        const range = { end: new Date(2017, 9, 10) };

        expect(isDayDisabled(new Date(2010, 8, 10), range)).toBe(true);

        expect(isDayDisabled(new Date(2017, 8, 10), range)).toBe(true);

        expect(isDayDisabled(new Date(2017, 9, 10), range)).toBe(true);

        expect(isDayDisabled(new Date(2017, 9, 11), range)).toBe(false);
    });
});

describe('isMonthDisabled', () => {
    it('should not disable with any predicate', () => {
        const predicate = (date: Date) => false;

        expect(isMonthDisabled(new Date(1984, 8, 27), predicate)).toBe(false);
    });

    it('should not disable with list of dates', () => {
        const disabled = [new Date(2000, 4, 5)];

        expect(isMonthDisabled(new Date(2000, 4, 5), disabled)).toBe(false);
    });

    it('should disable with range', () => {
        const range = { start: new Date(2015, 7, 15), end: new Date(2015, 9, 15) };

        expect(isMonthDisabled(month(2015, 8), range)).toBe(true);
    });

    it('should only disable with range for full months', () => {
        const range = { start: new Date(2015, 7, 15), end: new Date(2015, 9, 15) };

        expect(isMonthDisabled(month(2015, 7), range)).toBe(false);

        expect(isMonthDisabled(month(2015, 9), range)).toBe(false);
    });

    it('should disable with open ended range', () => {
        const range = { start: month(2015, 8) };

        expect(isMonthDisabled(month(2015, 7), range)).toBe(false);

        expect(isMonthDisabled(month(2015, 8), range)).toBe(true);

        expect(isMonthDisabled(month(2020, 9), range)).toBe(true);

        expect(isMonthDisabled(month(2030, 9), range)).toBe(true);
    });

    it('should disable with open "started" range', () => {
        const range = { end: month(2017, 9) };

        expect(isMonthDisabled(month(2010, 8), range)).toBe(true);

        expect(isMonthDisabled(month(2017, 9), range)).toBe(false);

        expect(isMonthDisabled(month(2020, 8), range)).toBe(false);
    });
});

describe('isYearDisabled', () => {
    it('should not disable with any predicate', () => {
        const predicate = (date: Date) => false;

        expect(isYearDisabled(new Date(1963, 7, 3), predicate)).toBe(false);
    });

    it('should not disable with list of dates', () => {
        const disabled = [year(2000)];

        expect(isYearDisabled(year(2000), disabled)).toBe(false);
    });

    it('should disable with range', () => {
        const range = { start: year(1989), end: year(1991) };

        expect(isYearDisabled(year(1990), range)).toBe(true);
    });

    it('should only disable with range for full years', () => {
        const range = { start: new Date(1990, 5, 15), end: new Date(1992, 5, 15) };

        expect(isYearDisabled(year(1990), range)).toBe(false);

        expect(isYearDisabled(year(1992), range)).toBe(false);
    });

    it('should disable with open ended range', () => {
        const range = { start: year(2015) };

        expect(isYearDisabled(year(2014), range)).toBe(false);

        expect(isYearDisabled(year(2015), range)).toBe(true);

        expect(isYearDisabled(year(2016), range)).toBe(true);
    });

    it('should disable with open "started" range', () => {
        const range = { end: year(2017) };

        expect(isYearDisabled(year(2010), range)).toBe(true);

        expect(isYearDisabled(year(2017), range)).toBe(false);

        expect(isYearDisabled(year(2018), range)).toBe(false);
    });
});
