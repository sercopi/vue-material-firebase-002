import Vue from "vue";
import Router from "vue-router";
import ViewList from "@/components/ViewList";
import ViewLists from "@/components/ViewLists";
import Login from "@/components/Login";
import Register from "@/components/Register";
import firebase from "firebase";
Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/",
      name: "viewlists",
      component: ViewLists,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/list/:list_id",
      name: "viewlist",
      component: ViewList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: {
        requiresGuest: true
      }
    }
  ]
});
router.beforeEach((to, from, next) => {
  //check for requiredAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    //check if logged in
    if (!firebase.auth().currentUser) {
      //got to login page
      /* next({
        path: "/login",
        query: {
          redirect: to.fullPath
        }
      }); */
    } else {
      //proceed to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    //check if logged in
    if (firebase.auth().currentUser) {
      //got to login page
      next({
        path: "/",
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      //proceed to route
      next();
    }
  } else {
    next();
  }
});
export default router;
