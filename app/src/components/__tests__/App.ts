import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex, { Store } from "vuex";

import App from "../App.vue";

const localVue = createLocalVue();

localVue.use(Vuex);

test("Render a component", () => {
  shallowMount(App, {
    localVue,
    store: new Store({}),
    stubs: ["router-view"]
  });
});
