import Vue from "vue";
import Router from "vue-router";
import ViewList from "@/components/ViewList";
import ViewLists from "@/components/ViewLists";
import NewList from "@/components/NewList";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "viewlists",
      component: ViewLists
    },
    {
      path: "/list/:list_id",
      name: "viewlist",
      component: ViewList
    },
    {
      path: "/newlist",
      name: "newList",
      component: NewList
    }
  ]
});
