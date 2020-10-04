const ComfyJS = require('comfy.js');


// All commands here!
ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if (command === 'test') {
        ComfyJS.Say(`@${user} Test has been triggered.`);
    }
    if (command === 'streamergoods') {
        ComfyJS.Say('https://www.streamergoods.com');
    }
    if (command === 'website') {
        ComfyJS.Say('https://www.stijnelskens.com');
    }
}

ComfyJS.onRaid = (user, viewers, extra ) => {
    ComfyJS.Say(`Thanks for the raid. ${user}`);
}

ComfyJS.Init(process.env.TWITCHUSER, process.env.OAUTH);