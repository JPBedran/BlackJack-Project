

var player = {
    cards:[],
    points: 0,
    won: 0,
    lost: 0,
};
var dealer = {
    cards: [],
    points: 0,
};


var deck ={
    deckArr:['2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
             '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS',
             '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
             '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD'], 
    //clones array everytime deal is called so POP method doesnt end array
    cloner: function(){
        let cloned = this.deckArr.slice();
        return cloned;
    },

    shuffleDeck: function (){
        let arrCopy = this.cloner();
        for (let i = arrCopy.length-1; i>0; i--){
            let j = Math.floor(Math.random()*arrCopy.length);
            let temp = arrCopy[i];
            arrCopy[i] = arrCopy[j];
            arrCopy[j] = temp;
        }
        return arrCopy
    },
    hit: function(){
        let popped = this.shuffleDeck().pop();
        return popped;
    },
    //creates suit and "type" o card in html so css can read!
    suiter: function(cards){
        let deckHand = [];
        let suit = "";
        let cardName = "";
        for(let card of cards){
            if(card[1]==="S"||card[2]==="S"){
                suit = "&#9824;";
                cardName = "Spades";
                deckHand.push('<div class="card ',cardName,'">',card[0],suit,'</div>');
            }else if(card[1]==="H"||card[2]==="H"){
                suit = '&#9829;';
                cardName = "Hearts";
                deckHand.push('<div class="card ',cardName,'">',card[0],suit,'</div>');
            }else if(card[1]==="D"||card[2]==="D"){
                suit = '&#9830';
                cardName = "Diamonds";
                deckHand.push('<div class="card ',cardName,'">',card[0],suit,'</div>');
            }else if(card[1]==="C"||card[2]==="C"){
                suit = '&#9827;';
                cardName = "Clubs";
                deckHand.push('<div class="card  ',cardName,'">',card[0],suit,'</div>');
            }
        }
        return deckHand.join('');
    },
};
deck.shuffleDeck();

function deal(){
    dealer.cards.push(deck.hit(), deck.hit());
    dealer.points += awardPoints(dealer.cards);
    player.cards.push(deck.hit(), deck.hit());
    player.points += awardPoints(player.cards);
};

function hit(){
    dealer.cards.push(deck.hit());
    dealer.points = awardPoints(dealer.cards);
    player.cards.push(deck.hit());
    player.points = awardPoints(player.cards);
};
function stand(){
    dealer.cards.push(deck.hit());
    dealer.points = awardPoints(dealer.cards);
};


function awardPoints(cards){
    let pointCount = 0
    for (let card of cards){
        if (card[0].match(/[0-9]/g) != null){
            let toNum = parseInt(card[0]);
            if(toNum ===1){
                pointCount+=10;
            }else{
                pointCount+=toNum;
            };
        }else if(card[0].match(/[j|q|k]/gi)!=null){
            pointCount+=10;
        }else{//remember to put conditional of Ace being 1 or 11!!
            if(player.points>10 || dealer.points>10){
                pointCount+=1;
            }else{
                pointCount+=11;
            }
        }
    }
    return pointCount;
};

var game = $(document).ready(function(){

    function masterReset(){
        player.points = 0;
        player.cards = [];
        dealer.points = 0;
        dealer.cards = [];
        deck.shuffleDeck();
        beforeDeal();
    };
    function uI(){
        $("#table").html(deck.suiter(player.cards));
        $("#yourScore").html(player.points)
    };
    function beforeDeal(){
        $("#deal").show();
        $("#hit").hide();
        $("#stand").hide()
    };
    function afterDeal(){
        $("#deal").hide();
        $("#hit").show();
        $("#stand").show();
    };

    $("#deal").click(function(){
        deal();
        uI();
        afterDeal();
    });
    $("#hit").click(function(){
        hit();
        if(player.points>21||player.cards.length>=5){
            $("#table").html(endGame());
        }else{
            uI();
        }
        
    });
    $("#stand").click(function(){
        while (dealer.points <=17){
            stand();  
        }
        uI();
        $("#table").html(endGame());
    })
    

    function endGame(){
        //var to store points before master reset, so they appear at end of game!
        let userPoints = player.points;
        let dealerPoints = dealer.points;
        let result = ""
        if (player.points > 21 || dealer.points === 21){
            result = "Bust!";
            player.lost++;
            masterReset();

        }else if (dealer.points >= 17 && player.points < dealer.points && dealer.points < 21){
            result = "You Lose!";
            player.lost++;
            masterReset();
        }else if (dealer.points > 21 || player.points === 21){
            result = "You win!";
            player.won++;
            masterReset();
        }else if (dealer.points > player.points && dealer.points<=21){
            result = "You lose!";
            player.lost++;
            masterReset();
        }else if (dealer.points === player.points){
            result = "You tied!";
            masterReset();
        }else if(dealer.points>21 && player.points>21){
            result = "Game Braker";
            masterReset();
        }else if(dealer.score >= 17 && player.score > dealer.score && player.score < 21){
            result = "You Win!"
            player.won++;
            masterReset();
        }

        return result+"<br />Dealer: "+dealerPoints+"<br />You: "+userPoints+"<br />Games Won: "+player.won+"<br />Games Lost: "+player.lost;
    };
});


