/* Meta Data Aplikasi */
var appVersion = '1.3.0'; /// versi aplikasi
var appDeviceID = '';
var appServer = 'https://api.sman3kabupatentangerang.sch.id'; /// tanpa slash di akhir 'http://localhost','https://greenrunchly.github.io'
var appConnected = 'off';

var appSettingsKelas = '12';
var appSettingsJurusan = 'ips';
var appSettingsRuang = '1';
var appSettingsBagian = 'genap';
var appSettingsKelasFull = appSettingsKelas+'-'+appSettingsJurusan+'-'+appSettingsRuang;
var appSettingsJenisJadwal = 'ptm';

var appSettingsTheme = 'dark-theme';
var appSettingsDebugMode = 'on';

var appSettingsStartupDone = 0;
var appSettingsFillComplete = 0;
var appStorageTips = '';
var appStorageBanner = '';
var appStorageLegendPTM = '';
var appStorageDataJadwalPTM = '';
var appStorageLegendPJJ = '';
var appStorageDataJadwalPJJ = '';

/* Loading Screen */
window.onload = function () {
    var intervalLoadingScreen = setInterval(function () {
        $("#loading").addClass('loaded');
        $("body").css('overflow-y','auto');
        clearInterval(intervalLoadingScreen);
        var intervalLoadingScreenRemove = setInterval(function () {
            $("#loading").remove();
            clearInterval(intervalLoadingScreenRemove);
        },1000);
    },500);
}
/* Penyetelan Tanggal dan Waktu */
var appSettingsDate = new Date();
var appSettingsDateDay = appSettingsDate.getDay();
var appSettingsDateHour = appSettingsDate.getHours();
var appSettingsDateMinute = appSettingsDate.getMinutes();
var appSettingsDateSecond = appSettingsDate.getSeconds();
var appSettingsDateFormat = appSettingsDate.getHours() + ":" + appSettingsDate.getMinutes() + ":" + appSettingsDate.getSeconds();
var appSettingsDateDayFormat = setelFormatHari(appSettingsDateDay);
var appSettingsDateTimestamp = Math.floor(Date.now() / 1000);

