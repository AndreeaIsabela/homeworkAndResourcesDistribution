<template lang="pug">
    #showFiles(v-if="solutionVector.length")
      h3#showFilesTitle.font-weight-bold.title Recent Solutions
      .table-responsive
        table.table(v-if="solutionVector.length")
          thead
            tr
              th(scope="col") Student Name
              th(scope="col") Updated
              th(scope="col") Download 
          tbody.tr-blue
            tr(v-for="(solution,index) in solutionVector" v-bind:key="index")
              td.text-truncate(v-if="solution.filePath") {{solution.studentName}}
              td.text-muted.text-truncate(v-else) {{solution.studentName}}
              td(v-if="solution.filePath") {{solution.updateDate}}
              td.text-muted(v-else) -
              td.font-weight-bold.default(v-if="solution.filePath")
                a#download-file(href="#" v-on:click="download(solution._id)") Download 
              td.font-weight-bold.default.text-muted(v-else) Download
              <!-- button.btn.btn-danger(v-on:click="onDelete(solution._id, index)") Delete -->
      b-pagination(align="center" :total-rows="totalRows" v-model="currentPage" :per-page="20")
    .show-files(v-else-if="this.loaded && !solutionVector.length")
          img.img-fluid(src="images/svg/spotListEmpty.svg")
          h6.font-weight-bold.text-center No new solutions were added.
</template>

<script lang="ts">
import * as moment from "moment";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import axios from "axios";
Vue.prototype.http = axios;
import bPagination from 'bootstrap-vue/es/components/pagination/pagination';

Vue.component('b-pagination', bPagination);

@Component
export default class showFiles extends Vue {
  public solutionVector: any = [];
  public http: any = Vue.prototype.http;
  public currentPage:number = 1;
  public totalRows:number;
  public rows:any;
  public rowsPerPage:number = 20;
  public loaded:boolean = false;

  constructor() {
    super();
  }

  async download(id) {
    const solution = 'solution/download/' + id;
    const response = await this.http.get(solution); 
  }

  async created() {
    try {
      //get first 20 items 
      const response = await this.http.get("/solution/page/1");
      //get  total number of items 
      const totalRowsObj = await this.http.get("/solution/totalPages");
      this.totalRows = totalRowsObj.data;
      this.rows = response.data;
      var index = 0;
      for (var solution in response.data) {
        index++;
        if(index == this.rowsPerPage-1){
          break;
        }
        //put the first 20 items in solutionVector,to be displayed 
        this.solutionVector.push({
          _id: response.data[solution]._id,
          email: response.data[solution].email,
          date: response.data[solution].date,
          filePath: response.data[solution].filePath,
          expiredForUser: response.data[solution].expiredForUser,
          updateDate: moment(response.data[solution].updateDate).format(
            "D MMMM YYYY"
          )
        });
      }
      this.loaded = true;
    } catch (err) {
      console.log(err);
    }
  }

@Watch('currentPage')
 async onPropertyChanged(newPageNumber:number ,oldPageNumber:number){
   const solution = "/solution/page/" + newPageNumber;
   const response = await this.http.get(solution);

  this.solutionVector=[];
  var index = 0;
  while(index < response.data.length && index < 20){
    this.solutionVector.push({
      _id: response.data[index]._id,
          studentName: response.data[index].studentName,
          filePath: response.data[index].filePath,
          updateDate: moment(response.data[index].updateDate).format(
            "D MMMM YYYY"
          )});
    ++index;
  }
}

  async onDelete(id, index) {
    const url = "/solution/" + id;
    try {
      const response = await this.http.delete(url);
      this.solutionVector.splice(index, 1);
    } catch (err) {
      console.log(err);
    }
  }
}
</script>

<style lang="stylus"  scoped src="./solutions.styl"></style>
