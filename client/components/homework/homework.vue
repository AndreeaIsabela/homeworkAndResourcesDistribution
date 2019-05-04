<template lang="pug">
  div
    .addHomeworks.text-center
      router-link.new-link(to="/addHomework") 
        i.fa.fa-plus-circle 
        span.text-element  Add new homework
    #showFiles(v-if="homeworksVector.length")
      .col-md-8.offset-md-2
        .input-group.col-md-12
          input#link-input.form-control.input(type="search"  aria-describedby="search" placeholder="search" v-model="searchedWord")
      h3.offset-md-2.col-md-8.col-sm-12#showFilesTitle.font-weight-bold.title Recent Homeworks
      div.row
        div.card.mb-3.offset-md-2.col-md-8.col-sm-12(v-for="(homework,index) in homeworks" v-bind:key="index")
          .card-body
            span.fa.fa-close(title="Delete homework." v-on:click="onDelete(homework._id, index)")
            h5.card-title {{homework.title}}
              span.fa.fa-sign-in(title="Go to assigment page." v-on:click="goToAssigment()")
            p.card-text {{homework._id}} 
            p.card-text Group: {{homework.group}}
            p.card-text.text-truncate {{homework.requirement}}
            div.row
              span.col-md-8.card-text
                small.text-muted Added on  {{homework.date}}, expires on {{homework.expirationDate}}
              //- button.offset-md-4.col-md-2.btn.btn-danger(v-on:click="onDelete(homework._id, index)") Delete

      b-pagination(align="center" :total-rows="totalRows" v-model="currentPage" :per-page="20")
    .show-files.text-center(v-else-if="this.loaded && !homeworksVector.length")
          img.img-fluid(src="https://es.seaicons.com/wp-content/uploads/2015/11/note-icon.png")
          h6.font-weight-bold.text-center No new homeworks were added.
</template>

<script lang="ts">
import * as moment from "moment";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import axios from "axios";
Vue.prototype.http = axios;
import bPagination from "bootstrap-vue/es/components/pagination/pagination";

Vue.component("b-pagination", bPagination);
var http: any = Vue.prototype.http;

export default {
  data: function() {
    return {
      homeworksVector: [],
      currentPage: 1,
      totalRows: 0,
      rows: 1,
      rowsPerPage: 20,
      loaded: false,
      userId: "",
      searchedWord: "",
      searchedList: []
    };
  },
  computed: {
    homeworks: function() {
      let files = this.homeworksVector.filter(file => {
        return (
          file.title.toLowerCase().indexOf(this.searchedWord.toLowerCase()) >= 0
        );
      });
      return files;
    }
  },
  methods: {
    goToAssigment: function(){
      this.$router.push('/assigment');
    },
    onDelete: async function(id, index) {
      const url = "/homework/" + this.userId + "/" + id;
      try {
        const response = await this.http.delete(url);
        this.homeworksVector.splice(index, 1);
      } catch (err) {
        console.log(err);
      }
    }
  },

  created: async function() {
    this.userId = window.localStorage.getItem("user");
    try {
      //get first 20 itemsl.
      const response = await this.http.get(
        "/homework/" + this.userId + "/page/1"
      );
      //get  total number of items
      const totalRowsObj = await this.http.get(
        "/homework/" + this.userId + "/totalPages"
      );
      this.totalRows = totalRowsObj.data;
      this.rows = response.data;
      var index = 0;
      for (var homework in response.data) {
        index++;
        if (index == this.rowsPerPage - 1) {
          break;
        }
        //put the first 20 items in homeworkVector,to be displayed
        this.homeworksVector.push({
          _id: response.data[homework]._id,
          group: response.data[homework].group,
          title: response.data[homework].title,
          requirement: response.data[homework].description,
          resources: response.data[homework].resources,
          date: moment(response.data[homework].date).format("D MMMM YYYY"),
          expirationDate: moment(response.data[homework].expirationDate).format(
            "D MMMM YYYY"
          ),
          teacher: response.data[homework].teacher
        });
      }
      this.loaded = true;
      console.log(this.homeworksVector);
    } catch (err) {
      console.log(err);
    }
  },

  watch: {
    onPropertyChanged: async function(
      newPageNumber: number,
      oldPageNumber: number
    ) {
      const homeworks =
        "/teacher/" + this.userId + "/homeworks/page/" + newPageNumber;
      const response = await this.http.get(homeworks);

      this.homeworksVector = [];
      var index = 0;
      while (index < response.data.length && index < 20) {
        this.homeworksVector.push({
          _id: response.data[index]._id,
          group: response.data[index].group,
          title: response.data[index].title,
          requirement: response.data[index].description,
          resources: response.data[index].resources,
          date: moment(response.data[index].date).format("D MMMM YYYY"),
          expirationDate: moment(response.data[index].expirationDate).format(
            "D MMMM YYYY"
          ),
          teacher: response.data[index].teacher
        });
        ++index;
      }
    }
  }
};
</script>

<style lang="stylus" src="./homework.styl" scoped></style>
