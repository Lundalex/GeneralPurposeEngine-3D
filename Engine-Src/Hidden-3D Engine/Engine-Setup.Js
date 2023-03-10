let canvas = document.getElementById("Canvas")
document.getElementById("Canvas").style.width = new String(CanvasWidth + "px")
document.getElementById("Canvas").style.width = new String(CanvasHeigth + "px")
canvas.style.width = new String(CanvasWidth + "px")
canvas.style.height = new String(CanvasHeigth + "px")
    
let ctx = canvas.getContext("2d")
let context = canvas.getContext('2d')
    
ctx.beginPath();
    ctx.rect(00, 00, CanvasWidth, CanvasHeigth);
    ctx.fillStyle = "#18191a";
    ctx.fill();
    
HTMLProjectOverviewNode = document.getElementById("ProjectOverview")

let SwitchTracker = false
    
let RegObjects = []
    
let SpawnerObjects = []

let TriSorted = []

// [traingles1,2,3] -> traingle1([corner1,2,3])
let CubePresetX = [[100,200,200],[100,100,200],[200,200,200],[200,200,200],[100,100,100],[100,100,100],[200,100,100],[200,200,100],[100,200,200],[100,100,200],[200,100,100],[200,200,100]]
let CubePresetY = [[100,200,100],[100,200,200],[100,200,200],[100,200,100],[100,200,100],[100,200,200],[100,200,100],[100,200,200],[200,200,200],[200,200,200],[100,100,100],[100,100,100]]
let CubePresetZ = [[100,100,100],[100,100,100],[100,100,200],[100,200,200],[200,100,100],[200,200,100],[200,200,200],[200,200,200],[100,200,100],[100,200,200],[100,200,100],[100,200,200]]
    
let CUSTOMObjtriDataX = [[[0.2]]]
let CUSTOMObjtriDataY = [[[0.2]]]
let CUSTOMObjtriDataZ = [[[0.2]]]

let KeyPress = ""
    
let Manipulate = "Path"
    
let ScrollY = "None"
    
    
let FoundObjectNumber = 0
    
let AnimationX = []
let AnimationY = []
let AnimationZ = []
    
let ChosenPathStage = 0
    
let LastMouseDownX = 0
let LastMouseDownY = 0
    
let LastMouseUpX = 0
let LastMouseUpY = 0
    
    
let Framestage = 0
    
let RunProgram = false
    
let CameraDirection1 = 1 // 1 = X
let CameraDirection2 = 2 // 2 = Y
let CameraDirection3 = 3 // 3 = Z
    
function MainLoop(){

    let Continue = OnNewFrame()
    if(!Continue){return}

    if(Framestage > 100){
        Framestage = 1
        for (let i = 0; i < SpawnerObjects.length; i++) {
            SpawnerObjects[i].Spawn()
        }
    }
    else{
        Framestage += 2 * ProgramIncrementHertz
    }
        
    ResetCanvas()

    CalculateTriangleCrossproducts()
        
    // (Manipulate path, object, point)
    DoManipulation()
        
    DoScaling()
        
    DoCalculateAnimation()
        
    DoCalculatePhysics()
        
    // Prepare Projection Arrays
    ProjectShell2D()
        
    ProjectAnimationPath2D()
        
    ProjectHitboxes2D()
    //

    CalculateCameraObjectVectorAndSortByDistance()
        
    // Draw On Canvas
    CanvasDrawObjectShells()
        
    CanvasDrawAnimationPathing()
        
    CanvasDrawHitboxes()
    //
        
    KeyPress = "NoKey"
    ScrollY = "None"
        
        
        
    if(RunProgram == true){
        setTimeout(MainLoop, 1000/ProgramHertz)
    }
    else{
        ResetCanvas()
    }
}
// END OF MAIN LOOP



// Start Main Loop Function
function Start() {
    OnStart()

    // Clear graph(fill)
    ctx.beginPath();
    ctx.rect(00, 00, CanvasWidth, CanvasHeigth);
    ctx.fillStyle = "white";
    ctx.fill();
    
    RunProgram = true

    if(RegObjects.length == 0){
        AddCubeObject(0,0,0,1)
    }
    
    setTimeout(MainLoop, 20)
}
// Start Main Loop Function



