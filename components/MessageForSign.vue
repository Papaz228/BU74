<template>
    <h4>Это форма для подписи сообщения</h4>
    <div class="main">
        <p>Адрес целевого контракта: {{ $store.state.message.targetAddress }}</p>
        <hr>
        <p>Имя функции: {{ $store.state.message.functionName }}</p>
        <hr>
        <p>Аргументы функции: {{ $store.state.message.functionArgs }}</p>
        <hr>
        <p>nonce: {{ $store.state.message.nonce }}</p>
        <hr>
        <p>payload: {{ $store.state.message.payload }}</p>
        <hr>
        <p>message: {{ $store.state.message.message }}</p>
        <hr>
        <p>signers: {{ $store.state.message.signers }}</p>
        <hr>
        <p>signatures: {{ $store.state.message.signatures }}</p>
    </div>
    <button class="btnn" @click="signMessage">Подписать</button>
    <button class="btnn" v-if="$store.state.enoughSignatures==true" @click="sendMessage">Отправить сообщение</button>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'message-for-sign',
    methods: {
        ...mapActions({
            signMessage: "signMessage",
            sendMessage: "sendMessage",
        })
    }
}
</script>

<style>
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    .main {
        padding: 15px;
        margin-top: 5px;
        border: 2px solid black;
        background-color: #e0dede;
    }
    .btnn {
        align-self: flex-end;
        padding: 10px 15px;
        background: none;
        color: #0303e0;
        border: 2px solid black;
        border-radius: 5px;
        margin-top: 5px;
    }
    h4 {
        text-align: center;
        margin-top: 15px;
    }
</style>