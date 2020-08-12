import { ref, nextTick } from 'vue';
import { usePickerInternals } from '../src/state';
import { dateMatches } from './utils';

describe('usePickerInternals', () => {
    it('should return changed dates', async () => {
        const refDate = ref(new Date(1977, 10, 21));
        const selDate = ref(new Date(1998, 0, 18));

        const { dates } = usePickerInternals(refDate, selDate, () => {});

        expect(dateMatches(dates.reference, new Date(1977, 10, 21))).toBe(true);
        expect(dateMatches(dates.selected!, new Date(1998, 0, 18))).toBe(true);

        refDate.value = new Date(1997, 1, 8);
        selDate.value = new Date(1999, 0, 25);

        await nextTick();

        expect(dateMatches(dates.reference, new Date(1997, 1, 8))).toBe(true);
        expect(dateMatches(dates.selected!, new Date(1999, 0, 25))).toBe(true);
    });

    it('should return new date after select', async () => {
        const refDate = ref(new Date());
        const selDate = ref(new Date(2000, 6, 25));

        const { dates, select } = usePickerInternals(refDate, selDate, () => {});

        expect(dateMatches(dates.selected!, new Date(2000, 6, 25))).toBe(true);

        select(new Date(2001, 10, 27));

        await nextTick();

        expect(dateMatches(dates.selected!, new Date(2001, 10, 27))).toBe(true);
    });
});
