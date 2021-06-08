import React, { PureComponent } from 'react';

// import { RNCamera } from 'react-native-camera';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Vibration,
  Platform,
  PixelRatio,
  StatusBar,
  Text,
  PermissionsAndroid,
  AppState,
  Linking,
  Alert
} from 'react-native';
import {RNCamera} from '../RNCamera'
import QRScannerView from './BarcodeView'
const pixelRatio = PixelRatio.get()
const appScreen = Dimensions.get('window');

export default class QRScanner extends PureComponent {
  constructor(props) {
    super(props);

    console.disableYellowBox = true;
    this.state = {
      scanning: false,
      barCodeSize: {},
      ready: true,
      appState: AppState.currentState,
      isRepeatScan: false
    }
  }

  static defaultProps = {
    onRead: () => { },
    renderTopView: () => { },
    renderBottomView: () => null,
    rectHeight: 3 / 4 * (appScreen.width - 90),
    rectWidth: appScreen.width - 40,
    flashMode: false,
    finderX: 0,
    finderY: 0,
    zoom: 0.2,
    translucent: false,
    isRepeatScan: false
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      const check = await PermissionsAndroid.check('android.permission.CAMERA');
      if (check && !this.state.ready) {
        this.setState({
          ready: true
        })
      }
    }
    this.setState({ appState: nextAppState });
  };

  request = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'GHN xin quyền truy cập camera',
          message:
            'GHN xin quyền camera ' +
            'cho quét barcode',
          buttonNeutral: 'Hỏi lại sau',
          buttonNegative: 'Từ chối',
          buttonPositive: 'Đồng ý',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({
          ready: true
        })
      } else {
        Linking.openSettings();
      }
    } catch (err) {
      console.warn(err);
    }
  }

  _renderNotAuthorizedView = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Bạn chưa cấp quyền camera</Text>
        <Text onPress={this.request}>bấm vào đây</Text>
      </View>
    )
  }
  onStatusChange = (data) => {
    if (data.cameraStatus !== 'READY' && this.state.ready) {
      this.setState({ ready: false })
    }
  }
  render() {
    return (
      <View style={[styles.container, {backgroundColor:'yellow'}]}>
        <Text style={{color:'blue', fontSize:20}}>Camera</Text>
        
        {
          this.state.ready ?
            <RNCamera
              ref={this.props.camera}
              cropScanAreaEnabled
              onStatusChange={this.onStatusChange}
              onCameraReady={this.onCameraReady}
              cropScanAreaSize={[0.9, 0.25]}
              style={styles.container}
              captureAudio={false}
              onGoogleVisionBarcodesDetected={this.androidBarCode}
              googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.ALL}
              androidCameraPermissionOptions={{
                title: 'GHN xin quyền truy cập camera',
                message: 'GHN cần quyền camera cho quét barcode',
                buttonPositive: 'Đồng ý',
                buttonNegative: 'Từ chối',
              }}

              autoFocus="on"
              flashMode={!this.props.flashMode ? RNCamera.Constants.FlashMode.off : RNCamera.Constants.FlashMode.torch}
              //zoom={this.props.zoom}
              >
              <View style={[styles.topButtonsContainer, this.props.topViewStyle]}>
                {this.props.renderTopView()}
              </View>
              <QRScannerView
                maskColor={this.props.maskColor}
                cornerColor={this.props.cornerColor}
                borderColor={this.props.borderColor}
                rectHeight={this.props.rectHeight}
                rectWidth={this.props.rectWidth}
                borderWidth={this.props.borderWidth}
                cornerBorderWidth={this.props.cornerBorderWidth}
                cornerBorderLength={this.props.cornerBorderLength}
                cornerOffsetSize={this.props.cornerOffsetSize}
                isCornerOffset={this.props.isCornerOffset}
                bottomHeight={this.props.bottomHeight}
                scanBarAnimateTime={this.props.scanBarAnimateTime}
                scanBarColor={this.props.scanBarColor}
                scanBarHeight={this.props.scanBarHeight}
                scanBarMargin={this.props.scanBarMargin}
                hintText={this.props.hintText}
                hintCenterText={this.props.hintCenterText}
                hintTextStyle={this.props.hintTextStyle}
                scanBarImage={this.props.scanBarImage}
                hintTextPosition={appScreen.height / 2 - this.props.rectHeight / 2 - StatusBar.currentHeight - 15}
                isShowScanBar={this.props.isShowScanBar}
                finderX={this.props.finderX}
                finderY={this.props.finderY}
                returnSize={this.barCodeSize} />
              <View style={[styles.bottomButtonsContainer, this.props.bottomViewStyle]}>
                {this.props.renderBottomView()}
              </View>
            </RNCamera> :
            this._renderNotAuthorizedView()
        }
      </View>
    );
  }


  barCodeSize = (size) => this.setState({ barCodeSize: size })

  androidBarCode = (e) => {
    let {isRepeatScan} = this.state;
    console.log("==e===",e)
    if(e?.barcodes[0] && !isRepeatScan){
      console.log("======androidBarCode========",e?.barcodes[0])
      this.setState({isRepeatScan: true},()=>{
        Alert.alert(
          'Thông báo',
          `Mã đã quét được là ${e.barcodes[0]?.data}`,
          [
            {
              text: 'OK',
              onPress: async () => {
                this.setState({isRepeatScan: false})
              },
            },
          ],
          {cancelable: false},
        );
      })
      
    }
    
    // if (this.props.isRepeatScan) {
    //   this.props.onRead(e.barcodes[0]);
    // }
  }

  _handleBarCodeRead = (e) => {
    switch (Platform.OS) {
      case 'ios':
        this.iosBarCode(e);
        break;
      case 'android':
        this.androidBarCode(e);
        break;
      default:
        break;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topButtonsContainer: {
    position: 'absolute',
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0,
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 100,
    right: 0,
  }
});

QRScanner.propTypes = {
  isRepeatScan: PropTypes.bool,
  onRead: PropTypes.func,
  maskColor: PropTypes.string,
  borderColor: PropTypes.string,
  cornerColor: PropTypes.string,
  borderWidth: PropTypes.number,
  cornerBorderWidth: PropTypes.number,
  cornerBorderLength: PropTypes.number,
  rectHeight: PropTypes.number,
  rectWidth: PropTypes.number,
  isCornerOffset: PropTypes.bool,
  cornerOffsetSize: PropTypes.number,
  bottomHeight: PropTypes.number,
  scanBarAnimateTime: PropTypes.number,
  scanBarColor: PropTypes.string,
  scanBarImage: PropTypes.any,
  scanBarHeight: PropTypes.number,
  scanBarMargin: PropTypes.number,
  hintText: PropTypes.string,
  hintTextStyle: PropTypes.object,
  hintTextPosition: PropTypes.number,
  renderTopView: PropTypes.func,
  renderBottomView: PropTypes.func,
  isShowScanBar: PropTypes.bool,
  topViewStyle: PropTypes.object,
  bottomViewStyle: PropTypes.object,
  flashMode: PropTypes.bool,
  finderX: PropTypes.number,
  finderY: PropTypes.number,
  zoom: PropTypes.number,
  translucent: PropTypes.bool
}
