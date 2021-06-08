package com.bhbapp.org.reactnative.camera.tasks;

import com.facebook.react.bridge.WritableArray;

import com.bhbapp.RNCameraModule.barcodedetector.RNBarcodeDetector;

public interface BarcodeDetectorAsyncTaskDelegate {

    void onBarcodesDetected(WritableArray barcodes, int width, int height, byte[] imageData);

    void onBarcodeDetectionError(RNBarcodeDetector barcodeDetector);

    void onBarcodeDetectingTaskCompleted();
}
