var Interface = function() {

    ctx.font = "25pt 'Impact'";

};

Interface.prototype.drawLife = function(life)
{
    ctx.save();

    var img = new Image();
    img.src = "../Frogger/images/Heart.png";

    ctx.scale(.6, .6);

    for (var i = 0; i < life; i++) {
        ctx.beginPath();
        ctx.translate(100, 0);
        ctx.drawImage(img, -100, 40);
        ctx.fill();

    }
    ctx.restore();
};

Interface.prototype.renderTimeLeft = function(timeLeft)
{

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.textAlign = "left";
    ctx.fillText("Time: " + timeLeft.toString(),
        25, ctx.canvas.height - 25);

};

Interface.prototype.renderScore = function(score)
{

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.textAlign = "right";
    ctx.fillText("Score: "+ score,
        ctx.canvas.width - 25, ctx.canvas.height - 25);

};