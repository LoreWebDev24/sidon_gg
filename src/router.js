import { createRouter, createWebHistory } from "vue-router";
import Homepage from "./pages/Hompage.vue";
import PlayerDetail from "./pages/PlayerDetail.vue"




const router = createRouter({
	history: createWebHistory(),
	routes: [
        {
			path: "/",
			name: "home",
			component: Homepage,
		},
		{
			path: "/PlayerDetail/:slug",
			props: true,
			name: "PlayerDetail",
			component: PlayerDetail,
		}
	],
});
export { router };