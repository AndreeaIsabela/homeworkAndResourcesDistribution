<template lang="pug">
  nav.navbar.navbar-expand-sm.navigation
    .container
      router-link.navbar-brand(to="/home")
        img(src="https://image.flaticon.com/icons/svg/167/167756.svg")
        span Uploader
    
      .justify-content-between(v-if="loggedin")
        router-link.nav-item.new-link(to="/student/homework" v-if="student")
          span.text-element Homework
          
        router-link.nav-item.resources(to="/teacher/resources" v-if="teacher")
          i.fa.fa-book  
          span.text-element Resources

        router-link.nav-item.homework(to="/teacher/homework" v-if="teacher")
          i.fa.fa-folder-open  
          span.text-element Homeworks
          
        span.nav-item.log-out(v-on:click="logOut()")
          i.fa.fa-sign-out  
          span.text-element  Log Out
</template>

<script lang="js">
import { Vue, Component, Prop } from "vue-property-decorator";

export default  {
  props: ["loggedin","student", "teacher"],
  methods:{
    logOut() {
      localStorage.removeItem("token");
      localStorage.removeItem("type");
      this.$router.push("/login");
      location.reload(true);
    }

  }
}
</script>

<style lang="stylus" scoped>
.navbar-brand
  span 
    color: #EA8953

img 
  width 35px
  margin-right 5px

.navigation 
  margin-bottom: 5%;
  background-color: #060813

.ai-logo-svg 
  height: 2.5rem
  margin-top: -.85rem
  shape-rendering: geometricPrecision

.homework
  text-decoration: none
  color: #EA8953
  margin-right 30px
  &:hover
    color: @color
    text-decoration: none
    cursor: pointer

.resources
  text-decoration: none
  color: #4ABC96
  margin-right 30px
  &:hover
    color: @color
    text-decoration: none
    cursor: pointer

.new-link
  text-decoration: none
  color: #FF6161
  margin-right 30px
  &:hover
    color: @color
    text-decoration: none
    cursor: pointer

.log-out
  text-decoration: none
  color:#0a78c9
  margin-right 20px
  &:hover
    color: @color
    text-decoration: none
    cursor: pointer

@media (max-width : 768px) 
  .text-element
    display none
  
</style>
