<template lang="pug">
  section
    .container.text-center
      h1 ERROR 404
      h3.text-muted Flie not found
</template>
<script lang="ts">
import * as moment from "moment";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import axios from "axios";
Vue.prototype.http = axios;

var http = Vue.prototype.http;

export default {
  props: ["id"],
  data: function() {
    return {
      assigment: {},
      newComment: {},
      userType: "",
      userId: ""
    };
  },
  created: async function() {
    this.userId = window.localStorage.getItem("user");
    this.userType = window.localStorage.getItem("type");
  }
};
</script>
