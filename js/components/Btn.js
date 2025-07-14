export default {
    inheritAttrs: false,
    template: `
        <button
            class="btn"
            v-bind="$attrs"
            v-on="$listeners"
        >
            <span class="type-label-lg">
                <slot></slot>
            </span>
        </button>
    `,
};
