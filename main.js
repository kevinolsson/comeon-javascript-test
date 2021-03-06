// - - - Big three
const loginScreen = document.querySelector('.login');
const casinoScreen = document.querySelector('.casino');
const ingameScreen = document.querySelector('.ingame');

// Login status
let loginStatus = false;

// - - - 
// Login screen related
// const loginUiTemplate = loginScreen.cloneNode(true);

const login = function(username, secret) {
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
      // success!
      loginStatus = true; 
      successLogin(json.player); // log the player in
    } else {
      // return the necessary error message
      errorLogin();
    }
  });
}

const logout = function(username) {
  fetch('http://localhost:3001/logout', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username
    })
  })
  .then(response => response.json())
  .then(json => {
    loginStatus = false;
    loginScreen.style.display = 'block';
    casinoScreen.style.display = 'none';
    resetSearchForm();
  })
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
  resetLoginForm();

  // bind logout
  casinoScreen.querySelector('.button.logout').addEventListener('click', function(e) {
    logout(`${player.username}`);
  });
}

const errorLogin = function() {
  // throw an error on the form if login fails
  if(!document.querySelector('.invalid-credentials')) {
    let errorUi = document.createElement('div');
    errorUi.innerHTML = '<h3>Incorect credentials!</h3>';
    errorUi.className = 'field invalid-credentials';

    let hook = loginScreen.querySelector('.ui > form > .fields > .field');
    hook.parentNode.insertBefore(errorUi, hook);
  }
}

const resetLoginForm = function() {
  // reset inputs
  let inputs = loginScreen.querySelectorAll('input');
  inputs.forEach(function(input) {
    if(input.value !== "Login")
      input.value = '';
  });

  // remove error message if needed
  if(document.querySelector('.invalid-credentials')) {
    document.querySelector('.invalid-credentials').remove();
  }
}

// form submit event listener
loginScreen.querySelector('.ui > form').addEventListener('submit', function(e) {
  e.preventDefault();

  let payload = {};
  let inputs = loginScreen.querySelectorAll('input');
  inputs.forEach(function(input) {
    payload[input.name] = input.value;
  });

  login(payload.username, payload.password);
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

const updateGameUi = function(params = null) {
  fetch('http://localhost:3001/games?' + params, { method: 'get' })
  .then(response => response.json())
  .then(json => {
    console.log(json);
    let gameUi = casinoScreen.querySelector('.ui.game.items');
    let gameItem = gameUiTemplate.querySelector('.game.item'); // original to be cloned
    gameUi.innerHTML = null;

    json.forEach(function(game) {
      // clone original, edit its content, then append to gameUi
      let clone = gameItem.cloneNode(true);
      clone.querySelector('.image > img').src = game.icon;
      clone.querySelector('.content > .header').innerHTML = game.name;
      clone.querySelector('.content > .description').innerHTML = game.description;
      clone.querySelector('.content > .extra > .play').setAttribute('onClick', `launchGame('${game.code}')`);
      gameUi.appendChild(clone);
    })
  });
}

const updateCategoryUi = function() {
  fetch('http://localhost:3001/categories', { method: 'get' })
  .then(response => response.json())
  .then(json => {
    console.log(json);
    let categoryUi = casinoScreen.querySelector('.ui.category.items');
    let categoryItem = categoryUi.querySelector('.category.item');
    categoryUi.innerHTML = null;

    json.forEach(function(category) {
      let clone = categoryItem.cloneNode(true);
      clone.querySelector('.content > .header').innerHTML = category.name;
      clone.querySelector('.content > .header').setAttribute('onClick', `updateGameUi('categoryIds_like=${category.id}')`);
      categoryUi.appendChild(clone);
    });
  });
}

const resetSearchForm = function() {
  casinoScreen.querySelector('.search > input').value = '';
}

casinoScreen.querySelector('.search > input').addEventListener('keyup', function(e) {
  // get value
  let value = casinoScreen.querySelector('.search > input').value;
  updateGameUi(`name_like=${value}`);
});

// - - -
// Game related screen
const ingameUiTemplate = ingameScreen.cloneNode(true);

const launchGame = function(code) {
  if(loginStatus) {
    casinoScreen.style.display = 'none';
    ingameScreen.style.display = 'block';
    comeon.game.launch(code);

    ingameScreen.querySelector('.button.secondary').addEventListener('click', function(e) {
      leaveGame();
    });
  }
}

const leaveGame = function() {
  casinoScreen.style.display = 'block';
  ingameScreen.style.display = 'none';

  // reset login screen
  ingameScreen.innerHTML = ingameUiTemplate.innerHTML;  
}