// Delete Found Object Function
function DeleteFoundObject(FoundObjectNumber){
    let Continue = OnDeleteFoundObject(FoundObjectNumber)
    if(!Continue){return}


    let CopyArr = []
    for (let i = 0; i < RegObjects.length; i++) {
        if(i != FoundObjectNumber){

            CopyArr.push(RegObjects[i])

        }    
    }
    RegObjects = CopyArr
    FoundObjectNumber = 0
}
// Delete Found Object Function



// Delete Found Object Function
function DeleteObject(ObjectNumber){
    let Continue = OnDeleteObject(ObjectNumber)
    if(!Continue){return}

    let CopyArr = []
    for (let i = 0; i < RegObjects.length; i++) {
        if(i != ObjectNumber){

            CopyArr.push(RegObjects[i])

        }    
    }
    RegObjects = CopyArr
    FoundObjectNumber = 0
}
// Delete Found Object Function



// CONSTRUCTOR - RegObjects
function NewRegularObject(INShellXArr, INShellYArr, INShellZArr, INLeaderX, INLeaderY, INLeaderZ,      HitboxSizeX1, HitboxSizeY1, HitboxSizeZ1, HitboxSizeX2, HitboxSizeY2, HitboxSizeZ2,    ObjectType,    VelocityX, VelocityY, VelocityZ,    Mass,    DeleteOnCollision, ConstantForceX, ConstantForceY, ConstantForceZ, ObjectTag) {
    
    if(ObjectTag){
        this.Tag = ObjectTag
    }

    this.FillColor = "#555555"
    this.Opacity = 1

    this.TriDistX = []
    this.TriDistY = []
    this.TriDistZ = []

    this.TriTotlength = []

    this.TriSorted = []

    this.TriDistCameraUnitVectorX = []
    this.TriDistCameraUnitVectorY = []
    this.TriDistCameraUnitVectorZ = []

    this.TriCameraDotProduct = []


    this.TriangleCrossProductUnitVectorX = []
    this.TriangleCrossProductUnitVectorY = []
    this.TriangleCrossProductUnitVectorZ = []

    this.ShellX = INShellXArr;
    this.ShellY = INShellYArr;
    this.ShellZ = INShellZArr;


    this.LeaderX = INLeaderX;
    this.LeaderY = INLeaderY;
    this.LeaderZ = INLeaderZ;

        
    this.ShellprojectedX = [0];
    this.ShellprojectedY = [0];


        this.AnimationInstructionsX = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        this.AnimationInstructionsY = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        this.AnimationInstructionsZ = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        this.AnimationStages = 1
        this.AnimationFrame = Framestage

    // FILL LATER

    this.AnimationPathCoordsX = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    this.AnimationPathCoordsY = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    this.AnimationPathCoordsZ = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

    this.AnimationPathProjectedX = [0]
    this.AnimationPathProjectedY = [0]

    this.TotalAnimationDeviationX = 0
    this.TotalAnimationDeviationY = 0
    this.TotalAnimationDeviationZ = 0

    this.DeleteOTHERonCollision = false

    if(ConstantForceX){
        this.ConstantForceX = ConstantForceX}
    else{
        this.ConstantForceX = 0}

    if(ConstantForceY){
        this.ConstantForceY = ConstantForceY}
    else{
        this.ConstantForceY = 0}

    if(ConstantForceZ){
        this.ConstantForceZ = ConstantForceZ}
    else{
        this.ConstantForceZ = 0}

    if(HitboxSizeX1){
        this.HitboxSizeX1 = HitboxSizeX1}
    else{
        this.HitboxSizeX1 = -50}
        
    if(HitboxSizeY1){
        this.HitboxSizeY1 = HitboxSizeY1}
    else{
        this.HitboxSizeY1 = -50}

    if(HitboxSizeZ1){
        this.HitboxSizeZ1 = HitboxSizeZ1}
    else{
        this.HitboxSizeZ1 = -50}

    if(HitboxSizeX2){
        this.HitboxSizeX2 = HitboxSizeX2}
    else{
        this.HitboxSizeX2 = 50}

    if(HitboxSizeY2){
        this.HitboxSizeY2 = HitboxSizeY2}
    else{
        this.HitboxSizeY2 = 50}

    if(HitboxSizeZ2){
        this.HitboxSizeZ2 = HitboxSizeZ2}
    else{
        this.HitboxSizeZ2 = 50}


    this.HitboxProjectedX = [0]
    this.HitboxProjectedY = [0]

    if(ObjectType){
        this.ObjectType = ObjectType}
    else{
        this.ObjectType = ChosenRegObjectType}
    // Animated, Physics

    if(VelocityX){
        this.VelocityX = VelocityX}
    else{
        this.VelocityX = 0}


    if(VelocityY){
        this.VelocityY = VelocityY}
    else{
        this.VelocityY = 0}


    if(VelocityZ){
        this.VelocityZ = VelocityZ}
    else{
        this.VelocityZ = 0}
    

    if(Mass){
        this.Mass = Mass}
    else{
        this.Mass = 100}


    if(DeleteOnCollision){
        this.DeleteOnCollision = true}
    else{
        this.DeleteOnCollision = false}


    this.IsMarked = false;

    this.PointsMarked = [];


    this.RelativePointPositionX = function(PointNumber){
        return this.ShellX[PointNumber] + this.LeaderX
    }

    this.RelativePointPositionY = function(PointNumber){
        return this.ShellY[PointNumber] + this.LeaderY
    }

    this.RelativePointPositionZ = function(PointNumber){
        return this.ShellZ[PointNumber] + this.LeaderZ
    }



    this.AnimationRelativePathCoordPositionX = function(PointNumber){
        return this.AnimationPathCoordsX[PointNumber] + this.LeaderX
    }

    this.AnimationRelativePathCoordPositionY = function(PointNumber){
        return this.AnimationPathCoordsY[PointNumber] + this.LeaderY
    }

    this.AnimationRelativePathCoordPositionZ = function(PointNumber){
        return this.AnimationPathCoordsZ[PointNumber] + this.LeaderZ
    }

    this.HitboxRelativeBoundraryXYZ = function(){
        let SpanXYZ = []

        SpanXYZ.push(this.TotalAnimationDeviationX + this.HitboxSizeX1 + this.LeaderX)
        SpanXYZ.push(this.TotalAnimationDeviationX + this.HitboxSizeX2 + this.LeaderX)
        SpanXYZ.push(this.TotalAnimationDeviationY + this.HitboxSizeY1 + this.LeaderY)
        SpanXYZ.push(this.TotalAnimationDeviationY + this.HitboxSizeY2 + this.LeaderY)
        SpanXYZ.push(this.TotalAnimationDeviationZ + this.HitboxSizeZ1 + this.LeaderZ)
        SpanXYZ.push(this.TotalAnimationDeviationZ + this.HitboxSizeZ2 + this.LeaderZ)

        return SpanXYZ
    }

    this.NextHitboxRelativeBoundraryXYZ = function(Increment){
        let SpanXYZ = []
        let Modifier = 1

        if(Increment){Modifier = Increment}
                                                                                                                         // *20
        SpanXYZ.push(this.TotalAnimationDeviationX + this.HitboxSizeX1 + this.LeaderX + (this.VelocityX - this.ConstantForceX) * ProgramIncrementHertz * 0.05 * Modifier)
        SpanXYZ.push(this.TotalAnimationDeviationX + this.HitboxSizeX2 + this.LeaderX + (this.VelocityX - this.ConstantForceX) * ProgramIncrementHertz * 0.05 * Modifier)
        SpanXYZ.push(this.TotalAnimationDeviationY + this.HitboxSizeY1 + this.LeaderY + (this.VelocityY - this.ConstantForceY) * ProgramIncrementHertz * 0.05 * Modifier)
        SpanXYZ.push(this.TotalAnimationDeviationY + this.HitboxSizeY2 + this.LeaderY + (this.VelocityY - this.ConstantForceY) * ProgramIncrementHertz * 0.05 * Modifier)
        SpanXYZ.push(this.TotalAnimationDeviationZ + this.HitboxSizeZ1 + this.LeaderZ + (this.VelocityZ - this.ConstantForceZ) * ProgramIncrementHertz * 0.05 * Modifier)
        SpanXYZ.push(this.TotalAnimationDeviationZ + this.HitboxSizeZ2 + this.LeaderZ + (this.VelocityZ - this.ConstantForceZ) * ProgramIncrementHertz * 0.05 * Modifier)

        return SpanXYZ
    }
}
// CONSTRUCTOR - RegObjects



