<template lang="pug">
  div.row
    .addResources.offset-md-2.col-md-8
      form
        .form-group
          input.form-control(type='text', placeholder='Link' v-model="newResource.link")
        .form-row
          .form-group.col-md-6
            input.form-control(type='text', placeholder='Title' v-model="newResource.title")
          .form-group.col-md-6
            input.form-control(type='text', placeholder='Description' v-model="newResource.description")
        .form-row
          .form-group.col-md-6
            input.form-control(type='text' v-model="tag" placeholder='tag')
          span.add.col-md-1
            i.fa.fa-plus-circle(title='add tag' v-on:click="addTag()")
          .rating.col-md-4.offset-md-1
            fieldset.rate
              input#rate1-star5(type='radio', name='rate1', value='5')
              label(for='rate1-star5' title='five stars' v-on:click="newResource.stars = 5") 5
              input#rate1-star4(type='radio', name='rate1', value='4')
              label(for='rate1-star4' title='four stars' v-on:click="newResource.stars = 4") 4
              input#rate1-star3(type='radio', name='rate1', value='3')
              label(for='rate1-star3' title='three stars' v-on:click="newResource.stars = 3") 3
              input#rate1-star2(type='radio', name='rate1', value='2')
              label(for='rate1-star2' title='two stars' v-on:click="newResource.stars = 2") 2
              input#rate1-star1(type='radio', name='rate1', value='1')
              label(for='rate1-star1' title='one star' v-on:click="newResource.stars = 1") 1 
        span.tag(v-for="(tag, index) in newResource.tags" v-bind:key="index") # {{tag}}
        .form-group
          button.btn.btn-def.col-md-12(v-on:click="addResource()") Add resource
        
      
</template>

<script lang="ts">
import * as moment from "moment";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import axios from "axios";
Vue.prototype.http = axios;
var http: any = Vue.prototype.http;

export default {
  data: function() {
    return {
      tag:"",
      teacherId: "",
      newResource: {
        title: "",
        description: "",
        stars: 0,
        tags: [],
        link: "",
        date: ""
      }
    };
  },
  methods: {
    addTag: function() {
      this.newResource.tags.push(this.tag);
    },
    addResource: async function() {
      const url = "/teacher/" + this.teacherId + "/resources/";
      const response = await this.http.post(url, {
        title: this.newResource.title,
        description: this.newResource.description,
        link: this.newResource.link,
        stars: this.newResource.stars,
        tags: this.newResource.tags,
        date: moment()
      });
      this.$router.push("/teacher/addResources");
    }
  },

  created: async function() {
    this.teacherId = window.localStorage.getItem("user");
  }
};
</script>

<style lang="stylus" src="./addResources.styl" scoped>
  @import "//maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
</style>
