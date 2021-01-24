const url = 'https://4bnypbtsa2.execute-api.eu-west-2.amazonaws.com/default/getPreSignedURL'; //API Gateway URL. Once API GAteway is called, the lambda is triggered which 
//carried out file validation and returns pre-signed URLs if files pass checks

const options = {
    method: 'GET',
}; //APIO Gateway will be called with GET method
    
let form = document.getElementById("form");
form.addEventListener("submit", onSubmit);
    
 //Once user submits both files, the below function pings the API Gateway with the parameters needed.   
async function onSubmit(event) {
    
    event.preventDefault(); //prvents the form being submitted the usual way. 
    if (form.fileOne.files.length < 1 || form.fileTwo.files.length < 1) { //checks if user has added 2 files (this is the only validation done client side)
        alert('Please select two files');
            return false;
        }
        
    const ladCode = form.lad.value //Local Authority code selected by user in form
    const fileOne = form.fileOne.files[0]; //First file chosen (EXTRACT file)
    const fileTwo = form.fileTwo.files[0]; //Second file chosen (MANI file)
    const fileOneObject = {
        fileSize: fileOne.size,
        fileType: fileOne.type
    }
    const urlWithParameters = url + `?fileOneName=${fileOne.name}&fileOneType=${fileOne.type}&fileTwoName=${fileTwo.name}&fileTwoType=${fileTwo.type}&ladCode=${ladCode}&fileOneSize=${fileOne.size}&fileTwoSize=${fileTwo.size}&fileOne=${fileOneObject}&fileTwo=${fileTwo}`;

    fetch(urlWithParameters, options) //pings API Gateway which triggers lambda. File verification is carried out by lambda - the message in the reponse depeneds on if and why the files fail the checks
        .then(response => response.json())    
        .then(data => {   
            console.log("message : " + data.message)
            if(data.message === "file is incorrect type"){
                alert(`${data.filename} is not csv`);
            
            } else if(data.message === "file incorrectly named") {
                alert(`${data.filename} is incorrectly named`);
                
            }  else if(data.message === "file is empty") {
                alert(`${data.filename} is empty`);
                
            } else if(data.message === "file names dont match") {
                alert(`File names dont match. Please check`);
                console.log(data.q)
                
                
                
            } else {
                uploadFile(data.uploadURLFileOne, fileOne).then(data => {   //If all file verification checks pass, each file is uploded to its individual pre-signed URL which puts file in s3 bucket
                    alert('Hooray! You uploaded ' + fileOne.name);         //Bucket is specified in lambda
                })
                uploadFile(data.uploadURLFileTwo, fileTwo).then(data => {
                    alert('Hooray! You uploaded ' + fileTwo.name);
                })
            }
        });
       
}

async function uploadFile(uploadURL, file) {
console.log("uploading file " + file.name)
let uploadResponse = await fetch(uploadURL, {
    method: "PUT",
    body: file
        }).then(resp => {
            return resp.text().then(body => {
                
                const result = {
                    status: resp.status,
                    body,
                };
                console.log(result)
                if (!resp.ok) {
                    return Promise.reject(result);
                }
                console.log(result);
                return result;
             });
        });
}
     
    
(window);
    
     



    
    