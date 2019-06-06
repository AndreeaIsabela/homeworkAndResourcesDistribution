<template lang="pug">
  section.row
    #showFiles.offset-md-2.col-md-8.col-sm-12(v-if="solutionVector.length")
      h3#showFilesTitle.font-weight-bold.title Recent Solutions
      .table-responsive
        table.table(v-if="solutionVector.length")
          thead
            tr
              th(scope="col") Student Name
              th(scope="col") Updated
              th(scope="col") Download 
              th(scope="col") Grade
          tbody.tr-blue
            tr(v-for="(solution,index) in solutionVector" v-bind:key="index")
              td.text-truncate(v-if="solution.filePath") {{solution.userName}}
              td.text-muted.text-truncate(v-else) {{solution.userName}}
              td(v-if="solution.filePath") {{solution.updateDate}}
              td.text-muted(v-else) -
              td.font-weight-bold.default(v-if="solution.filePath")
                a#download-file(href="#" v-on:click="download(solution._id)") Download 
              td.font-weight-bold.default.text-muted(v-else) Download
              td.font-weight-bold.default.text-muted Grade
              <!-- button.btn.btn-danger(v-on:click="onDelete(solution._id, index)") Delete -->
    .show-files(v-else-if="this.loaded && !solutionVector.length")
          img.img-fluid(src="images/svg/spotListEmpty.svg")
          h6.font-weight-bold.text-center No new solutions were added.
</template>

<script lang="js">
import * as moment from "moment";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import axios from "axios";
Vue.prototype.http = axios;
var http = Vue.prototype.http;

export default  {
  props: ["id"],
  data: function() {
    return {
      solutionVector: [],
      loaded: false
    }
   },
  created: async function() {
     try {
      const response = await this.http.get("/homework/students/" + this.id);
      this.solutionVector = response.data;
       console.log(response);
      this.loaded = true;
    } catch (err) {
      console.log(err);
    }
   },

 methods: {
  download: async function(id) {
    const solution = 'solution/download/' + id;
    const response = await this.http.get(solution); 
  }
 },
}
</script>

<style lang="stylus"  scoped src="./solutions.styl"></style>
