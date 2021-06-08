package com.bhbapp.org.reactnative.camera.events;

import androidx.core.util.Pools;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import com.bhbapp.RNCameraModule.barcodedetector.RNBarcodeDetector;
import com.bhbapp.org.reactnative.camera.CameraViewManager;

public class BarcodeDetectionErrorEvent extends Event<BarcodeDetectionErrorEvent> {

  private static final Pools.SynchronizedPool<BarcodeDetectionErrorEvent> EVENTS_POOL = new Pools.SynchronizedPool<>(3);
  private RNBarcodeDetector mBarcodeDetector;

  private BarcodeDetectionErrorEvent() {
  }

  public static com.bhbapp.org.reactnative.camera.events.BarcodeDetectionErrorEvent obtain(int viewTag, RNBarcodeDetector barcodeDetector) {
    com.bhbapp.org.reactnative.camera.events.BarcodeDetectionErrorEvent event = EVENTS_POOL.acquire();
    if (event == null) {
      event = new com.bhbapp.org.reactnative.camera.events.BarcodeDetectionErrorEvent();
    }
    event.init(viewTag, barcodeDetector);
    return event;
  }

  private void init(int viewTag, RNBarcodeDetector faceDetector) {
    super.init(viewTag);
    mBarcodeDetector = faceDetector;
  }

  @Override
  public short getCoalescingKey() {
    return 0;
  }

  @Override
  public String getEventName() {
    return CameraViewManager.Events.EVENT_ON_BARCODE_DETECTION_ERROR.toString();
  }

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
  }

  private WritableMap serializeEventData() {
    WritableMap map = Arguments.createMap();
    map.putBoolean("isOperational", mBarcodeDetector != null && mBarcodeDetector.isOperational());
    return map;
  }
}
