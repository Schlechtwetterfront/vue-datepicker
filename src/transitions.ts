import { VNode, h, TransitionGroup } from 'vue';

export enum TransitionNames {
    PICKER_ITEMS_FORWARD = 'v-transition-picker-items-forward',
    PICKER_ITEMS_BACK = 'v-transition-picker-items-back',

    POP_UP_APPEAR = 'v-transition-pop-up-appear',
}

export function getItemsTransition(date: Date, lastDate: Date) {
    return date > lastDate
        ? TransitionNames.PICKER_ITEMS_FORWARD
        : TransitionNames.PICKER_ITEMS_BACK;
}

export function maybeWrapTransitionGroup(wrap: boolean, transition: string, renderFn: () => VNode) {
    return wrap
        ? h(TransitionGroup, { name: transition, tag: 'div', class: 'v-picker__body' }, renderFn)
        : renderFn();
}
