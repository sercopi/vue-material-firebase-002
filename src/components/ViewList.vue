<template>
<div>
    <h2>
        <router-link to="/"><i style="color:pink" class="fa fa-arrow-left"></i></router-link>
        {{ list.title }}
    </h2>
    <div v-if="message.info" :class="'row message ' + message.type">
        <h3>{{ message.info }}</h3>
    </div>
    <div class="row">
        <form class="col s12">
            <ul class="collection">
                <li v-if="!list">No hay Artículos, Añade el primero!</li>
                <li v-for="(object, index) in list.objects" :key="index" class="collection-item">
                    <div class="row list">
                        <div class="col sm4">
                            <label>
                                <span class="pink-text text-darken-2">Nombre:</span>
                                <input v-model="object.name" :id="index + 'nombre'" class="pink-text text-darken-2" type="text" />
                            </label>
                        </div>
                        <div class="col sm4">
                            <label>
                                <span class="pink-text text-darken-2">Lugar:</span>
                                <input class="pink-text text-darken-2" v-model="object.lugar" :id="index + 'lugar'" type="text" />
                            </label>
                        </div>
                        <div class="col sm4">
                            <!--                            <label :for="index + 'comprado'">Comprado</label>
                            <input type="checkbox" v-model="object.comprado" :id="index + 'comprado'" :checked="object.comprado ? checked : ''" /> -->
                            <label>
                                <input type="checkbox" v-model="object.comprado" :checked="object.comprado ? 'checked' : ''" />
                                <span class="pink-text text-darken-2">{{
                    object.comprado ? "comprado" : "no comprado"
                  }}</span>
                            </label>
                        </div>
                        <div class="col sm2">
                            <button class="btn pink" v-on:click.prevent="deleteObject(object)">
                                <i class="fa fa-window-close"></i>
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
        </form>
    </div>
    <div class="row">
        <h3>Añadir nuevo Artículo</h3>
        <form class="col s12">
            <div class="row list">
                <div class="col sm4">
                    <label>
                        <span class="pink-text text-darken-2">Nombre:</span>
                        <input v-model="newObject.name" id="newObjectNombre" class="pink-text text-darken-2" type="text" />
                    </label>
                </div>
                <div class="col sm4">
                    <label>
                        <span class="pink-text text-darken-2">Lugar:</span>
                        <input class="pink-text text-darken-2" v-model="newObject.lugar" id="newObjectLugar" type="text" />
                    </label>
                </div>
                <div class="col sm4 comprado">
                    <label>
                        <input type="checkbox" v-model="newObject.comprado" />
                        <span class="pink-text text-darken-2">{{
                newObject.comprado ? "comprado" : "no comprado"
              }}</span>
                    </label>
                </div>
                <div class="col sm2">
                    <button class="btn pink" v-on:click.prevent="addObject">
                        <i class="fa fa-plus"></i>
                    </button>
                </div>
            </div>
        </form>
    </div>
    <button class="btn" v-on:click.prevent="updateList">guardar</button>
</div>
</template>

<script>
import db from "@/components/firebaseInit";
import moment from "moment";
export default {
    name: "viewlist",

    data() {
        return {
            list_id: null,
            list: {},
            newObject: {
                name: null,
                lugar: null,
                comprado: false
            },
            message: {
                info: null,
                messageType: null
            }
        };
    },
    beforeRouteEnter(to, from, next) {
        db.collection("Lists")
            .doc(to.params.list_id)
            .get()
            .then(doc => {
                next(vm => {
                    (vm.list_id = to.params.list_id),
                    (vm.list = {
                        ...doc.data()
                    });
                });
            });
    },

    methods: {
        updateList(event, info = false, type = false) {
            const list = {
                ...this.list
            };
            list["updated_at"] = moment().format();
            db.collection("Lists")
                .doc(this.list_id)
                .set(list)
                .then(() => {
                    this.message.info = info ? info : "guardado!";
                    this.message.type = type ? type : "success";
                    setTimeout(() => {
                        this.message = {
                            info: null,
                            type: null
                        };
                    }, 2000);
                })
                .catch(error => console.log(error));
        },
        addObject() {
            this.newObject.id = this.list_id + "-" + (this.list.objects.length + 1);
            this.list.objects.push(this.newObject);
            this.updateList(false, this.newObject.name + " añadido!", "success");

            this.newObject = {
                name: null,
                lugar: null,
                comprado: false
            };
        },
        deleteObject(objectToDelete) {
            this.list.objects = this.list.objects.filter(
                object => object.id !== objectToDelete.id
            );
            this.updateList(false, objectToDelete.name + " borrado!", "success");
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

.col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    vertical-align: center;
}

.list {
    display: flex;
    justify-content: space-evenly;
}

.message {
    border-radius: 10px;
    transition: all 2s;
}

.success {
    border: 1px solid green;
    background-color: rgb(28, 206, 28, 0.5);
}

.error {
    border: 1px solid red;
}

.fadeOut {
    display: none;
}
</style>
