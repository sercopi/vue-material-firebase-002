<template>
  <div class="container">
    <div class="row title">
      <div class="col title s3 xl3">
        <router-link to="/"
          ><i style="color:pink" class="fa fa-arrow-left"></i
        ></router-link>

        <label>
          <span class="pink-text text-darken-2 title">Título:</span>
          <input
            class="pink-text text-darken-2"
            v-model="list.title"
            type="text"
          />
        </label>
      </div>
    </div>

    <div class="row">
      <form class="col">
        <ul class="collection">
          <li v-if="!list">No hay Artículos, Añade el primero!</li>
          <li
            v-for="(object, index) in list.objects"
            :key="index"
            class="collection-item"
          >
            <div class="row list">
              <div class="col sm2 xl2">
                <label>
                  <span class="pink-text text-darken-2">Nombre:</span>
                  <input
                    v-model="object.name"
                    :id="index + 'nombre'"
                    class="pink-text text-darken-2"
                    type="text"
                  />
                </label>
              </div>
              <div class="col sm2 xl2">
                <div>
                  <h4 class="pink-text">{{ object.place }}</h4>
                </div>
                <div class="text-pink">
                  <button
                    @click.prevent="openCustomModal('#object-' + object.name)"
                    class="btn pink"
                  >
                    <span><i class="material-icons">room</i></span>
                  </button>

                  <!-- Modal Structure -->
                  <div :id="'object-' + object.name" class="modal">
                    <div class="modal-content">
                      <p class="pink-text">Elige un lugar de compra:</p>
                      <p v-for="(place, index) in places" :key="index">
                        <label>
                          <input
                            name="newObjectPlace"
                            type="radio"
                            :value="place"
                            v-model="object.place"
                          />
                          <span class="pink-text">{{ place }}</span>
                        </label>
                      </p>
                    </div>
                    <div class="modal-footer">
                      <a
                        @click.prevent
                        class="btn modal-close waves-effect pink"
                      >
                        salir
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col sm2 xl2">
                <label>
                  <span class="pink-text text-darken-2">Cantidad:</span>
                  <input
                    class="pink-text text-darken-2"
                    v-model="object.number"
                    min="1"
                    :id="index + 'number'"
                    type="number"
                  />
                </label>
              </div>
              <div class="col sm2 xl2">
                <label>
                  <input
                    type="checkbox"
                    v-model="object.comprado"
                    :checked="object.comprado ? 'checked' : ''"
                  />
                  <span class="pink-text text-darken-2">{{
                    object.comprado ? "comprado" : "no comprado"
                  }}</span>
                </label>
              </div>
              <div class="col sm2">
                <button
                  class="btn pink"
                  v-on:click.prevent="deleteObject(object)"
                >
                  <i class="fa fa-window-close"></i>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </form>
    </div>
    <div class="row">
      <h3 class="pink-text">Añadir nuevo Artículo</h3>
      <form class="col s12">
        <div class="row list">
          <div class="col sm2 xl2">
            <label>
              <span class="pink-text text-darken-2">Nombre:</span>
              <input
                v-model="newObject.name"
                id="newObjectNombre"
                class="pink-text text-darken-2"
                type="text"
              />
            </label>
          </div>
          <div class="col sm2 xl2">
            <div>
              <p class="pink-text">{{ newObject.place }}</p>
            </div>
            <div class="text-pink">
              <button
                @click.prevent="openCustomModal('#newObject')"
                class="btn pink"
              >
                <span><i class="material-icons">room</i></span>
              </button>

              <!-- Modal Structure -->
              <div :id="'newObject'" class="modal">
                <div class="modal-content">
                  <h4 class="pink-text">Elige un lugar de compra:</h4>
                  <p v-for="(place, index) in places" :key="index">
                    <label>
                      <input
                        name="newObjectPlace"
                        type="radio"
                        :value="place"
                        v-model="newObject.place"
                      />
                      <span class="pink-text">{{ place }}</span>
                    </label>
                  </p>
                </div>
                <div class="modal-footer">
                  <a @click.prevent class="btn modal-close waves-effect pink">
                    salir
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="col sm2 xl2">
            <label>
              <span class="pink-text text-darken-2">Cantidad:</span>
              <input
                class="pink-text text-darken-2"
                v-model="newObject.number"
                min="1"
                id="newObjectNumber"
                type="number"
              />
            </label>
          </div>
          <div class="col sm2 xl2 comprado">
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
import firebase from "firebase";
import db from "@/components/firebaseInit";
import moment from "moment";
export default {
  name: "viewlist",

  data() {
    return {
      list_id: null,
      list: {
        created_at: moment().format("DD/MM/YYYY HH:mm"),
        updated_at: "",
        done: false,
        objects: [],
        title: "nueva lista"
      },
      newObject: {
        name: null,
        place: null,
        comprado: false,
        number: 1
      },
      lastSave: null,
      places: []
    };
  },
  beforeRouteLeave(to, from, next) {
    /* console.log(this.lastSave);
    console.log(this.list); */
    if (JSON.stringify(this.lastSave) !== JSON.stringify(this.list)) {
      confirm("Hay cambios no guardados, continuar?") ? next() : next(false);
    } else {
      next();
    }
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
            }),
            (vm.lastSave = { ...doc.data() });
        });
      });
  },
  mounted() {},
  created() {
    db.collection("Places")
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          this.places.push(doc.data().place);
        });
      });
  },
  computed: {
    isCompleted() {
      return (
        this.list.objects.every(object => object.comprado == true) &&
        this.list.objects.length !== 0
      );
    }
  },
  methods: {
    openCustomModal(id) {
      const elem = document.querySelector(id);
      const instance = M.Modal.init(elem);
      instance.open();
      console.log(this.newObject.place);
    },
    updateList(event, info = false, type = false) {
      if (
        this.list.objects.some(
          object => object.name == "" || object.name == null
        )
      ) {
        M.toast({
          html: "<p>Todos los Artículos tienen que tener nombre! </p>",
          classes: "pink"
        });
        return false;
      }
      const names = this.list.objects.reduce((acc, object) => {
        acc.push(object.name);
        return acc;
      }, []);
      if (new Set(names).size !== names.length) {
        M.toast({
          html: "<p>No puede haber nombres repetidos! </p>",
          classes: "pink"
        });
        return false;
      }
      const list = {
        ...this.list
      };
      this.lastSave = { ...this.list };
      list["updated_at"] = moment().format("DD/MM/YYYY HH:mm");
      list.done = this.isCompleted;
      db.collection("Lists")
        .doc(this.list_id)
        .set(list)
        .then(() => {
          M.toast({
            html: "<p>" + (info ? info : "guardado con éxito!") + "</p>",
            classes: type == "success" ? "green" : "pink"
          });
        })
        .catch(error => console.log(error));
    },
    nameExists(name) {
      return !this.list.objects.every(object => object.name !== name);
    },
    addObject() {
      if (this.newObject.name == null || this.newObject.name == "") {
        M.toast({
          html: "<p>El Artículo debe contener un nombre! </p>",
          classes: "pink"
        });
        return false;
      }
      if (this.nameExists(this.newObject.name)) {
        M.toast({
          html: "<p>El nombre del Artículo ya existe! </p>",
          classes: "pink"
        });
        return false;
      }
      this.newObject.id = this.list_id + "-" + (this.list.objects.length + 1);
      this.list.objects.push(this.newObject);
      this.updateList(false, this.newObject.name + " añadido!", "success");

      this.newObject = {
        name: null,
        place: null,
        comprado: false,
        number: 1
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
.title.col {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  vertical-align: center;
}
.fa-arrow-left {
  font-size: 3rem;
  margin-right: 20px;
}
.title {
  font-size: 4rem;
}
label {
  display: flex;
  flex-direction: row;
}
label span {
  margin-right: 5px;
}
.modal-footer {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-content: center;
  margin-bottom: 20px;
}
</style>
