import { mount, VueWrapper } from '@vue/test-utils';
import { enUS } from 'date-fns/locale';

import YearPicker from '../../src/pickers/YearPicker';
import { TransitionGroup, ref, nextTick } from 'vue';
import { month, dateMatches, year } from '../utils';

describe('YearPicker', () => {
    const refDate = ref(new Date(2020, 7, 1));
    const selDate = new Date(2020, 7, 15);

    const defaultProps = {
        locale: enUS,
        referenceDate: refDate,
        modelValue: selDate,
    };

    function makeWrapper(extraProps?: object) {
        return mount(YearPicker, {
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
        expect(wrapper.text()).toContain('2020 - 2029');

        refDate.value = month(2031, 8);

        await nextTick();

        expect(wrapper.text()).toContain('2030 - 2039');
    });

    it('should display correct amount of years', async () => {
        expect(wrapper.findAll('.v-picker__year')).toHaveLength(10);

        wrapper.setProps({ ...defaultProps, transitions: false });

        refDate.value = month(2020, 6);

        await nextTick();

        expect(wrapper.findAll('.v-picker__year')).toHaveLength(10);
    });

    it('should display buttons', () => {
        const text = wrapper.text();
        expect(text).not.toContain('<<');
        expect(text).not.toContain('>>');
        expect(text).toContain('<');
        expect(text).toContain('>');
    });

    it('should mark selected year', async () => {
        let el = wrapper.find('.v-picker__year--selected');

        expect(el.exists()).toBe(true);
        expect(el.text()).toContain('2020');

        const days = wrapper.findAll('.v-picker__year');

        await days[0].trigger('click');
        await days[3].trigger('click');
        await days[9].trigger('click');

        const selected = wrapper.emitted<Date[]>('update:modelValue');

        expect(selected).toHaveLength(3);

        expect(dateMatches(selected[0][0], year(2020))).toBe(true);
        expect(dateMatches(selected[1][0], year(2023))).toBe(true);
        expect(dateMatches(selected[2][0], year(2029))).toBe(true);

        el = wrapper.find('.v-picker__year--selected');

        expect(el.exists()).toBe(true);
        expect(el.text()).toContain('2029');
    });

    it('should not disable years with predicate', () => {
        const disabled = (date: Date) => true;

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__year--disabled');

        expect(disabledEls).toHaveLength(0);
    });

    it('should not disable years with list', () => {
        const disabled = [year(2021), year(2022)];

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__year--disabled');

        expect(disabledEls).toHaveLength(0);
    });

    it('should disable years with range', () => {
        const disabled = { start: year(2020), end: year(2022) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__year--disabled');

        const expectedDisabled = ['2020', '2021'];

        expect.assertions(expectedDisabled.length + 1);

        expect(disabledEls).toHaveLength(expectedDisabled.length);

        expectedDisabled.forEach((e, i) => expect(disabledEls[i].text()).toContain(e));
    });

    it('should disable years with open ended range', () => {
        const disabled = { start: year(2025) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__year--disabled');

        const expectedDisabled = ['2025', '2026', '2027', '2028', '2029'];

        expect.assertions(expectedDisabled.length + 1);

        expect(disabledEls).toHaveLength(expectedDisabled.length);

        expectedDisabled.forEach((e, i) => expect(disabledEls[i].text()).toContain(e));
    });

    it('should disable years with open ended range in previous decade', () => {
        const disabled = { start: year(2019) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__year--disabled');

        expect(disabledEls).toHaveLength(10);
    });

    it('should disable years with open started range', () => {
        const disabled = { end: year(2025) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__year--disabled');

        const expectedDisabled = ['2020', '2021', '2022', '2023', '2024'];

        expect.assertions(expectedDisabled.length + 1);

        expect(disabledEls).toHaveLength(expectedDisabled.length);

        expectedDisabled.forEach((e, i) => expect(disabledEls[i].text()).toContain(e));
    });

    it('should disable years with open started range in next decade', () => {
        const disabled = { end: month(2031, 0) };

        wrapper = makeWrapper({ disabledDates: disabled });

        const disabledEls = wrapper.findAll('.v-picker__year--disabled');

        expect(disabledEls).toHaveLength(10);
    });

    it('should not use transitions if disabled', () => {
        wrapper = makeWrapper({ transitions: false });

        const transition = wrapper.findComponent(TransitionGroup);

        expect(transition.exists()).toBe(false);
    });

    it('should move decades', async () => {
        const next = wrapper.find('.v-picker__next-decade');

        await next.trigger('click');

        expect(wrapper.text()).toContain('2030 - 2039');

        const prev = wrapper.find('.v-picker__prev-decade');

        await prev.trigger('click');
        await prev.trigger('click');

        expect(wrapper.text()).toContain('2010 - 2019');
    });

    it('should render slots', () => {
        const slotKeys = ['above', 'below', 'year', 'decadeLabel', 'prevDecade', 'nextDecade'];

        const slots: any = {};

        slotKeys.forEach((k) => {
            slots[k] = () => k;
        });

        wrapper = mount(YearPicker, {
            props: defaultProps,
            slots,
        } as any);

        const text = wrapper.text();

        expect.assertions(slotKeys.length);

        slotKeys.forEach((k) => expect(text).toContain(k));
    });
});
