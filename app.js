let selectP1 = document.querySelector('.number.number1')
let selectP2 = document.querySelector('.number.number2')
let topScoreCard = document.querySelector('.botcont')
let controls = document.querySelector('.container.control2')
let ctrlbutton = document.querySelectorAll('.ctrlBtn')
let resetBtn = document.querySelector('.reset')
let multiBtn = document.querySelector('.multi')
let toolTip = document.querySelector('.toolTip')
let toolTip2 = document.querySelector('.toolTip2')
let roundSelect = document.querySelector('.rounds')
let roundHistory = document.getElementById('history')
let modals = document.querySelectorAll('.mod')
let scoreList = document.getElementById('scores')

let scoreLimit
let globalMult = 1
let shown = false
let resArr = []


function resetScore() {
    scoreLogger()
    renderScore()
    selectP1.innerText = '0'
    selectP2.innerText = '0'
    player1.score = 0
    player2.score = 0
    resetColor()
    eventToggler('on')
    this.classList.toggle('alertUsr')
}
function resetColor() {
    selectP1.style.color = 'black'
    selectP2.style.color = 'black'
}

resetColor()


const player1 = {
    score: 0,
    scoreLimit: 99,
    scoreCard: selectP1,
    get color() {
        return this.scoreCard.style.color
    },
    set color(arg) {
        this.scoreCard.style.color = arg
    },
    scoreUp() {

        this.score += globalMult
        if (this.score >= this.scoreLimit) {
            changeClr(this)
            resetBtn.classList.toggle('alertUsr')
            this.scoreCard.innerText = this.score
            eventToggler('off')
            return
        } else {
            this.scoreCard.innerText = this.score
        }





        //////check here if score same or higher than scoreLimit extracted from the select input
        ///// if yes call change color function on scoreCard prop
        //// if P1 winner call global changeClr fn

        ///// disable more score adding here
    },
    scoreDown() {
        this.score -= globalMult
        this.scoreCard.innerText = this.score
    },
    get playerScore() {
        return this.score
    },

}

function changeClr(winner, loser, color) {
    winner === player1 ? loser = player2 : loser = player1
    winner.color = 'green'
    loser.color = 'red'
    ///// lockout adding more score here?
}

const player2 = Object.create(player1, {
    scoreCard: {
        value: selectP2
    },
})

player2.score = 0

function scoreIncrease(e) {
    let tgt = e.target
    console.log(tgt);
    if (tgt == selectP1) {
        player1.scoreUp()
    } else if (tgt == selectP2) {
        player2.scoreUp()
    }
}


function scoreControl(e) {
    let tgt = e.target
    console.log(tgt);
    switch (true) {
        case tgt == controls.children[0]:
            player1.scoreDown()
            break;
        case tgt == controls.children[1]:
            player1.scoreUp()
            break;
        case tgt == controls.children[2]:
            player2.scoreUp()
            break;
        case tgt == controls.children[3]:
            player2.scoreDown()
            break;

        default:
            break;
    }
}

function multiplier(e) {
    let curMult = parseInt(this.children[0].innerText)
    if (curMult >= 10) {
        curMult = 1
        multiBtn.children[0].innerText = curMult
        globalMult = curMult
        return
    }
    curMult += 1
    this.children[0].innerText = curMult
    globalMult = curMult
}

function addBtnTooltipListener() {
    for (const btn of ctrlbutton) {
        btn.addEventListener('mouseenter', showTooltipForBtn, { once: true })
    }
}

function showTooltipForBtn(e) {
    this.style.backgroundColor = 'red'
    toolTip.classList.toggle('shown')
    setTimeout(() => {
        toolTip.classList.toggle('shown')
        /* shown = true */
    }, 5000)
    let tgt = e.target
    for (const btn of ctrlbutton) {
        btn.removeEventListener('mouseenter', showTooltipForBtn, { once: true })
    }
}

function showTooltip(tooltip,e) {

    /* if (shown === true) {
        return
    } */
    tooltip.classList.toggle('shown')
    setTimeout(() => {
        tooltip.classList.toggle('shown')
        /* shown = true */
    }, 5000)

}

let showTooltip1 = showTooltip.bind(this, toolTip)
let showTooltip2 = showTooltip.bind(this, toolTip2)

function scoreLimitSetter(e) {
    let limit = e.target.value
    player1.scoreLimit = limit
    player2.scoreLimit = limit;
    roundSelect.classList.add('padLeft')
}

function scoreLogger() { ///// keeps the history of last 10 rounds
    if (resArr.length > 9) {
        resArr.splice(0, 1)
    }
    resArr.push([player1.score, player2.score])
    console.log(resArr);
    /////////// to render the histor modal - 1.rerender all items with every addition to array, 2.rerender all items when reaches 10rounds
    //////////// 3. rerender only 1st(last in history) item based on some conditionals
}

function keyIncrease(e) {
    if (e.key === 'ArrowLeft') {
        player1.scoreUp()
    } else if (e.key === 'ArrowRight') {
        player2.scoreUp()
    }
}

function eventToggler(state) {
    if (state === 'off') {
        controls.removeEventListener('click', scoreControl)
        document.removeEventListener('keyup', keyIncrease)
        topScoreCard.removeEventListener('click', scoreIncrease)
    } else {
        addScoreListeners()
    }
}

function addScoreListeners() {
    topScoreCard.addEventListener('click', scoreIncrease)
    controls.addEventListener('click', scoreControl)
    document.addEventListener('keyup', keyIncrease)
}

function displayHistory(e) {
    for (const mod of modals) {
        console.log(modals);
        mod.classList.toggle('shown')
    }
}

let index = 0
function renderScore() {
    
    let score1 = resArr[resArr.length-1][0]
    let score2 = resArr[resArr.length-1][1]
    if (score1 > score2) {
        color1 = 'winner'
        color2 = 'loser'
    } else if (score1 === score2) {
        color1 = 'winner'
        color2  = 'winner'
    } else {
        color1 = 'loser'
        color2  = 'winner'
    }
    scoreList.children[index].innerHTML = `<span class="p1">player1: <span class="score p1score ${color1}">${score1}</span></span> <span
    class="p2">player2: <span class="score p2score ${color2}">${score2}</span></span>`
    index++
}

addScoreListeners()
addBtnTooltipListener()

resetBtn.addEventListener('mouseenter', showTooltip2, {once:true})
resetBtn.addEventListener('click', resetScore)
multiBtn.addEventListener('click', multiplier)
roundSelect.addEventListener('input', scoreLimitSetter)
roundHistory.addEventListener('click', displayHistory)
modals[1].addEventListener('click', displayHistory)
modals[0].addEventListener('click', displayHistory)


