package com.bhbapp.org.reactnative.camera.events;

import androidx.core.util.Pools;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import com.bhbapp.org.reactnative.camera.CameraViewManager;

public class CameraReadyEvent extends Event<CameraReadyEvent> {
  private static final Pools.SynchronizedPool<CameraReadyEvent> EVENTS_POOL = new Pools.SynchronizedPool<>(3);
  private CameraReadyEvent() {}

  public static com.bhbapp.org.reactnative.camera.events.CameraReadyEvent obtain(int viewTag) {
    com.bhbapp.org.reactnative.camera.events.CameraReadyEvent event = EVENTS_POOL.acquire();
    if (event == null) {
      event = new com.bhbapp.org.reactnative.camera.events.CameraReadyEvent();
    }
    event.init(viewTag);
    return event;
  }

  @Override
  public short getCoalescingKey() {
    return 0;
  }

  @Override
  public String getEventName() {
    return CameraViewManager.Events.EVENT_CAMERA_READY.toString();
  }

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
  }

  private WritableMap serializeEventData() {
    return Arguments.createMap();
  }
}
