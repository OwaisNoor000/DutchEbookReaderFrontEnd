// Attach URI paramaters to set it to page 1 by default
// window.addEventListener("DOMContentLoaded",()=>{
//     let url = new URL(window.location.href);
//     console.log("initial url",window.location.href)

//     let paramaters = new URLSearchParams(url.search);

//     paramaters.set("book","Jip&Janneke")
//     paramaters.set("page","1");

//     url.search = paramaters.toString();

//     console.log("url",url.toString());
//     window.location.href=url.toString();
// });


let mappings = [];
let stopBoxes = [];
let timeStamps = []
async function loadMappings() {
    try {

        // get book and page from url
        const url = new URL(window.location.href);
        let params = new URLSearchParams(url.search);
        let book = params.get("book");
        let page = params.get("page");

        const response = await fetch(`http://localhost:8000/boxes/${book}/${page}`); // Fetch JSON file from the server
        if (!response.ok) throw new Error('Network response was not ok');
        
        mappings = await response.json(); // Parse JSON
        return mappings
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

async function loadAudio() {
    try {
        const response = await fetch('http://localhost:8000/boxMappings.json'); // Fetch JSON file from the server
        if (!response.ok) throw new Error('Network response was not ok');
        
         mappings = await response.json()[30]; // Parse JSON
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

async function loadStopBoxes() {
    try {
        const response = await fetch('http://localhost:8000/stopBoxes.json'); // Fetch JSON file from the server
        if (!response.ok) throw new Error('Network response was not ok');
        
        result = await response.json(); // Parse JSON
        stopBoxes = result[0]
        return stopBoxes
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

async function loadTimeStamps() {
    // get book and page from url
    const url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    let book = params.get("book");
    let page = params.get("page");    


    try {
        const response = await fetch(`http://localhost:8000/timeStamps/${book}/${page}`); // Fetch JSON file from the server
        if (!response.ok) throw new Error('Network response was not ok');
        
        result = await response.json(); // Parse JSON
        timeStamps = result
        return timeStamps
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

async function loadImage(){
    // get book and page from url
    const url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    let book = params.get("book");
    let page = params.get("page");    
    

    let img = document.getElementById("page-image");
    let pageNo = document.getElementById("pageNumber");
    img.src = `http://localhost:8000/image/${book}/${page}`
    pageNo.innerHTML = page;

}

loadStopBoxes().then(() => {
    console.log('StepBoxes:', stopBoxes);
});
loadMappings().then(() => {
    console.log('Mappings:', mappings);
});
loadTimeStamps().then(() => {
    console.log('TimeStamps:', timeStamps);
});
loadImage().then(() => {
    console.log('Loaded Images');
});





// (async ()=>{
//     mappings = await loadMappings();
//     console.log("Mappings")
//     console.log(mappings);
// })();
// (async ()=>{
//     mappings = await loadStepBoxes();
//     console.log("Step boxes");
//     console.log(mappings);
// })();


cursor = document.getElementById("cursor");

function moveCursor(originalBBox) {
    const img = document.getElementById("page-image");
    const cursor = document.getElementById("cursor");
    const container = document.getElementById("book-page");

    if (!img || !cursor) {
        console.error("Image or cursor element not found!");
        return;
    }

    // Get the original (intrinsic) image size
    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;

    // Get displayed (resized) image size
    const displayedWidth = img.clientWidth;
    const displayedHeight = img.clientHeight;

    // Calculate scaling factors dynamically
    const scaleX = displayedWidth / originalWidth;
    const scaleY = displayedHeight / originalHeight;

    // Extract original bounding box values
    const [origLeft, origTop, origWidth, origHeight] = originalBBox;

    // Scale bounding box based on the new image size
    const newLeft = origLeft * scaleX;
    const newTop = origTop * scaleY;
    const newWidth = origWidth * scaleX;
    const newHeight = origHeight * scaleY;

    const offset = 10;
    const highlightPadding = 2;

    // Move cursor to the new scaled position
    cursor.style.left = `${newLeft + newWidth + offset / 2}px`; // Center horizontally
    cursor.style.top = `${newTop + newHeight + offset/ 2}px`; // Center vertically

    // draw a box
    const box = document.createElement("div");
    box.classList.add("highlight-box");
    box.style.left = `${newLeft-highlightPadding}px`;
    box.style.top = `${newTop-highlightPadding}px`;
    box.style.width = `${newWidth+highlightPadding}px`;
    box.style.height = `${newHeight+highlightPadding}px`;
    container.appendChild(box)
    
}

// document.addEventListener("DOMContentLoaded",()=>{
//     console.log("Moving to")
//     console.log(stopBoxes[0]);
//     moveCursor(stopBoxes[0]);
// });

function insertHighlightBoxes(originalBBox,class_name){
    const img = document.getElementById("page-image");
    const container = document.getElementById("book-page");

    if (!img || !container) {
        console.error("Image or cursor element not found!");
        return;
    }

    // Get the original (intrinsic) image size
    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;

    // Get displayed (resized) image size
    const displayedWidth = img.clientWidth;
    const displayedHeight = img.clientHeight;

    // Calculate scaling factors dynamically
    const scaleX = displayedWidth / originalWidth;
    const scaleY = displayedHeight / originalHeight;

    // Extract original bounding box values
    const [origLeft, origTop, origWidth, origHeight] = originalBBox;

    // Scale bounding box based on the new image size
    const newLeft = origLeft * scaleX;
    const newTop = origTop * scaleY;
    const newWidth = origWidth * scaleX;
    const newHeight = origHeight * scaleY;

    const offset = 10;
    const highlightPadding = 5;

    // draw a box
    const box = document.createElement("div");
    box.classList.add("highlight-box");
    box.classList.add(class_name);
    box.style.left = `${newLeft-highlightPadding}px`;
    box.style.top = `${newTop-highlightPadding}px`;
    box.style.width = `${newWidth+highlightPadding}px`;
    box.style.height = `${newHeight+highlightPadding}px`;
    container.appendChild(box)
}

// Move the cursor to a stop word
// let cursorInterval = setInterval(()=>{
//     if(stopBoxes!=[]){
//         moveCursor(stopBoxes[4]["position"]);
//         clearInterval(cursorInterval);
//     }
// },500)

// Insert hight boxes
let highlightInterval = setInterval(()=>{
    if(mappings!=[]){
        mappings.forEach(
            box=>{
                insertHighlightBoxes(box["position"],box["class"])
            }
        );

        let x = document.querySelectorAll(".highlight-box");
        x.forEach(box=>{
            let class_name = box.classList[1];
            box.setAttribute("onmouseover", `showBoxes("${class_name}")`);
        })
        x.forEach(box=>{
            let class_name = box.classList[1];
            box.setAttribute("onmouseout", `hideBoxes("${class_name}")`);
        })

        x.forEach(box=>{
            let class_name = box.classList[1];
            box.setAttribute("onclick", `addBoxes("${class_name}")`);
        })
        

        // moveCursor(stopBoxes[4]["position"]);
        clearInterval(highlightInterval);
    }
},500)


Array.from(document.getElementsByClassName("highlight-box")).forEach(element => {
    element.addEventListener("click", () => {
        
        let secondClass = element.classList[1];
        document.querySelectorAll(`.${secondClass}`).forEach(element => {
            element.style.backgroundColor = "yellow";
        });
    });
});

function showBoxes(class_name){
    document.querySelectorAll(`.${class_name}`).forEach(element => {
        element.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
        // console.log(element);
    });
}

function hideBoxes(class_name){
    document.querySelectorAll(`.${class_name}`).forEach(element => {
        element.style.backgroundColor = "";
        // console.log(element);
    });
}

linesToPlay = new Set();

function addBoxes(class_name){

    // check if line is clicked or not
    let clicked = false;

    let elements = document.querySelectorAll(`.${class_name}`);
    let firstEl = elements[0];
    console.log("firstEl")
    console.log(firstEl)

    if(firstEl.hasAttribute("data-clicked")){
        if(firstEl.getAttribute("data-clicked")=="true"){
            clicked=true;
        }else{
            clicked=false;
        }
    }else{
        clicked = false;
    }


    // show boxes and remove mouseout attribute
    if(!clicked){
        elements.forEach(box=>{
            // alert(1);
            box.setAttribute("onmouseout", "");
            box.setAttribute("data-clicked", "true");
            showBoxes(class_name);
        });
        linesToPlay.add(class_name);
    }else{ //This branch is for hiding the boxes again
        linesToPlay.delete(class_name);
        elements.forEach(box=>{
            // alert(1);
            box.setAttribute("onmouseout", `hideBoxes("${class_name}")`);
            box.setAttribute("data-clicked", "false");
            hideBoxes(class_name);
        });
    }   

}

// this function is used to batch consecutive values in an integer array
function batchConsecutive(arr) {
    if (arr.length === 0) return [];

    let result = [];
    let tempBatch = [arr[0]];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] === arr[i - 1] + 1) {
            tempBatch.push(arr[i]);
        } else {
            result.push(tempBatch.length > 1 ? tempBatch : tempBatch[0]);
            tempBatch = [arr[i]];
        }
    }

    // Push the last batch
    result.push(tempBatch.length > 1 ? tempBatch : tempBatch[0]);

    return result;
}

let audio=null;
let context=null;
let audioBuffer=null;
async function playAudio(){

    // Change icon to resume
    let playbtn =document.getElementById("play-btn");
    playbtn.innerHTML = "<img src='resources/resume.svg' class='h-6 w-6'>"

    console.log("DEBUGGING playAudio()");
    // create audio object
    let audioPromise = new Promise(async (resolve,reject)=>{
        // get book and page from url
        const url = new URL(window.location.href);
        let params = new URLSearchParams(url.search);
        let book = params.get("book");
        let page = params.get("page");
        

        context = new AudioContext();
        const media = await fetch(`http://localhost:8000/audio/${book}/${page}`);
        const arrayBuffer = await media.arrayBuffer();
        audioBuffer = await context.decodeAudioData(arrayBuffer);

        audio = context.createBufferSource();
        audio.buffer = audioBuffer;
        audio.connect(context.destination);

        resolve();
    });
    

    // convert to indexes and sort
    console.log("deriving indexes from set",linesToPlay)
    indexesToPlay = new Array();
    for(line of linesToPlay){
        let number = parseInt(line.match(/\d+/)[0],10);
        indexesToPlay[indexesToPlay.length] = number
    }
    indexesToPlay.sort((x, y) => x - y);
    console.log("indexesToPlay",indexesToPlay);

    // batch consecutive indexes
    let batchedIndexes = batchConsecutive(indexesToPlay)

    // get start and end times
    startTimes = new Array();
    endTimes = new Array();
    
    for(batch of batchedIndexes){
        if(Array.isArray(batch)){
            startTimes.push(parseInt(timeStamps[batch[0]]["sec"],10));
            endTimes.push(parseInt(timeStamps[batch[batch.length-1]+1]["sec"],10));
        }else{
            startTimes.push(parseInt(timeStamps[batch]["sec"],10));
            endTimes.push(parseInt(timeStamps[batch+1]["sec"],10));
        }

    }


    console.log("TIMINGS REPORT");
    console.log(batchedIndexes);
    console.log(startTimes);
    console.log(endTimes);


    await audioPromise;

    // get start and end times of audio segements according to indexes
    let enumeration = 0;
    for(index of batchedIndexes){
        //change background to GREEN of line being read
        console.log("turning BG green for containers of class",`.line-${index}`)
        if(Array.isArray(index)){
            for(j of index){
                document.querySelectorAll(`.line${j}`).forEach(element => {
                    element.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
                    // console.log(element);
                });        
            }
        }else{
            document.querySelectorAll(`.line${index}`).forEach(element => {
                element.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
                // console.log(element);
            });
        }

        // forward to time of line and play
        let progressms = startTimes[enumeration];
        let pauseTime = endTimes[enumeration];

        console.log("start ms",progressms);
        console.log("end ms",pauseTime);

        // reload audio buffers;
        audio = context.createBufferSource();
        audio.buffer = audioBuffer;
        audio.connect(context.destination);

        let playingSegment = new Promise( async (resolve,reject)=>{
            
            let currentTime = progressms;
            let endTime = pauseTime;
            let duration = endTime - currentTime;
            let audioOffsetSeconds = 1;
            console.log(duration,"duration")

            let condition=index==0;
            if(Array.isArray(index)){
                condition=index.includes(0);
            }

            // if(condition){
            //     await audio.start(0,currentTime,duration+0.5);
            // }else{
            //     await audio.start(0,currentTime-audioOffsetSeconds,duration+0.5);
            // }
            await audio.start(0,currentTime,duration);

            console.log("Step 1. Playing audio")

            // pauseCheck = setInterval(()=>{
            //     console.log("context state",context.state);
            // }
            //     ,1000);

            audio.onended = ()=>{

                resolve("Audio ended");
                console.log("Audio ended");

                // change the highlights back to red
                if(Array.isArray(index)){
                    for(j of index){
                        document.querySelectorAll(`.line${j}`).forEach(element => {
                            element.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
                            // console.log(element);
                        });        
                    }
                }else{
                    document.querySelectorAll(`.line${index}`).forEach(element => {
                        element.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
                        // console.log(element);
                    });
                }
            }

            });
        
        await playingSegment.then(()=>{console.log("Audio segment played")},(error)=>{
            console.log(error);
        });


        
        enumeration++;

        // delay for i second
        await new Promise(resolve => setTimeout(resolve, 1000));

    }


    // for(line of linesToPlay){
    //     let number = line[line.length-1];
    //     let audio = new Audio(`http://localhost:8000/getAudioChunk/chunk_${number}.mp3`);
        
    //     showBoxes(line);
    //     await audio.play();
    //     await new Promise(resolve => audio.onended = resolve);
    //     hideBoxes(line);
    // }

    let icon =`<svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
    </svg>`

    playbtn.innerHTML=icon;
        
}

// async function playAudio(){
//     let context = new AudioContext();

// const response = await fetch("http://localhost:8000/getAudio");
// const arrayBuffer = await response.arrayBuffer();

// const audioBuffer = await context.decodeAudioData(arrayBuffer);

// const source = context.createBufferSource();
// source.buffer = audioBuffer;
// source.connect(context.destination);
// source.start(0,2.5)

// let x = setInterval(()=>{
//     console.log(context.currentTime);
// },500)

// }

// playAudio();


function nextPage(){
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);

    let page = params.get("page");

    let nextPage = parseInt(page,10)+1;
    console.log("nextPage",nextPage);

    params.set("page",nextPage.toString());
    url.search = params.toString()

    console.log(url.toString())

    window.location.href = url.toString();
    let pageNo = document.getElementById("pageNumber");
    pageNo.innerHTML = nextPagepage;
}

function prevPage(){
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);

    let page = params.get("page");

    if(page!=1){
        let nextPage = parseInt(page,10)-1;
    console.log("nextPage",nextPage);

    params.set("page",nextPage.toString());
    url.search = params.toString()

    console.log(url.toString())

    window.location.href = url.toString();
    }

    
}

