import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { faceImages, eyeImages, browImages, mouthImages } from './AvatarPreview';

const { width } = Dimensions.get('window');
export type TabType = '色' | '目元' | '眉毛' | '口';

interface ControlPanelProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedEye: string;
  setSelectedEye: (eye: string) => void;
  selectedBrow: string;
  setSelectedBrow: (brow: string) => void;
  selectedMouth: string;
  setSelectedMouth: (mouth: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedColor,
  setSelectedColor,
  selectedEye,
  setSelectedEye,
  selectedBrow,
  setSelectedBrow,
  selectedMouth,
  setSelectedMouth,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('色');

  return (
    <View style={styles.controlPanel}>
      {/* タブバー */}
      <View style={styles.tabBar}>
        {(['色', '目元', '眉毛', '口'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* グリッド選択肢 */}
      <View style={styles.optionsGrid}>
        {/* 色タブの選択肢 */}
        {activeTab === '色' &&
          Object.keys(faceImages).map((colorKey) => (
            <TouchableOpacity
              key={colorKey}
              style={styles.optionCircle}
              onPress={() => setSelectedColor(colorKey)}
            >
              <Image source={faceImages[colorKey]} style={styles.thumbnailImage} resizeMode="contain" />
              {selectedColor === colorKey && (
                <View style={styles.checkedOverlay}>
                  <AntDesign name="check" size={24} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}

        {/* 目元タブの選択肢 */}
        {activeTab === '目元' &&
          Object.keys(eyeImages).map((eyeKey) => (
            <TouchableOpacity
              key={eyeKey}
              style={[styles.optionCircle, styles.whiteBg]}
              onPress={() => setSelectedEye(eyeKey)}
            >
              <Image source={eyeImages[eyeKey]} style={styles.thumbnailImage} resizeMode="contain" />
              {selectedEye === eyeKey && <View style={styles.selectedBorder} />}
            </TouchableOpacity>
          ))}

        {/* 眉毛タブの選択肢 */}
        {activeTab === '眉毛' &&
          Object.keys(browImages).map((browKey) => (
            <TouchableOpacity
              key={browKey}
              style={[styles.optionCircle, styles.whiteBg]}
              onPress={() => setSelectedBrow(browKey)}
            >
              {browImages[browKey] ? (
                <Image source={browImages[browKey]} style={styles.thumbnailImage} resizeMode="contain" />
              ) : (
                <Text style={styles.noneText}>なし</Text>
              )}
              {selectedBrow === browKey && <View style={styles.selectedBorder} />}
            </TouchableOpacity>
          ))}

        {/* 口タブの選択肢 */}
        {activeTab === '口' &&
          Object.keys(mouthImages).map((mouthKey) => (
            <TouchableOpacity
              key={mouthKey}
              style={[styles.optionCircle, styles.whiteBg]}
              onPress={() => setSelectedMouth(mouthKey)}
            >
              <Image source={mouthImages[mouthKey]} style={styles.thumbnailImage} resizeMode="contain" />
              {selectedMouth === mouthKey && <View style={styles.selectedBorder} />}
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controlPanel: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F2AC00', // 濃い山吹色背景
    paddingHorizontal: 8,
    padding: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 4,
    marginBottom: 40,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 21,
  },
  activeTabItem: {
    backgroundColor: '#000',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
  },
  optionsGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCircle: {
    width: (width - 64) / 3 - 8, // 3列グリッドの均等配置計算
    height: (width - 64) / 3 - 8,
    borderRadius: ((width - 64) / 3 - 8) / 2,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  whiteBg: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#000',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  noneText: {
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  checkedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 4,
    borderColor: '#3B82F6',
    borderRadius: ((width - 64) / 3 - 8) / 2,
  },
});