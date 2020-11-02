const ComfyJS = require('comfy.js');
import Queue from 'queue';

const PAUZE_DURATION = 30 * 1000;
const DISPLAY_DURATION = 10 * 1000;

const alertContainer = document.querySelector('.alert-container');
const queue = new Queue();

// Sounds
const hello = new Audio('/sounds/hello.mp3');
const myMan = new Audio('/sounds/myman.mp3');
const veryNice = new Audio('/sounds/verynice.mp3');

// Gifs
const helloGif = '/gifs/hello.gif';
const myManGif = '/gifs/myman.gif';
const veryNiceGif = '/gifs/verynice.gif';

const wait = async duration => {
    return new Promise(resolve => setTimeout(resolve, duration));
};

// All chatbot commands here!
ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if (command === 'lurk') {
        ComfyJS.Say(`@${user} Thanks for the lurk!`);
    }
    if (command === 'lurkoff') {
        ComfyJS.Say(`@${user} Welcome back!`);
    }
    if (command === 'streamergoods') {
        ComfyJS.Say('https://www.streamergoods.com');
    }
    if (command === 'website') {
        ComfyJS.Say('https://www.stijnelskens.com');
        new alert(user, myManGif, myMan, command);
    }
}

ComfyJS.onSub = (user, message, subTierInfo, extra) => {
    ComfyJS.Say(`Thanks for the sub! @${user}`);
    new alert(user, myManGif, myMan, onSub);
}

ComfyJS.onResub = (user, message, streamMonths, cumulativeMonths, subTierInfo, extra) => {
    ComfyJS.Say(`Thanks for the resub! @${user}`);
    new alert(user, myManGif, myMan, onReSub, streamMonths);
}

ComfyJS.onSubGift = (gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra) => {
    new alert(gifterUser, myManGif, myMan, onSubGift, recipientUser);
}

ComfyJS.onCheer = (user, message, bits, flags, extra) => {
    new alert(user, veryNiceGif, veryNice, bits);
}

ComfyJS.onRaid = (user, viewers, extra) => {
    ComfyJS.Say(`Thanks for the raid. @${user} with ${viewers} viewers.`);
    // new alert(user,);
}

ComfyJS.onHosted = (user, viewers, autohost, extra) => {
    ComfyJS.Say(`Thanks for the raid. @${user} with ${viewers} viewers.`);
    // new alert(user,);
}

ComfyJS.Init(process.env.TWITCHUSER, process.env.OAUTH);


const generateTitle = {
    onSub: " subscribed!",
    onReSub: " resubscribed!",
    onSubGift: " gifted a sub to",
    onCheer: " cheered ",
    onRaid: " raided the stream with ",
    onHosted: " hosted the stream with ",
};

function alert(user, gif, audio, type) {
    console.log(gif);

    // queue.add(() =>
    queue.add(async () => {
        console.log('testt komen we hier?');
        audio.play();
        container.innerHTML = `
            <h1 class="text-shadows">${user + generateTitle[type]}</h1>
            <img src="${gif}" />
        `;
        container.style.opacity = 1;
        
        await wait(DISPLAY_DURATION);

        if (!queue.isLooping) {
            container.style.opacity = 0;
        }

    });
}