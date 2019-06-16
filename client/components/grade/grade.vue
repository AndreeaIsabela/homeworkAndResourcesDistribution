<template lang="pug">
  section.row
    .offset-md-2.col-md-8
      .row
        select#inlineFormCustomSelect.custom-select.mr-sm-2(v-model="grade")
          option(selected) Grade homework...
          option(value='1') 1
          option(value='2') 2
          option(value='3') 3
          option(value='4') 4
          option(value='5') 5
          option(value='6') 6
          option(value='7') 7
          option(value='8') 8
          option(value='9') 9
          option(value='10') 10
      .row
        textarea.form-control(rows="3" v-model='observations' placeholder='Add your Observations')
      button.btn.btn-primary(type="submit" v-on:click='gradeHomework()') Submit
        
    

</template>

<script lang="js">
import * as moment from "moment";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import axios from "axios";
Vue.prototype.http = axios;
var http = Vue.prototype.http;

export default  {
  props: ["studentId", "homeworkId"],
  data: function() {
    return {
      grade: 0,
      observations: ''
    }
   },

 methods: {
  gradeHomework: async function() {
    this.userId = window.localStorage.getItem("user");
    const url = "/homework/grade/" + this.studentId;
    try{
      const response = await this.http.put(url, {
        grade: this.grade,
        observations: this.observations,
        homeworkId: this.homeworkId
    });
    this.$router.push("/solutions/" + this.homeworkId);
    } catch(error) {
      console.log(error);
    }
     } 
 },
}
</script>

<style lang="stylus"  scoped src="./grade.styl"></style>
