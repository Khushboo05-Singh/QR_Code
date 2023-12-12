const generatorTab=document.querySelector(".nav-gene");
const scannerTab=document.querySelector(".nav-scan");

generatorTab.addEventListener("click", () =>{
    generatorTab.classList.add("active");
    scannerTab.classList.remove("active");

    document.querySelector(".scanner").style.display ="none";
    document.querySelector(".generator").style.display ="block";
})

scannerTab.addEventListener("click",() =>{
    scannerTab.classList.add("active");
    generatorTab.classList.remove("active");

    document.querySelector(".scanner").style.display ="block";
    document.querySelector(".generator").style.display ="none";
})


const generatorDiv = document.querySelector(".generator");
const generateBtn = generatorDiv.querySelector(".generator-form button");
const qrInput = generatorDiv.querySelector(".generator-form input");
const qrImg = generatorDiv.querySelector(".generator-img img");
const downloadBtn = generatorDiv.querySelector(".generator-btn .btn-link");


let imgURL = '';
generateBtn.addEventListener("click", () =>{
    let qrValue = qrInput.value;
    if(!qrValue.trim()) return;

    generateBtn.innerText ="Generating QR Code...";
    imgURL=`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrValue}`;

    qrImg.src = imgURL;

    qrImg.addEventListener("load", () => {
        generatorDiv.classList.add("active");
        generateBtn.innerText = "Generate QR Code";
    })
})

downloadBtn.addEventListener("click", () =>{
    if(!imgURL) return;
    fetchImage(imgURL)
})
function fetchImage(url){
    fetch(url).then(res => res.blob()).then(file => {
        console.log(file)
        let tempFile = URL.createObjectURL(file);
        let file_name = url.split("/").pop().split(".")[0];
        let extension = file.type.split("/")[1];
        download(tempFile, file_name, extension);
    })
    .catch(()=> imgURL = '');
}
function download(tempFile, file_name, extension){
    let a = document.createElement('a');
    a.href = tempFile;
    a.download = `${file_name}.${extension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

qrInput.addEventListener("input", () =>{
    if(!qrInput.value.trim())
    return generatorDiv.classList.remove("active");
})


const scannerDiv = document.querySelector(".scanner");

const camera = scannerDiv.querySelector("h1 .fa-camera");
const stopCam = scannerDiv.querySelector("h1 .fa-camera-stop");

const form = scannerDiv.querySelector(".scanner-form");
const fileInput = form.querySelector("input");
const p = form.querySelector("p");
const img = form.querySelector("img");
const video = form.querySelector("video");
const content = form.querySelector(".content");

const textarea = scannerDiv.querySelector(".scanner-details textarea");
const copyBtn = scannerDiv.querySelector(".scanner-details .copy");
const closeBtn = scannerDiv.querySelector(".scanner-details .close");

form.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", e=>{
    let file =e.target.files[0];
    if(!file) return;
    fetchRequest(file);
})

function fetchRequest(file){
    let formData= new FormData();
    formData.append("file", file);

    p.innerText = "Scanning QR Code...";
    fetch(`http://api.qrserver.com/v1/read-qr-code/`, {
        method: "POST", body: formData
    }).then(res => res.json()).then(result =>{
        let text = result[0].symbol[0].data;
        
        if(!text)
            return p.innerText = "Couldn't Scan QR Code";

        scannerDiv.classList.add("active");
        form.classList.add("active-img");

        img.src = URL.createObjectURL(file);
        textarea.innerText = text;
    })
}

copyBtn.addEventListener("click",() => {
    let text = textarea.textContent;
    navigator.clipboard.writeText(text);
})


closeBtn.addEventListener("click", () => stopScan());

function stopScan(){
    p.innerText = "Upload QR Code to Scan";

    scannerDiv.classList.remove("active");
    form.classList.remove("active-img");
}


