export default {
    props: {
        author: {
            type: String,
            required: true,
        },
        creators: {
            type: Array,
            required: true,
        },
        verifier: {
            type: String,
            required: true,
        },
    },
    template: `
        <div class="level-authors">
            <template v-if="selfVerified">
                <div class="type-title-sm">Creator & Verifier</div>
                <p class="type-body">
                    <span>{{ author }}</span>
                </p>
            </template>
            <template v-else-if="creators.length === 0">
                <div class="type-title-sm">Creator</div>
                <p class="type-body">
                    <span>{{ author }}</span>
                </p>
                <div class="type-title-sm">Verifier</div>
                <p class="type-body">
                    <span>{{ verifier }}</span>
                </p>
            </template>
            <template v-else>
                <div class="type-title-sm">Creators</div>
                <p class="type-body">
                    <span>{{ joinedCreators }}</span>
                </p>
                <div class="type-title-sm">Verifier</div>
                <p class="type-body">
                    <span>{{ verifier }}</span>
                </p>
            </template>
            <div class="type-title-sm">Publisher</div>
            <p class="type-body">
                <span>{{ author }}</span>
            </p>
        </div>
    `,
    computed: {
        selfVerified() {
            return this.author === this.verifier && this.creators.length === 0;
        },
        joinedCreators() {
            // Defensive: fallback to [] if undefined
            return (this.creators || []).join(', ');
        }
    },
};
