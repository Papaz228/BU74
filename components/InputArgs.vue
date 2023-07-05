<template>
    {{ id }}
    <select-type @changeType = "changeType" :options="options" ></select-type>
    <input class="inpt" v-model="argument" placeholder="Введите значение аргумента" type="text">
    <br>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'input-args',
    data() {
        return {
            argument: "",
            options: ["string", "uint256"]
        }
    },
    props: {
        id: {
            type: Number,
        }
    },
    methods: {
        ...mapActions({
            
        }),
        changeType(type) {
            const types = {
                id: this.id,
                type: type
            };
            this.$emit("changeType", types);
        }
    },
    watch: {
        argument() {
            const arg = {
                id: this.id,
                arg: this.argument
            };
            this.$emit("inputArg", arg);
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
    .inpt {
        padding: 15px;
        margin-top: 5px;
        border: 2px solid black;
        background-color: #d6d4d4;
        border-radius: 5px;
    }
</style>