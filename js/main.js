/** Função de start do jogo */
function start() { 

    // Oculta a div inicio
	$("#inicio").hide(); 
	
    // Cria as divs de personagens
	$("#fundo-game").append("<div id='jogador' class='anima1'></div>"); // Cria novas divs
	$("#fundo-game").append("<div id='inimigo1' class='anima2'></div>");
	$("#fundo-game").append("<div id='inimigo2' class='anima-enemycar'></div>");
	$("#fundo-game").append("<div id='amigo' class='anima-frienddog'></div>");
    $("#fundo-game").append("<div id='placar'></div>");
    $("#fundo-game").append("<div id='energia'></div>");

    // Principais variaveis do jogo
    var jogo = {}
    var TECLA = {
        W: 87,
        S: 83,
        D: 68
    }
    jogo.pressionou = [];
    var velocidade = 5; // Velocidade de movimento do inimigo
    var posicaoY = parseInt(Math.random() * 334); // Encontra um valor random entre 0 e 334
    var podeAtirar = true;
    var fimdejogo = false;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual = 3;

    // Pega os sons do jogo
    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    // Música em loop
    // Insere um evento na variavel musica. Quando identifica o fim da musica, toca novamente.
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false); 
    musica.play();


    // Verifica se o usuário pressionou alguma tecla
	// Se tecla pressionada, true
    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });
    
    // Se tecla solta, false
    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });

    // Game loop    	
	jogo.timer = setInterval(loop,30); // Chamo a função loop a cada 30 milissegundos
	
	function loop() {
	    moveFundo();	
        moveJogador();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
        colisao();
        placar();
        energia();
	} 

    function moveFundo() {
        // Pego a posicao do background da div e transformo em um int
        esquerda = parseInt($("#fundo-game").css("background-position"));
        // Subtrai 1 pixel para o fundo estar sempre em movimento 
        $("#fundo-game").css("background-position",esquerda-1);
    }

    function moveJogador() {
        if (jogo.pressionou[TECLA.W]) {
            var topo = parseInt($("#jogador").css("top")); // Pega o valor do atributo "top" da div jogador
            $("#jogador").css("top",topo-10); // Sobe 10 pixels
            
            // Se a propriedade "top" for menor ou igual a zero, sempre soma 10 para não ultrapassar as divs
            if (topo<=50) {
                $("#jogador").css("top",topo+10);
            }
        }
        
        if (jogo.pressionou[TECLA.S]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo+10);	
            if (topo>=434) {	
                $("#jogador").css("top",topo-10);
                    
            }
        }
        
        if (jogo.pressionou[TECLA.D]) {
            //Chama função disparo	
            disparo();
        }
    
    }

    function moveInimigo1() {
        posicaoX = parseInt($("#inimigo1").css("left")); // Pega a posicao "left" da div inimigo1
        $("#inimigo1").css("left",posicaoX-velocidade); // Subtrai a velocidade, fazendo-o caminhar para a esquerda
        
        $("#inimigo1").css("top",posicaoY); // Pega a posicao "top" da div
        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334); // Gera um numero random para posicionar o inimigo
            $("#inimigo1").css("left",694); // Posiciona para o inicio do eixo X
            $("#inimigo1").css("top",posicaoY);  // Posiciona para posicao randomica do eixo Y   
        }
    }

    function moveInimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left")); // Pega posicao X do inimigo pela propriedade "left"
	    $("#inimigo2").css("left",posicaoX-3); // Subtrai 3 para caminhar 3 pixels para a esquerda
		if (posicaoX<=0) { // Quando variavel for igual a zero, reposiciona para o inicio
		    $("#inimigo2").css("left",775);		
		}
    }

    function moveAmigo() {
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",posicaoX+1);
                    
        if (posicaoX>906) {    
            $("#amigo").css("left",0);
        }
    }

    function disparo() {
	
        if (podeAtirar == true) {   
            // Nao pode atirar novamente enquanto o tiro nao percorrer toda a tela
            podeAtirar = false;
            // Precisa saber a posicao atual do helicoptero quando foi realizado o disparo
            topo = parseInt($("#jogador").css("top"))
            posicaoX= parseInt($("#jogador").css("left"))
            // Posicoes do disparo
            tiroX = posicaoX + 190;
            topoTiro=topo+37;
            // Cria a div do disparo na posicao 
            $("#fundo-game").append("<div id='disparo'></div");
            $("#disparo").css("top",topoTiro);
            $("#disparo").css("left",tiroX);
            
            var tempoDisparo=window.setInterval(executaDisparo, 30);
        }

        // Faz o disparo andar na tela
        function executaDisparo() {
            somDisparo.play();
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left",posicaoX+15); 
    
            if (posicaoX>900) {                
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;      
            }
        }
    } // Fim da funcao disparo()

    function colisao() {
        // Verifica se as divs colidiram com a funcao do jQuery collision
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));
    
        // Jogador com inimigo1
        // Se a variavel colisão tiver informacoes, eh porque colidiu
        if (colisao1.length>0) {
            energiaAtual--; // Jogador perde energia

            // Pega a posicao X e Y do inimigo, para aparecer a explosao no lugar dele
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y); // Chama animacao da explosao
        
            // Reposiciona o inimigo
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }

        // Jogador com inimigo2
        if (colisao2.length>0) {
            energiaAtual--; // Jogador perde energia
            velocidade += 0.3; // Inimigo fica mais rápido para aumentar dificuldade do jogo
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);
            $("#inimigo2").remove();
            reposicionaInimigo2();
        }	

        // Disparo com inimigo1 
        if (colisao3.length > 0) {
            pontos += 100; // Ganha 100 pontos quando matar inimigo1
            velocidade += 0.3; // Inimigo fica mais rápido para aumentar dificuldade do jogo
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);
            $("#disparo").css("left",950);
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }

        // Disparo com o inimigo2
        if (colisao4.length > 0) {
            pontos += 50; // Ganha 50 quando matar inimigo2
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
            explosao2(inimigo2X,inimigo2Y);
            $("#disparo").css("left",950);    
            reposicionaInimigo2();   
        }

        // Jogador com o amigo
        if (colisao5.length > 0) {
            somResgate.play();
            salvos++; // Qtd de amigos salvos
            reposicionaAmigo();
            $("#amigo").remove();
        }

        // Inimigo2 com o amigo
        if (colisao6.length > 0) {
            perdidos++; // Qtd de amigos mortos pelos inimigos
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            friendDiedAnimation(amigoX,amigoY);
            $("#amigo").remove();            
            reposicionaAmigo();       
        }
    } // Fim da funcao colisao()

    //Explosão 1
    function explosao1(inimigo1X,inimigo1Y) {
        somExplosao.play();
        $("#fundo-game").append("<div id='explosao1'></div"); // Cria a div de explosao
        $("#explosao1").css("background-image", "url(img/explosao.png)"); // Adiciona a imagem na div
        var div=$("#explosao1");
        // Estiliza a posicao da explosao, onde o inimigo esta
        div.css("top", inimigo1Y); 
        div.css("left", inimigo1X);
        // Anima a largura ate 200, faz o efeito de crescimento de forma devagar
        div.animate({width:150, opacity:0}, "5s");
        
        var tempoExplosao=window.setInterval(removeExplosao, 1000); // Remove explosao depois de um tempo
        
        // Remove a explosao
		function removeExplosao() {
			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao=null;
		}	
	} // Fim da funcao explosao1

    function explosao2(inimigo2X,inimigo2Y) {
        somExplosao.play();
        $("#fundo-game").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(img/explosao.png)");
        var div2=$("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");
        
        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);
        function removeExplosao2() {
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2=null;
        }
    }

    //Reposiciona Inimigo2
	function reposicionaInimigo2() {
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);
            
        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;    
            if (fimdejogo == false) {
                $("#fundo-game").append("<div id=inimigo2></div");    
            }
        }	
    }	
    
    // Reposiciona Amigo        
    function reposicionaAmigo() {
        var tempoAmigo = window.setInterval(reposiciona6, 6000);
        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;
            if (fimdejogo == false) {
                $("#fundo-game").append("<div id='amigo' class='anima-frienddog'></div>");
            }
        }
    }

    // Animacao do amigo morrendo
    function friendDiedAnimation(amigoX, amigoY) {
        somPerdido.play();
        $("#fundo-game").append("<div id='friend-died' class='anima4'></div");
        $("#friend-died").css("top", amigoY);
        $("#friend-died").css("left", amigoX);
        var tempoAnimation=window.setInterval(resetaFriendDiedAnimation, 1000);
        
        function resetaFriendDiedAnimation() {
            $("#friend-died").remove();
            window.clearInterval(tempoAnimation);
            tempoAnimation = null;
        }
    }

    // Placar do jogo 
    function placar() {
        $("#placar").html("<h2> Pontos: " + pontos + "      Salvos: " + salvos + "     Perdidos: " + perdidos + "</h2>");  
    } 

        
    // Barra de energia
    function energia() {
        if (energiaAtual == 3) {
            $("#energia").css("background-image", "url(img/energia3.png)");
        }
        if (energiaAtual == 2) {
            $("#energia").css("background-image", "url(img/energia2.png)");
        }
        if (energiaAtual == 1) {
            $("#energia").css("background-image", "url(img/energia1.png)");
        }
        if (energiaAtual == 0) {
            $("#energia").css("background-image", "url(img/energia0.png)");
            // Game over
            gameOver();
        }
    } // Fim da funcao energia()

    
    //Função game over
	function gameOver() {
        fimdejogo = true;
        musica.pause();
        somGameover.play();
        
        window.clearInterval(jogo.timer);
        jogo.timer = null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#fundo-game").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<button class='botao-ui' onclick='reiniciaJogo()'>Jogar novamente</button>");
    } // Fim da funcao gameOver();

} // Fim da funcao start

// Reinicia o jogo
function reiniciaJogo() {
	somGameover.pause();
	$("#fim").remove();
	start(); // Chama novamente a funcao start
} 