import { defineComponent, computed, PropType, h, Prop, toRefs } from 'vue';
import {
    format,
    eachYearOfInterval,
    startOfDecade,
    endOfDecade,
    add,
    sub,
    isSameYear,
} from 'date-fns';
import { usePickerInternals } from '../state';
import { getItemsTransition, maybeWrapTransitionGroup } from '../transitions';
import { PickerContext, PickerItemContext, DisabledDates } from '../types';
import { isYearDisabled } from '../dateUtils';

export default defineComponent({
    name: 'YearPicker',
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

        const decade = computed(() => {
            return { start: startOfDecade(dates.reference), end: endOfDecade(dates.reference) };
        });

        const yearStarts = computed(() => {
            return eachYearOfInterval(decade.value);
        });

        const nextDecade = () => (dates.reference = add(dates.reference, { years: 10 }));
        const prevDecade = () => (dates.reference = sub(dates.reference, { years: 10 }));

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
                    {
                        class: 'v-picker__years',
                        key: format(dates.reference, 'yyyy').slice(0, 3),
                    },
                    yearStarts.value.map((d) => {
                        const ctx: PickerItemContext = {
                            locale: props.locale,
                            reference: dates.reference,
                            date: d,
                            selected: dates.selected,
                            disabled: props.disabledDates
                                ? isYearDisabled(d, props.disabledDates)
                                : false,
                        };

                        const isSelected = dates.selected && isSameYear(dates.selected, d);
                        const onClick = ctx.disabled ? undefined : () => select(d);

                        const opts: any = {
                            class: {
                                'v-picker__year': true,
                                'v-picker__year--selected': isSelected,
                                'v-picker__year--disabled': ctx.disabled,
                                'v-picker__year--this-year': isSameYear(d, today),
                            },
                            onClick,
                        };

                        if (isSelected) {
                            opts['aria-selected'] = true;
                        }

                        return h(
                            'div',
                            opts,
                            slots.year?.(ctx) ?? format(d, 'yyyy', { locale: props.locale })
                        );
                    })
                );

            const itemsWrapperVN = maybeWrapTransitionGroup(
                props.transitions,
                transition,
                itemsRenderFn
            );

            return h('section', { class: 'v-picker v-picker--year' }, [
                slots.above?.(ctx),
                h('header', { class: 'v-picker__controls' }, [
                    h(
                        'div',
                        {
                            class: 'v-picker__prev-decade',
                            onClick: prevDecade,
                            'aria-role': 'button',
                        },
                        slots.prevDecade?.(ctx) ?? '<'
                    ),
                    h(
                        'div',
                        { class: 'v-picker__decade-label' },
                        slots.decadeLabel?.(ctx) ??
                            `${format(decade.value.start, 'yyyy', {
                                locale: props.locale,
                            })} - ${format(decade.value.end, 'yyyy', { locale: props.locale })}`
                    ),
                    h(
                        'div',
                        {
                            class: 'v-picker__next-decade',
                            onClick: nextDecade,
                            'aria-role': 'button',
                        },
                        slots.nextDecade?.(ctx) ?? '>'
                    ),
                ]),
                itemsWrapperVN,
                slots.below?.(ctx),
            ]);
        };
    },
});
