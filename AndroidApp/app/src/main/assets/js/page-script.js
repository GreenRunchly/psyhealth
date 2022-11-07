/* Loading Screen */
window.onload = function () {
    var intervalLoadingScreen = setInterval(function () {
        $("body").css('overflow-y','auto');
        $(".app-cloack").fadeOut(500);
        clearInterval(intervalLoadingScreen);
    },500);
}
/* Nav Bar */
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (currentScrollPos < 20) {
        $("#navigation-bar-hide").removeClass('blur');
    } else {
        $("#navigation-bar-hide").addClass('blur');
    }
    prevScrollpos = currentScrollPos;
    //console.log(currentScrollPos);
}

if (typeof $_GET['pesan'] !== 'undefined'){
    console.log($_GET['pesan']);
    $('.pesan_get').html($_GET['pesan']);
}
$(document).on('click','.to-page',function(e){
    var destination = $(this).attr("to-page");        
    window.location.replace(destination);
});
$(document).on('click','.halamanMundur',function(e){
    history.back()
});

