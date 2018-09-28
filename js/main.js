//Text area auto resize
var textAreaResize = document.getElementsByTagName('textarea');

for (var i = 0; i < textAreaResize.length; i++) {
    textAreaResize[i].setAttribute('style', 'height:' + (textAreaResize[i].scrollHeight) + 'px;overflow-y:hidden;');
    textAreaResize[i].addEventListener("input", OnInput, false);
}

function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}
