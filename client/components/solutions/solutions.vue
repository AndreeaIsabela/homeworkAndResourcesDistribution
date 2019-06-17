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
                a#download-file(href="#" v-on:click="download(solution.userId, solution.filePath)") Download 
              td.font-weight-bold.default.text-muted(v-else) Download
              td.font-weight-bold.default.text-muted(v-if="!solution.filePath") Grade
              td
                button.btn.btn-primary(v-if="solution.filePath && !solution.grade" v-on:click="gradeHomework(solution.userId)") Grade
              td.font-weight-bold.default(v-if="solution.filePath && solution.grade") {{solution.grade}}
              <!-- button.btn.btn-danger(v-on:click="onDelete(solution.userId, index)") Delete -->
    .show-files.text-center.offset-md-5(v-else-if="this.loaded && !solutionVector.length")
          img.img-fluid(src="https://es.seaicons.com/wp-content/uploads/2015/11/note-icon.png")
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
      this.loaded = true;
    } catch (err) {
      console.log(err);
    }
   },

 methods: {
  gradeHomework: function(studentId) {
    this.$router.push("/grade/" + studentId + '/' + this.id);
  },

  download: async function(id, filePath) {
    try{
      const solution = 'homework/download/' + id;
    
      const response = await this.http({ url: solution, method: 'GET', responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');

      link.href = url;

      const contentHeader = response.headers['content-disposition'];
      const match = new RegExp('=(.*)$').exec(contentHeader);
      const fileName = filePath.split('/')[2];

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch(err) {
      console.log(err);
    }
  },

 },
}
</script>

<style lang="stylus"  scoped src="./solutions.styl"></style>
