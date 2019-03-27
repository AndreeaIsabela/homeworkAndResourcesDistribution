<template lang="pug">
  div
    .login-html
      input#tab-1.sign-in(type='radio' name='tab' checked='')
      label.tab(for='tab-1') Sign In
      input#tab-2.sign-up(type='radio' name='tab')
      label.tab(for='tab-2') Sign Up
      .login-form
        .sign-in-htm
          .group
            label.label(for='email') Email
            input.input(type='email' v-model="login.email")
          .group
            label.label(for='pass') Password
            input.input(type='password' data-type='password' v-model="login.password" v-on:change="message=''")
            .text-center
              p.text-danger.error-message(v-if="message") {{message}}
          form
            input#student.check(type='radio' name="type" value="teacher" v-on:click="type = 'student'") 
            span Student
            input#teacher.check(type='radio' name="type" value="teacher" v-on:click="type = 'teacher'") 
            span Teacher
          .group
            button.button(v-on:click="logIn()" value='Sign In') Sign In
          .hr
          .foot-lnk
            a(href='#forgot') Forgot Password?

        .sign-up-htm
          .group
            label.label(for='user') Username
            input.input(type='text' v-model="register.username")
          .group
            label.label(for='pass') Password
            input.input(type='password' data-type='password' v-model="register.password")
          .group
            label.label(for='pass') Email Address
            input.input(type='text' v-model="register.email")
          form
            input#student.check(type='radio' name="type" value="student" v-on:click="type = 'student'") 
            span Student
            input#teacher.check(type='radio' name="type" value="teacher" v-on:click="type = 'teacher'") 
            span Teacher
          .group
            button.button(type='submit' value='Sign Up' v-on:click="registerUser()") Sign Up


  //- section
  //-   h2.font-weight-bold  Log In: 
  //-   .form-group
  //-     input.form-control.input#input-password(type="password" v-model="password" v-on:keyup.enter="login" v-on:change="message=''" placeholder="password" autofocus)
  //-   .text-center
  //-     p.text-danger.error-message(v-if="message") {{message}}
  //-   .form-group.text-right
  //-     button#login.btn.btn-def(@click="login") Continue
</template>

<script lang="js">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios from "axios";
Vue.prototype.$http = axios;
export default  {
  data(){
    return{
      login : {
        password: '',
        email: ''
      },
      type: 'student',
      register: {
        password: '',
        username: '',
        email: ''
      },
      message: ''
    }
  },
 methods:{
   logIn: async function() {
    try {
      const response = await this.http.post("/" + this.type + "/login", {
        password: this.login.password,
        email: this.login.email
      });
      const token = response.data.token;
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("type", this.type);
      if (token) {
        const AUTH_TOKEN = "Bearer " + token;
        this.http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
        this.$parent.$emit("loggedin", true);
        this.$parent.$emit("" + this.type, true);
      }
      this.$router.push("/"+ this.type);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.message = "The password or email are incorrect.";
      } else {
        this.message ="Please verify if your authorisation is valid."
      }
      console.log(error);
    }
  },
  registerUser: async function(){
    try {
      const response = await this.http.post("/" + this.type + "/register", {
        password: this.register.password,
        username: this.register.username,
        email: this.register.email
      });
      const token = response.data.token;
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("type", this.type);
      if (token) {
        const AUTH_TOKEN = "Bearer " + token;
        this.http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
        this.$parent.$emit("loggedin", true);
        this.$parent.$emit("" + this.type, true);
      }
      this.$router.push("/"+ this.type);
    } catch (error) {
      // if (error.response && error.response.status === 401) {
      //   this.message = "Invalid password.";
      // }
      console.log(error);
    }
  }
 }
}
</script>

<style lang="stylus" scoped>

.error-message 
  align-self center
  color #FFFFFF
  margin 1%

body
  margin 0
  color #6a6f8c
  font 600 16px/18px 'Open Sans',sans-serif

*,:after,:before
  box-sizing border-box

.clearfix:after,.clearfix:before
  content ''
  display table

.clearfix
  &:after
    clear both
    display block
form
  input 
    margin 30px
    span 
      margin-left 10px
a
  color inherit
  text-decoration none

.login-html
  background-color rgba(40,57,101,.9)
  width 100%
  height 100%
  position absolute
  padding 10% 20%
  .tab
    font-size 22px
    margin-right 15px
    padding-bottom 5px
    margin 0 15px 10px 0
    display inline-block
    border-bottom 2px solid transparent
  .sign-in
    &:checked
      & + .tab
        & + .sign-up
          & + .tab
            & + .login-form
              .sign-in-htm
                transform rotate(0)
  .sign-up
    &:checked
      & + .tab
        & + .login-form
          .sign-up-htm
            transform rotate(0)

.login-html .sign-in-htm,
.login-html .sign-up-htm
  top 0
  left 0
  right 0
  bottom 0
  position absolute
  transform rotateY(180deg)
  backface-visibility hidden
  transition all .4s linear

.login-html .sign-in,
.login-html .sign-up,
.login-form .group .check
  display none

.login-html .tab,
.login-form .group .label,
.login-form .group .button
  text-transform uppercase

.button
  outline none
  
.login-html .sign-in:checked + .tab,
.login-html .sign-up:checked + .tab
  color #fff
  border-color #1161ee

.login-form
  min-height 345px
  position relative
  perspective 1000px
  transform-style preserve-3d
  .group
    margin-bottom 15px
    input[data-type="password"]
      text-security circle
      -webkit-text-security circle
    .label
      color #aaa
      font-size 12px
    .button
      background #1161ee
    label
      .icon
        width 15px
        height 15px
        border-radius 2px
        position relative
        display inline-block
        background rgba(255,255,255,.1)
        &:before
          left 3px
          width 5px
          bottom 6px
          transform scale(0) rotate(0)
        &:after
          top 6px
          right 0
          transform scale(0) rotate(0)
    .check
      &:checked
        & + label
          color #fff
          display block
          .icon
            background #1161ee
            &:before
              transform scale(1) rotate(45deg)
            &:after
              transform scale(1) rotate(-45deg)

.login-form .group .label,
.login-form .group .input,
.login-form .group .button
  width 100%
  color #fff
  display block

.login-form .group .input,
.login-form .group .button
  border none
  padding 15px 20px
  border-radius 25px
  background rgba(255,255,255,.1)

.login-form .group label .icon:before,
.login-form .group label .icon:after
  content ''
  width 10px
  height 2px
  background #fff
  position absolute
  transition all .2s ease-in-out 0s

.hr
  height 2px
  margin 60px 0 50px 0
  background rgba(255,255,255,.2)

.foot-lnk
  text-align center
</style>
