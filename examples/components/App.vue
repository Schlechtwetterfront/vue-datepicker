<template>
    <section class="playground">
        <header class="playground__header">
            <h1>
                <code>vue-datepicker</code>
                playground
            </h1>
        </header>

        <div class="playground__body">
            <div class="playground__nav">
                <div
                    :key="item.name"
                    class="nav"
                    v-for="item in sections"
                >
                    <a
                        :href="`#${item.link}`"
                        v-text="item.title"
                    ></a>
                </div>
            </div>
            <div class="playground__content">
                <div class="example">
                    <h4 id="full">Full datepicker</h4>
                    <div class="example__desc">
                        <p>Select days. Includes a month and year picker for quickly navigating long timespans (by clicking on the month/year labels)</p>
                        <p>
                            Value:
                            <code>{{ format(state.picker, 'yyyy-MM-dd') }}</code>
                        </p>
                    </div>
                    <Picker v-model="state.picker" />
                </div>

                <div class="example">
                    <h4 id="locale">Custom locale</h4>
                    <div class="example__desc">
                        <p>
                            This library internally uses
                            <code>date-fns</code> to handle all date calculations and formatting/parsing. It can also take
                            <code>date-fns</code> locales
                        </p>
                        <p>
                            Value:
                            <code>{{ format(state.customDayPicker, 'yyyy-MM-dd') }}</code>
                        </p>
                        <p>
                            <code>&lt;Picker :locale="it" /&gt;</code>
                        </p>
                    </div>
                    <Picker
                        :locale="it"
                        v-model="state.customDayPicker"
                    />
                </div>

                <div class="example">
                    <h4 id="input">Hooking up an input tag</h4>
                    <div class="example__desc">
                        <p>
                            Additionally to just being displayed inline like above, the picker can be hooked up to an
                            <code>input</code> element.
                        </p>
                        <p>
                            This also allows directly writing into the
                            <code>input</code> element
                        </p>
                        <p>
                            Value:
                            <code>{{ state.pickerInput ? format(state.pickerInput, 'yyyy-MM-dd') : '' }}</code>
                        </p>
                        <p>
                            <code>&lt;Picker mode="input" /&gt;</code>
                        </p>
                    </div>
                    <Picker
                        :inputProps="{ placeholder: 'Enter date here', name: 'someDateField' }"
                        :parse="parseDateString"
                        mode="input"
                        v-model="state.pickerInput"
                    />
                </div>

                <div class="example">
                    <h4 id="disabled">Disabling dates</h4>
                    <div class="example__desc">
                        <p>
                            Restrict selection via a range (
                            <code>{ start?: Date, end?: Date}</code>) a list of
                            <code>Dates</code>s or a predicate
                        </p>
                        <p>
                            Value:
                            <code>{{ format(state.disablePicker, 'yyyy-MM-dd') }}</code>
                        </p>
                    </div>
                    <Picker
                        :disabledDates="disabled"
                        v-model="state.disablePicker"
                    />
                </div>

                <div class="example">
                    <h4 id="slots">Customizing the pickers</h4>
                    <div class="example__desc">
                        <p>Most pieces can be customized with slots</p>
                        <p>
                            Value:
                            <code>{{ format(state.slotsPicker, 'yyyy-MM-dd') }}</code>
                        </p>
                    </div>
                    <Picker
                        :referenceDate="state.slotsRef"
                        :weekStartsOn="3"
                        v-model="state.picker"
                    >
                        <template #above>
                            <div class="below-above">
                                <div>
                                    This is
                                    <code>above</code>
                                </div>
                            </div>
                        </template>
                        <template #below>
                            <div class="below-above">
                                <div
                                    @click="toNow()"
                                    class="clickable"
                                    title="Set reference date to today"
                                >To today</div>
                            </div>
                        </template>
                        <template #day="{ date }">{{ format(date, 'dd') }}</template>
                        <template #year="{ date }">{{ format(date, 'yyyy G') }}</template>
                        <template #yearLabel="{ reference }">{{ format(reference, 'yyy G') }}</template>
                        <template #month="{ date }">{{ format(date, 'Mo') }}</template>
                        <template #monthLabel="{ reference }">{{ format(reference, 'MMM') }}</template>
                        <template
                            #decadeLabel="{ reference }"
                        >Decade of {{ format(reference, 'yyyy') }}</template>
                        <template #weekdayLabel="{ date }">{{ format(date, 'eeeee') }}</template>
                        <template #prev>◀️</template>
                        <template #nextDecade>▶️</template>
                        <template #nextYear>▶️</template>
                        <template #nextMonth>▶️</template>
                        <template #nextNextYear>⏩</template>
                        <template #prevPrev>⏪</template>
                    </Picker>
                </div>

                <div class="example">
                    <h4 id="day">Day picker</h4>
                    <div class="example__desc">
                        <p>
                            The
                            <code>Picker</code> actually consists of several pickers:
                            <code>DayPicker</code>,
                            <code>MonthPicker</code> and
                            <code>YearPicker</code>.
                            These can be used individually, too.
                        </p>
                        <p>
                            Value:
                            <code>{{ format(state.dayPicker, 'yyyy-MM-dd') }}</code>
                        </p>
                    </div>
                    <DayPicker v-model="state.dayPicker" />
                </div>

                <div class="example">
                    <h4 id="month">Month picker</h4>
                    <div class="example__desc">
                        <p>Individual month picker</p>
                        <p>
                            Value:
                            <code>{{ format(state.monthPicker, 'yyyy-MM-dd') }}</code>
                        </p>
                    </div>
                    <MonthPicker v-model="state.monthPicker" />
                </div>

                <div class="example">
                    <h4 id="year">Year picker</h4>
                    <div class="example__desc">
                        <p>Individual year picker</p>
                        <p>
                            Value:
                            <code>{{ format(state.yearPicker, 'yyyy-MM-dd') }}</code>
                        </p>
                    </div>
                    <YearPicker
                        :transitions="false"
                        v-model="state.yearPicker"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