// Add New Cube Object Function
function AddCubeObject(INLeaderX, INLeaderY, INLeaderZ, Size,  HitboxSizeX1, HitboxSizeY1, HitboxSizeZ1, HitboxSizeX2, HitboxSizeY2, HitboxSizeZ2,    ObjectType,    VelocityX, VelocityY, VelocityZ,    Mass,    DeleteOnCollision, ConstantForceX, ConstantForceY, ConstantForceZ){
    
    let CDX = -290
    let CDY = -290
    let CDZ = -290

    if(INLeaderX == 0 && INLeaderY == 0 && INLeaderZ == 0){
    CDX = Math.random() * 100 - 50
    CDY = Math.random() * 100 - 50
    CDZ = Math.random() * 100 - 50
    }

    let NewShellLeaderX = 0
    let NewShellLeaderY = 0
    let NewShellLeaderZ = 0

    let NewShellX1
    let NewShellY1
    let NewShellZ1

    if(CUSTOMObjtriDataX[0][0] != 0.2 && CUSTOMObjtriDataY[0][0] != 0.2 && CUSTOMObjtriDataZ[0][0] != 0.2){

        NewShellX1 = CUSTOMObjtriDataX.slice()
        NewShellY1 = CUSTOMObjtriDataY.slice()
        NewShellZ1 = CUSTOMObjtriDataZ.slice()

    }
    else{

        NewShellX1 = CubePresetX.slice()
        NewShellY1 = CubePresetY.slice()
        NewShellZ1 = CubePresetZ.slice()

    }

    let AllValuesX = 0
    let AllValuesY = 0
    let AllValuesZ = 0


    for (let i = 0; i < NewShellX1.length; i++) {

        NewShellX1[i] = NewShellX1[i].map(function Procfunc(num){return num + CDX})
        NewShellY1[i] = NewShellY1[i].map(function Procfunc(num){return num + CDY})
        NewShellZ1[i] = NewShellZ1[i].map(function Procfunc(num){return num + CDZ})

        AllValuesX += NewShellX1[i].reduce(function RedX(total,value){return Number(total)+Number(value)})
        AllValuesY += NewShellY1[i].reduce(function RedX(total,value){return Number(total)+Number(value)})
        AllValuesZ += NewShellZ1[i].reduce(function RedX(total,value){return Number(total)+Number(value)})

    }

    const TotalValueCount = NewShellX1.length * 3
    
    const AverageX = AllValuesX / TotalValueCount
    const AverageY = AllValuesY / TotalValueCount
    const AverageZ = AllValuesZ / TotalValueCount

    if(INLeaderX != 0 || INLeaderY != 0 || INLeaderZ != 0){

        NewShellLeaderX = INLeaderX
        NewShellLeaderY = INLeaderY
        NewShellLeaderZ = INLeaderZ
    }

    else{

        NewShellLeaderX = AverageX
        NewShellLeaderY = AverageY
        NewShellLeaderZ = AverageZ

    }

    for (let i = 0; i < NewShellX1.length; i++) {
    
    NewShellX1[i] = NewShellX1[i].map(function Procfunc(num){return (num-AverageX)*Size})
    NewShellY1[i] = NewShellY1[i].map(function Procfunc(num){return (num-AverageY)*Size})
    NewShellZ1[i] = NewShellZ1[i].map(function Procfunc(num){return (num-AverageZ)*Size})

    }

    RegObjects.push(new NewRegularObject(NewShellX1, NewShellY1, NewShellZ1, NewShellLeaderX, NewShellLeaderY, NewShellLeaderZ,       HitboxSizeX1, HitboxSizeY1, HitboxSizeZ1, HitboxSizeX2, HitboxSizeY2, HitboxSizeZ2,    ObjectType,    VelocityX, VelocityY, VelocityZ,    Mass,    DeleteOnCollision, ConstantForceX, ConstantForceY, ConstantForceZ))
                                                                                            
}
// Add New Cube Object Function



    // CONTRUCTOR New Spawner Object
