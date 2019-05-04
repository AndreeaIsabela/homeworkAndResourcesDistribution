<template lang="pug">
  div
    .addResources.text-center
      router-link.new-link(to="/addResources") 
        i.fa.fa-plus-circle 
        span.text-element.addResources  Add new resource
    #showFiles(v-if="resourcesVector.length")
      .col-md-8.offset-md-2
        .input-group.col-md-12
          input#link-input.form-control.input(type="search"  aria-describedby="search" placeholder="search" v-model="searchedWord")
          //- button#search.btn.btn-def.in-field-button(v-on:click="getByTitle(resources,searchedWord)") Search
      h3.offset-md-2.col-md-8.col-sm-12#showFilesTitle.font-weight-bold.title Recent Resources
      div.row
        div.card.mb-3.offset-md-2.col-md-8.col-sm-12(v-for="(resource,index) in resources" v-bind:key="index")
          .card-body
            span.fa.fa-close(title="Delete homework." v-on:click="onDelete(resource._id, index)")
            h5.card-title Title: {{resource.title}}
            p.card-text Link:
              a(v-bind:href="resource.link") {{resource.link}}
            p.card-text Description: {{resource.description}}
            p.card-text 
              span(v-for="(tag,index) in resource.tags" v-bind:key="index") # {{tag}}
            div.row
              span.col-md-4.card-text
                small.text-muted Updated {{resource.date}}
              .offset-md-1.col-md-2 
                span {{resource.stars}} 
                span.fa.fa-2x.fa-star 
              //- button.offset-md-3.col-md-2.btn.btn-danger(v-on:click="onDelete(resource._id, index)") Delete

      b-pagination(align="center" :total-rows="totalRows" v-model="currentPage" :per-page="20")
    .show-files.text-center(v-else-if="this.loaded && !resourcesVector.length")
          img.img-fluid(src="https://es.seaicons.com/wp-content/uploads/2015/11/note-icon.png")
          h6.font-weight-bold.text-center No new resources were added.
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
      resourcesVector: [],
      currentPage: 1,
      totalRows: 0,
      rows: 1,
      rowsPerPage: 20,
      loaded: false,
      userId: "",
      userType:"",
      searchedWord: "",
      searchedList: []
    };
  },
  computed: {
    resources: function() {
      let files = this.resourcesVector.filter(file => {
        return (
          file.title.toLowerCase().indexOf(this.searchedWord.toLowerCase()) >= 0 ||
          file.tags.includes(this.searchedWord.toLowerCase())
        );
      });
      return files;
    }
  },
  methods: {
    onDelete: async function(id, index) {
      const url = "/" + this.userType + "/" + this.userId + "/resources/" + id;
      try {
        const response = await this.http.delete(url);
        this.resourcesVector.splice(index, 1);
      } catch (err) {
        console.log(err);
      }
    }
  },

  created: async function() {
    this.userId = window.localStorage.getItem("user");
    this.userType = window.localStorage.getItem("type");
    try {
      //get first 20 itemsl.
      const response = await this.http.get(
        "/" + this.userType + "/" + this.userId + "/resources/page/1"
      );
      //get  total number of items
      const totalRowsObj = await this.http.get(
        "/" + this.userType + "/" + this.userId + "/resources/totalPages"
      );
      this.totalRows = totalRowsObj.data;
      this.rows = response.data;
      var index = 0;
      for (var resource in response.data) {
        index++;
        if (index == this.rowsPerPage - 1) {
          break;
        }
        //put the first 20 items in solutionVector,to be displayed
        this.resourcesVector.push({
          _id: response.data[resource]._id,
          link: response.data[resource].link,
          title: response.data[resource].title,
          description: response.data[resource].description,
          stars: response.data[resource].stars,
          tags: response.data[resource].tags,
          date: moment(response.data[resource].date).format("D MMMM YYYY")
        });
      }
      this.loaded = true;
      console.log(this.resourcesVector);
    } catch (err) {
      console.log(err);
    }
  },

  watch: {
    onPropertyChanged: async function(
      newPageNumber: number,
      oldPageNumber: number
    ) {
      const resources =
        "/" + this.userType + "/" + this.userId + "/resources/page/" + newPageNumber;
      const response = await this.http.get(resources);

      this.resourcesVector = [];
      var index = 0;
      while (index < response.data.length && index < 20) {
        this.resourcesVector.push({
          _id: response.data[index]._id,
          link: response.data[index].link,
          title: response.data[index].title,
          tags: response.data[index].tags,
          description: response.data[index].description,
          stars: response.data[index].stars,
          date: moment(response.data[index].date).format("D MMMM YYYY")
        });
        ++index;
      }
    }
  }
};
</script>

<style lang="stylus" src="./resources.styl" scoped></style>
