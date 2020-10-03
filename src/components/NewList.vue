<template>
<div>
    <button @click="createList">asd</button>
</div>
</template>

<script>
import db from "@/components/firebaseInit";
import moment from "moment";
export default {
    name: "newList",
    data() {
        return {};
    },
    methods: {
        createList() {
            const ref = db.collection("Lists");
            const id = ref.doc().id;
            console.log(id);
            ref.doc(id).set({
                created_at: moment().format("LLLL"),
                updated_at: "",
                objects: [],
                done: false,
                title: "nueva lista"
            });
        }
    }
};
</script>

<style scoped></style>