function NewSpawnerObject(SpawnSpaceX1, SpawnSpaceY1, SpawnSpaceZ1, SpawnSpaceX2, SpawnSpaceY2, SpawnSpaceZ2, SpawnedLeaderX, SpawnedLeaderY, SpawnedLeaderZ, SpawnedSize, SpawnedHitboxSizeX1, SpawnedHitboxSizeY1, SpawnedHitboxSizeZ1, SpawnedHitboxSizeX2, SpawnedHitboxSizeY2, SpawnedHitboxSizeZ2, SpawnedVelocityX, SpawnedVelocityY, SpawnedVelocityZ, SpawnedMass, SpawnedDeleteOnCollision, SpawnedObjectCubeSphere, SpawnedConstantForceX, SpawnedConstantForceY, SpawnedConstantForceZ){
    //                            1             2            3             4                5                 6          7                8         9                 10           11                        12                13                     14                    15                   16                 17               18                   19             20                21                      22                        
            
    this.SpawnSpaceX1 = +SpawnSpaceX1 // Def 0
    this.SpawnSpaceY1 = +SpawnSpaceY1 // Def 0
    this.SpawnSpaceZ1 = +SpawnSpaceZ1 // Def 0
    
    this.SpawnSpaceX2 = +SpawnSpaceX2 // Def 0
    this.SpawnSpaceY2 = +SpawnSpaceY2 // Def 0
    this.SpawnSpaceZ2 = +SpawnSpaceZ2 // Def 0
    
    
    this.SpawnedLeaderX = +SpawnedLeaderX // Def 0
    this.SpawnedLeaderY = +SpawnedLeaderY // Def 0
    this.SpawnedLeaderZ = +SpawnedLeaderZ // Def 0
    
    this.SpawnedSize = +SpawnedSize // Def 1
    
    this.SpawnedHitboxSizeX1 = +SpawnedHitboxSizeX1 // Def -100
    this.SpawnedHitboxSizeY1 = +SpawnedHitboxSizeY1 // Def -100
    this.SpawnedHitboxSizeZ1 = +SpawnedHitboxSizeZ1 // Def -100
    
    this.SpawnedHitboxSizeX2 = +SpawnedHitboxSizeX2 // Def 100
    this.SpawnedHitboxSizeY2 = +SpawnedHitboxSizeY2 // Def 100
    this.SpawnedHitboxSizeZ2 = +SpawnedHitboxSizeZ2 // Def 100
    
    this.SpawnedObjectType = "Physics"
    
    this.SpawnedVelocityX = +SpawnedVelocityX // Def 0
    this.SpawnedVelocityY = +SpawnedVelocityY // Def 0
    this.SpawnedVelocityZ = +SpawnedVelocityZ // Def 0
    
    this.SpawnedMass = +SpawnedMass // Def 100
    
    
    this.SpawnedDeleteOnCollision = +SpawnedDeleteOnCollision // Def false
    
    
    this.SpawnedObjectCubeSphere = SpawnedObjectCubeSphere // Def "Cube"
    
    this.SpawnedConstantForceX = SpawnedConstantForceX
    this.SpawnedConstantForceY = SpawnedConstantForceY
    this.SpawnedConstantForceZ = SpawnedConstantForceZ
    
                  
    this.Spawn = function(){
    
        const LeaderX = this.SpawnSpaceX1 + (Math.random() * this.SpawnSpaceX2 - SpawnSpaceX1)
        const LeaderY = this.SpawnSpaceY1 + (Math.random() * this.SpawnSpaceY2 - SpawnSpaceY1)
        const LeaderZ = this.SpawnSpaceZ1 + (Math.random() * this.SpawnSpaceZ2 - SpawnSpaceZ1)
    
        AddCubeObject(LeaderX, LeaderY, LeaderZ, this.SpawnedSize,this.SpawnedHitboxSizeX1, this.SpawnedHitboxSizeY1, this.SpawnedHitboxSizeZ1, this.SpawnedHitboxSizeX2, this.SpawnedHitboxSizeY2, this.SpawnedHitboxSizeZ2, this.SpawnedObjectType, this.SpawnedVelocityX, this.SpawnedVelocityY, this.SpawnedVelocityZ, this.SpawnedMass, this.SpawnedDeleteOnCollision, this.SpawnedConstantForceX, this.SpawnedConstantForceY, this.SpawnedConstantForceZ)
    
    }
}
// CONTRUCTOR New Spawner Object



