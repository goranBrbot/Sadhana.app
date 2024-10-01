import webPush from "web-push";

// Generirajte VAPID ključeve
const vapidKeys = webPush.generateVAPIDKeys();
console.log("VAPID Keys:", vapidKeys);
