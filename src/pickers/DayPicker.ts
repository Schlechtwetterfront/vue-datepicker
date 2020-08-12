import { defineComponent, computed, PropType, h, Prop, toRefs } from 'vue';
import {
    add,
    sub,
    format,
    isSameMonth,
    isSameDay,
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    Locale,
} from 'date-fns';
import { dayClasses, paddedDaysInMonth, isDayDisabled } from '../dateUtils';
import { PickerItemContext, PickerContext, DayOfWeek, DisabledDates } from '../types';
import { usePickerInternals } from '../state';
import { getItemsTransition, maybeWrapTransitionGroup } from '../transitions';

export default defineComponent({
    name: 'DayPicker',
    props: {
        referenceDate: {
            type: Date as PropType<Date | null>,
            default: null,
        },
        modelValue: {
            type: Date as PropType<Date | null>,
            default: null,
        },
        disabledDates: { required: false } as Prop<DisabledDates>,
        weekStartsOn: {
            type: Number,
            default: 1,
        } as Prop<DayOfWeek>,
        showDayOfWeek: {
            type: Boolean,
            default: true,
        },
        showControls: {
            type: Boolean,
            default: true,
        },
        transitions: {
            type: Boolean,
            default: true,
        },
        locale: { type: Object } as Prop<Locale>,
    },
    setup(props, { emit, slots }) {
        const { referenceDate, modelValue } = toRefs(props);

        const { dates, select } = usePickerInternals(referenceDate, modelValue, emit);

        let lastReference = dates.reference;

        const days = computed(() => paddedDaysInMonth(dates.reference, props.weekStartsOn ?? 1));

        const dayFn =
            slots.day ??
            ((ctx: PickerItemContext) => format(ctx.date, 'd', { locale: props.locale }));
        const monthFn =
            slots.monthLabel ??
            ((ctx: PickerContext) => format(ctx.reference, 'MMMM', { locale: props.locale }));

        const nextMonth = () => (dates.reference = add(dates.reference, { months: 1 }));
        const prevMonth = () => (dates.reference = sub(dates.reference, { months: 1 }));

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
                    { class: 'v-picker__days', key: format(dates.reference, 'yyyy-MM') },
                    days.value.map((d) => {
                        const ctx: PickerItemContext = {
                            reference: dates.reference,
                            date: d,
                            selected: dates.selected,
                            disabled: props.disabledDates
                                ? isDayDisabled(d, props.disabledDates) ||
                                  !isSameMonth(d, dates.reference)
                                : !isSameMonth(d, dates.reference),
                            locale: props.locale,
                        };

                        const onClick = ctx.disabled ? undefined : () => select(d);

                        const opts: any = {
                            class: dayClasses(ctx),
                            onClick,
                        };

                        if (ctx.disabled) {
                            opts['aria-disabled'] = true;
                        }

                        if (ctx.selected && isSameDay(ctx.selected, d)) {
                            opts['aria-selected'] = true;
                        }

                        return h('div', opts, dayFn(ctx));
                    })
                );

            const itemsWrapperVN = maybeWrapTransitionGroup(
                props.transitions,
                transition,
                itemsRenderFn
            );

            return h('section', { class: 'v-picker v-picker--day' }, [
                slots.above?.(ctx),
                props.showControls
                    ? h('div', { class: 'v-picker__controls' }, [
                          h(
                              'div',
                              {
                                  class: 'v-picker__prev-year',
                                  onClick: prevYear,
                                  'aria-role': 'button',
                              },
                              slots.prevPrevYear?.(ctx) ?? '<<'
                          ),
                          h(
                              'div',
                              {
                                  class: 'v-picker__prev-month',
                                  onClick: prevMonth,
                                  'aria-role': 'button',
                              },
                              slots.prevMonth?.(ctx) ?? '<'
                          ),
                          h('div', [
                              h(
                                  'span',
                                  {
                                      class: 'v-picker__month-label',
                                      onClick: () => emit('switch', 'month'),
                                      'aria-role': 'button',
                                  },
                                  monthFn(ctx)
                              ),
                              h(
                                  'span',
                                  {
                                      class: 'v-picker__year-label',
                                      onClick: () => emit('switch', 'year'),
                                      'aria-role': 'button',
                                  },
                                  slots.yearLabel?.(ctx) ?? format(dates.reference, 'yyyy')
                              ),
                          ]),
                          h(
                              'div',
                              {
                                  class: 'v-picker__next-month',
                                  onClick: nextMonth,
                                  'aria-role': 'button',
                              },
                              slots.nextMonth?.(ctx) ?? '>'
                          ),
                          h(
                              'div',
                              {
                                  class: 'v-picker__next-year',
                                  onClick: nextYear,
                                  'aria-role': 'button',
                              },
                              slots.nextNextYear?.(ctx) ?? '>>'
                          ),
                      ])
                    : null,
                props.showDayOfWeek
                    ? h(
                          'header',
                          { class: 'v-picker__header' },
                          eachDayOfInterval({
                              start: startOfWeek(dates.reference, {
                                  weekStartsOn: props.weekStartsOn ?? 1,
                              }),
                              end: endOfWeek(dates.reference, {
                                  weekStartsOn: props.weekStartsOn ?? 1,
                              }),
                          }).map((d) =>
                              h(
                                  'div',
                                  {
                                      class: 'v-picker__header-cell',
                                  },
                                  slots.weekdayLabel?.({
                                      reference: dates.reference,
                                      date: d,
                                      selected: dates.selected,
                                      locale: props.locale,
                                  }) ?? format(d, 'eeeeee', { locale: props.locale })
                              )
                          )
                      )
                    : null,
                itemsWrapperVN,
                slots.below?.(ctx),
            ]);
        };
    },
});
