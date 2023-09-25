"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScannerEvents = void 0;
var ScannerEvents;
(function (ScannerEvents) {
    ScannerEvents["SCAN_STARTED"] = "scan-started";
    ScannerEvents["FILE_SCANNED"] = "file-scanned";
    ScannerEvents["DIRECTORY_SCANNED"] = "dir-scanned";
    ScannerEvents["MP4_FILE_SCANNED"] = "mp4-file-scanned";
    ScannerEvents["FILE_NOT_FOUND"] = "file-not-found";
    ScannerEvents["SCAN_COMPLETED"] = "scan-completed";
})(ScannerEvents || (exports.ScannerEvents = ScannerEvents = {}));