// Camera Perspective Function
function CameraPerpectiveHandling(DownX, DownY, UpX, UpY){
    if( (17 < DownX) && (90 < DownY) && (17 < UpX) && (90 < UpY) && (DownX < 817) && (DownY < 890) && (UpX < 817) && (UpY < 890)){
        
        const ChangeX = DownX - UpX
        const ChangeY = DownY - UpY
        
        if((Math.abs(ChangeX) > 200) || (Math.abs(ChangeY) > 200)){

            let NewCameraDirection1 = 0
            let NewCameraDirection2 = 0
            let NewCameraDirection3 = 0

                // Turn Right
                if(ChangeX < -200){

                    NewCameraDirection1 = -CameraDirection3
                    NewCameraDirection2 = CameraDirection2
                    NewCameraDirection3 = CameraDirection1


                }
                // Turn Up
                else if(ChangeY < -200){

                    NewCameraDirection1 = CameraDirection1
                    NewCameraDirection2 = -CameraDirection3
                    NewCameraDirection3 = CameraDirection2
                }
                // Turn Left
                else if(ChangeX > 200){

                    NewCameraDirection1 = CameraDirection3
                    NewCameraDirection2 = CameraDirection2
                    NewCameraDirection3 = -CameraDirection1
                }
                // Turn Down
                else if(ChangeY > 200){

                    NewCameraDirection1 = CameraDirection1
                    NewCameraDirection2 = CameraDirection3
                    NewCameraDirection3 = -CameraDirection2
                }
                CameraDirection1 = NewCameraDirection1
                CameraDirection2 = NewCameraDirection2
                CameraDirection3 = NewCameraDirection3
        }
    }
}
// Camera Perspective Function




