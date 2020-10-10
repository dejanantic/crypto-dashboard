$(function () {
  loaderMethods.remove();

  $.validator.setDefaults({
    errorElement: 'div',
    errorClass: 'is-invalid',
    validClass: 'is-valid',
    errorPlacement(error, element) {
      error.addClass('invalid-feedback');
      element.closest('.form-group').append(error);
    },
    highlight(element, errorClass, validClass) {
      $(element).addClass(errorClass);
    },
    unhiglight(element, errorClass, validClass) {
      $(element).removeClass(errorClass);
    },
  });

  $('#account-form').validate({
    rules: {
      fname: 'required',
      lname: 'required',
      email: {
        required: true,
        email: true,
      },
      password1: {
        required: true,
        minlength: 6,
      },
      password2: {
        required: true,
        minlength: 6,
        equalTo: '#inputPassword',
      },
      city: 'required',
      country: 'required',
    },
    messages: {
      fname: 'Please provide a name',
      lname: 'Please provide a last name',
      email: 'Please provide a valid email',
      city: 'Please provide a city',
      country: 'Please provide a country',
    },
    submitHandler() {
      $('#account-form').trigger('reset');
      $('input').removeClass(['is-valid', 'is-invalid']);
    },
  });
});
