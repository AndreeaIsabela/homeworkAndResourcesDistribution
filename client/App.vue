<template>
  <div id="link">
    <navigation v-bind:loggedin="loggedin" v-bind:student="student" v-bind:teacher="teacher"></navigation>
     <main class="containet-fluid">
      <router-view></router-view>
    </main>
  </div>
</template>
<script>
import navigation from "./components/navigation/navigation";
export default {
  components: {
    navigation: navigation
  },
  data: function(){
    return{
    loggedin: false,
    teacher: false,
    student: false
    }
  },
  mounted: function() {
    const token = window.localStorage.getItem("token");
    const type = window.localStorage.getItem("type");
    if (type === "student") {
      this.student = true;
    } else if(type === "teacher") {
      this.teacher = true;
    }
    if (token) {
      this.loggedin = true;
    }
    this.$on("loggedin",() =>  {
      this.loggedin = true;
    });
    this.$on("student",() =>  {
      this.student = true;
    });
    this.$on("teacher",() =>  {
      this.teacher = true;
    });
  }
};
</script>
<style lang="stylus">
body 
  font-family: 'Roboto', 'Arial', 'Helvetica', sans-serif
  background-color: #FCFCFC

h2 
  margin-bottom: 10%
  color: #404249

h3
  margin-bottom: 1%
  color: #404249

.title 
  margin-top: 50px

.input 
  border-radius: 10rem

.btn-def 
  align-content: center
  background-color: #5FC2FF
  color: #FFFFFF
  border: none
  border-radius: 10rem
  box-shadow: 0 0.1rem 1rem 0 rgba(95, 194, 255, 0.4)
  transition-property: box-shadow
  transition-duration: 0.3s
  transition-timing-function: ease-in
  transition-delay: initial
  font-size: 1.2rem
  font-weight: 30
  font-style: normal
  text-decoration: none
  
</style>

