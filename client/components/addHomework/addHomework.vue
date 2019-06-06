<template lang="pug">
  div.row
    .addHomework.offset-md-2.col-md-8
      form
        .form-row
          .form-group.col-md-6
            input.form-control(type='text', placeholder='Title' v-model="newHomework.title" required)
          .form-group.col-md-6
            input.form-control(type='text', placeholder='Group' v-model="newHomework.group" required)
        .form-group
          textarea.form-control(type='text', placeholder='Requirement' v-model="newHomework.requirement" required)
        .form-group
          span.col-2.col-md-2 Expiration Date
          input.col-md-10.form-control(type="date" v-model="newHomework.expirationDate" required)
        .form-row
          .form-group.col-md-10
            input.form-control(type='text' v-model="resource" placeholder='resource')
          span.add.col-md-2
            i.fa.fa-plus-circle(title='add resource' v-on:click="addResource()")
        span.resource(v-for="(resource, index) in newHomework.resources" v-bind:key="index")  {{resource}}

        .form-group
          button.btn.btn-def.col-md-12(v-on:click="addHomework()") Add homework
        
      
</template>

<script lang="js">
import * as moment from "moment";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import axios from "axios";
Vue.prototype.http = axios;
var http = Vue.prototype.http;

export default {
  data: function() {
    return {
      resource:"",
      userId: "",
      newHomework: {
        title: "",
        group: "",
        requirement: "",
        resources: [],
        expirationDate: "",
        date: ""
      }
    };
  },
  methods: {
    addResource: function() {
      this.newHomework.resources.push(this.resource);
    },
    addHomework: async function() {
      const url = "/homework";
      try{
      const response = await this.http.post(url, {
        title: this.newHomework.title,
        group: this.newHomework.group,
        requirement: this.newHomework.requirement,
        expirationDate: this.newHomework.expirationDate,
        resources: this.newHomework.resources,
        date: moment(),
        teacher: this.userId
      });
      window.setTimeout(()=>{this.$router.push("/homework");}, 1000);
      } catch(error) {
        console.log(error);
      }
    }
  },

  created: async function() {
    this.userId = window.localStorage.getItem("user");
  }
};
</script>

<style lang="stylus" src="./addHomework.styl" scoped>
  @import "//maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
</style>
