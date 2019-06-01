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
          hr
          // Date/Time
          p Posted on: {{assigment.date}}
          p Expires on:  {{assigment.expirationDate}}
          hr
          // Post Content
          p Requirement: 
          p {{assigment.requirement}}
          p Resources:
          p(v-for="(resource, index) in assigment.resources" v-bind:key="index")
            a(v-bind:href="'' + resource") {{resource}}
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
    try {
      const response = await this.http.get("/homework/assigment/" + this.id);
      this.assigment = response.data;
      this.assigment.date = moment(this.assigment.date).format("D MMMM YYYY");
      this.assigment.expirationDate = moment(
        this.assigment.expirationDate
      ).format("D MMMM YYYY");
      console.log(this.assigment);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    addHomework: function() {
      const url = "/upload/" + this.id;
      this.$router.push(url);
    },
    postComment: async function() {
      try {
        const response = await this.http.get(
          "/" + this.userType + "/" + this.userId
        );
        this.newComment.userEmail = response.data.email;
        this.newComment.date = moment().format("D MMMM YYYY");
        const comment = this.newComment
        const url = "/homework/" + this.id + "/comment ";
        const resp = await this.http.post(url, {
          userEmail: response.data.email,
          userId: this.userId,
          text: this.newComment.text,
          date: moment().format("D MMMM YYYY")
        });
        this.assigment.comments.push(comment);
        this.newComment.text = '';
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
<style lang="stylus" src="./assigment.styl" scoped></style>