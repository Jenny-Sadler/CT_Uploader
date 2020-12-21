const url = 'https://4bnypbtsa2.execute-api.eu-west-2.amazonaws.com/default/getPreSignedURL';
const options = {
    method: 'GET',
};
    
let form = document.getElementById("form");
form.addEventListener("submit", onSubmit);
    
    
async function onSubmit(event) {
    event.preventDefault();
    console.log("clicked!!!!")
    if (form.fileOne.files.length < 1 || form.fileTwo.files.length < 1) {
        alert('select both files please');
            return false;
        }
    const fileOne = form.fileOne.files[0];
    const urlWithFilenameOne = url + `?filename=${fileOne.name}`;
    console.log(urlWithFilenameOne)
    const fileTwo = form.fileTwo.files[0];
    const urlWithFilenameTwo = url + `?filename=${fileTwo.name}`;
    console.log(urlWithFilenameTwo)


    fetch(urlWithFilenameOne, options)
        .then(response => response.json())    
        .then(data => {   
            console.log(data.uploadURL); 
            console.log(data.filename)
            uploadFile(data.uploadURL, fileOne)
                }).then(data => {
                            alert('Hooray!You uploaded ' + fileOne.name);
                            //form.reset();
            });

    fetch(urlWithFilenameTwo, options)
        .then(response => response.json())    
        .then(data => {   
            console.log(data.uploadURL); 
            console.log(data.filename)
            uploadFile(data.uploadURL, fileTwo)
                }).then(data => {
                            alert('Hooray!You uploaded ' + fileTwo.name);
                            //form.reset();
            });
}

async function uploadFile(uploadURL, file) {
console.log("uploading file " + file.name)
let uploadResponse = await fetch(uploadURL, {
    method: "PUT",
    //headers: {
       // 'Access-Control-Allow-Methods': '*',
        //'Access-Control-Allow-Origin': '*',
        //"Content-Type": "text/csv",
       // 'x-amz-acl': 'public-read',
    //},
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
    
     



    
    