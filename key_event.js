// https://gist.github.com/SathyaBhat/894012/9d109913c6252dd22975856908e3d792f30a5bee

if (window == top) {
    window.addEventListener('keyup', doKeyPress, false); //add the keyboard handler
}
    

function doKeyPress(e) {
    

    if (e.ctrlKey && e.keyCode == 13){ // ctrl+Enter
        var p = document.getElementById("postEntryID");
        alert('toto')
        //p.click();
        if (p!= null) {
            alert('toto')
            //p.click()
        }
        
    }
}