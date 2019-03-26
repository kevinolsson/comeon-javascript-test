const loginScreen = document.querySelector('.login');
const casinoScreen = document.querySelector('.casino');
const ingameScreen = document.querySelector('.inage');


loginScreen.querySelector('.ui > form').addEventListener('submit', function(e) {
  e.preventDefault();

  let payload = {};
  let inputs = loginScreen.querySelectorAll('input');
  inputs.forEach(function(input) {
    payload[input.name] = input.value;
  })

  handleLogin(payload.username, payload.password);

});


const handleLogin = function(username, secret) {
  // make a request
  fetch('http://localhost:3001/login', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: secret
    })
  })
  // do something with said request
  .then(response => response.json())
  .then(json => {
    console.log(json);
    if(json.status === 'success') {
      // success, login the player
      successLogin(json.player);
    } else {
      // return the necessary error message
      errorLogin();
    }
  });
}

const successLogin = function(player) {
  // update screen
  loginScreen.style.display = 'none';
  casinoScreen.style.display = 'block';

  // update user elements
  let playerUi = document.querySelector('.player');
  playerUi.querySelector('.image').src = player.avatar
  playerUi.querySelector('.content > .header').innerHTML = player.name;
  playerUi.querySelector('.content > .description').innerHTML = player.event;

}

const errorLogin = function() {
  if(!document.querySelector('.invalid-credentials')) {
    let errorUi = document.createElement('div');
        errorUi.innerHTML = '<h3>Incorect credentials!</h3>';
        errorUi.className = 'field invalid-credentials';

    let hook = loginScreen.querySelector('.ui > form > .fields > .field');
    hook.parentNode.insertBefore(errorUi, hook);
  }
}