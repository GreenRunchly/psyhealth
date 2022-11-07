/* Meta Data Aplikasi */
var appVersion = '1.0.0'; /// versi aplikasi
var appDeviceID = '';
var appServer = 'https://app.ieu.link'; /// tanpa slash di akhir 'http://localhost','https://greenrunchly.github.io'
var appConnected = true;
var appSettingsDebugMode = true;

var appSettingsTheme = 'dark-theme';

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

/* Action Function */
/// Cek Koneksi Internet Function
function appCheckServer(){
    $.post((appServer + "/client-socket",
    {
        client:appDeviceID
    },
    function(data, status){
        if ((data.maintenance == 1) && (appSettingsDebugMode == false)){
            appConnected = false;
        }else{
            appConnected = true;
        }        
    }).fail(function(){ 
        appConnected = false;
        console.log('Connection Failed');
    });
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
        appServer + '/get-content?cat=news',
        appServer + '/get-content?cat=books',
        appServer + '/get-content?cat=quotes',
        ]
    var appServerResourceSet = [
        'app_storage_news',
        'app_storage_books',
        'app_storage_quotes'
    ]
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