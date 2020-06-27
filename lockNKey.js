const height = window.innerHeight;
const width = window.innerWidth;
const keyElement   = document.querySelector('.key');
const lockElement = document.querySelector('.lock');
const siteDiv = document.querySelector('.fullPage');

const LOCK_SIZE = 60;
const KEY_SIZE = 35;
const LOCK_X = (width/2) - (LOCK_SIZE/2);
const LOCK_Y = (height/2) - (LOCK_SIZE/2);

const randomInt = (min, max) => {
    return (Math.random()*(max-min+1))+min;
}

const createKey = () => {
    const randomX = ((Math.random()*2)>1) ?
     randomInt(KEY_SIZE, LOCK_X-KEY_SIZE-10) :
     randomInt(LOCK_X+LOCK_SIZE+10, width);

    const randomY = ((Math.random()*2)>1) ?
     randomInt(0, LOCK_Y-KEY_SIZE-10) :
     randomInt(LOCK_Y+LOCK_SIZE+10, height-2*(KEY_SIZE));

    keyElement.style.position = "absolute";
    keyElement.style.top = `${randomY}px`;
    keyElement.style.left = `${randomX}px`;
    keyElement.height = keyElement.width = KEY_SIZE;
    keyElement.style.display = "block";
}

const createLock = () => {
    lockElement.style.position = "absolute";
    lockElement.style.top = `${LOCK_Y}px`;
    lockElement.style.left = `${LOCK_X}px`;
    lockElement.height = lockElement.width = LOCK_SIZE;
    lockElement.style.display = "block";
}

const mouseDown = Rx.Observable.fromEvent(keyElement, "mousedown");
const touchStart = Rx.Observable.fromEvent(keyElement, "touchstart");

const mouseMoves = Rx.Observable.fromEvent(document, "mousemove");
const touchMoves = Rx.Observable.fromEvent(document, "touchmove");

const mouseUps = Rx.Observable.fromEvent(document, "mouseup");
const touchEnds = Rx.Observable.fromEvent(document, "touchend");

const canUnlock = (pos) => {
    const LOCK_LEFT = LOCK_X + 10;
    const LOCK_RIGHT = LOCK_X + LOCK_SIZE - 10;
    const LOCK_UP = LOCK_Y + 35;
    const LOCK_DOWN = LOCK_Y + LOCK_SIZE;

    const KEY_LEFT = pos.x + 10;
    const KEY_RIGHT = pos.x + KEY_SIZE - 10;
    const KEY_UP = pos.y;
    const KEY_DOWN = pos.y + KEY_SIZE;

    return ((LOCK_LEFT < KEY_RIGHT && LOCK_RIGHT > KEY_LEFT) &&
        (LOCK_UP < KEY_DOWN && LOCK_DOWN > KEY_UP));
}


const keyObservable = Rx.Observable.merge(mouseDown, touchStart).map((_mouseDown) =>  { 
     return  Rx.Observable.merge(mouseMoves, touchMoves).map(mouseMove => {
                mouseMove.preventDefault();
                    return {
                        x: mouseMove.clientX,
                        y: mouseMove.clientY
                    }
                })
        .takeUntil(Rx.Observable.merge(mouseUps, touchEnds))
}).concatAll();


const subscription = 
    keyObservable.forEach((mouseMoves) => {
        if(canUnlock(mouseMoves)){
            subscription.dispose();
            cleanLocknKey();
        }
        keyElement.style.top = `${mouseMoves.y}px`;
        keyElement.style.left = `${mouseMoves.x}px`;
    }, () => {}, () => {});


const createLockNKey = () => {
    createKey();
    createLock();
}

const cleanLocknKey = () => {
    const keyElem = document.querySelector(`.key`) 
    lockElement.style.display = keyElem.style.display = 'none';
    siteDiv.style.visibility = 'visible';
}       

createLockNKey();
