$(function () {
  loaderMethods.remove();

  function checkPasswords() {
    const passOne = $('#inputPassword');
    const passTwo = $('#inputPassword2');

    if (passOne.val() !== passTwo.val()) {
      passOne.val('');
      passTwo.val('');
    }
  }

  $('#account-form').on('submit', function (e) {
    e.preventDefault();

    checkPasswords();

    $(this).addClass('was-validated');
  });
});
