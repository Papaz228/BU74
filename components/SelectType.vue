<template>
    {{ id }}
    <select class="sel" @change="changeOption">
        <option value="">Выберите тип данных</option>
        <option v-for="option in options">{{ option }}</option>
    </select>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'select-type',
    props: {
        options: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        changeOption(event) {
            this.$emit("changeType", event.target.value);
        }
    }
}
</script>

<style>
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    .sel {
        padding: 15px;
        margin-top: 5px;
        border: 2px solid black;
        background-color: #d6d4d4;
        border-radius: 5px;
    }
</style>