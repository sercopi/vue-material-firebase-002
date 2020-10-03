<template>
<div>
    <h2>listas de la compra</h2>
    <div class="row container">
        <div v-for="(list, index) in lists" :key="index" class="col xl4 l6 m12 s12">
            <div class="card" :data-id="list.list_id">
                <span v-if="isCompleted(list)" class="notify-badge-completed">COMPLETED</span>
                <span v-if="list.objects.length == 0" class="notify-badge-empty">EMPTY</span>

                <div class="card-content">
                    <span class="card-title dark-text">{{ list.title }}</span>
                    <div class="row buttons">
                        <div class="col s6">
                            <router-link :to="{
                    name: 'viewlist',
                    params: { list_id: list.list_id }
                  }">
                                <button class="btn-floating  waves-effect waves-light green">
                                    <i class="material-icons">edit</i>
                                </button>
                            </router-link>
                        </div>
                        <div class="col s6">
                            <a @click.prevent="openCustomModal('#modal-' + list.list_id)" class="waves-effect waves-light btn modal-trigger" :href="'#modal-' + list.list_id">
                                <i class="material-icons">book</i>
                            </a>
                        </div>
                    </div>

                    <div class="flow-text">creada: {{ list.created_at }}</div>
                    <div class="flow-text">modificada: {{ list.updated_at }}</div>
                    <div :id="'modal-' + list.list_id" class="modal">
                        <div class="modal-content">
                            <h4 class="pink-text">{{ list.title }}</h4>
                            <ul class="pink-text item-list">
                                Artículos:
                                <li v-for="(object, index) in list.objects" :key="index" class="pink-text item">
                                    <p>
                                        {{ object.name }} comprado:
                                        <span><i class="material-icons">{{
                          object.comprado ? "check" : "clear"
                        }}</i></span>
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div class="modal-footer">
                            <a href="" @click.prevent="" class="modal-close waves-effect waves-green btn-flat">Agree</a>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn pink">
                        <span><i class="material-icons">delete_outline</i></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div>
        <router-link to="/newlist" class="btn-floating btn-large red">
            <i class="fa fa-plus"></i>
        </router-link>
    </div>
</div>
</template>

<script>
import db from "@/components/firebaseInit";
import moment from "moment";
export default {
    name: "viewlist",
    data() {
        return {
            lists: []
        };
    },
    beforeRouteEnter(to, from, next) {
        db.collection("Lists")
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    next(vm => {
                        vm.lists.push({
                            list_id: doc.id,
                            ...doc.data()
                        });
                    });
                    console.log(doc.data());
                });
            });
    },

    methods: {
        isCompleted(list) {
            return (
                list.objects.every(object => object.comprado == true) &&
                list.objects.length !== 0
            );
        },
        openCustomModal(id) {
            const elem = document.querySelector(id);
            const instance = M.Modal.init(elem);
            instance.open();
        }
    }
};
</script>

<style scoped>
li {
    margin: 10px;
}

ul {
    border: none;
}

.comprado {
    display: flex;
    flex-direction: column;
    justify-content: center;
    vertical-align: center;
}

.list {
    display: flex;
    justify-content: space-evenly;
}

.card {
    margin: 30px;
    height: 350px;
    width: 250px;
}

.buttons {
    display: flex;
    justify-content: space-evenly;
    align-content: center;
}

.notify-badge-completed {
    color: rgb(216, 9, 112);
    position: absolute;
    right: -30px;
    top: -15px;
    background: rgb(216, 9, 112);
    text-align: center;
    border-radius: 30px 30px 30px 30px;
    color: white;
    padding: 5px 10px;
    font-size: 20px;
}

.notify-badge-empty {
    color: rgb(216, 9, 112);
    position: absolute;
    right: -30px;
    top: -15px;
    border: 1px solid rgb(216, 9, 112);
    text-align: center;
    border-radius: 30px 30px 30px 30px;
    padding: 5px 10px;
    font-size: 20px;
}
</style>
