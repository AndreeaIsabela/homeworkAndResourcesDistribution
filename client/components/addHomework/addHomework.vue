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
          model-select(:options='options' v-model='item' placeholder='select item')

        span.resource(v-for="(resource, index) in newHomework.resources" v-bind:key="index")  {{resource.title}}

        .form-group
          button.btn.btn-def.col-md-12(v-on:click="addHomework()") Add homework
        
      
</template>

<script lang="js">
import * as moment from "moment";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import axios from "axios";
import { ModelSelect } from 'vue-search-select'
Vue.prototype.http = axios;
var http = Vue.prototype.http;

export default {
  data: function() {
    return {
      resource:"",
      userId: "",
      resourcesList: "",
      options: [],
      item: {
          value: '',
          text: ''
        },
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
  watch: {
    item: function (newValue, old) {
      console.log('item selectat -  ', newValue);
      console.log('resource list- ', this.resourcesList);
      this.addResource(this.resourcesList[newValue.value]);

    },
  },
  methods: {
    addResource: function(resource) {
      console.log('Add resources - ', resource);
      this.newHomework.resources.push(resource);
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
      } catch(error) {
        console.log(error);
      }
      this.$router.push("/homework");
    },
     reset: function () {
        this.item = {}
      },
      selectFromParentComponent1: function () {
        // select option from parent component
        this.item = this.options[0];
        this.addResource(this.item.value)

      }
  },
   components: {
      ModelSelect
    },

  created: async function() {
    this.userId = window.localStorage.getItem("user");
    try {
      const response = await this.http.get("/teacher/" + this.userId);
      this.resourcesList = response.data.resources;
      var self = this;
      for(let i = 0; i < this.resourcesList.length; i++) { 
        this.options.push({
          value: i,
          text: this.resourcesList[i].title + '; stars-' +  this.resourcesList[i].stars
        })
      }
      console.log('options ', this.options);
    } catch (err) {
      console.log(err);
    }
  }
};
</script>

<style lang="stylus" src="./addHomework.styl" scoped>
  @import "//maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
</style>
