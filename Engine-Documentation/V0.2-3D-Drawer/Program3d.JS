var InputdataX = []
var InputdataY = []
var InputdataZ = []
const F = 100
var Procdata = new Array
let ProcX = (X, Z) => X*F/Z+Z
let ProcY = (Y, Z) => Y*F/Y+Z
function InputCoords(){
    Procdata = []
    let Coordamount = +prompt("insert amount of coordinates")
    for (let i = 0; i < Coordamount; i++) {
        const X=+prompt("X:")
        const Y=+prompt("Y:")
        const Z=+prompt("Z:")
        Procdata.push(ProcX(X, Z))
        Procdata.push(ProcY(Y, Z))
        alert(Procdata.length)
    }}
function Load() {
    alert(Procdata.length)
    debugger
    for (let i = 0; i < Procdata.length; i+=2) {
        ctx.moveTo(400+Number(Procdata[i]),400+Number(Procdata[i+1]));
        ctx.lineTo(400+Number(Procdata[i+2]),400+Number(Procdata[i+3]));
        ctx.stroke();
    }}
// Använder äldre och sämre metoder än 3D-Engine