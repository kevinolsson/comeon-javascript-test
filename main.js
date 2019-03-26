// - - - Big three
const loginScreen = document.querySelector('.login');
const casinoScreen = document.querySelector('.casino');
const ingameScreen = document.querySelector('.inage');

// - - - 
// Login screen related
const loginUiTemplate = loginScreen.cloneNode(true);

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

  // update casino ui
  updatePlayerUi(player)
  updateGameUi();
  updateCategoryUi();

  // reset login screen
  loginScreen.innerHTML = loginUiTemplate.innerHTML;
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

// Form submit event listener
loginScreen.querySelector('.ui > form').addEventListener('submit', function(e) {
  e.preventDefault();

  let payload = {};
  let inputs = loginScreen.querySelectorAll('input');
  inputs.forEach(function(input) {
    payload[input.name] = input.value;
  });

  handleLogin(payload.username, payload.password);
});


// - - -
// Casino screen related
const playerUiTemplate = casinoScreen.querySelector('.player').cloneNode(true);
const gameUiTemplate = casinoScreen.querySelector('.ui.game.items').cloneNode(true);
const categoryUiTemplate = casinoScreen.querySelector('.ui.category.items').cloneNode(true);

const updatePlayerUi = function(player) {
  // update user elements
  let playerUi = casinoScreen.querySelector('.player');
  playerUi.querySelector('.image').src = player.avatar
  playerUi.querySelector('.content > .header').innerHTML = player.name;
  playerUi.querySelector('.content > .description').innerHTML = player.event;
}

const updateGameUi = function() {
  fetch('http://localhost:3001/games', { method: 'get' })
  .then(response => response.json())
  .then(json => {
    console.log(json);
    let gameUi = casinoScreen.querySelector('.ui.game.items');
    let gameItem = gameUi.querySelector('.game.item'); // original to be cloned
    gameUi.innerHTML = null;

    json.forEach(function(game) {
      // clone original, edit its content, then append to gameUi
      let clone = gameItem.cloneNode(true);
      clone.querySelector('.image > img').src = game.icon;
      clone.querySelector('.content > .header').innerHTML = game.name;
      clone.querySelector('.content > .description').innerHTML = game.description;
      gameUi.appendChild(clone);
    })
  });
}

const updateCategoryUi = function() {
  fetch('http://localhost:3001/categories', { method: 'get' })
  .then(response => response.json())
  .then(json => {
    console.log(json);
  });
}