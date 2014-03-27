(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#showRegister').click(toggleRegister);
    $('#showLogin').click(toggleLogin);
  }

  function toggleRegister(){
    if($('#registerBox:hidden').length){
      $('#loginBox').hide();
      $('#registerBox').show(401);
    }else{
      $('#registerBox').hide(200);
    }
  }

  function toggleLogin(){
    if($('#loginBox:hidden').length){
      $('#registerBox').hide();
      $('#loginBox').show(401);
    }else{
      $('#loginBox').hide(200);
    }
  }
})();

