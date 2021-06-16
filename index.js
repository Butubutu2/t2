function start() {
    game.gameStart();
}
function restart() {
    game.score = 0;
    document.getElementsByClassName("score_num")[0].innerText = 0;
    document.getElementsByClassName("time_num")[0].innerText = 0;
    game.gameStart();
}
var game = {
    time: 0,
    score: 0,
    area: 0,
    width: 0,
    height: 0,
    status: true,
    ecreatset: null,
    timeset: null,
    enemyArray: [],
    bulletArray: [],
    gameScore: function (s) {//处理分数并判断
        if (s >= 500) {
            game.score = 0;
            s = 0;
        } else if (s < 0) {
            game.gameover();
        }
        document.getElementsByClassName("score_num")[0].innerText = s;
    },
    gameTime: function () {
        game.timeset = setInterval(() => {
            var timenum = document.querySelector(".time_num");
            game.time = timenum.innerText;
            game.time++;
            timenum.innerText = game.time;
        }, 1000);
    },
    gameover: function () {
        game.status = false;
        document.querySelector(".shadow").style.display = "flex";
        document.querySelector(".start").style.display = "none";
        document.querySelector(".gameover").style.display = "flex";
        var rank = document.querySelector(".rank");
        if (game.time <= 30) {
            rank.innerText = "倔强青铜";
        } else if (game.time <= 60) {
            rank.innerText = "秩序白银";
        } else if (game.time <= 120) {
            rank.innerText = "荣耀黄金";
        } else if (game.time <= 240) {
            rank.innerText = "尊贵铂金";
        } else if (game.time <= 480) {
            rank.innerText = "永恒钻石";
        } else {
            rank.innerText = "最强王者";
        }
        document.querySelector(".flytimenum").innerText = game.time;
        clearInterval(game.timeset);
        clearInterval(game.ecreatset);
        for (let i = game.enemyArray.length - 1; i >= 0; i--) {
            game.enemyArray[i].disappear();
        }
        for (let i = game.bulletArray.length - 1; i >= 0; i--) {
            game.bulletArray[i].disappear();
        }
        game.area.onmousedown = null;
        game.area.onmousemove = null;
        game.area.removeChild(myplane.plane);
        myplane.plane = null;
    },
    creatEnemy: function () {
        game.ecreatset = setInterval(() => {
            var e = new Enemy(Math.random() * (game.width - 98), 0)
            game.enemyArray.push(e);
            e.creatEnemy();
            e.fly();
        }, 800);
    },
    gameStart: function () {
        game.status = true;
        document.querySelector(".shadow").style.display = "none";
        game.gameTime();
        game.area = document.querySelector(".gameArea");
        game.width = game.area.offsetWidth;
        game.height = game.area.offsetHeight;
        game.area.onmousedown = function () {
            myplane.bullet();
        }
        game.area.onmousemove = function (event) {
            if (!myplane.plane) {
                myplane.creatPlane();
            }
            game.area = document.querySelector(".gameArea");
            game.width = game.area.offsetWidth;
            game.height = game.area.offsetHeight;
            myplane.fly(event.offsetX, event.offsetY);
        }
        game.creatEnemy()
    },
}
var myplane = {
    left: 0,
    top: 0,
    plane: null,
    creatPlane: function () {
        var plane = document.createElement("div");
        plane.className = "me";
        game.area.appendChild(plane);
        myplane.plane = document.getElementsByClassName("me")[0];
    },
    fly: function (offsetX, offsetY) {
        myplane.left = parseInt(myplane.plane.style.left);
        myplane.top = parseInt(myplane.plane.style.top);
        if (offsetX > 53 && offsetX < game.width - 53) {
            myplane.plane.style.left = (offsetX - 53) + "px";
        }
        if (offsetY > 38 && offsetY < game.height - 38) {
            myplane.plane.style.top = (offsetY - 38) + "px";
        }
    },
    bullet: function () {
        if (!myplane.plane) {
            return;
        }
        var b = new Bullet(myplane.left + 48, myplane.top);
        game.bulletArray.push(b);
        b.creatBullet();
        b.fly();
    }
}
var bid = 0;
function Bullet(left, top) {
    bid++;
    this.id = "bullet" + bid;
    this.left = left;
    this.top = top;
    this.bflyset = null;
}
Bullet.prototype.creatBullet = function () {
    var bullet = document.createElement("div");
    bullet.className = "bullet";
    game.area.appendChild(bullet);
    bullet.id = this.id;
    bullet.style.left = this.left + "px";
    bullet.style.top = this.top + "px";
}
Bullet.prototype.fly = function () {
    var thisbullet = document.getElementById(this.id);
    this.bflyset = setInterval(() => {
        this.top -= 10;
        thisbullet.style.top = this.top + "px";
        if (this.top <= 0) {
            this.disappear();
        } else {
            this.isHit();
        }
    }, 30);
}
Bullet.prototype.disappear = function () {
    var thisbullet = document.getElementById(this.id);
    if (!thisbullet) {
        return;
    }
    clearInterval(this.bflyset);
    game.area.removeChild(thisbullet);
    for (let i = 0; i < game.bulletArray.length; i++) {
        if (game.bulletArray[i] == this) {
            game.bulletArray.splice(i, 1);
        }
    }
}
Bullet.prototype.isHit = function () {
    for (let i = 0; i < game.enemyArray.length; i++) {
        if (this.left >= game.enemyArray[i].left && this.left <= game.enemyArray[i].left + 98) {
            if (this.top >= game.enemyArray[i].top && this.top <= game.enemyArray[i].top + 76) {
                game.score += game.enemyArray[i].score;
                game.gameScore(game.score);
                this.disappear();
                var hitEid = game.enemyArray[i].id;
                document.getElementById(hitEid).style.background = 'url("./images/boom.gif") no-repeat';
                document.getElementById(hitEid).style.backgroundSize = 'contain';
                clearInterval(game.enemyArray[i].eflyset);//清除爆炸飞行
                game.enemyArray.splice(i, 1);
                setTimeout(() => {
                    game.area.removeChild(document.getElementById(hitEid));
                }, 500);
            }
        }

    }
}
var eid = 0;
function Enemy(left, top) {
    eid++;
    this.id = "enemy" + eid;
    this.left = left;
    this.top = top;
    this.eflyset = null;
    this.score = 0;
}
Enemy.prototype.creatEnemy = function () {
    var enemy = document.createElement("div");
    enemy.className = "enemy";
    var num = Math.floor(Math.random() * 3) + 1;
    switch (num) {
        case 1:
            this.score = 10;
            break;
        case 2:
            this.score = 20;
            break;
        case 3:
            this.score = 30;
            break;
    }
    var iteam = "e" + num;
    enemy.classList.add(iteam);
    game.area.appendChild(enemy);
    enemy.id = this.id;
    enemy.style.left = this.left + "px";
    enemy.style.top = this.top + "px";
}
Enemy.prototype.fly = function () {
    var thisenemy = document.getElementById(this.id);
    this.eflyset = setInterval(() => {
        this.top += 5;
        thisenemy.style.top = this.top + "px";
        if (this.top > game.height - 76) {
            game.score -= 5 * this.score;
            game.gameScore(game.score);
            clearInterval(this.eflyset);
            this.disappear()
        }
    }, 30);
}
Enemy.prototype.disappear = function () {
    var thisenemy = document.getElementById(this.id);
    if (!thisenemy) {
        return;
    }
    clearInterval(this.eflyset);
    game.area.removeChild(thisenemy);
    for (let i = 0; i < game.enemyArray.length; i++) {
        if (game.enemyArray[i] == this) {
            game.enemyArray.splice(i, 1);
        }
    }
}