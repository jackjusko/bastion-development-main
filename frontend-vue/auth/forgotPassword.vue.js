/* POST /forgotPassword. Always treats the request as successful. */
var forgotPasswordTemplate = `
<div class="w95">
	<h1 class="underProfilePic" style="margin-top: 8rem;">Forgot Password</h1>
	<h1 class="b-acctop" style="font-size: 1.25rem; font-weight: 500; max-width: 600px; margin: 0 auto 2rem auto; text-align: center;">Enter your email below, and we'll send you a link to reset your password if the email corresponds to a valid Bastion account.</h1>
	<input class="input b-textinput" type="text" v-model="email" placeholder="Enter your email here." style="max-width: 500px; margin: 0 auto; display: block;"/>
	<br /><br />
	<button class="button b-button" v-bind:disabled="sent" style="border: none; width: 100%; max-width: 200px; margin: 0 auto; display: block;" v-on:click="resetPassword()">Send</button>
	<h1 class="b-acctop" style="font-size: 1.25rem; font-weight: 500; text-align: center; margin-top: 1rem;" v-show="sent">Your reset password request has been successfully submitted.</h1>
</div>
`;


var forgotPassword = {
  template: forgotPasswordTemplate,
  data: function(){
    return{
		email: "",
		sent: false
    }
  },
  methods:{
	resetPassword: function(){
		axios.post("/forgotPassword", {email: this.email}).then(res => {
			this.sent = true;
		});
	}
  }
 }