import { Picker, DayPicker, MonthPicker, YearPicker } from '../../src';
import { format, parse, sub } from 'date-fns';
import { it } from 'date-fns/locale';

export default defineComponent({
    components: {
        Picker,
        DayPicker,
        MonthPicker,
        YearPicker,
    },
    setup() {
        const state = reactive({
            dayPicker: new Date(),
            monthPicker: new Date(),
            yearPicker: new Date(),
            picker: new Date(),
            pickerInput: null as Date | null,
            disablePicker: new Date(),
            customDayPicker: new Date(),
            slotsPicker: new Date(),
            slotsRef: new Date(),
        });

        function parseDateString(dateString: string) {
            return parse(dateString, 'yyyy-MM-dd', new Date());
        }

        const disabled = {
            end: sub(new Date(), { days: 5 }),
        };

        function toNow() {
            state.slotsRef = new Date();
        }

        return {
            format,
            state,
            parseDateString,
            it,
            disabled,
            toNow,
            sections: [
                {
                    title: 'Full picker',
                    link: 'full',
                },
                {
                    title: 'Custom locale',
                    link: 'locale',
                },
                {
                    title: 'With input element',
                    link: 'input',
                },
                {
                    title: 'Customizing with slots',
                    link: 'slots',
                },
                {
                    title: 'Day picker',
                    link: 'day',
                },
                {
                    title: 'Month picker',
                    link: 'month',
                },
                {
                    title: 'Year picker',
                    link: 'year',
                },
            ],
        };
    },
});
</script>

<style lang="scss">
$accent: #d408e6;

body {
    color: #444;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
        'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.65;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    margin-top: 0;
    font-weight: bold;
    color: #222;
}

p {
    margin-top: 0;
}

a {
    color: $accent;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

* {
    box-sizing: border-box;
}

.clickable {
    cursor: pointer;
    &:hover {
        color: $accent;
    }
}

.below-above {
    background-color: #efefef;

    > * {
        display: inline-block;
        padding: 0.5rem;
    }
}

code {
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
        monospace;
    background: #efefef;
    padding: 0.25rem 0.25rem;
    border-radius: 0.25em;
}

.playground {
    max-width: 1200px;
    margin: 0 auto 5rem;

    &__header {
        padding: 1.5rem;
    }

    &__body {
        position: relative;

        display: flex;
        flex-flow: row nowrap;
        align-items: flex-start;
    }

    &__nav {
        position: sticky;
        top: 1rem;
        min-width: 240px;

        padding: 0 1.5rem;
    }

    &__content {
        display: flex;
        flex-flow: column;

        .example {
            display: grid;
            grid-template:
                'heading heading' auto
                'desc component' 1fr
                / 6fr 4fr;
            align-items: start;

            min-height: 200px;

            &:not(:last-child) {
                border-bottom: 1px solid #efefef;
            }
            padding-bottom: 2rem;
            margin-bottom: 2rem;

            h4 {
                grid-area: heading;
            }

            &__desc {
                grid-area: desc !important;
                padding-right: 1rem;
            }

            * {
                grid-area: component;
            }
        }
    }
}

@import '../assets/_layout.scss';
@import '../assets/_style.scss';
@import '../assets/_transitions.scss';
</style>
