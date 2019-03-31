<template lang="pug">
    #showFiles(v-if="resourcesVector.length")
      h3#showFilesTitle.font-weight-bold.title Recent Resources
      div.row
        div.card.mb-3.offset-md-2.col-md-8.col-sm-12(v-for="(resource,index) in resourcesVector" v-bind:key="index")
          .card-body
            h5.card-title {{resource.title}}
            p.card-text {{resource.description}}
            p.card-text 
              span(v-for="(tag,index) in resource.tag" v-bind:key="index") #{{tag}}
            p.card-text
              small.text-muted Last updated {{resource.date}}
            button.btn.btn-danger(v-on:click="onDelete(resource._id, index)") Delete

      b-pagination(align="center" :total-rows="totalRows" v-model="currentPage" :per-page="20")
    .show-files(v-else-if="this.loaded && !resourcesVector.length")
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
      teacherId: ""
    };
  },
  methods: {
    onDelete: async function(id, index) {
    const url = "/teacher/" + this.teacherId + "/resources/" + id;
    try {
      const response = await this.http.delete(url);
      this.resourcesVector.splice(index, 1);
    } catch (err) {
      console.log(err);
    }
  }
  },

  created: async function() {
    this.teacherId = window.localStorage.getItem("user");
    try {
      //get first 20 itemsl.
      const response = await this.http.get("/teacher/" + this.teacherId + "/resources/page/1");
      //get  total number of items
      const totalRowsObj = await this.http.get("/teacher/" + this.teacherId + "/resources/totalPages");
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
          date: moment(response.data[resource].date).format("D MMMM YYYY")
        });
      }
      this.loaded = true;
    } catch (err) {
      console.log(err);
    }
  },

  watch: {
    onPropertyChanged: async function(
      newPageNumber: number,
      oldPageNumber: number
    ) {
      const resources = "/teacher/" + this.teacherId + "/resources/page/" + newPageNumber;
      const response = await this.http.get(resources);

      this.resourcesVector = [];
      var index = 0;
      while (index < response.data.length && index < 20) {
        this.resourcesVector.push({
          _id: response.data[index]._id,
          link: response.data[index].link,
          title: response.data[index].title,
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
