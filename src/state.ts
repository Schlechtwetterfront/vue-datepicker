import { reactive, watch, SetupContext, Ref } from 'vue';

export function usePickerInternals(
    referenceDate: Ref<Date | null>,
    selectedDate: Ref<Date | null>,
    emit: SetupContext['emit']
) {
    const dates = reactive({
        reference: referenceDate.value ?? selectedDate.value ?? new Date(),
        selected: selectedDate.value,
    });

    function select(date: Date) {
        dates.selected = date;

        emit('update:modelValue', date);
    }

    watch(selectedDate, () => {
        dates.selected = selectedDate.value;
    });
    watch(referenceDate, () => {
        dates.reference = referenceDate.value ?? selectedDate.value ?? new Date();
    });

    return {
        dates,
        select,
    };
}
