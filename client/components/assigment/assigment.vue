<template lang="pug">
  section
    // Page Content
    .container
      .row
        // Post Content Column
        .offset-2.col-lg-8
          // Title
          h1.mt-4 {{assigment.title}}
          // Author
          p.lead
            | Group: {{assigment.group}}
            button.btn.btn-primary(v-if="userType === 'student'" @click="addHomework()") Upload homework
            button.offset-md-3.btn.btn-primary(type="button" v-if="userType === 'teacher'" @click="goToSolutions()") Solutions
          hr
          // Date/Time
          p Posted on: {{assigment.date}}
          p Expires on:  {{assigment.expirationDate}}
          hr
          // Post Content
          p Requirement: 
          p {{assigment.requirement}}
          model-select(v-if="userType==='student'" :options='options' v-model='item' placeholder='select item')
          hr
          p Teacher resources:
          div.row
            div.card.mb-3.col-sm-12(v-for="(resource,index) in assigment.resources" v-bind:key="index")
              .card-body
                h5.card-title Title: {{resource.title}}
                p.card-text Link:
                  a(v-bind:href="resource.link") {{resource.link}}
                p.card-text Description: {{resource.description}}
                  span {{resource.stars}} 
                  span.fa.fa-2x.fa-star 
          hr
          p Student resources:
          div.row(v-if="assigment.studentResources")
            div.card.mb-3.col-sm-12(v-for="(resource,index) in assigment.studentResources" v-bind:key="index")
              .card-body
                h5.card-title Title: {{resource.title}} added by {{resource.studentName}}
                p.card-text Link:
                  a(v-bind:href="resource.link") {{resource.link}}
                p.card-text Description: {{resource.description}}
                  span {{resource.stars}} 
                  span.fa.fa-2x.fa-star 
          hr
          // Comments Form
          .card.my-4
            h5.card-header Leave a Comment:
            .card-body
              form
                .form-group
                  textarea.form-control(v-model="newComment.text" rows='3')
                button.btn.btn-primary(@click="postComment()") Submit
          div(v-if="assigment.comments")
            br
            h3 Comments:
            .media.mb-4(v-for="(comment, index) in assigment.comments" v-bind:key="index")
              img.d-flex.mr-3.rounded-circle(src='http://placehold.it/50x50' alt='')
              .media-body
                h5.mt-0 {{comment.userEmail}}
                | {{comment.text}}
                span.text-muted.float-right {{comment.date}}
    footer.py-5.bg-dark
      .container
        p.m-0.text-center.text-white Copyright &copy; Uploader 2019
</template>

<script lang="js">
import * as moment from "moment";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import axios from "axios";
import { ModelSelect } from 'vue-search-select'
Vue.prototype.http = axios;
var http = Vue.prototype.http;
export default {
  props: ["id"],
  data: function() {
    return {
      studentName: '',
      resourcesList: [],
      assigment: {},
      newComment: {},
      userType: "",
      userId: "",
       options: [],
      item: {
          value: '',
          text: ''
        },
    };
  },
  watch: {
    item: function (newValue, old) {
      this.addResource(this.resourcesList[newValue.value]);
    },
  },
  created: async function() {
    this.userId = window.localStorage.getItem("user");
    this.userType = window.localStorage.getItem("type");
    try {
      const response = await this.http.get("/homework/assigment/" + this.id);
      this.assigment = response.data;
      this.assigment.date = moment(this.assigment.date).format("D MMMM YYYY");
      this.assigment.expirationDate = moment(
        this.assigment.expirationDate
      ).format("D MMMM YYYY");
    } catch (err) {
      console.log(err);
    }

    if(this.userType === 'student') {
      try {
        const response = await this.http.get("/student/" + this.userId);
        this.resourcesList = response.data.resources;
        this.studentName = response.data.username;
        for(let i = 0; i < this.resourcesList.length; i++) { 
          this.options.push({
            value: i,
            text: this.resourcesList[i].title + '; stars-' +  this.resourcesList[i].stars
          })
        }
      } catch (err) {
        console.log(err);
      }}
  },
  methods: {
    reset: function () {
        this.item = {}
      },
    selectFromParentComponent1: function () {
      // select option from parent component
      this.item = this.options[0];
      this.addResource(this.item.value);
    },
    addResource: async function(resource) {
      resource.studentName = this.studentName;
      this.assigment.studentResources.push(resource);
      const response = await this.http.put('/homework/add/resources/' + this.id,{
        _id: resource._id,
        stars: resource.stars,
        title: resource.title,
        description: resource.description,
        studentName: this.studentName
      });
    },
    goToSolutions: function () {
      const url = "/solutions/" + this.id;
      this.$router.push(url);
    },
    addHomework: function() {
      const url = "/upload/" + this.id;
      this.$router.push(url);
    },
    postComment: async function() {
      try {
        const response = await this.http.get(
          "/" + this.userType + "/" + this.userId
        );
        this.newComment.userEmail = response.data.username;
        this.newComment.date = moment().format("D MMMM YYYY");
        const comment = this.newComment;
        const url = "/homework/" + this.id + "/comment ";
        const resp = await this.http.post(url, {
          userEmail: response.data.username,
          userId: this.userId,
          text: this.newComment.text,
          date: moment().format("D MMMM YYYY")
        });
        this.assigment.comments.push(comment);
      } catch (err) {
        console.log(err);
      }
      this.newComment.text = '';
    }
  },
  components: {
    ModelSelect
  },
};
</script>
<style lang="stylus" src="./assigment.styl" scoped></style>