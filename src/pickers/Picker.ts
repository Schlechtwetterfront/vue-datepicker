import {
    defineComponent,
    h,
    Prop,
    PropType,
    reactive,
    ref,
    Transition,
    SetupContext,
    toRefs,
} from 'vue';
import { PickerKind, PickerMode, DayOfWeek, DisabledDates } from '../types';
import DayPicker from '../pickers/DayPicker';
import MonthPicker from '../pickers/MonthPicker';
import YearPicker from '../pickers/YearPicker';
import { format, isValid } from 'date-fns';
import { usePickerInternals } from '../state';
import { TransitionNames } from '../transitions';
import { useClickOutside } from '../dom';

function lowerKind(kind: PickerKind) {
    return kind === PickerKind.YEAR ? PickerKind.MONTH : PickerKind.DAY;
}

function getSlots(slots: SetupContext['slots']) {
    const pickerSlots: any = {
        nextDecade: slots.nextDecade ?? slots.next,
        prevDecade: slots.prevDecade ?? slots.prev,
        nextYear: slots.nextYear ?? slots.next,
        prevYear: slots.prevYear ?? slots.prev,
        nextMonth: slots.nextMonth ?? slots.next,
        prevMonth: slots.prevMonth ?? slots.prev,
        nextNextYear: slots.nextNextYear ?? slots.nextNext,
        prevPrevYear: slots.prevPrevYear ?? slots.prevPrev,
        year: slots.year,
        month: slots.month,
        day: slots.day,
        decadeLabel: slots.decadeLabel,
        yearLabel: slots.yearLabel,
        monthLabel: slots.monthLabel,
        weekdayLabel: slots.weekdayLabel,
        above: slots.above,
        below: slots.below,
    };

    const actualPickerSlots: any = {};

    Object.keys(pickerSlots).forEach((key) => {
        if (pickerSlots[key]) {
            actualPickerSlots[key] = pickerSlots[key];
        }
    });

    return actualPickerSlots;
}

export default defineComponent({
    name: 'Picker',
    props: {
        /**
         * Picker mode (with/without input)
         */
        mode: {
            type: String,
            default: PickerMode.INLINE,
            validator: (v) => Object.values(PickerMode).includes(v as any),
        } as Prop<PickerMode>,
        transitions: {
            type: Boolean,
            default: true,
        },
        /**
         * Picker kind
         */
        kind: {
            type: String,
            default: PickerKind.DAY,
            validator: (v) => Object.values(PickerKind).includes(v as any),
        } as Prop<PickerKind>,
        showDayOfWeek: {
            type: Boolean,
            default: true,
        },
        showControls: {
            type: Boolean,
            default: true,
        },
        /**
         * Display reference date
         */
        referenceDate: {
            type: Date as PropType<Date | null>,
            default: null,
        },
        weekStartsOn: {
            type: Number,
            default: 1,
        } as Prop<DayOfWeek>,
        disabledDates: {} as Prop<DisabledDates>,
        /**
         * v-model value
         */
        modelValue: {
            type: Date as PropType<Date | null>,
            default: null,
        },
        /**
         * Props to pass to the input tag
         */
        inputProps: {
            type: Object,
        },
        /**
         * Function that takes a date
         */
        parse: {
            type: Function as PropType<(s: string) => Date>,
            default: null,
        },
        /**
         * Function that takes the selected date and returns a string to set as the input's value
         */
        valueFormat: {
            type: Function,
            default: (date: Date | null) => (date ? format(date, 'yyyy-MM-dd') : ''),
        } as Prop<(d: Date | null) => string>,
        locale: { type: Object } as Prop<Locale>,
    },
    setup(props, { emit, slots }) {
        const { referenceDate, modelValue } = toRefs(props);

        const lowestKind = props.kind ?? PickerKind.DAY;
        const currentKind = ref(lowestKind);
        const state = reactive({
            pickerOpen: props.mode !== PickerMode.INPUT_POPUP,
        });

        // Used to trigger a rerender
        const rerenderTrigger = ref(0);

        // Toggle picker open state
        function toggle(open: boolean) {
            if (props.mode !== PickerMode.INPUT_POPUP) {
                return;
            }

            state.pickerOpen = open;

            emit('toggle', open);
        }

        // Try to parse user input
        function tryParse(input: string) {
            if (props.parse) {
                const parsed = props.parse(input);

                if (parsed instanceof Date && isValid(parsed)) {
                    select(parsed);
                } else {
                    // Trigger re-render to reset the input's value to before the
                    // invalid user input
                    rerenderTrigger.value += 1;
                    emit('invalid-input', input, parsed);
                }
            }
        }

        const { elRef } = useClickOutside(toggle);

        const { dates, select } = usePickerInternals(referenceDate, modelValue, emit);

        // Switch picker kind
        function onSwitch(kind: PickerKind) {
            currentKind.value = kind;

            emit('switch', kind);
        }

        // Pass selection to lower picker kind
        function passSelectionToLower(date: Date) {
            dates.reference = date;

            if (currentKind.value !== lowestKind) {
                onSwitch(lowerKind(currentKind.value));
            }
        }

        return () => {
            // Trick vue into thinking some actual state has changed and it
            // needs to rerender
            rerenderTrigger.value;

            const isLowest = currentKind.value === lowestKind;

            const picker =
                currentKind.value === PickerKind.DAY
                    ? DayPicker
                    : currentKind.value === PickerKind.MONTH
                    ? MonthPicker
                    : YearPicker;

            const opts = {
                onSwitch,
                'onUpdate:modelValue': (date: Date) => {
                    if (isLowest) {
                        select(date);

                        // Close
                        toggle(false);
                    } else {
                        passSelectionToLower(date);
                    }
                },
                referenceDate: dates.reference,
                modelValue: dates.selected,
                locale: props.locale,
                weekStartsOn: props.weekStartsOn,
                disabledDates: props.disabledDates,
                transitions: props.transitions,
                showControls: props.showControls,
                showDayOfWeek: props.showDayOfWeek,
            };

            const actualPickerSlots = getSlots(slots);

            if (props.mode === PickerMode.INLINE) {
                return h(picker, opts, actualPickerSlots);
            }

            const pickerRenderFn = () =>
                state.pickerOpen
                    ? h(
                          'section',
                          {
                              class: {
                                  'v-picker-wrapper': true,
                                  'v-picker-wrapper--pop-up': props.mode === PickerMode.INPUT_POPUP,
                                  'v-picker-wrapper--open':
                                      props.mode === PickerMode.INPUT_POPUP && state.pickerOpen,
                                  'v-picker-wrapper--input-inline':
                                      props.mode === PickerMode.INPUT_INLINE,
                              },
                          },
                          [h(picker, opts, actualPickerSlots)]
                      )
                    : undefined;

            const pickerWrapperVN = props.transitions
                ? h(
                      Transition,
                      { appear: true, name: TransitionNames.POP_UP_APPEAR },
                      pickerRenderFn
                  )
                : pickerRenderFn();

            return h(
                'section',
                { class: ['v-input-wrapper', 'v-input-wrapper--inline'], ref: elRef },
                [
                    h('input', {
                        ...props.inputProps,
                        readonly: !props.parse,
                        value: (props.valueFormat as Function)(dates.selected),
                        onClick: () => toggle(true),
                        onChange: (event: InputEvent) => tryParse((event.target as any).value),
                    }),
                    pickerWrapperVN,
                ]
            );
        };
    },
});
