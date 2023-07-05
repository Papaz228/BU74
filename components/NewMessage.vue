<template>
    <div class="main">
        <h3>Создать новое сообщение на подпись</h3>   
        <div>
            <input class="inpt" v-model="targetAddress" placeholder="Введите адрес контракта" type="text">
        </div>
        <div>
            <input class="inpt" v-model="functionName" placeholder="Введите имя функции" type="text">
        </div>
        <div>
            <input class="inpt" v-model="argsCount" placeholder="Введите кол-во аргументов" type="text">
        </div>
        <input-args @changeType="changeType" @inputArg="inputArg" v-for="id in argsId" :id = "id">
        </input-args>
        <div>
            <button class="btnn" @click="nMessage">Создать и подписать сообщение</button>
        </div>
    </div>
    
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'new-message',
    data() {
        return {
            targetAddress: "",
            functionName: "",
            argsCount: "",
            argsId: [],
            arguments: {
                types: [],
                args: []
            }
        }
    },
    methods: {   
        ...mapActions({
            newMessage: "newMessage"
        }),
        changeType(type) {
            this.arguments.types[type.id] = type.type;
        },
        inputArg(arg) {
            this.arguments.args[arg.id] = arg.arg;
        },
        async nMessage() {
            await this.newMessage([this.targetAddress, this.functionName, this.arguments])
        }
    },
    watch: {
        argsCount() {
            this.argsId = [];
            for (let i = 0; i < this.argsCount; i++) {
                this.argsId.push(i);
            }
            this.arguments.types = new Array(this.argsCount);
            this.arguments.args = new Array(this.argsCount);
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
    .inpt {
        padding: 15px;
        margin-top: 5px;
        border: 2px solid black;
        background-color: #d6d4d4;
        border-radius: 5px;
        width: 100%;
    }
</style>