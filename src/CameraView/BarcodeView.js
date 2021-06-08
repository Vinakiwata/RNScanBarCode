import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Animated,
  Easing,
  Text,
  Image,
} from 'react-native';

export default class QRScannerView extends Component {
  static defaultProps = {
    maskColor: '#0000004D',
    cornerColor: '#FFFFFF',
    borderColor: '#000000',
    rectHeight: 200,
    rectWidth: 200,
    borderWidth: 0,
    cornerBorderWidth: 3,
    cornerBorderLength: 20,
    cornerOffsetSize: 1,
    isCornerOffset: true,
    bottomHeight: 0,
    scanBarAnimateTime: 2500,
    scanBarColor: '#22ff00',
    scanBarImage: null,
    scanBarHeight: 1.5,
    scanBarMargin: 6,
    hintText: '',
    hintTextStyle: {
      color: '#fff',
      fontSize: 14,
      backgroundColor: 'transparent',
      textAlign: 'right',
    },
    hintTextPosition: 130,
    isShowScanBar: true,
    hintCenterText: 'Quét mã đơn hàng vào ô màu trắng',
    // hintTextStyle: {
    //   color: '#fff',
    //   fontSize: 14,
    // },
  };

  constructor(props) {
    super(props);
    this.state = {
      topWidth: 0,
      topHeight: 0,
      leftWidth: 0,
      animatedValue: new Animated.Value(0)
    }
  }

  getBackgroundColor = () => {
    return ({ backgroundColor: this.props.maskColor });
  }

  getRectSize = () => {
    return ({ height: this.props.rectHeight, width: this.props.rectWidth });
  }

  getBorderSize = () => {
    if (this.props.isCornerOffset) {
      return ({
        height: this.props.rectHeight - this.props.cornerOffsetSize * 2,
        width: this.props.rectWidth - this.props.cornerOffsetSize * 2
      });
    } else {
      return ({ height: this.props.rectHeight, width: this.props.rectWidth });
    }
  }

  getCornerColor = () => {
    return ({ borderColor: this.props.cornerColor });
  }

  getCornerSize = () => {
    return ({ height: this.props.cornerBorderLength, width: this.props.cornerBorderLength });
  }

  getBorderWidth = () => {
    return ({ borderWidth: this.props.borderWidth });
  }

  getBorderColor = () => {
    return ({ borderColor: this.props.borderColor });
  }

  measureTotalSize = (e) => {
    let totalSize = e.layout;
    this.setState({ topWidth: totalSize.width })
  }

  measureRectPosition = (e) => {
    let rectSize = e.layout;
    rectSize.x += this.props.finderX
    rectSize.y += this.props.finderY
    this.props.returnSize(rectSize)
    this.setState({ topHeight: rectSize.y, leftWidth: rectSize.x })
  }

  getTopMaskHeight = () => {
    if (this.props.isCornerOffset) {
      return this.state.topHeight + this.props.rectHeight - this.props.cornerOffsetSize;
    } else {
      return this.state.topHeight + this.props.rectHeight;
    }
  }

  getBottomMaskHeight = () => {
    if (this.props.isCornerOffset) {
      return this.props.rectHeight + this.state.topHeight - this.props.cornerOffsetSize;
    } else {
      return this.state.topHeight + this.props.rectHeight;
    }
  }

  getSideMaskHeight = () => {
    if (this.props.isCornerOffset) {
      return this.props.rectHeight - this.props.cornerOffsetSize * 2;
    } else {
      return this.props.rectHeight;
    }
  }

  getSideMaskWidth = () => {
    if (this.props.isCornerOffset) {
      return this.state.leftWidth + this.props.cornerOffsetSize;
    } else {
      return this.state.leftWidth;
    }
  }

  getBottomHeight = () => {
    return ({ bottom: this.props.bottomHeight });
  }

  getScanBarMargin = () => {
    return ({ marginRight: this.props.scanBarMargin, marginLeft: this.props.scanBarMargin })
  }

  getScanImageWidth = () => {
    return this.props.rectWidth - this.props.scanBarMargin * 2
  }

