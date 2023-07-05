<template>
    <div class="main">
        <button class="btn" @click="connectionWallet">
            Подключить Metamask
        </button>
        <div class="main">
            Адрес пользователя: {{ $store.state.address }}
        </div>
        <div class="main">
            ID цепочки: {{ $store.state.chainId }}
        </div>
        <div class="main">
            Пользователь админ: {{ $store.state.admin }}
        </div>
    </div>
    <new-message class="main" v-if="$store.state.admin==true && $store.state.newMessage==false"></new-message>
    <message-for-sign class="main" v-if="$store.state.admin==true && $store.state.newMessage==true"></message-for-sign>

</template>

<script>
import { mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions({
            connectionWallet: "connectionWallet"
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
        background-color: #d6d4d4;
    }
    .btn {
        align-self: flex-end;
        padding: 10px 15px;
        background: none;
        color: #0303e0;
        border: 2px solid black;
        border-radius: 5px;
    }
</style>