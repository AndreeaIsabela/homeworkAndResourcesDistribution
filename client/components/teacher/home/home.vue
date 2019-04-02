<template lang="pug">
div.row
  div.offset-md-2.col-md-3.offset-sm-2.col-sm-8
    div.card
      img.card-img-top(src="https://image.flaticon.com/icons/svg/196/196363.svg")
      div.card-body
        p.card-text Here you can add resources, grade them by their quality and organise them.
        router-link.btn.btn-primary(to="/teacher/resources") Go to resources
    
  div.offset-md-2.col-md-3.offset-sm-2.col-sm-8
    div.card
      img.card-img-top( src="https://image.flaticon.com/icons/svg/579/579702.svg")
      div.card-body
        p.card-text Here you can create a homework or see student's solutions to existent homeworks.
        router-link.btn.btn-primary(to="/teacher/homework") Go to homework
</template>

<script lang="js">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios from "axios";
Vue.prototype.$http = axios;
export default  {
}
</script>

<style lang="stylus" scoped>
.card-body
  text-align: center
.row
  margin-top 5%
  margin-bottom 10%
.card
  background-color #fcfcfc 
  border none
</style>