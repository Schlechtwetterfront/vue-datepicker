import { mount, VueWrapper } from '@vue/test-utils';
import { enUS, de } from 'date-fns/locale';

import MonthPicker from '../../src/pickers/MonthPicker';
import { TransitionGroup, ref, nextTick } from 'vue';
import { month, dateMatches } from '../utils';

describe('MonthPicker', () => {
    const refDate = ref(new Date(2020, 7, 1));
    const selDate = new Date(2020, 7, 15);

    const defaultProps = {
        locale: enUS,
        referenceDate: refDate,
        modelValue: selDate,
    };

    function makeWrapper(extraProps?: object) {
        return mount(MonthPicker, {
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
        expect(wrapper.text()).toContain('2020');

        refDate.value = month(2021, 8);

        await nextTick();

        expect(wrapper.text()).toContain('2021');
    });

    it('should display correct amount of months', async () => {
        expect(wrapper.findAll('.v-picker__month')).toHaveLength(12);

        wrapper.setProps({ ...defaultProps, transitions: false });

        refDate.value = month(2020, 6);

        await nextTick();

        expect(wrapper.findAll('.v-picker__month')).toHaveLength(12);
    });

    it('should display buttons', () => {
        const text = wrapper.text();
        expect(text).not.toContain('<<');
        expect(text).not.toContain('>>');
        expect(text).toContain('<');
        expect(text).toContain('>');
    });

    it('should mark selected month', async () => {
        let el = wrapper.find('.v-picker__month--selected');

        expect(el.exists()).toBe(true);
        expect(el.text()).toContain('August');

        const days = wrapper.findAll('.v-picker__month');

        await days[0].trigger('click');
        await days[3].trigger('click');
        await days[11].trigger('click');

        const selected = wrapper.emitted<Date[]>('update:modelValue');

        expect(selected).toHaveLength(3);

        expect(dateMatches(selected[0][0], month(2020, 0))).toBe(true);
        expect(dateMatches(selected[1][0], month(2020, 3))).toBe(true);
        expect(dateMatches(selected[2][0], month(2020, 11))).toBe(true);

        el = wrapper.find('.v-picker__month--selected');

        expect(el.exists()).toBe(true);
        expect(el.text()).toContain('December');
    });

    it('should not disable months with predicate', () => {
        const disabled = (date: Date) => true;

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__month--disabled');

        expect(disabledEls).toHaveLength(0);
    });

    it('should not disable months with list', () => {
        const disabled = [month(2020, 7), month(2020, 8)];

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__month--disabled');

        expect(disabledEls).toHaveLength(0);
    });

    it('should disable months with range', () => {
        const disabled = { start: month(2020, 7), end: month(2020, 9) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__month--disabled');

        const expectedDisabled = ['August', 'September'];

        expect.assertions(expectedDisabled.length + 1);

        expect(disabledEls).toHaveLength(expectedDisabled.length);

        expectedDisabled.forEach((e, i) => expect(disabledEls[i].text()).toContain(e));
    });

    it('should disable months with open ended range', () => {
        const disabled = { start: month(2020, 7) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__month--disabled');

        const expectedDisabled = ['August', 'September', 'October', 'November', 'December'];

        expect.assertions(expectedDisabled.length + 1);

        expect(disabledEls).toHaveLength(expectedDisabled.length);

        expectedDisabled.forEach((e, i) => expect(disabledEls[i].text()).toContain(e));
    });

    it('should disable months with open ended range in previous year', () => {
        const disabled = { start: month(2019, 0) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__month--disabled');

        expect(disabledEls).toHaveLength(12);
    });

    it('should disable months with open started range', () => {
        const disabled = { end: month(2020, 3) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__month--disabled');

        const expectedDisabled = ['January', 'February', 'March'];

        expect.assertions(expectedDisabled.length + 1);

        expect(disabledEls).toHaveLength(expectedDisabled.length);

        expectedDisabled.forEach((e, i) => expect(disabledEls[i].text()).toContain(e));
    });

    it('should disable months with open started range in next year', () => {
        const disabled = { end: month(2021, 0) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__month--disabled');

        expect(disabledEls).toHaveLength(12);
    });

    it('should not use transitions if disabled', () => {
        wrapper = makeWrapper({ transitions: false });

        const transition = wrapper.findComponent(TransitionGroup);

        expect(transition.exists()).toBe(false);
    });

    it('should move years', async () => {
        const next = wrapper.find('.v-picker__next-year');

        await next.trigger('click');

        expect(wrapper.text()).toContain('2021');

        const prev = wrapper.find('.v-picker__prev-year');

        await prev.trigger('click');
        await prev.trigger('click');

        expect(wrapper.text()).toContain('2019');
    });

    it('should switch on label click', async () => {
        await wrapper.find('.v-picker__year-label').trigger('click');

        expect(wrapper.emitted('switch')[0]).toEqual(['year']);
    });

    it('should respect different locale', () => {
        wrapper = makeWrapper({ locale: de });

        expect(wrapper.text()).toContain('Januar');
        expect(wrapper.text()).toContain('Februar');
        expect(wrapper.text()).toContain('März');
    });

    it('should render slots', () => {
        const slotKeys = ['above', 'below', 'month', 'yearLabel', 'prevYear', 'nextYear'];

        const slots: any = {};

        slotKeys.forEach((k) => {
            slots[k] = () => k;
        });

        wrapper = mount(MonthPicker, {
            props: defaultProps,
            slots,
        } as any);

        const text = wrapper.text();

        expect.assertions(slotKeys.length);

        slotKeys.forEach((k) => expect(text).toContain(k));
    });
});
