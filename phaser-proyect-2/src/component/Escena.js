import Phaser from 'phaser';
class Escena extends Phaser.Scene {
    platform = null;
    player = null;
    cursors = null;
    anims = null;
    stars = null;
    collectStar = null;
    score = 0;
    scoreText;
    bombs = null;
    bomb = null;
    preload() {
        this.load.image('sky', 'img/sky.png');
        this.load.image('ground', 'img/platform.png');
        this.load.image('star', 'img/star.png');
        this.load.image('bomb', 'img/bomb.png');
        this.load.spritesheet('dude',
            'img/dude.png',//la imagen dude mide 288x48 y contiene 9 sprites en una sola fila
            { frameWidth: 32, frameHeight: 48 }//por lo tanto cada frame de sprites seria 288/9=32 y como esta en una sola fila la altura es solo 48
        );
    }
    create() {// la creacion y carga de imagenes se hace en el orden en la que se codifica
        this.add.image(400, 300, 'sky');
        //se declara a la variable plataformas como u grupo Estatico(para que no pueda moverse)
        this.platform = this.physics.add.staticGroup();
        //plataforma base
        this.platform.create(400, 568, 'ground').setScale(2).refreshBody();//(posX,posY,nombre de objeto).
        //otras Plataformas
        this.platform.create(600, 400, 'ground');
        this.platform.create(50, 250, 'ground');
        this.platform.create(750, 220, 'ground');
        //creando al player
        this.player = this.physics.add.sprite(100, 250, 'dude');
        //rebote y el choque contra algo
        this.player.setBounce(0.2);//cuidado a la hora del uso de comas o puntos
        this.player.setCollideWorldBounds(true);
        //animaciones de player
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10, //se ejecuta a una velocidad de 10 fotogramas por segundo.
            repeat: -1 //El valor'repeat -1' indica que la animación debe volver a empezar cuando termine.
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        /**PARA HACER QUE SE MUEVA SE TRABAJA EN EL UPDATE */
        //se crea la fisica de colision entre el player y la plataforma
        this.physics.add.collider(this.player, this.platform);
        //Esta línea crea el objeto 'cursors' con cuatro propiedades: up, down, left, right 
        this.cursors = this.input.keyboard.createCursorKeys();

        //ESTRELLAS
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        //recorre todos los elementos del grupo y le da a cada uno un valor de rebote de Y aleatorio entre 0,4 y 0,8.
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });
        this.physics.add.collider(this.stars, this.platform);
        //comprobar si el personaje se superpone con alguna estrella
        //Si tienen contacto, se ejecuta la función 'collectStar'(fuera del creae y update) pasándole los dos objetos implicados:
        this.physics.add.overlap(this.player, this.stars, this.collectStars, null, this);

        /**TEXTO EN PANTALLA */
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        /**ENEMIGOSSS */
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platform);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    };

    update() {
        //si presiona la tecla left 
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);//se reduce su posicion en X

            this.player.anims.play('left', true);//y se reproducira la animacion con nombre "left"
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }
        // si la tecla UP esta presionada y si el jugador esta tocando el suelo
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-200);
        }
    };
    collectStars(player, star) {
        //se desactiva el cuerpo físico de la estrella y con esto se vuelve inactiva e invisible, 
        //lo que la elimina de la pantalla.
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        //Si se han recolectado todas,restablecer su posición Y a cero.
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });
            /*Primero elegimos una coordenada X aleatoria, siempre en el lado opuesto a donde 
       se encuentra el personaje para darle una oportunidad.**/
            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            // Luego se crea la bomba, se indica que no se pueda salir del mundo, que rebota y que 
            //tiene una velocidad aleatoria.
            this.bomb = this.bombs.create(x, 16, 'bomb');
            this.bomb.setBounce(1);
            this.bomb.setCollideWorldBounds(true);
            this.bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        }

    }
    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOver = true;
    }
} export default Escena;
