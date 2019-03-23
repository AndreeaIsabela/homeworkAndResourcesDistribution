<template lang="pug">
  nav.navbar.navbar-expand-sm.navigation
    .container
      router-link.navbar-brand(to="/home")
        p Uploader
    
      .justify-content-between(v-if="loggedin")
        router-link.nav-item.new-link(to="/login" v-if="student")
          span.text-element Student
          
        router-link.nav-item.new-link(to="/login" v-if="teacher")
          span.text-element Teacher
          
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
.navigation 
  background-color: #060813

.ai-logo-svg 
  height: 2.5rem
  margin-top: -.85rem
  shape-rendering: geometricPrecision

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
