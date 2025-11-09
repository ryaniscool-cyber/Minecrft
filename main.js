console.log("✅ main.js loaded!");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Draw blue background
ctx.fillStyle = "dodgerblue";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw red square
ctx.fillStyle = "red";
ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);

// Label
ctx.fillStyle = "white";
ctx.font = "20px sans-serif";
ctx.fillText("main.js executed successfully!", 20, 60);
