let names;
let libraryPromise = new Promise(async (resolve,reject)=>{
    let response = await fetch("http://localhost:8000/general/getEbookNames");
    names = await response.json();
    names = names["books"]
    if(response.ok){
        resolve();
    }else{
        reject();
    }
});

function createBookElement(bookName,status="Available",statusId=""){
    let bookEl = `<a class="https://michael.raggleai.com/site3.html?book=${bookName}&page=1"><div class="book-card bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer" onclick="openBook('${bookName}')">
    <div class="relative pb-3/4">
      <img src="PAGES/1.jpg" alt="Book cover" class="absolute h-full w-full object-cover" />
      <div class="absolute top-0 right-0 bg-red rounded-bl-lg p-2">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22.5C11.5833 22.5 11.1673 22.4167 10.752 22.25C10.3367 22.0833 9.98332 21.85 9.69165 21.55L3.44165 15.3C2.84165 14.7 2.54165 13.9583 2.54165 13.075C2.54165 12.1917 2.84165 11.45 3.44165 10.85C4.04165 10.25 4.78332 9.95 5.66665 9.95C6.54999 9.95 7.29165 10.25 7.89165 10.85L12 14.95L16.1083 10.85C16.7083 10.25 17.45 9.95 18.3333 9.95C19.2167 9.95 19.9583 10.25 20.5583 10.85C21.1583 11.45 21.4583 12.1917 21.4583 13.075C21.4583 13.9583 21.1583 14.7 20.5583 15.3L14.3083 21.55C14.0167 21.85 13.6627 22.0833 13.2462 22.25C12.8294 22.4167 12.4167 22.5 12 22.5Z" />
        </svg>
      </div>
    </div>
    <div class="p-4">
      <h3 class="font-bold text-lg mb-1">${bookName}</h3>
      <p class="text-gray-600 text-sm" id="${statusId}">${status}</p>
    </div>
  </div></a>`

    return bookEl;
}

libraryPromise.then(()=>{
    let container = document.getElementById("libraryContainer");
    for(bookName of names){
        el = createBookElement(bookName);
        container.innerHTML+=el;
    }

}
,null);


function openBook(bookName){
    const url = new URL(window.location.href);
    url.pathname = "site3.html"
    url.searchParams.set("book", bookName);
    url.searchParams.set("page", "1");
    console.log(url.toString());
    window.location.href = url.toString();
}


document.addEventListener("DOMContentLoaded",()=>{
  let fileInput = document.getElementById("fileInput")

fileInput.addEventListener('change', (event) => {
  const files = event.target.files;

  if (files.length > 0) {
    const file = files[0];  // Since we allow multiple files, you can loop over all files if needed

    // Check the file type using the file's MIME type or extension
    const validMimeType = file.type === 'application/epub+zip'; // Check the MIME type
    const validExtension = file.name.endsWith('.epub');  // Check file extension

    if (validMimeType || validExtension) {
      // Proceed with sending the file to the server
      uploadFile(file);
      alert('File Uploaded successfully. Check section below for status');
    } else {
      alert('Please upload a valid EPUB file!');
    }
  } else {
    console.log('No file selected');
  }
});



function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  // Send the file to the Flask server using the Fetch API
  fetch('http://localhost:8000/upload', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      addToLibrary(file.name);
      console.log('File uploaded successfully');
    } else {
      console.log('Error uploading file');
    }
  })
  .catch(error => {
    console.error('Error uploading file:', error);
  });
}
});


function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
  }
  return result;
}

function removeExtension(filename) {
  return filename.split('.').slice(0, -1).join('.');
}

function addToLibrary(bookName){
  alert("Do not refresh the page while your new book is being Processed")
  let id = generateRandomString(6);
  let container = document.getElementById("libraryContainer");
  let el = createBookElement(removeExtension(bookName),"pending",id);
  container.innerHTML+= el;

  let count=0;
  let statusCheck = setInterval(()=>{
    fetch("http://localhost:8000/getBatchProcessStatus").then((response)=>{
      if(response.ok){
        return response.json();
      }
    }).then(responsejson=>{
      status0 = responsejson["status"];

      if(status0!="Processed"){
        count++;
      }

      if(status0=="Processed" && count>0){
        console.log("status check removed");
        clearInterval(statusCheck);
      }

      console.log("status",status0);
      let statusContainer = document.getElementById(id);
      statusContainer.innerHTML = status0;
    });  

  },500);
}