// Camera Orientation Function (LOGIC TABLE)
function ApplyCameraPerspective(X, Y, Z){
    
    let NewX = 0
    let NewY = 0
    let NewZ = 0
    
    if(CameraDirection1 == 1){
        NewX = X
    }
    else if(CameraDirection1 == -1){
        NewX = -X
    }
    else if(CameraDirection1 == 2){
        NewX = Y
    }
    else if(CameraDirection1 == -2){
        NewX = -Y
    }
    else if(CameraDirection1 == 3){
        NewX = Z
    }
    else if(CameraDirection1 == -3){
        NewX = -Z
    }
    
    if(CameraDirection2 == 1){
        NewY = X
    }
    else if(CameraDirection2 == -1){
        NewY = -X
    }
    else if(CameraDirection2 == 2){
        NewY = Y
    }
    else if(CameraDirection2 == -2){
        NewY = -Y
    }
    else if(CameraDirection2 == 3){
        NewY = Z
    }
    else if(CameraDirection2 == -3){
        NewY = -Z
    }
    
    if(CameraDirection3 == 1){
        NewZ = X
    }
    else if(CameraDirection3 == -1){
        NewZ = -X
    }
    else if(CameraDirection3 == 2){
        NewZ = Y
    }
    else if(CameraDirection3 == -2){
        NewZ = -Y
    }
    else if(CameraDirection3 == 3){
        NewZ = Z
    }
    else if(CameraDirection3 == -3){
        NewZ = -Z
    }
    return [NewX, NewY, NewZ]
}
// Camera Orientation Function (LOGIC TABLE)