<template lang="pug">
  section
    form
      .form-group.row
        label.offset-md-2.col-md-2.col-form-label(for='staticEmail') Email
        .col-md-6
          input#staticEmail.form-control-plaintext(type='text' readonly='' v-bind:value='userEmail')
      .form-group.row
        label.col-md-2.offset-md-2.col-form-label(for='username') Name
        .col-md-6
          input#username.form-control(v-model= "userName" type='text' placeholder='Ex: Jon Doe' required)
      .form-group.row
        label.col-md-2.offset-md-2.col-form-label(for='homeworkId') Homework
        .col-md-6
          input#homeworkId.form-control(v-model= "homeworkId" type='text' placeholder='Homework id' required)
          span.text-danger(v-if="showErrorMessage") Your homework id is incorrect
      button.btn.btn-primary.offset-md-2(@click="enrol()") Enrol to homework

</template>
<script lang="js">
export default  {
  data: function() {
    return {
      userId: '',
      userType: '',
      userEmail: '',
      userName: '',
      homeworkId: '',
      showErrorMessage: false
    }
  },
  created: async function() {
    this.userId = window.localStorage.getItem("user");
    this.userType = window.localStorage.getItem("type");
    try {
      const url = "/student/" + this.userId;
      const response = await this.http.get(url);
      this.userEmail = response.data.email;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    enrol: async function () {
    const url = "/homework/" + this.homeworkId + "/addStudent";
      try{
      const response = await this.http.post(url, {
        userId: this.userId,
        userEmail: this.userEmail,
        userName: this.userName,
      });
      this.$router.push("/homework");
      } catch(error) {
        this.showErrorMessage = true;
        console.log(error);
      }
    }
  }
}
</script>
<style lang="stylus" src="./enrol.styl" scoped>
  @import "//maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
</style>
