import { ref, nextTick } from 'vue';
import { enUS } from 'date-fns/locale';
import { mount, VueWrapper } from '@vue/test-utils';
import Picker from '../../src/pickers/Picker';
import DayPicker from '../../src/pickers/DayPicker';
import MonthPicker from '../../src/pickers/MonthPicker';
import YearPicker from '../../src/pickers/YearPicker';
import { dateMatches } from '../utils';
import { PickerMode } from '../../src/types';

describe('Picker', () => {
    const refDate = ref(new Date(2020, 7, 1));
    const selDate = new Date(2020, 7, 15);

    const defaultProps = {
        locale: enUS,
        referenceDate: refDate,
        modelValue: selDate,
    };

    function makeWrapper(extraProps?: object) {
        return mount(Picker, {
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

    it('should be inline by default', () => {
        expect(wrapper.findComponent(DayPicker).exists()).toBe(true);
    });

    it('should show input instead', async () => {
        await wrapper.setProps({ ...defaultProps, mode: 'input' });

        // expect(wrapper.findComponent(DayPicker).exists()).toBe(false);
        expect(wrapper.find('input').exists()).toBe(true);
    });

    it('should respect specified kind', async () => {
        wrapper = makeWrapper({ ...defaultProps, kind: 'month' });

        await nextTick();

        expect(wrapper.findComponent(DayPicker).exists()).toBe(false);
        expect(wrapper.findComponent(MonthPicker).exists()).toBe(true);
        expect(wrapper.findComponent(YearPicker).exists()).toBe(false);

        wrapper = makeWrapper({ ...defaultProps, kind: 'year' });

        await nextTick();

        expect(wrapper.findComponent(DayPicker).exists()).toBe(false);
        expect(wrapper.findComponent(MonthPicker).exists()).toBe(false);
        expect(wrapper.findComponent(YearPicker).exists()).toBe(true);
    });

    it('should pass inputProps', async () => {
        await wrapper.setProps({
            ...defaultProps,
            mode: 'input',
            inputProps: {
                class: 'inputClass',
                name: 'inputName',
                placeholder: 'inputPlaceholder',
            },
        });

        const input = wrapper.find('input');

        expect(input.classes()).toContain('inputClass');
        expect(input.attributes()).toHaveProperty('name', 'inputName');
        expect(input.attributes()).toHaveProperty('placeholder', 'inputPlaceholder');
    });

    it('should parse input', async () => {
        const parseFn = jest.fn();

        const dateStr = '2020-04-01';

        await wrapper.setProps({
            ...defaultProps,
            mode: 'input',
        });

        const input = wrapper.find('input');

        expect(input.attributes()).toHaveProperty('readonly');

        await wrapper.setProps({
            ...defaultProps,
            mode: 'input',
            parse: parseFn,
        });

        expect(input.attributes()).not.toHaveProperty('readonly');

        input.setValue(dateStr);

        expect(parseFn).toBeCalledWith(dateStr);

        expect(wrapper.emitted('invalid-input')).toHaveLength(1);

        const parseFn2 = jest.fn(() => new Date(2020, 1, 2));

        await wrapper.setProps({
            ...defaultProps,
            mode: 'input',
            parse: parseFn2,
        });

        input.setValue(dateStr);

        expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    });

    it('should format value', async () => {
        expect.assertions(3);

        const format = jest.fn((date: Date) => {
            expect(dateMatches(date, new Date(2020, 10, 10))).toBe(true);

            return '2020-01-01';
        });

        await wrapper.setProps({
            ...defaultProps,
            mode: 'input',
            modelValue: new Date(2020, 10, 10),
            valueFormat: format,
        });

        expect(format).toBeCalledTimes(1);

        const input = wrapper.find('input');

        expect(input.element.value).toBe('2020-01-01');
    });

    it('should toggle picker', async () => {
        await wrapper.setProps({
            ...defaultProps,
            mode: 'input',
        });

        const input = wrapper.find('input');

        input.trigger('click');

        expect(wrapper.emitted('toggle')[0]).toEqual([true]);
    });

    it('should close when selected', async () => {
        await wrapper.setProps({
            ...defaultProps,
            mode: PickerMode.INPUT_POPUP,
        });

        const input = wrapper.find('input');

        input.trigger('click');

        wrapper.findAll('.v-picker__day')[10].trigger('click');

        expect(wrapper.emitted('toggle')[1]).toEqual([false]);
    });

    // it('should display both for input-inline', () => {
    //     wrapper = makeWrapper({ mode: PickerMode.INPUT_INLINE });

    //     expect(wrapper.find('input').exists()).toBe(true);
    //     expect(wrapper.findComponent(DayPicker).exists()).toBe(true);
    // });
});
