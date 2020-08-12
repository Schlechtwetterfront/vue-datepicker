import { mount, VueWrapper } from '@vue/test-utils';
import { enUS, de } from 'date-fns/locale';

import DayPicker from '../../src/pickers/DayPicker';
import { TransitionGroup, ref, nextTick, h } from 'vue';
import { month, dateMatches } from '../utils';

describe('DayPicker', () => {
    const refDate = ref(new Date(2020, 7, 1));
    const selDate = new Date(2020, 7, 15);
    const numberOfDays = 31;
    const numberOfPaddedDays = numberOfDays + 5 + 6;

    const defaultProps = {
        locale: enUS,
        referenceDate: refDate,
        modelValue: selDate,
    };

    function makeWrapper(extraProps?: object) {
        return mount(DayPicker, {
            props: {
                ...defaultProps,
                ...extraProps,
            },
        } as any);
    }

    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        refDate.value = new Date(2020, 7, 1);
        wrapper = makeWrapper();
    });

    it('should display correct labels', async () => {
        expect(wrapper.text()).toContain('August');
        expect(wrapper.text()).toContain('2020');

        refDate.value = month(2021, 8);

        await nextTick();

        expect(wrapper.text()).toContain('September');
        expect(wrapper.text()).toContain('2021');
    });

    it('should display correct amount of days', async () => {
        expect(wrapper.findAll('.v-picker__day')).toHaveLength(numberOfPaddedDays);

        wrapper.setProps({ ...defaultProps, transitions: false });

        refDate.value = month(2020, 6);

        await nextTick();

        // July 2020 has 5 padded weeks
        expect(wrapper.findAll('.v-picker__day')).toHaveLength(5 * 7);
    });

    it('should display buttons', () => {
        const text = wrapper.text();
        expect(text).toContain('<<');
        expect(text).toContain('>>');
        expect(text).toContain('<');
        expect(text).toContain('>');
    });

    it('should display day of week headers', () => {
        const text = wrapper.text();
        expect(text).toContain('Mo');
        expect(text).toContain('Tu');
        expect(text).toContain('We');
        expect(text).toContain('Th');
        expect(text).toContain('Fr');
        expect(text).toContain('Sa');
        expect(text).toContain('Su');
    });

    it('should not display day of week headers if disabled', () => {
        wrapper = makeWrapper({ showDayOfWeek: false });

        expect(wrapper.findAll('.v-picker__header-cell')).toHaveLength(0);
    });

    it('should mark selected day', async () => {
        let el = wrapper.find('.v-picker__day--selected');

        expect(el.exists()).toBe(true);
        expect(el.text()).toContain('15');

        const days = wrapper.findAll('.v-picker__day');

        await days[14].trigger('click');
        await days[15].trigger('click');
        await days[16].trigger('click');

        const selected = wrapper.emitted<Date[]>('update:modelValue');

        expect(selected).toHaveLength(3);

        expect(dateMatches(selected[0][0], new Date(2020, 7, 10))).toBe(true);
        expect(dateMatches(selected[1][0], new Date(2020, 7, 11))).toBe(true);
        expect(dateMatches(selected[2][0], new Date(2020, 7, 12))).toBe(true);

        el = wrapper.find('.v-picker__day--selected');

        expect(el.exists()).toBe(true);
        expect(el.text()).toContain('12');
    });

    it('should mark weekend', () => {
        expect.assertions(12);

        const weekends = [1, 2, 8, 9, 15, 16, 22, 23, 29, 30, 5, 6];
        const els = wrapper.findAll('.v-picker__day--weekend');

        els.forEach((el, i) => expect(el.text()).toContain(weekends[i]));
    });

    it('should disable days with predicate', () => {
        const disabled = (date: Date) => [5, 6].includes(date.getDate());

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__day--disabled');

        // The first 5 are padding from the previous month

        expect(disabledEls[5].text()).toContain(5);
        expect(disabledEls[6].text()).toContain(6);
    });

    it('should disable days with list', () => {
        const disabled = [new Date(2020, 7, 5), new Date(2020, 7, 6)];

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__day--disabled');

        // The first 5 are padding from the previous month

        expect(disabledEls[5].text()).toContain(5);
        expect(disabledEls[6].text()).toContain(6);
    });

    it('should disable days with range', () => {
        const disabled = { start: new Date(2020, 7, 10), end: new Date(2020, 7, 12) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__day--disabled');

        const expectedDisabled = [
            // July padding
            27,
            28,
            29,
            30,
            31,
            // Aug
            10,
            11,
            12,
            // September padding
            1,
            2,
            3,
            4,
            5,
            6,
        ];

        expect.assertions(expectedDisabled.length + 1);

        expect(disabledEls).toHaveLength(expectedDisabled.length);

        expectedDisabled.forEach((e, i) => expect(disabledEls[i].text()).toContain(e));
    });

    it('should disable days with open ended range', () => {
        const disabled = { start: new Date(2020, 7, 25) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__day--disabled');

        const expectedDisabled = [
            // July padding
            27,
            28,
            29,
            30,
            31,
            // Aug
            25,
            26,
            27,
            28,
            29,
            30,
            31,
            // September padding
            1,
            2,
            3,
            4,
            5,
            6,
        ];

        expect.assertions(expectedDisabled.length + 1);

        expect(disabledEls).toHaveLength(expectedDisabled.length);

        expectedDisabled.forEach((e, i) => expect(disabledEls[i].text()).toContain(e));
    });

    it('should disable days with open ended range in previous month', () => {
        const disabled = { start: new Date(2020, 2, 25) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__day--disabled');

        expect(disabledEls).toHaveLength(numberOfPaddedDays);
    });

    it('should disable days with open started range', () => {
        const disabled = { end: new Date(2020, 7, 5) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__day--disabled');

        const expectedDisabled = [
            // July padding
            27,
            28,
            29,
            30,
            31,
            // Aug
            1,
            2,
            3,
            4,
            5,
            // September padding
            1,
            2,
            3,
            4,
            5,
            6,
        ];

        expect.assertions(expectedDisabled.length + 1);

        expect(disabledEls).toHaveLength(expectedDisabled.length);

        expectedDisabled.forEach((e, i) => expect(disabledEls[i].text()).toContain(e));
    });

    it('should disable days with open started range in next month', () => {
        const disabled = { end: new Date(2020, 10, 25) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__day--disabled');

        expect(disabledEls).toHaveLength(numberOfPaddedDays);
    });

    it('should use transitions by default', () => {
        const transition = wrapper.findComponent(TransitionGroup);

        expect(transition.exists()).toBe(true);
    });

    it('should not use transitions if disabled', () => {
        wrapper = makeWrapper({ transitions: false });

        const transition = wrapper.findComponent(TransitionGroup);

        expect(transition.exists()).toBe(false);
    });

    it('should respect different locale', () => {
        wrapper = makeWrapper({ locale: de });

        expect(wrapper.text()).toContain('August');
        expect(wrapper.text()).toContain('Mo');
        expect(wrapper.text()).toContain('Di');
        expect(wrapper.text()).toContain('Mi');
        expect(wrapper.text()).toContain('Do');
        expect(wrapper.text()).toContain('Fr');
        expect(wrapper.text()).toContain('Sa');
        expect(wrapper.text()).toContain('So');
    });

    it('should allow different week start days', () => {
        wrapper = makeWrapper({ weekStartsOn: 0 });

        const weekDayHeaders = wrapper.findAll('.v-picker__header-cell');

        expect(weekDayHeaders[0].text()).toBe('Su');

        const days = wrapper.findAll('.v-picker__day');

        expect(days[0].text()).toBe('26');
    });

    it('should move months', async () => {
        const next = wrapper.find('.v-picker__next-month');

        await next.trigger('click');

        expect(wrapper.text()).toContain('September');
        expect(wrapper.text()).toContain('2020');

        const prev = wrapper.find('.v-picker__prev-month');

        await prev.trigger('click');
        await prev.trigger('click');

        expect(wrapper.text()).toContain('July');
        expect(wrapper.text()).toContain('2020');
    });

    it('should move years', async () => {
        const next = wrapper.find('.v-picker__next-year');

        await next.trigger('click');

        expect(wrapper.text()).toContain('August');
        expect(wrapper.text()).toContain('2021');

        const prev = wrapper.find('.v-picker__prev-year');

        await prev.trigger('click');
        await prev.trigger('click');

        expect(wrapper.text()).toContain('August');
        expect(wrapper.text()).toContain('2019');
    });

    it('should switch on label click', async () => {
        await wrapper.find('.v-picker__month-label').trigger('click');

        expect(wrapper.emitted('switch')[0]).toEqual(['month']);

        await wrapper.find('.v-picker__year-label').trigger('click');

        expect(wrapper.emitted('switch')[1]).toEqual(['year']);
    });

    it('should render slots', () => {
        const slotKeys = [
            'above',
            'below',
            'day',
            'weekdayLabel',
            'monthLabel',
            'yearLabel',
            'prevPrevYear',
            'nextNextYear',
            'prevMonth',
            'nextMonth',
        ];

        const slots: any = {};

        slotKeys.forEach((k) => {
            slots[k] = () => k;
        });

        wrapper = mount(DayPicker, {
            props: defaultProps,
            slots,
        } as any);

        const text = wrapper.text();

        expect.assertions(slotKeys.length);

        slotKeys.forEach((k) => expect(text).toContain(k));
    });
});
