import { defineComponent, computed, PropType, h, Prop, toRefs } from 'vue';
import {
    eachMonthOfInterval,
    startOfYear,
    endOfYear,
    format,
    add,
    sub,
    isSameMonth,
} from 'date-fns';
import { usePickerInternals } from '../state';
import { getItemsTransition, maybeWrapTransitionGroup } from '../transitions';
import { PickerContext, DisabledDates, PickerItemContext } from '../types';
import { isMonthDisabled } from '../dateUtils';

export default defineComponent({
    name: 'MonthPicker',
    props: {
        showControls: {
            type: Boolean,
            default: true,
        },
        transitions: {
            type: Boolean,
            default: true,
        },
        referenceDate: {
            type: Date as PropType<Date | null>,
            default: null,
        },
        modelValue: {
            type: Date as PropType<Date | null>,
            default: null,
        },
        disabledDates: {} as Prop<DisabledDates>,
        locale: { type: Object } as Prop<Locale>,
    },
    setup(props, { emit, slots }) {
        const { referenceDate, modelValue } = toRefs(props);

        const today = new Date();

        const { dates, select } = usePickerInternals(referenceDate, modelValue, emit);

        let lastReference = dates.reference;

        const monthStarts = computed(() => {
            const start = startOfYear(dates.reference);
            const end = endOfYear(dates.reference);

            return eachMonthOfInterval({ start, end });
        });

        const nextYear = () => (dates.reference = add(dates.reference, { years: 1 }));
        const prevYear = () => (dates.reference = sub(dates.reference, { years: 1 }));

        return () => {
            const transition = getItemsTransition(dates.reference, lastReference);
            lastReference = dates.reference;

            const ctx: PickerContext = {
                reference: dates.reference,
                selected: dates.selected,
                locale: props.locale,
            };

            const itemsRenderFn = () =>
                h(
                    'div',
                    { class: 'v-picker__months', key: format(dates.reference, 'yyyy') },
                    monthStarts.value.map((d) => {
                        const ctx: PickerItemContext = {
                            locale: props.locale,
                            reference: dates.reference,
                            date: d,
                            selected: dates.selected,
                            disabled: props.disabledDates
                                ? isMonthDisabled(d, props.disabledDates)
                                : false,
                        };

                        const isSelected = dates.selected && isSameMonth(dates.selected, d);
                        const onClick = ctx.disabled ? undefined : () => select(d);

                        const opts: any = {
                            class: {
                                'v-picker__month': true,
                                'v-picker__month--selected': isSelected,
                                'v-picker__month--disabled': ctx.disabled,
                                'v-picker__month--this-month': isSameMonth(d, today),
                            },
                            onClick,
                        };

                        if (isSelected) {
                            opts['aria-selected'] = true;
                        }

                        return h(
                            'div',
                            opts,
                            slots.month?.(ctx) ?? format(d, 'MMMM', { locale: props.locale })
                        );
                    })
                );

            const itemsWrapperVN = maybeWrapTransitionGroup(
                props.transitions,
                transition,
                itemsRenderFn
            );

            return h('section', { class: 'v-picker v-picker--month' }, [
                slots.above?.(ctx),
                props.showControls
                    ? h('header', { class: 'v-picker__controls' }, [
                          h(
                              'div',
                              {
                                  class: 'v-picker__prev-year',
                                  onClick: prevYear,
                                  'aria-role': 'button',
                              },
                              slots.prevYear?.(ctx) ?? '<'
                          ),
                          h(
                              'div',
                              {
                                  class: 'v-picker__year-label',
                                  onClick: () => emit('switch', 'year'),
                                  'aria-role': 'button',
                              },
                              slots.yearLabel?.(ctx) ??
                                  format(dates.reference, 'yyyy', { locale: props.locale })
                          ),
                          h(
                              'div',
                              {
                                  class: 'v-picker__next-year',
                                  onClick: nextYear,
                                  'aria-role': 'button',
                              },
                              slots.nextYear?.(ctx) ?? '>'
                          ),
                      ])
                    : undefined,
                ,
                itemsWrapperVN,
                slots.below?.(ctx),
            ]);
        };
    },
});
