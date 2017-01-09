var app = null;

var fileURL = "http://82.212.67.141:508/media/2016/1/1/pdfs/Practice.pdf";

$(function() {
    document.addEventListener("deviceready", function() {
        app = new kendo.mobile.Application(document.body, {
                                               skin: "flat"
                                           });
    }, false);
});

function openPDF(e) {
    var fileError = function(error) {
        console.log("File Error: " + JSON.stringify(error));
        document.getElementById("loader").style.visibility = "hidden";
    };
            
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        console.log("Got the file system!");
        fs.root.getDirectory("Downloads", {create:true,exclusive:false}, function(dir) {
            dir.getFile("pdfFile.pdf", null, function(pdfFile) {
                FoxitPDFPlugin.openPDF(pdfFile.fullPath, "");
            }, function() {
                loader.innerHTML = "Downloading...";
                document.getElementById("loader").style.visibility = "visible";
                                                                      
                var ft = new FileTransfer();
                ft.onProgress = function(progressEvent) {
                    setPercentage(progressEvent.loaded / progressEvent.total);
                };
                ft.download(
                    encodeURI(fileURL),
                    dir.fullPath + "/pdfFile.pdf",
                    function(fileEntry) {
                        document.getElementById("loader").style.visibility = "hidden";
                        FoxitPDFPlugin.openPDF(fileEntry.fullPath, "");
                    },
                    function(error) {
                        console.log("Download Error: " + JSON.stringify(error));
                        document.getElementById("loader").style.visibility = "hidden";
                    });
            }, fileError);
        }, fileError);
    });
}

function setPercentage(percentage) {
    loader.innerHTML = "Downloading..." + percentage + "%";
}