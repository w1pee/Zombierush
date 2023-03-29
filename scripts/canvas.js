var canvas = document.getElementById("test");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext("2d");

ctx.fillStyle = "#000000";

ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#ffffff";

ctx.fillRect(100, 100, 100, 100);