var waktuRefresh = setInterval(function(){ 

    appSettingsDate = new Date();
    appSettingsDateDay = appSettingsDate.getDay();
    appSettingsDateHour = appSettingsDate.getHours();
    appSettingsDateMinute = appSettingsDate.getMinutes();
    appSettingsDateSecond = appSettingsDate.getSeconds();
    appSettingsDateFormat = appSettingsDate.getHours() + ":" + appSettingsDate.getMinutes() + ":" + appSettingsDate.getSeconds();
    appSettingsDateDayFormat = setelFormatHari(appSettingsDateDay);
    appSettingsDateTimestamp = Math.floor(Date.now() / 1000);
    //console.log(appSettingsDateTimestamp);
    appCekWidget();

}, 1000);
/// Check Internet Connection Function
var chknet = setInterval(function(){ 

    appCekKoneksi();
    appCekUpdate();

}, 10000);
/* System Functions */
function setData(input,pada){
    /* simpan data */
    localStorage.setItem(pada, input);
    /// Switch Ruang Input Kelas 
    appSwitchRuang(input, pada);
    console.log('Set Data "'+pada+'"');
}  
function loadData(pada){
    /* load data */
    return localStorage.getItem(pada);
    console.log('Load Data "'+pada+'"');
}
function deleteData(pada){
    /* load data */
    return localStorage.removeItem(pada);
    console.log('Delete Data "'+pada+'"');
}
function setelFormatHari(angkaHari){
    switch (angkaHari) {
        case 0:
            formatHari = "Minggu";
            break;
        case 1:
            formatHari = "Senin";
            break;
        case 2:
            formatHari = "Selasa";
            break;
        case 3:
            formatHari = "Rabu";
            break;
        case 4:
            formatHari = "Kamis";
            break;
        case 5:
            formatHari = "Jumat";
            break;
        case 6:
            formatHari = "Sabtu";
            break;
        default:
            formatHari = "Unknow";
    }
    return formatHari;
}
function acakArray1D(arra1) {
    var ctr = arra1.length, temp, index;

    // While there are elements in the array
    while (ctr > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
        ctr--;
        // And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}
function appSwitchRuang(input,pada){
    if (pada == 'app_settings_jurusan'){
        if (input == 'mipa'){
            $("#select_kelas_ruang").empty();
            $("#select_kelas_ruang").append('<option value="">Pilih Ruangan</option>');
            for (var i = 1; i <= 7; i++) {
                $("#select_kelas_ruang").append('<option value="' + i + '">' + i + '</option>');
            }
        }
        if (input == 'ips'){
            $("#select_kelas_ruang").empty();
            $("#select_kelas_ruang").append('<option value="">Pilih Ruangan</option>');
            for (var i = 1; i <= 5; i++) {
                $("#select_kelas_ruang").append('<option value="' + i + '">' + i + '</option>');
            }
        }
    }
}
/* Action Function */
/// Cek Koneksi Internet Function
function appCekKoneksi(){
    $.get(appServer + "/apps/jadwal-pelajaran/api/isconnected.json?v=" + appSettingsDateTimestamp,
    function(data, status){
        if ((data.maintenance == 1) && (appSettingsDebugMode == 'off')){
            appConnected = 'off';
            $("#app-notification-maintenance").addClass("on");
            $("#app-notification-maintenance").removeClass("off");
        }else{
            appConnected = 'on';
            $("#app-notification-connection").addClass("off");
            $("#app-notification-connection").removeClass("on");
            $("#app-notification-connection-connecting").addClass("off");
            $("#app-notification-connection-connecting").removeClass("on");
        }        
    }).fail(function(){ 
        appConnected = 'off';
        $("#app-notification-connection").addClass("on");
        $("#app-notification-connection").removeClass("off");
        $("#app-notification-connection-connecting").addClass("off");
        $("#app-notification-connection-connecting").removeClass("on");
        console.log('Connection Failed');
    });
}
/// Cek Update Function
function appCekUpdate(){
    $.get(appServer + "/apps/jadwal-pelajaran/api/version.json?v=" + appSettingsDateTimestamp,
    function(data, status){
        if (appSettingsDebugMode == 'off'){
            if (data.public != appVersion){
                $("#app-notification-update").addClass("on");
                $("#app-notification-update").removeClass("off");        
            }else{            
                $("#app-notification-update").addClass("off");
                $("#app-notification-update").removeClass("on");
            }
        }else{
            if (data.beta != appVersion){
                $("#app-notification-update").addClass("on");
                $("#app-notification-update").removeClass("off");        
            }else{            
                $("#app-notification-update").addClass("off");
                $("#app-notification-update").removeClass("on");
            }
        }
    }).fail(function(){         
        $("#app-notification-update").addClass("off");
        $("#app-notification-update").removeClass("on");
    });
}
/// Cek Berita Sekolah
function appCekBeritaSekolah(){
    $.post("https://api.sman3kabupatentangerang.sch.id/wp-get-post.php",{},
    function(data, status){
        $('#berita').html(data);
    });
}
/// Cek Banner Function
function appCekBanner(){
    addBanner = '';
    $("#banners").empty();
    $.each(appStorageBanner, function( index, value ) {
        addBanner += '<a class="swiper-slide" style="background-image: url('+ value +');"></a>';
    }); 
    $("#banners").append('<div class="swiper-container banner-swiper size size-2 full"><div class="swiper-wrapper">' + addBanner + '</div><div class="swiper-pagination"></div></div>');
    $("#banners").append('<script> var swiper = new Swiper(".banner-swiper", {spaceBetween: 0,centeredSlides: true,loop:true,autoplay: {delay: 2000,disableOnInteraction: false,},pagination: {el: ".swiper-pagination",clickable: true,},navigation: {nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev",},});</script>');
}
/// Cek Widget Function
function appCekWidget(){
    var gotDay = 0; var gotMapel = 0;
    if (appSettingsJenisJadwal == 'ptm'){
        var legendData = appStorageLegendPTM;
        var jadwalData = appStorageDataJadwalPTM;
    }
    if (appSettingsJenisJadwal == 'pjj'){
        var legendData = appStorageLegendPJJ;
        var jadwalData = appStorageDataJadwalPJJ;
    }    
    if (appSettingsBagian == 'ganjil'){
        var dataPelajaranTemp = jadwalData.a;
    }
    if (appSettingsBagian == 'genap'){
        var dataPelajaranTemp = jadwalData.b;
    }
    $.each(dataPelajaranTemp, function (index, obj) {
        if (index == appSettingsDateDayFormat.toLowerCase()){
            gotDay = 1;
            $.each(obj, function (key, value) {
                waktupertama = value.jam1.split('.');
                jam_mapel = parseInt(waktupertama[0]);
                menit_mapel = parseInt(waktupertama[1]);
                waktukedua = value.jam2.split('.');
                jam_mapel_2 = parseInt(waktukedua[0]);
                menit_mapel_2 = parseInt(waktukedua[1]);
                kodemapel = 'no'+ value.mapel;
                if (appSettingsDateHour >= jam_mapel){
                    if ((appSettingsDateMinute >= menit_mapel) || (appSettingsDateHour >= jam_mapel+1)){
                        gotMapel = 1;
                    $("#widget-jadwal-detail-hari").html(appSettingsDateDayFormat);
                        $("#widget-jadwal-detail-mapel").html(legendData[kodemapel].mapel);
                        $("#widget-jadwal-detail-namaguru").html(legendData[kodemapel].nama);
                        $("#widget-jadwal-clock").html('<h2>' + value.jam1.replace('.',':') + '</h2><h2>' + value.jam2.replace('.',':') + '</h2>');
                    }
                }else{
                    if (gotMapel == 0){
                        $("#widget-jadwal-detail-hari").html(appSettingsDateDayFormat);
                        $("#widget-jadwal-detail-mapel").html('Belum dimulai');
                        $("#widget-jadwal-detail-namaguru").html('Bisa lihat jadwal dibawah');
                        $("#widget-jadwal-clock").html('<div class="loading-page"><img class="icon-white" src="i/clock.svg"></div>');
                    }
                }
            });    
        }else{
            if (gotDay == 0){
                $("#widget-jadwal-detail-hari").html(appSettingsDateDayFormat);
                $("#widget-jadwal-detail-mapel").html('Tidak ada Pelajaran');
                $("#widget-jadwal-detail-namaguru").html('Selamat Berlibur!');
                $("#widget-jadwal-clock").html('<div class="loading-page"><img class="icon-white" src="i/cloud-moon.svg"></div>');
            }
        }
    });
}
/// Reset Widget
function appResetWidget(arg1,arg2,arg3){
    $("#widget-jadwal-detail-mapel").html(arg1);///'Tunggu Sesaat...'
    $("#widget-jadwal-detail-namaguru").html(arg2);///'Applying App Settings...'
    $("#widget-jadwal-clock").html('<div class="loading-page anim-rotate"><img class="icon-white" src="' + arg3 + '"></div>');/// i/spinner-third.svg
}
/// Cek Jadwal Function
function appCekJadwal(){

    $("#table-jadwal").empty();
    addTable = '';
    if (appSettingsJenisJadwal == 'ptm'){
        var legendData = appStorageLegendPTM;
        var jadwalData = appStorageDataJadwalPTM;
    }
    if (appSettingsJenisJadwal == 'pjj'){
        var legendData = appStorageLegendPJJ;
        var jadwalData = appStorageDataJadwalPJJ;
    }    
    if (appSettingsBagian == 'ganjil'){
        var dataPelajaranTemp = jadwalData.a;
    }
    if (appSettingsBagian == 'genap'){
        var dataPelajaranTemp = jadwalData.b;
    }
            
    $.each(dataPelajaranTemp, function (index, obj) {

        if (index == appSettingsDateDayFormat.toLowerCase()){
            var setTable = 'on';
        }else{
            var setTable = 'off';
        }
                
        indexEdit = index.substr(0,1).toUpperCase()+index.substr(1);
        addTable += '<div class="table-jadwal-head toggle-table" reset-class="table-jadwal" toggle-id="ptm-' + index + '"><img src="i/book-spells.svg"><h2>' + indexEdit + '</h2></div>';
        addTable += '<table class="table-jadwal ' + setTable + '"  id="ptm-' + index + '"><tr><th class="jam">Jam</th><th class="waktu">Waktu</th><th class="mapel">Mata Pelajaran</th></tr>'
        $.each(obj, function (key, value) {
            kodemapel = 'no'+ value.mapel;
            jamke = key.replace('no','');
            addTable += '<tr><td class="jam">' +jamke+ '</td><td class="waktu"><h4>' + value.jam1 + '</h4><h4>' + value.jam2 + '</h4></td><td class="mapel"><h2>' + legendData[kodemapel].mapel + '</h2><h4>' + legendData[kodemapel].nama + '</h4></td></tr>';

        });
        addTable += '</table>';
    });
    $("#table-jadwal").html(addTable);
    /// Reset Widget
    appResetWidget('Tunggu sesaat..','Mengambil Jadwal...','i/spinner-third.svg');
}
/// Cek Tips Function
function appCekTips(){    
    temp = acakArray1D(appStorageTips);
    console.log('App Check tips!');
    $("#loading-tips").html(temp[0]);
}
/// Reset App Data Function
function appDeleteStorage(tipe){
    if (tipe == 'all'){
        localStorage.clear();
        console.log('App Delete All Success!');
        window.location.reload();
    }else{
        deleteData(tipe);
        console.log('Data "'+tipe+'" Delete Success!');
    }
}
/// Menyimpan Data dari Server
function appSavingServerData(){
    var appServerResource = [
        appServer + '/apps/jadwal-pelajaran/api/tips.json?v=' + appSettingsDateTimestamp,
        appServer + '/apps/jadwal-pelajaran/api/banner.json?v=' + appSettingsDateTimestamp,
        appServer + '/apps/jadwal-pelajaran/data/' + appVersion + '/legend-ptm.json?v=' + appSettingsDateTimestamp,
        appServer + '/apps/jadwal-pelajaran/data/' + appVersion + '/' + appSettingsKelasFull + '-ptm.json?v=' + appSettingsDateTimestamp
    ]
    var appServerResourceSet = [
        'app_storage_tips',
        'app_storage_banner',
        'app_storage_legendptm',
        'app_storage_datajadwalptm'
    ]
    /*
        appServer + '/apps/jadwal-pelajaran/data/' + appVersion + '/legend-pjj.json?v=' + appSettingsDateTimestamp,
        appServer + '/apps/jadwal-pelajaran/data/' + appVersion + '/' + appSettingsKelasFull + '-pjj.json?v=' + appSettingsDateTimestamp
        
        'app_storage_legendpjj',
        'app_storage_datajadwalpjj'
    */
    var progress = 0;
    $.each(appServerResource, function( index, value ) {
        /// Looping Saving
        console.log('Init "' + value + '"');
        $.get(value, function(data, status){
            if (status == 'success'){
                var data = JSON.stringify(data);
                setData(data, appServerResourceSet[index]); 
                console.log(index+'Init "' + value + '" Success to ' + appServerResourceSet[index]);
                progress ++;
                if (progress == 4){
                    appLoadServerData();
                }
            }
        });
        
    });
}
function appLoadServerData(){
    var dataError = 0;
    if ( loadData('app_storage_tips') !== null ) {
        appStorageTips = JSON.parse(loadData('app_storage_tips'));
    }else{
        dataError ++;
    }
    if ( loadData('app_storage_banner') !== null ) {
        appStorageBanner = JSON.parse(loadData('app_storage_banner'));
        //console.log(appStorageBanner);
    }else{
        dataError ++;
    }
    if ( loadData('app_storage_legendptm') !== null ) {
        appStorageLegendPTM = JSON.parse(loadData('app_storage_legendptm'));
    }else{
        dataError ++;
    }
    if ( loadData('app_storage_datajadwalptm') !== null ) {
        appStorageDataJadwalPTM = JSON.parse(loadData('app_storage_datajadwalptm'));
        //console.log(appStorageDataJadwalPTM)
    }else{
        dataError ++;
    }
    /*if ( loadData('app_storage_legendpjj') !== null ) {
        appStorageLegendPJJ = JSON.parse(loadData('app_storage_legendpjj'));
    }else{
        dataError ++;
    }
    if ( loadData('app_storage_datajadwalpjj') !== null ) {
        appStorageDataJadwalPJJ = JSON.parse(loadData('app_storage_datajadwalpjj'));
    }else{
        dataError ++;
    }*/
    /// Load tips
    appCekTips();
    /// Reload Berita
    appCekBeritaSekolah();
    console.log('Load Data Success to App');  
    return dataError;  
}
function appLoadSettingsData(){
    var dataError = 0;

    /// Version App
    $("#appVersion").html(appVersion);
    if (appSettingsDebugMode == 'on'){
        $("#appVersionMode").html('Insider Student Edition');
    }else{
        $("#appVersionMode").html('Student Release');
    }
    

    /// DeviceID Item
    if ( loadData('app_device_id') !== null ) {
        appDeviceID = loadData('app_device_id');
    }else{
        appDeviceID = 'U-'+Date.now();
        setData(appDeviceID, 'app_device_id');
    }
    $('#DeviceID').html(appDeviceID);


    appSettingsFillComplete = 0;
    /// Kelas Item
    if ( loadData('app_settings_kelas') !== null ) {
        appSettingsKelas = loadData('app_settings_kelas');
        $("#select_kelas").val(appSettingsKelas);
        appSettingsFillComplete ++;
    }else{
        dataError ++;
    }
    if ( loadData('app_settings_jurusan') !== null ) {
        appSettingsJurusan = loadData('app_settings_jurusan');
        $("#select_kelas_jurusan").val(appSettingsJurusan);
        appSwitchRuang(appSettingsJurusan,'app_settings_jurusan');
        appSettingsFillComplete ++;
    }else{
        dataError ++;
    }
    if ( loadData('app_settings_ruang') !== null ) {
        appSettingsRuang = loadData('app_settings_ruang');
        $("#select_kelas_ruang").val(appSettingsRuang);
        appSettingsFillComplete ++;
    }else{
        dataError ++;
    }
    if ( loadData('app_settings_bagian') !== null ) {
        appSettingsBagian = loadData('app_settings_bagian');
        $("#select_kelas_bagian").val(appSettingsBagian);
        appSettingsFillComplete ++;
    }else{
        setData($('#select_kelas_bagian').val(),'app_settings_bagian');
        appSettingsBagian = loadData('app_settings_bagian');
        $("#select_kelas_bagian").val(appSettingsBagian);
        appSettingsFillComplete ++;
    }
    if (appSettingsFillComplete == 4){
        appSettingsKelasFull = appSettingsKelas + '-' + appSettingsJurusan + '-' + appSettingsRuang;
        $("#kelas").html('Kelas ' + appSettingsKelasFull.toUpperCase().replace(/-/g, ' '));
        $("#kelasInput").val(appSettingsKelasFull);
        $("#kelasBagianInput").val(appSettingsBagian);
        if (loadData('app_settings_startup_done') !== null){

        }else{
            setData(1,'app_settings_startup_done');
        }
    }
    /// Theme Item
    if ( loadData('app_settings_theme') !== null ) {
        appSettingsTheme = loadData('app_settings_theme');
        $("#select_app_theme").val(appSettingsTheme);

        switch (appSettingsTheme) {
            case 'light-theme':
                themelink = "css/style-light.css";
                break;
            case 'dark-theme':
                themelink = "css/style-dark.css";
                break;
            case 'default-theme':
                themelink = "css/style-default.css";
                break;
            default:
                themelink = "css/style-default.css";
        }

        $("head link#app-theme").attr("href", themelink);
    }else{
        setData('default-theme','app_settings_theme');
    }
    /// Startup Item
    if ( loadData('app_settings_startup_done') !== null ) {
        appSettingsStartupDone = loadData('app_settings_startup_done');
    }else{
        appSettingsStartupDone = loadData('app_settings_startup_done');
        $("#app-login").addClass("on");
        $("#app-login").removeClass("off");
        dataError ++;
    }
    /// Load Server Data
    appSavingServerData()
    console.log('Load Settings App Success'); 
    /// Reset Widget
    appResetWidget('Tunggu sesaat..','Applying Settings..','i/spinner-third.svg');
    return dataError;
}
/* Buttons Action */
$(document).on('click','.toggle',function(e){
    var idnya = $(this).attr("toggle-id");
    var has = $("#"+idnya).hasClass("on");         

    if (has == true){
        $("#"+idnya).addClass("off");
        $("#"+idnya).removeClass("on");
    }else{
        $("#"+idnya).addClass("on");
        $("#"+idnya).removeClass("off");
    }
});
$(document).on('click','.toggle-table',function(e){
    var idnya = $(this).attr("toggle-id");
    var resetnya = $(this).attr("reset-class");
    var has = $("#"+idnya).hasClass("on");         

    $("."+resetnya).addClass("off");
    $("."+resetnya).removeClass("on");

    if (has == true){
        $("#"+idnya).addClass("off");
        $("#"+idnya).removeClass("on");
    }else{
        $("#"+idnya).addClass("on");
        $("#"+idnya).removeClass("off");
    }
});
$(document).on('click','.penerapanSettings',function(e){
    console.log('Applying Settings');
    appLoadSettingsData();
});
$(document).on('click','.resetSettings',function(e){
    console.log('Init Reset Settings');
    appDeleteStorage('all');
});
$(document).on('click','.loadJadwal',function(e){
    var jenis = $(this).attr('jenis');
    appSettingsJenisJadwal = jenis;
    $("#table-jadwal").html('<div class="loading-page anim-rotate"><img src="i/spinner-third.svg"></div>');
    var loadJadwalInterval = setInterval(function(){ 
        
        clearInterval(loadJadwalInterval);
    }, 200);
    $(this).html('<h4>Refresh Tabel</h4>');
    appCekJadwal();
    console.log('Membuka jadwal');
});
$(document).on('click','.creatorEasterEgg',function(e){
    $(this).attr('src','assets/creator1.jpg');
    console.log('Gotcha!');
});
/* Initial App */
appSettingsError = appLoadSettingsData();
if (appSettingsError == 0){
    appCekBeritaSekolah();
    if (appSettingsStartupDone == 1){
        var appLoadServerDataState = appLoadServerData();
        if (appLoadServerDataState == 4){
            appSavingServerData();
        }else{
            appCekBanner();
            appCekKoneksi();
            appCekUpdate();
        }
    }else{
        var appSavingServerDataState = appSavingServerData();
    }
}else{
    
}