import { onMounted, onUnmounted, ref } from 'vue';

export function useClickOutside(toggle: (open: boolean) => void) {
    const elRef = ref<Element>();

    // Close picker pop up if clicked outside
    function clickOutside(event: MouseEvent) {
        const isWrapper = event.target === elRef.value;
        const wrapperContainsTarget = elRef.value?.contains(event.target as Node);
        // Clicked outside
        if (!isWrapper && !wrapperContainsTarget) {
            toggle(false);
        }
    }

    onMounted(() => {
        // `true` seems to be required for this to work consistently
        document.addEventListener('click', clickOutside, true);
    });

    onUnmounted(() => {
        // `true` seems to be required for this to work consistently
        document.removeEventListener('click', clickOutside, true);
    });

    return {
        clickOutside,
        elRef,
    };
}