  _renderScanBar = () => {
    if (!this.props.isShowScanBar)
      return;
    if (this.props.scanBarImage) {
      return <Image
        style={{
          resizeMode: 'contain',
          width: this.getScanImageWidth()
        }}
        source={this.props.scanBarImage} />
    } else {
      return <View
        style={[
          this.getScanBarMargin(), {
            backgroundColor: 'white',
            height: this.props.scanBarHeight
          }
        ]} />
    }
  }

  render() {
    const animatedStyle = {
      transform: [
        {
          translateY: this.state.animatedValue
        }
      ]
    };
    return (
      <View
        onLayout={({ nativeEvent: e }) => this.measureTotalSize(e)}
        style={[
          styles.container
        ]}>
        <Text style={styles.hintCenterText}>{this.props.hintCenterText}</Text>
        {/* <View style={{flex:1}}></View> */}
        <View
          style={[
            styles.viewfinder, this.getRectSize(), { top: this.props.finderY, left: this.props.finderX }
          ]}
          onLayout={({ nativeEvent: e }) => this.measureRectPosition(e)}>
          <View
            style={[
              this.getBorderSize(),
              this.getBorderColor(),
              this.getBorderWidth()
            ]}>

            {/* <Animated.View style={[animatedStyle]}>
              {this._renderScanBar()}
            </Animated.View> */}
          </View>
          <View
            style={[
              this.getCornerColor(),
              this.getCornerSize(),
              styles.topLeftCorner, {
                borderLeftWidth: this.props.cornerBorderWidth,
                borderTopWidth: this.props.cornerBorderWidth
              }
            ]} />
          <View
            style={[
              this.getCornerColor(),
              this.getCornerSize(),
              styles.topRightCorner, {
                borderRightWidth: this.props.cornerBorderWidth,
                borderTopWidth: this.props.cornerBorderWidth
              }
            ]} />
          <View
            style={[
              this.getCornerColor(),
              this.getCornerSize(),
              styles.bottomLeftCorner, {
                borderLeftWidth: this.props.cornerBorderWidth,
                borderBottomWidth: this.props.cornerBorderWidth
              }
            ]} />
          <View
            style={[
              this.getCornerColor(),
              this.getCornerSize(),
              styles.bottomRightCorner, {
                borderRightWidth: this.props.cornerBorderWidth,
                borderBottomWidth: this.props.cornerBorderWidth
              }
            ]} />
        </View>

        <View
          style={[
            this.getBackgroundColor(),
            styles.topMask, {
              bottom: this.getTopMaskHeight() - this.props.finderY * 3,
              top: 0,
              width: this.state.topWidth
            }
          ]} />

        <View
          style={[
            this.getBackgroundColor(),
            styles.leftMask, {
              height: this.getSideMaskHeight(),
              width: this.getSideMaskWidth() - this.props.finderX,
              bottom: this.getTopMaskHeight() - this.props.finderY * 3 - this.getSideMaskHeight()
            }
          ]} />

        <View
          style={[
            this.getBackgroundColor(),
            styles.rightMask, {
              height: this.getSideMaskHeight(),
              width: this.getSideMaskWidth() - this.props.finderX * 3,
              bottom: this.getTopMaskHeight() - this.props.finderY * 3 - this.getSideMaskHeight()
            }
          ]} />

        <View
          style={[
            this.getBackgroundColor(),
            styles.bottomMask, {
              top: this.getBottomMaskHeight() - this.props.finderY,
              width: this.state.topWidth
            }
          ]} />

        <View
          style={{
            position: 'absolute',
            width: this.props.rectWidth,
            bottom: this.props.hintTextPosition
          }}>
          <Text style={[this.props.hintTextStyle, { top: this.props.finderY, left: this.props.finderX }]}>{this.props.hintText}</Text>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    flex: 1,
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  viewfinder: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  topLeftCorner: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  topRightCorner: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  topMask: {
    position: 'absolute',
    top: 0
  },
  leftMask: {
    position: 'absolute',
    left: 0
  },
  rightMask: {
    position: 'absolute',
    right: 0
  },
  bottomMask: {
    position: 'absolute',
    bottom: 0
  },
  hintCenterText: {
    position: 'absolute',
    color: '#fff',
    fontSize: 14,
    textAlign: 'center'
  }
});
