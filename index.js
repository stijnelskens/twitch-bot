const ComfyJS = require('comfy.js');

const PAUZE_DURATION = 30 * 1000;
const DISPLAY_DURATION = 10 * 1000;

const alertContainer = document.querySelector('.alert-container');
const img = new Image();
const queue = new Queue();

// Sounds
const veryNice = new Audio('/sounds/verynice.mp3');
const hello = new Audio('/sounds/hello.mp3');
const myMan = new Audio('/sounds/myman.mp3');

const wait = async duration => {
    return new Promise(resolve => setTimeout(resolve, duration));
};


// All chatbot commands here!
ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if (command === 'test') {
        ComfyJS.Say(`@${user} Test has been triggered.`);
    }
    if (command === 'lurk') {
      ComfyJS.Say(`@${user} Thanks for the lurk!`);
  }
    if (command === 'streamergoods') {
        ComfyJS.Say('https://www.streamergoods.com');
    }
    if (command === 'website') {
        ComfyJS.Say('https://www.stijnelskens.com');
    }
}

ComfyJS.onRaid = (user, viewers, extra ) => {
    ComfyJS.Say(`Thanks for the raid. @${user} with ${viewers} viewers.`);
    // new alert(user,);
}

ComfyJS.onJoin = (user) => {
    ComfyJS.Say(`Welcome to the stream. ${user}`);
}

function alert(user, gif, audio, type) {
    queue.add(async () => {
      audio.play();
      alertContainer.innerHTML = `
        <h1 class="text-shadows">${user + generateTitle[type]}</h1>
        <img src="${gif}" />
      `;
      alertContainer.style.opacity = 1;
  
      await wait(DISPLAY_DURATION);
  
      if (!queue.isLooping) {
        alertContainer.style.opacity = 0;
      }
  
    });
  }

ComfyJS.Init(process.env.TWITCHUSER, process.env.OAUTH);