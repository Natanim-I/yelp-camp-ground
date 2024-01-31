function checkFileCount(input){
    let maxFileCount = 5;
    let Images = document.querySelector(".file-error")

    if(input.files.files > maxFileCount){
        $(input).val("")
        Images.textContent = "Select only Upto Five Images!"
    }
}