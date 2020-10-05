<template>
  <div>
    <div class="row info">
      <div class="col info">
        <div>
          <div>
            <h3 class="pink-text">Completas: {{ completed }}</h3>
          </div>
        </div>
        <div>
          <div>
            <h3 class="pink-text">Incompletas: {{ uncompleted }}</h3>
          </div>
        </div>
      </div>
    </div>
    <h2 class="pink-text">listas de la compra</h2>
    <div class="row container">
      <div class="input-field ">
        <select v-model="order" class="pink-text" @change="orderBy">
          <option class="pink-text" value="" disabled selected
            >Elige una Opción</option
          >
          <option class="pink-text" value="fec-asc">fecha ASC</option>
          <option class="pink-text" value="title">título</option>
          <option class="pink-text" value="fec-desc">fecha DESC</option>
          <option class="pink-text" value="quantity"
            >Cantidad de Artículos</option
          >
          <option class="pink-text" value="completed">Completados</option>
        </select>
        <label class="pink-text">Ordenar</label>
      </div>
      <div class="row">
        <label for="newPlace" class="pink-text">
          Añadir Lugar de compra habitual
          <button @click="addPlace" class="btn waves-effect waves-light pink">
            <i class="material-icons">room</i>
          </button>
          <input
            type="text"
            id="newPlace"
            class="pink-text"
            v-model="newPlace"
          />
        </label>
        <div>
          <h4 class="pink-text">Tus Lugares:</h4>
          <div class="pink-text" v-if="places.length == 0">
            Aun no tienes lugares? Añade el primero!
          </div>
          <div v-for="(place, index) in places" :key="index" class="chip pink">
            {{ place.place }}
            <i @click="deletePlace(place.id)" class="close material-icons"
              >close</i
            >
          </div>
        </div>
      </div>
      <div>
        <button
          @click.prevent="createNewList"
          class="btn-floating btn-large pink"
        >
          <i class="fa fa-plus"></i>
        </button>
      </div>
      <div
        v-for="(list, index) in lists"
        :key="index"
        class="col xl4 l6 m12 s12"
      >
        <div class="card" :data-id="list.list_id">
          <span v-if="list.done" class="notify-badge-completed"
            >COMPLETADA</span
          >
          <span
            v-if="!list.done && list.objects.length == 0"
            class="notify-badge-empty"
            >VACÍA</span
          >

          <div class="card-content">
            <span class="card-title dark-text">{{ list.title }}</span>
            <div class="row buttons">
              <div class="col s4">
                <router-link
                  :to="{
                    name: 'viewlist',
                    params: { list_id: list.list_id }
                  }"
                >
                  <button class="btn-floating  waves-effect waves-light green">
                    <i class="material-icons">edit</i>
                  </button>
                </router-link>
              </div>
              <div class="col s4">
                <a
                  @click.prevent="openCustomModal('#modal-' + list.list_id)"
                  class="waves-effect waves-light btn modal-trigger"
                  :href="'#modal-' + list.list_id"
                >
                  <i class="material-icons">book</i>
                </a>
              </div>
              <div class="col s4">
                <div class="switch">
                  <label class="pink-text">
                    Completar:
                    <input
                      v-model="list.done"
                      @click="udpdateList(list)"
                      type="checkbox"
                    />
                    <span class="lever pink"></span>
                  </label>
                </div>
              </div>
            </div>
            <small>Artículos: {{ list.objects.length }}</small>
            <div class="flow-text"></div>
            <div class="flow-text">creada: {{ list.created_at }}</div>
            <div class="flow-text">modificada: {{ list.updated_at }}</div>
            <div :id="'modal-' + list.list_id" class="modal">
              <div class="modal-content">
                <h4 class="pink-text">{{ list.title }}</h4>
                <ul class="pink-text item-list">
                  <h4>Artículos</h4>
                  <li
                    v-for="(object, index) in list.objects"
                    :key="index"
                    class="pink-text item"
                  >
                    <p>
                      {{ object.name }} comprado:
                      <span
                        ><i class="material-icons">{{
                          object.comprado ? "check" : "clear"
                        }}</i></span
                      >
                    </p>
                  </li>
                  <p v-if="list.objects.length == 0">
                    No hay artículos en esta lista, añade el primero editándola!
                  </p>
                </ul>
              </div>
              <div class="modal-footer">
                <button class="modal-close waves-effect waves-green btn pink">
                  OK
                </button>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button
              @click.prevent="openCustomModal('#modalDelete-' + list.list_id)"
              class="btn pink"
            >
              <span><i class="material-icons">delete_outline</i></span>
            </button>

            <!-- Modal Structure -->
            <div :id="'modalDelete-' + list.list_id" class="modal">
              <div class="modal-content">
                <h4 class="pink-text">Borar la lista: {{ list.title }}?</h4>
              </div>
              <div class="modal-footer">
                <button class="btn modal-close waves-effect pink">
                  cancelar
                </button>
                <button
                  class="btn modal-close waves-effect pink"
                  @click.prevent="deleteList(list)"
                >
                  Si
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div class="pink-text" v-if="lists.length == 0">
        No tienes ninguna lista, crea la primera!
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/components/firebaseInit";
import moment from "moment";
export default {
  name: "viewlist",
  data() {
    return {
      lists: [],
      order: "fec-asc",
      newPlace: null,
      places: []
    };
  },
  /* beforeRouteEnter(to, from, next) {
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
        });
      });
    //este next es necesario, si no hay ninguna lista, aun asi se va hacia la url
    next();
  }, */
  computed: {
    completed() {
      return this.lists.reduce((acc, list) => {
        if (list.done) {
          acc = acc + 1;
        }
        return acc;
      }, 0);
    },
    uncompleted() {
      return this.lists.reduce((acc, list) => {
        if (!list.done) {
          acc = acc + 1;
        }
        return acc;
      }, 0);
    }
  },
  mounted() {
    const select = document.querySelector("select");
    M.FormSelect.init(select);
    //ordenar por defecto
  },
  created() {
    db.collection("Lists")
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.lists.push({ ...doc.data() });
        });
      });
    db.collection("Places")
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.places.push({ place: doc.data().place, id: doc.id });
        });
      });
  },
  methods: {
    openCustomModal(id) {
      const elem = document.querySelector(id);
      const instance = M.Modal.init(elem);
      instance.open();
    },
    deleteList(list) {
      db.collection("Lists")
        .doc(list.list_id)
        .delete()
        .then(() => {
          M.toast({ html: "La lista: " + list.title + " ha sido borrada!" });
          this.lists = this.lists.filter(
            element => element.list_id !== list.list_id
          );
        })
        .catch(error => console.error(error));
    },
    udpdateList(list) {
      list.done = !list.done;
      list.objects.forEach(object => (object.comprado = list.done));
      this.lists = [...this.lists];
      db.collection("Lists")
        .doc(list.list_id)
        .set(list)
        .then(() => this.orderBy());
    },
    createNewList() {
      const ref = db.collection("Lists").doc();
      const id = ref.id;
      const router = this.$router;
      db.collection("Lists")
        .doc(id)
        .set({
          list_id: id,
          user_id: firebase.auth().currentUser.uid,
          created_at: moment().format("DD/MM/YYYY HH:mm"),
          updated_at: "",
          done: false,
          objects: [],
          title: "nueva lista"
        })
        .then(() => {
          router.push({ name: "viewlist", params: { list_id: id } });
        });
    },
    orderBy() {
      if (this.order == "quantity") {
        this.lists = this.lists.sort((listA, listB) => {
          if (listA.objects.length > listB.objects.length) {
            return -1;
          }
          if (listA.objects.length < listB.objects.length) {
            return +1;
          }
          return 0;
        });
      }
      if (this.order == "completed") {
        this.lists = this.lists.sort((listA, listB) => {
          if (listB.done) {
            return +1;
          }
          return 0;
        });
      }
      if (this.order == "fec-desc") {
        this.lists = this.lists.sort((listA, listB) => {
          if (
            moment(listA.created_at, "DD/MM/YYYY HH:mm").isAfter(
              moment(listB.created_at, "DD/MM/YYYY HH:mm")
            )
          ) {
            return -1;
          }
          return +1;
        });
      }
      if (this.order == "fec-asc") {
        this.lists = this.lists.sort((listA, listB) => {
          if (
            moment(listA.created_at, "DD/MM/YYYY HH:mm").isAfter(
              moment(listB.created_at, "DD/MM/YYYY HH:mm")
            )
          ) {
            return +1;
          }
          return -1;
        });
      }
      if (this.order == "title") {
        this.lists = this.lists.sort((listA, listB) => {
          if (listA.title > listB.title) {
            return +1;
          }
          return -1;
        });
      }
    },
    addPlace() {
      const names = this.places.reduce((acc, place) => {
        acc.push(place.place);
        return acc;
      }, []);
      console.log(names);
      if (names.includes(this.newPlace)) {
        M.toast({
          html: "<p> El lugar de compra ya existe!</p>",
          classes: "pink"
        });
        return false;
      }
      if (this.newPlace == null || this.newPlace == "") {
        M.toast({
          html: "<p> Elige un nombre para el lugar!</p>",
          classes: "pink"
        });
        return false;
      }
      console.log("lugar añadido");
      const id = db.collection("Places").doc().id;
      db.collection("Places")
        .doc(id)
        .set({
          user_id: firebase.auth().currentUser.uid,
          place: this.newPlace
        })
        .then(() => {
          this.places.push({ id: id, place: this.newPlace });
          this.newPlace = null;
        })
        .catch(error => console.log(error));
    },
    deletePlace(id) {
      db.collection("Places")
        .doc(id)
        .delete()
        .then(() => {
          this.places.filter(setPlace => setPlace.id !== id);
        });
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
  height: 400px;
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
.modal-footer {
  display: flex;
  justify-content: space-evenly;
  align-content: center;
  margin-bottom: 20px;
}
.col.info {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
.col.info > div {
  margin-right: 20px;
}
.row.info {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
